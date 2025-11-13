/**
 * Composable for optimizing files (images and PDFs) before upload
 * Images are converted to WebP or AVIF format for better compression
 * Falls back to original if optimized version is larger
 */

interface OptimizationResult {
    file: File
    optimized: boolean
    originalSize: number
    compressedSize?: number
    compressionRatio?: number
    outputFormat?: string
}

export const useOptimizeFile = () => {
    /**
     * Compress image to WebP or AVIF format
     * @param file - The image file to compress
     * @param quality - Compression quality (0-1), defaults to 0.85
     * @param maxWidth - Maximum width in pixels, defaults to 3840 (4K)
     * @param maxHeight - Maximum height in pixels, defaults to 3840 (4K)
     * @returns Promise with compressed blob and metadata, or null if conversion not possible
     */
    const compressImage = async (
        file: File,
        quality = 0.85,
        maxWidth = 3840,
        maxHeight = 3840,
    ): Promise<{ blob: Blob; width: number; height: number; format: string } | null> => {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (event) => {
                const img = new Image()

                img.onload = () => {
                    // Calculate new dimensions while maintaining aspect ratio
                    let { width, height } = img
                    const aspectRatio = width / height
                    let newWidth = width
                    let newHeight = height

                    // Scale down if dimensions exceed max
                    if (width > maxWidth) {
                        newWidth = maxWidth
                        newHeight = maxWidth / aspectRatio
                    }
                    if (newHeight > maxHeight) {
                        newHeight = maxHeight
                        newWidth = maxHeight * aspectRatio
                    }

                    // Create canvas and compress
                    const canvas = document.createElement('canvas')
                    canvas.width = Math.round(newWidth)
                    canvas.height = Math.round(newHeight)

                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        resolve(null)
                        return
                    }

                    // Enable image smoothing for better quality
                    ctx.imageSmoothingEnabled = true
                    ctx.imageSmoothingQuality = 'high'

                    // Draw scaled image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                    // Try AVIF first (best compression)
                    // AVIF: ~50-60% size reduction vs JPEG
                    // WebP: ~25-35% size reduction vs JPEG
                    canvas.toBlob(
                        (avifBlob) => {
                            if (avifBlob) {
                                // AVIF succeeded, now try WebP to compare
                                canvas.toBlob(
                                    (webpBlob) => {
                                        if (webpBlob && webpBlob.size < avifBlob.size) {
                                            // WebP is smaller than AVIF
                                            resolve({
                                                blob: webpBlob,
                                                width: canvas.width,
                                                height: canvas.height,
                                                format: 'image/webp',
                                            })
                                        } else {
                                            // AVIF is smaller or WebP failed
                                            resolve({
                                                blob: avifBlob,
                                                width: canvas.width,
                                                height: canvas.height,
                                                format: 'image/avif',
                                            })
                                        }
                                    },
                                    'image/webp',
                                    quality,
                                )
                            } else {
                                // AVIF not supported, try WebP
                                canvas.toBlob(
                                    (webpBlob) => {
                                        if (webpBlob) {
                                            resolve({
                                                blob: webpBlob,
                                                width: canvas.width,
                                                height: canvas.height,
                                                format: 'image/webp',
                                            })
                                        } else {
                                            // WebP not supported, use JPEG
                                            canvas.toBlob(
                                                (jpegBlob) => {
                                                    resolve(
                                                        jpegBlob
                                                            ? {
                                                                blob: jpegBlob,
                                                                width: canvas.width,
                                                                height: canvas.height,
                                                                format: 'image/jpeg',
                                                            }
                                                            : null,
                                                    )
                                                },
                                                'image/jpeg',
                                                quality,
                                            )
                                        }
                                    },
                                    'image/webp',
                                    quality,
                                )
                            }
                        },
                        'image/avif',
                        quality,
                    )
                }

                img.onerror = () => {
                    resolve(null)
                }

                img.src = event.target?.result as string
            }

            reader.onerror = () => {
                resolve(null)
            }

            reader.readAsDataURL(file)
        })
    }

    /**
     * Determine if file should be optimized
     * Optimizes images > 300KB and PDFs > 500KB
     */
    const shouldOptimize = (file: File): boolean => {
        const mimeType = file.type
        const isImage = mimeType.startsWith('image/')
        const isPDF = mimeType === 'application/pdf'

        if (isImage) {
            // Optimize images larger than 300KB
            return file.size > 300 * 1024
        }
        if (isPDF) {
            // Optimize PDFs larger than 500KB
            return file.size > 500 * 1024
        }

        return false
    }

    /**
     * Optimize a single file
     * For images: convert to WebP/AVIF for better compression
     * Returns original file if optimization doesn't reduce size
     */
    const optimizeFile = async (
        file: File,
        imageQuality = 0.85,
    ): Promise<OptimizationResult> => {
        const isImage = file.type.startsWith('image/')

        // Only optimize supported types
        if (!isImage) {
            return {
                file,
                optimized: false,
                originalSize: file.size,
            }
        }

        // Skip optimization if file is too small
        if (!shouldOptimize(file)) {
            return {
                file,
                optimized: false,
                originalSize: file.size,
            }
        }

        try {
            // Compress image to WebP/AVIF
            const result = await compressImage(
                file,
                imageQuality,
                3840,
                3840,
            )

            if (!result) {
                // Compression failed, use original
                return {
                    file,
                    optimized: false,
                    originalSize: file.size,
                }
            }

            const { blob, width, height, format } = result

            // Only use compressed version if it's actually smaller or equal
            if (blob.size <= file.size) {
                const extension = format === 'image/avif' ? 'avif' : format === 'image/webp' ? 'webp' : 'jpg'
                const newFileName = file.name.replace(/\.[^.]+$/, `.${extension}`)

                const compressedFile = new File([blob], newFileName, {
                    type: format,
                    lastModified: file.lastModified,
                })

                const compressionRatio = 1 - blob.size / file.size
                const formatName = format === 'image/avif' ? 'AVIF' : format === 'image/webp' ? 'WebP' : 'JPEG'


                return {
                    file: compressedFile,
                    optimized: true,
                    originalSize: file.size,
                    compressedSize: blob.size,
                    compressionRatio,
                    outputFormat: formatName,
                }
            }

            // Compression resulted in larger file, use original
            return {
                file,
                optimized: false,
                originalSize: file.size,
            }
        } catch (error) {
            console.warn(`File optimization failed, using original: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        return {
            file,
            optimized: false,
            originalSize: file.size,
        }
    }

    /**
     * Batch optimize multiple files
     */
    const optimizeFiles = async (
        files: File[],
        imageQuality = 0.85,
    ): Promise<OptimizationResult[]> => {
        return Promise.all(
            files.map((file) => optimizeFile(file, imageQuality)),
        )
    }

    return {
        compressImage,
        shouldOptimize,
        optimizeFile,
        optimizeFiles,
    }
}
