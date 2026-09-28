<template>
    <div class="hero-container">
        <div class="hero-grid">
            <div class="hero-content">
                <LazyBlockHeading
                    v-if="modelValue?.preHeading || modelValue?.heading || modelValue?.description || modelValue?.preHeadingLink"
                    :model-value="{ ...modelValue, align: 'left' }" :design="1"
                    style="margin: 0 auto;padding-bottom: 0;padding-inline: 0;" />
                <div v-if="modelValue?.buttons && modelValue.buttons.length" class="hero-actions">
                    <a v-for="({ label, link }, index) in modelValue.buttons" :key="index" v-bind="linkAttrs(link)"
                        :class="['action', index === 0 ? 'action-primary' : 'action-secondary']">
                        {{ label }}
                        <svg v-if="index === 0" class="action-arrow" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </a>
                </div>
            </div>
            <div v-if="modelValue?.images && modelValue.images.length" class="hero-image-wrapper">
                <video v-if="heroMediaIsVideo" class="hero-image" :src="heroMediaUrl ?? ''" autoplay muted loop
                    playsinline></video>
                <img v-else class="hero-image" :src="heroMediaUrl" alt="" />
                <div class="hero-image-gradient"></div>
                <div class="hero-image-deco">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 451" fill="currentColor">
                        <rect x="531" y="352" width="99" height="99" fill="currentColor" />
                        <rect x="140" y="352" width="106" height="99" fill="currentColor" />
                        <rect x="482" y="402" width="64" height="49" fill="currentColor" />
                        <rect x="433" y="402" width="63" height="49" fill="currentColor" />
                        <rect x="384" y="352" width="49" height="50" fill="currentColor" />
                        <rect x="531" y="328" width="50" height="50" fill="currentColor" />
                        <rect x="99" y="303" width="49" height="58" fill="currentColor" />
                        <rect x="99" y="352" width="49" height="50" fill="currentColor" />
                        <rect x="99" y="392" width="49" height="59" fill="currentColor" />
                        <rect x="234" y="402" width="62" height="49" fill="currentColor" />
                        <rect x="334" y="303" width="50" height="49" fill="currentColor" />
                        <rect x="581" width="49" height="49" fill="currentColor" />
                        <rect x="581" width="49" height="64" fill="currentColor" />
                        <rect x="482" y="123" width="49" height="49" fill="currentColor" />
                        <rect x="507" y="124" width="49" height="24" fill="currentColor" />
                        <rect x="531" y="49" width="99" height="99" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Hero>();
const { linkAttrs } = usePageLinks();

const heroMediaUrl = computed(() => modelValue.value?.images?.[0]?.publicURL);
const heroMediaIsVideo = computed(() =>
	isVideoMediaValue(modelValue.value?.images),
);
</script>

<style scoped>
.hero-container {
    max-width: 85rem;
    margin-inline: auto;
    padding-block: 2.5rem;
    padding-inline: 1rem;
    position: relative;
    z-index: 0;
}

.hero-grid {
    display: grid;
    gap: 1rem;
}

.hero-actions {
    display: grid;
    gap: 0.75rem;
    width: 100%;
}

.action {
    padding: 0.75rem 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid;
    text-decoration: none;
    transition: background-color 150ms ease-in-out;
}

.action-primary {
    border-color: transparent;
    background-color: rgb(var(--primaryColor));
    color: #fff;
}

.action-primary:hover,
.action-primary:focus {
    background-color: rgba(var(--primaryColor), .7);
}

.action-secondary {
    border-color: #e5e7eb;
    background-color: #fff;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-secondary:hover,
.action-secondary:focus {
    background-color: #f9fafb;
}

.dark .action-secondary {
    background-color: #111827;
    border-color: #374151;
    color: #fff;
}

.dark .action-secondary:hover,
.dark .action-secondary:focus {
    background-color: #27272a;
}

.action-arrow {
    flex-shrink: 0;
}

.rtl .action-arrow {
    transform: scaleX(-1);
}

.hero-image-wrapper {
    position: relative;
}

.hero-image,
.hero-image-gradient,
.hero-image-deco {
    border-radius: 0.375rem;
}

.hero-image {
    width: 100%;
    display: block;
}

.hero-image-gradient {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: linear-gradient(to bottom right,
            rgba(var(--primaryColor), .1),
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0));
    margin-block-start: -.5rem;
    margin-inline-start: -.5rem;
}

.rtl .hero-image-gradient {
    background-image: linear-gradient(to bottom left,
            rgba(var(--primaryColor), .1),
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0));
}

.hero-image-deco {
    position: absolute;
    bottom: -7px;
    left: 0;
    width: 66.666%;
    color: #fff;
}

.rtl .hero-image-deco {
    transform: scaleX(-1);
}

.dark .hero-image-deco {
    color: #404040;
}

@container (min-width: 640px) {
    .hero-container {
        padding-inline: 1.5rem;
    }

    .hero-actions {
        display: inline-flex;
    }
}

@container (min-width: 768px) {
    .hero-grid {
        gap: 2rem;
        align-items: center;
    }
}

@container (min-width: 1024px) {
    .hero-container {
        padding-inline: 2rem;
    }

    .hero-image-gradient {
        margin-block-start: -1.5rem;
        margin-inline-start: -1.5rem;
    }

    .hero-grid {
        gap: 5rem;
        grid-template-columns: repeat(2, 1fr);
    }

    .hero-image-wrapper {
        margin-inline-start: 1rem;
    }

    .rtl .hero-image-wrapper {
        margin-inline-start: 0;
        margin-inline-end: 1rem;
    }
}
</style>