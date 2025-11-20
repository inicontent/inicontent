import { ref } from "vue"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

// Use a specific version for stability and the single-threaded core
const FFMPEG_VERSION = "0.12.6"
const CORE_URL = `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_VERSION}/dist/esm/ffmpeg-core.js`
const WASM_URL = `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_VERSION}/dist/esm/ffmpeg-core.wasm`
const WORKER_URL = `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_VERSION}/dist/esm/ffmpeg-core.worker.js`

// Queue system for multiple files
interface CompressionTask {
    file: File
    resolve: (file: File) => void
    reject: (error: Error) => void
}

export function useVideoCompressor() {
    const loading = ref(false)
    const progress = ref(0)
    const queue = ref<CompressionTask[]>([])
    const isProcessing = ref(false)
    const skipRemaining = ref(false) // Skip compression for remaining files
    let ffmpeg: FFmpeg | null = null
    let currentTask: CompressionTask | null = null

    const abort = () => {
        try {
            if (ffmpeg) {
                ffmpeg.terminate()
                ffmpeg = null
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
                currentTask.reject(new Error("terminated"))
                currentTask = null
            }
        } catch (e) {
            console.error("Error aborting FFmpeg:", e)
        } finally {
            loading.value = false
            progress.value = 0
            isProcessing.value = false
        }
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
                    const compressedFile = await compressVideoInternal(task.file)
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

    const compressVideoInternal = async (videoFile: File): Promise<File> => {
        ffmpeg = new FFmpeg()
        let tempOutputFileName: string | null = null
        let inputFileName: string | null = null

        // ffmpeg.on("log", ({ message }) => {
        //     console.log(message)
        // })

        ffmpeg.on("progress", ({ progress: p, time }) => {
            progress.value = p
            // console.log(`Progress: ${p * 100}%, time: ${time / 1000000}s`)
        })

        try {
            loading.value = true
            progress.value = 0

            await ffmpeg.load({
                coreURL: await toBlobURL(CORE_URL, "text/javascript"),
                wasmURL: await toBlobURL(WASM_URL, "application/wasm"),
                workerURL: await toBlobURL(WORKER_URL, "text/javascript"),
            })

            // Use unique filename to avoid conflicts
            inputFileName = `input_${Date.now()}_${videoFile.name}`
            tempOutputFileName = `temp_output_${Date.now()}.mp4`
            const finalOutputName = `${videoFile.name.split(".").slice(0, -1).join(".")}.mp4`

            await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

            // Execute FFmpeg command for compression
            await ffmpeg.exec([
                "-i",
                inputFileName,
                "-vcodec",
                "libx264",
                "-crf",
                "28", // Adjust CRF for quality/size balance (lower is better quality)
                "-preset",
                "fast", // 'fast' provides a good balance of speed and compression
                "-movflags",
                "+faststart",
                tempOutputFileName,
            ])

            const data = await ffmpeg.readFile(tempOutputFileName)

            // Create a new File object from the compressed data with a NEW instance
            // This ensures the original file is not referenced
            const blob = new Blob([data as any], { type: "video/mp4" })
            const compressedFile = new File(
                [blob],
                finalOutputName,
                {
                    type: "video/mp4",
                    lastModified: Date.now()
                }
            )

            return compressedFile
        } catch (error) {
            if (String(error).includes("terminate")) {
                throw new Error("terminated")
            }
            console.error("Video compression failed:", error)
            return videoFile // Return original file on other errors
        } finally {
            loading.value = false
            progress.value = 0
            if (ffmpeg) {
                try {
                    if (inputFileName) await ffmpeg.deleteFile(inputFileName)
                    if (tempOutputFileName) await ffmpeg.deleteFile(tempOutputFileName)
                }
                catch (e) {
                    console.warn("Could not cleanup files, ffmpeg may have been terminated.", e)
                }
                // Terminate FFmpeg instance to free resources
                try {
                    await ffmpeg.terminate()
                    ffmpeg = null
                } catch (e) {
                    console.warn("Could not terminate ffmpeg:", e)
                }
            }
        }
    }

    const compressVideo = async (videoFile: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            queue.value.push({ file: videoFile, resolve, reject })
            processQueue()
        })
    }

    return {
        compressVideo,
        loading,
        progress,
        abort,
        resetSkip,
        queueLength: computed(() => queue.value.length)
    }
}
