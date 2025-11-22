import { ref, computed } from "vue"
import { jsPDF } from "jspdf"
import * as pdfjs from "pdfjs-dist"

if (import.meta.client) {
	const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`
	pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
}

// Queue system for multiple files
interface CompressionTask {
	file: File
	resolve: (file: File) => void
	reject: (error: Error) => void
}

export const usePdfCompressor = () => {
	const loading = ref(false)
	const progress = ref(0)
	const queue = ref<CompressionTask[]>([])
	const isProcessing = ref(false)
	const skipRemaining = ref(false) // Skip compression for remaining files
	let abortController: AbortController | null = null
	let currentTask: CompressionTask | null = null

	const abort = () => {
		if (abortController) {
			abortController.abort()
		}
		// Mark to skip compression for remaining files
		skipRemaining.value = true

		// Resolve all pending tasks with original files (skip compression)
		while (queue.value.length > 0) {
			const task = queue.value.shift()
			if (task) {
				task.resolve(task.file) // Return original file
			}
		}
		// Reject current task only (it was being compressed)
		if (currentTask) {
			currentTask.reject(new Error("aborted"))
			currentTask = null
		}
		loading.value = false
		progress.value = 0
		isProcessing.value = false
	}

	const resetSkip = () => {
		skipRemaining.value = false
	}

	const processQueue = async () => {
		if (isProcessing.value || queue.value.length === 0) return

		isProcessing.value = true

		while (queue.value.length > 0) {
			const task = queue.value.shift()
			if (!task) continue

			currentTask = task
			try {
				// If skip was requested, return original file without compression
				if (skipRemaining.value) {
					task.resolve(task.file)
				} else {
					const compressedFile = await compressPdfInternal(task.file)
					task.resolve(compressedFile)
				}
			} catch (error) {
				task.reject(error as Error)
			}
			currentTask = null
		}

		isProcessing.value = false
		// Reset skip flag after processing all files
		skipRemaining.value = false
	}

	const compressPdfInternal = async (file: File): Promise<File> => {
		if (!file.type.includes("pdf")) {
			console.warn("File is not a PDF. Skipping compression.")
			return file
		}

		loading.value = true
		progress.value = 0
		abortController = new AbortController()
		const { signal } = abortController

		try {
			const pdfData = await file.arrayBuffer()
			const pdfDoc = await pdfjs.getDocument({ data: pdfData }).promise
			const totalPages = pdfDoc.numPages
			const doc = new jsPDF({
				unit: "pt", // Use points to match PDF coordinates
				compress: true,
			})

			for (let i = 1; i <= totalPages; i++) {
				if (signal.aborted) throw new Error("PDF compression aborted")

				const page = await pdfDoc.getPage(i)
				const originalViewport = page.getViewport({ scale: 1 })
				// Using scale 2 (144 DPI) for better quality while maintaining reasonable size
				const viewport = page.getViewport({ scale: 2 })

				const canvas = document.createElement("canvas")
				const context = canvas.getContext("2d")
				canvas.width = viewport.width
				canvas.height = viewport.height

				if (!context) throw new Error("Could not get canvas context.")

				await page.render({ canvasContext: context, viewport, canvas }).promise
				const imgData = canvas.toDataURL("image/jpeg", 0.8) // 0.8 offers better quality

				doc.addPage([originalViewport.width, originalViewport.height])
				if (i === 1) doc.deletePage(1) // Remove the default blank page

				doc.addImage(imgData, "JPEG", 0, 0, originalViewport.width, originalViewport.height, undefined, "FAST")
				progress.value = (i / totalPages)
			}

			const compressedBlob = doc.output("blob")
			const compressedFile = new File([compressedBlob], file.name, {
				type: "application/pdf",
				lastModified: Date.now(),
			})

			// Return the smaller of the two files
			return compressedFile.size < file.size ? compressedFile : file
		} catch (error) {
			console.error("Failed to compress PDF:", error)
			// Return original file on error
			return file
		} finally {
			loading.value = false
			progress.value = 0
			abortController = null
		}
	}

	const compressPdf = async (file: File): Promise<File> => {
		return new Promise((resolve, reject) => {
			queue.value.push({ file, resolve, reject })
			processQueue()
		})
	}

	return {
		compressPdf,
		loading,
		progress,
		abort,
		resetSkip,
		queueLength: computed(() => queue.value.length),
	}
}
