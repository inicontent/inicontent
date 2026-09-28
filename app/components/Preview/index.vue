<template>
    <LazyPreviewMockup v-if="mockup" v-model="selectedDevice">
        <div class="iframeWrapper" :class="selectedDevice">
            <div class="iframe" :class="selectedDevice">
                <slot></slot>
            </div>
        </div>
    </LazyPreviewMockup>
    <div v-else class="iframeContainer" :class="selectedDevice">
        <div class="iframeWrapper" :class="selectedDevice">
            <div class="iframe" :class="selectedDevice">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
	mockup: Boolean,
});
const selectedDevice = usePreviewDevice();
</script>

<style scoped>
.rtl .iframeWrapper {
    transform-origin: top right;
}

.iframeWrapper {
    transform: scale(0.5);
    transform-origin: 0 0;
    width: 100%;
    height: 100%;
}

.iframeWrapper.desktop {
    transform: scale(0.248);
}

.dark .iframeContainer {
    background-color: #404040;
}

.iframeContainer .iframeWrapper.desktop {
    transform: scale(0.27);
}

.iframeContainer .iframeWrapper.tablet {
    transform: scale(0.76);
}

.iframeContainer .iframeWrapper.mobile {
    transform: scale(1.02);
}

.previewBox.iframeContainer .iframeWrapper.mobile {
    transform: scale(.35);
}

.previewBox.iframeContainer .iframeWrapper.tablet {
    transform: scale(.26);
}

.previewBox.iframeContainer .iframeWrapper.desktop {
    transform: scale(.19);
}

.iframe {
    width: 100%;
    height: 100%;
}

.iframe *:focus {
    pointer-events: none;
}

@media (min-width: 600px) and (max-width: 1280px) {
    .iframe.desktop {
        width: 1280px;
    }
}

@media (min-width: 1280px) {
    .iframe.desktop {
        width: 100vw;
    }
}

.iframe.tablet {
    width: 541px;
}

.iframe.mobile {
    width: 400px;
}

.iframeContainer {
    width: 100%;
    height: 12rem;
    overflow: auto;
    border: 2px solid #ccc;
    border-radius: 0.75rem;
    position: relative;
}
</style>