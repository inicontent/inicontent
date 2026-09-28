<template>
    <section class="container">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div class="features-list">
            <div v-for="(feature, index) in modelValue?.items" :key="index" class="feature-item" tabindex="0">
                <div v-if="feature.image?.publicURL || feature.icon" class="icon-wrapper">
                    <video v-if="isVideoMediaValue(feature.image)" :src="feature.image?.publicURL"
                        class="icon-image" muted loop playsinline></video>
                    <img v-else-if="feature.image?.publicURL" :src="feature.image.publicURL" alt="Feature image"
                        class="icon-image" />
                    <Icon v-else-if="feature.icon" :name="`tabler:${feature.icon}`" class="icon-svg" :size="20" />
                </div>
                <div class="text-block">
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p v-if="feature.description" class="feature-desc">
                        {{ feature.description }}
                    </p>
                    <a v-if="feature.link" v-bind="linkAttrs(feature.link)" class="feature-link">
                        {{ t('learnMore') }}
                        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
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
import { isVideoMediaValue } from "~/composables/useForm";

const modelValue = defineModel<Features>();

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);

const { linkAttrs } = usePageLinks();
</script>

<style scoped>
.container {
    margin-inline: auto;
    padding: 2.5rem 1rem;
}

@container (min-width: 640px) {
    .container {
        padding-inline: 1.5rem;
    }
}

@container (min-width: 1024px) {
    .container {
        padding-inline: 2rem;
    }
}

/* Removed .grid-wrapper and .left-block styles */

.features-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@container (min-width: 1024px) {
    .features-list {
        gap: 2.5rem;
    }
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    transition: background-color 200ms ease-in-out;
}

.icon-wrapper {
    flex-shrink: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .icon-wrapper {
    border-color: #374151;
    background-color: #1f1f1f;
}

.icon-image,
.icon-svg {
    width: 1.5rem;
    height: 1.5rem;
}

.icon-image {
    border-radius: 0.5rem;
    object-fit: cover;
}

.icon-svg {
    color: #1f2937;
}

.dark .icon-svg {
    color: #e5e7eb;
}

.text-block {
    flex-grow: 1;
}

.feature-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

@container (min-width: 640px) {
    .feature-title {
        font-size: 1.125rem;
    }
}

.dark .feature-title {
    color: #ffffff;
}

.feature-desc {
    margin-block-start: 0.25rem;
    color: #6b7280;
}

.dark .feature-desc {
    color: #9ca3af;
}

.feature-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-block-start: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(var(--primaryColor));
    text-decoration: underline;
    transition: transform 200ms ease-in-out;
}

.feature-item:hover .arrow-icon,
.feature-item:focus .arrow-icon {
    transform: translateX(0.25rem);
}

.rtl .feature-item:hover .arrow-icon,
.rtl .feature-item:focus .arrow-icon {
    transform: translateX(-0.25rem) scaleX(-1);
}

.arrow-icon {
    flex-shrink: 0;
    transition: transform 200ms ease-in-out;
}

.rtl .arrow-icon {
    transform: scaleX(-1);
}
</style>