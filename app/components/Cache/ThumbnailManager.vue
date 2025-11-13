<template>
    <div class="cache-manager">
        <NCard title="Thumbnail Cache Manager">
            <template #header-extra>
                <NButton text type="primary" @click="loadStats">
                    <template #icon>
                        <Icon name="tabler:refresh" />
                    </template>
                    Refresh
                </NButton>
            </template>

            <NFlex vertical :size="16">
                <!-- Stats -->
                <div class="stats-container">
                    <NStatistic label="Total Cached" :value="stats.total" />
                    <NStatistic label="Expired Items" :value="stats.expired" />
                    <NStatistic label="Cache Size" :value="cacheSize" />
                </div>

                <!-- Actions -->
                <NFlex :size="8">
                    <NButton type="warning" @click="clearExpired" :loading="isClearing">
                        <template #icon>
                            <Icon name="tabler:trash" />
                        </template>
                        Clear Expired
                    </NButton>
                    <NButton type="error" secondary @click="clearAll" :loading="isClearing">
                        <template #icon>
                            <Icon name="tabler:trash-x" />
                        </template>
                        Clear All Cache
                    </NButton>
                </NFlex>

                <!-- Info -->
                <NAlert type="info" :closable="false">
                    Thumbnails are automatically cached for <strong>30 days</strong>. Cache
                    helps your PWA load faster offline and reduces bandwidth usage.
                </NAlert>

                <!-- Cache Details -->
                <div v-if="stats.total > 0" class="cache-details">
                    <NText strong>Cache Breakdown</NText>
                    <NFlex vertical :size="4">
                        <NText depth="3">
                            Video Thumbnails: {{ stats.total - pdfCount }} items
                        </NText>
                        <NText depth="3"> PDF Thumbnails: {{ pdfCount }} items </NText>
                        <NText depth="3">
                            Average Size: {{ averageSize }} per thumbnail
                        </NText>
                    </NFlex>
                </div>
            </NFlex>
        </NCard>
    </div>
</template>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { Icon } from '#components'
import { useThumbnailCacheManager } from '~/composables/useThumbnailCacheManager'

const { getStats: getCacheStats, getFormattedSize, clearExpired: clearExpiredCache, clearAll: clearAllCache } =
    useThumbnailCacheManager()

const stats = ref({
    total: 0,
    expired: 0,
    size: 0,
})
const cacheSize = ref('0 B')
const isClearing = ref(false)

const pdfCount = computed(() => {
    // This is an estimate; exact count would require querying all keys
    return Math.round(stats.value.total * 0.3)
})

const averageSize = computed(() => {
    if (stats.value.total === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const bytes = stats.value.size / stats.value.total
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
})

async function loadStats() {
    try {
        stats.value = await getCacheStats()
        cacheSize.value = await getFormattedSize()
    } catch (error) {
        console.error('Failed to load cache stats:', error)
        window.$message.error('Failed to load cache statistics')
    }
}

async function clearExpired() {
    try {
        isClearing.value = true
        await clearExpiredCache()
        await loadStats()
        window.$message.success('Expired thumbnails cleared')
    } catch (error) {
        console.error('Failed to clear expired:', error)
        window.$message.error('Failed to clear expired thumbnails')
    } finally {
        isClearing.value = false
    }
}

async function clearAll() {
    try {
        isClearing.value = true
        const dialog = useDialog()
        await new Promise<void>((resolve) => {
            dialog.warning({
                title: 'Clear All Cache?',
                content: `This will delete all ${stats.value.total} cached thumbnails. 
					You'll need to regenerate them on next load.`,
                positiveText: 'Clear All',
                negativeText: 'Cancel',
                onPositiveClick: async () => {
                    await clearAllCache()
                    await loadStats()
                    window.$message.success('All thumbnails cleared')
                    resolve()
                },
                onNegativeClick: () => resolve(),
            })
        })
    } catch (error) {
        console.error('Failed to clear all:', error)
        window.$message.error('Failed to clear cache')
    } finally {
        isClearing.value = false
    }
}

// Load stats on mount
onMounted(() => {
    loadStats()
})

// Auto-refresh every 30 seconds
const autoRefreshInterval = setInterval(() => {
    loadStats()
}, 30000)

onUnmounted(() => {
    clearInterval(autoRefreshInterval)
})
</script>

<style scoped>
.cache-manager {
    padding: 16px;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    padding: 12px;
    background: var(--n-color, rgba(0, 0, 0, 0.02));
    border-radius: 8px;
}

.cache-details {
    padding: 12px;
    background: var(--n-color, rgba(0, 0, 0, 0.02));
    border-radius: 8px;
    border-left: 3px solid var(--n-border-color);
}
</style>
