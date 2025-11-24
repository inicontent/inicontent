import type { UploadCustomRequestOptions } from "naive-ui"

interface UploadAssetWithProgressOptions {
	url: string
	method: "POST" | "PUT"
	headers?: Record<string, string>
	file?: File | null
	onProgress?: UploadCustomRequestOptions["onProgress"]
}

export function useAssetUploader() {
	async function uploadAssetWithProgress({
		url,
		method,
		headers,
		file,
		onProgress,
	}: UploadAssetWithProgressOptions) {
		if (!file) return
		if (typeof XMLHttpRequest === "undefined") {
			await $fetch(url, {
				method,
				headers,
				body: file,
			})
			onProgress?.({ percent: 100 })
			return
		}

		await new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			xhr.open(method, url)
			for (const [key, value] of Object.entries(headers ?? {})) {
				if (value) xhr.setRequestHeader(key, value)
			}
			xhr.upload.onprogress = (event) => {
				if (!event.lengthComputable) return
				const percent = 10 + (event.loaded / event.total) * 90
				onProgress?.({ percent })
			}
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					onProgress?.({ percent: 100 })
					resolve()
				} else reject(new Error(`Upload failed with status ${xhr.status}`))
			}
			xhr.onerror = () => reject(new Error("Upload failed"))
			xhr.onabort = () => reject(new Error("Upload aborted"))
			xhr.send(file)
		})
	}

	return {
		uploadAssetWithProgress,
	}
}
