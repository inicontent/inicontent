<template>
    <NModal :show="currentPreviewAsset !== undefined" @mask-click="onClosePreview" @close="onClosePreview"
        @esc="onClosePreview" :width="800">
        <NSpin v-if="currentPreviewAsset" :show="Loading.previewModal" size="large" style="width: 80%;">
            <video v-if="videoExtensions.includes(currentPreviewAsset.extension)" controls autoplay
                style="width:100%;height:auto" :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }"
                @loadeddata="Loading.previewModal = false" @canplay="Loading.previewModal = false"
                @error="Loading.previewModal = false">
                <source :src="currentPreviewAsset?.publicURL" :type="currentPreviewAsset?.type" />
            </video>
            <object v-else-if="currentPreviewAsset.extension === 'pdf'" :data="currentPreviewAsset.publicURL"
                type="application/pdf" style="width:100%;height:80vh;"
                :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }"
                @load="Loading.previewModal = false"></object>
        </NSpin>
    </NModal>
</template>

<script setup lang="ts">
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))

const currentPreviewAsset = useState<Asset | undefined>("currentPreviewAsset")

function onClosePreview() {
    currentPreviewAsset.value = undefined
    Loading.value.previewModal = false
}
</script>
