<template>
    <section class="hero-section">
        <div class="gradient-wrapper" aria-hidden="true">
            <div class="gradient-1"></div>
            <div class="gradient-2"></div>
        </div>

        <div class="content-wrapper">
            <div class="inner-container">
                <div class="hero-text">
                    <LazyBlockHeading
                        v-if="modelValue?.preHeading || modelValue?.heading || modelValue?.description || modelValue?.preHeadingLink"
                        v-model="modelValue" :design="2" />

                    <div v-if="modelValue?.buttons && modelValue.buttons.length" class="actions-wrap">
                        <a v-for="({ label, link }, i) in modelValue.buttons" :key="i" v-bind="linkAttrs(link)"
                            :class="['action-button', i === 0 ? 'primary' : 'secondary']">
                            {{ label }}
                            <svg v-if="i === 0" class="action-arrow" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div v-if="heroMediaUrl" class="hero-image-wrapper">
                    <video v-if="heroMediaIsVideo" :src="heroMediaUrl" alt="Hero Image" class="hero-image" autoplay muted
                        loop playsinline></video>
                    <img v-else :src="heroMediaUrl" alt="Hero Image" class="hero-image" />
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
/* Section & gradients */
.hero-section {
    position: relative;
    overflow: hidden;
    padding-block: 2.5rem;
}

.gradient-wrapper {
    position: absolute;
    display: flex;
    top: -24rem;
    left: 50%;
    transform: translateX(-50%);
}

.gradient-1,
.gradient-2 {
    filter: blur(64px);
}

.gradient-1 {
    width: 25rem;
    height: 44rem;
    background-image: linear-gradient(to right,
            rgba(var(--primaryColor), 0.3),
            rgba(var(--primaryColor), 0.1));
    transform: rotate(-60deg) translateX(-10rem);
}

.gradient-2 {
    width: 90rem;
    height: 50rem;
    background-image: linear-gradient(to top left,
            rgba(var(--primaryColor), 0.05),
            rgba(var(--primaryColor), 0.1),
            rgba(var(--primaryColor), 0.05));
    border-radius: 9999px;
    transform-origin: top left;
    transform: rotate(-12deg) translateX(-15rem);
}

.dark .gradient-1 {
    background-image: linear-gradient(to right,
            rgba(var(--primaryColor), 0.7),
            rgba(var(--primaryColor), 0.9));
}

.dark .gradient-2 {
    background-image: linear-gradient(to top left,
            rgba(var(--primaryColor), 0.5),
            rgba(var(--primaryColor), 0.7),
            rgba(var(--primaryColor), 0.9));
}

/* Content */
.content-wrapper {
    position: relative;
    z-index: 10;
}

.inner-container {
    max-width: 85rem;
    margin-inline: auto;
    padding: 2.5rem 1rem;
}

.hero-text {
    max-width: 42rem;
    margin-inline: auto;
    text-align: center;
}

/* Actions */
.actions-wrap {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
}

.action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: background-color 300ms ease-in-out;
}

.action-button.primary {
    background-color: #ffffff;
    color: #000000;
}

.action-button.primary:hover,
.action-button.primary:focus {
    background-color: rgba(229, 231, 235, 0.8);
}

.action-button.secondary {
    color: #1f2937;
}

.action-button.secondary:hover,
.action-button.secondary:focus {
    background-color: #f3f4f6;
}

.dark .action-button.secondary {
    color: #ffffff;
}

.dark .action-button.secondary:hover,
.dark .action-button.secondary:focus {
    background-color: #27272a;
}

.action-arrow {
    flex-shrink: 0;
}

.rtl .action-arrow {
    transform: scaleX(-1);
}

/* Responsive */
@container (min-width: 768px) {
    .inner-container {
        padding-block: 2.875rem;
    }
}

@container (min-width: 1024px) {
    .hero-section {
        padding-block-start: 4rem;
    }

    .inner-container {
        padding-block: 4rem;
    }
}

@container (min-width: 640px) {
    .inner-container {
        padding-inline: 1.5rem;
    }
}

@container (min-width: 1024px) {
    .inner-container {
        padding-inline: 2rem;
    }
}

.hero-image-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
}

.hero-image {
    max-width: 100%;
    max-height: 320px;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 1.5px 6px rgba(0, 0, 0, 0.08);
    object-fit: cover;
    background: #fff;
    transition: box-shadow 0.3s;
}

.hero-image:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.10);
}
</style>