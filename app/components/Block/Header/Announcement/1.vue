<template>
    <div class="banner" :class="{ 'scrolling': isOverflowing }">
        <div class="banner-text-container" ref="containerRef">
            <p v-if="modelValue?.text" class="banner-text" ref="textRef">
                {{ modelValue.text }}
            </p>
        </div>
        <a v-if="modelValue?.button" v-bind="linkAttrs(modelValue?.button.link)" class="banner-button">
            {{ modelValue?.button.label }}
            <svg class="banner-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
            </svg>
        </a>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<HeaderAnnouncement>();
const { linkAttrs } = usePageLinks();
const textRef = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const isOverflowing = ref(false);

onMounted(() => {
	if (modelValue.value?.text && textRef.value && containerRef.value)
		isOverflowing.value =
			textRef.value.scrollWidth > containerRef.value.clientWidth;
});
</script>

<style scoped>
.banner {
    display: flex;
    align-items: center;
    background-color: rgba(var(--primaryColor), .5);
    transition: background-color 0.3s ease-in-out;
    justify-content: center;
    gap: 10px;
    height: 48px;
    min-height: 48px;
    max-height: 48px;
    overflow: hidden;
}

.scrolling .banner-text-container {
    flex: 1 1 auto;
}

.banner-text-container {
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
}

.banner-text {
    display: inline-block;
    margin-right: 0.5rem;
    font-size: 0.875rem;
    color: #000;
    white-space: nowrap;
    transition: color 0.3s;
    will-change: transform;
    /* Only animate if scrolling */
}

.scrolling .banner-text {
    animation: scroll-text-ltr 8s linear infinite alternate;
}

.rtl .scrolling .banner-text {
    animation: scroll-text-rtl 8s linear infinite alternate;
}

@keyframes scroll-text-ltr {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(calc(-100% + 100vw - 120px));
        /* 120px for button and paddings */
    }
}

@keyframes scroll-text-rtl {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(calc(100% - 100vw + 120px));
    }
}

.dark .banner-text {
    color: #fff;
}

.banner-button {
    display: inline-flex;
    align-items: center;
    font-weight: bold;
    color: #000;
    text-decoration: none;
    transition: text-decoration 0.3s ease-in-out;
    flex-shrink: 0;
    z-index: 1;
}

.dark .banner-button {
    color: #fff
}

.banner-button:hover,
.banner-button:focus {
    text-decoration: underline;
}

.banner-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
}

.rtl .banner-icon {
    transform: scaleX(-1);
}
</style>