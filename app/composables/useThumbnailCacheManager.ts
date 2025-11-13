import {
    getCachedThumbnail,
    cacheThumbnail,
    clearExpiredThumbnails,
    clearAllThumbnails,
    getCacheStats,
} from './useThumbnailCache'

/**
 * Composable for managing thumbnail cache in PWA apps
 * Provides utilities to interact with the IndexedDB cache
 */
export function useThumbnailCacheManager() {
    /**
     * Get cached thumbnail
     */
    const getThumbnail = async (key: string): Promise<string | null> => {
        return getCachedThumbnail(key)
    }

    /**
     * Manually cache a thumbnail
     */
    const cacheThumbnailManually = async (
        key: string,
        dataUrl: string,
        expirationDays?: number,
    ): Promise<void> => {
        return cacheThumbnail(key, dataUrl, expirationDays)
    }

    /**
     * Clear expired cache entries
     */
    const clearExpired = async (): Promise<void> => {
        return clearExpiredThumbnails()
    }

    /**
     * Clear entire cache
     */
    const clearAll = async (): Promise<void> => {
        return clearAllThumbnails()
    }

    /**
     * Get cache statistics
     */
    const getStats = async (): Promise<{
        total: number
        expired: number
        size: number
    }> => {
        return getCacheStats()
    }

    /**
     * Get formatted cache size
     */
    const getFormattedSize = async (): Promise<string> => {
        const stats = await getStats()
        const bytes = stats.size
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
    }

    return {
        getThumbnail,
        cacheThumbnailManually,
        clearExpired,
        clearAll,
        getStats,
        getFormattedSize,
    }
}
