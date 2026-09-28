<template>
    <section class="hero-section"
        :style="!heroMediaIsVideo && heroMediaUrl ? `background-image: url(${heroMediaUrl})` : ''">
        <video v-if="heroMediaIsVideo" :src="heroMediaUrl" class="hero-bg-video" autoplay muted loop
            playsinline></video>
        <div class="overlay"></div>
        <div class="hero-wrapper">
            <div class="hero-content">
                <LazyBlockHeading
                    v-if="modelValue?.preHeading || modelValue?.heading || modelValue?.description || modelValue?.preHeadingLink"
                    :model-value="{ ...modelValue, align: 'left' }" :design="2" />

                <div v-if="modelValue?.buttons && modelValue.buttons.length" class="actions">
                    <a v-for="({ label, link }, i) in modelValue.buttons" :key="i" v-bind="linkAttrs(link)"
                        :class="['btn', i === 0 ? 'btn-primary' : 'btn-secondary']">
                        {{ label }}
                        <svg v-if="i === 0" class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const modelValue = defineModel<Hero>();
const { linkAttrs } = usePageLinks();

const heroMediaUrl = computed(() => modelValue.value?.images?.[0]?.publicURL);
const heroMediaIsVideo = computed(() =>
	isVideoMediaValue(modelValue.value?.images),
);
</script>

<style scoped>
.hero-section {
    position: relative;
    overflow: hidden;
    padding-block: 8rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.75);
}

.hero-bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dark .overlay {
    background-color: rgba(17, 24, 39, 0.75);
}

.hero-wrapper {
    position: relative;
    z-index: 10;
    max-width: 1024px;
    margin-inline: auto;
    padding-inline: 1rem;
}

@container (min-width: 640px) {
    .hero-wrapper {
        padding-inline: 1.5rem;
    }
}

@container (min-width: 1024px) {
    .hero-wrapper {
        display: flex;
        align-items: center;
        height: 100vh;
        padding-inline: 2rem;
    }
}

.hero-content {
    max-width: 36rem;
    margin-inline: auto;
}


@container (min-width: 1024px) {
    .hero-content {
        margin-inline: 0;
    }
}

.actions {
    margin-block-start: 1.75rem;
    display: grid;
    gap: 0.75rem;
    width: 100%;
}

@container (min-width: 640px) {
    .actions {
        display: inline-flex;
    }
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding-block: 0.75rem;
    padding-inline: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: background-color 300ms ease-in-out;
}

.btn:hover {
    opacity: .8
}

.btn-primary {
    background-color: rgba(var(--primaryColor), 1);
    color: #ffffff;
}

.btn-primary:hover,
.btn-primary:focus {
    background-color: rgba(var(--primaryColor), 0.9);
}

.btn-secondary {
    border-color: #e5e7eb;
    background-color: #ffffff;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover,
.btn-secondary:focus {
    background-color: #f9fafb;
}

.dark .btn-secondary {
    background-color: #111827;
    border-color: #374151;
    color: #ffffff;
}

.dark .btn-secondary:hover,
.dark .btn-secondary:focus {
    background-color: #27272a;
}

.arrow-icon {
    flex-shrink: 0;
}

.rtl .arrow-icon {
    transform: scaleX(-1);
}
</style>