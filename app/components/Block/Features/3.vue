<template>
    <div class="container">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div class="features-grid">
            <div v-for="(feature, index) in modelValue?.items" :key="index" class="feature-card" tabindex="0">
                <div v-if="feature.image?.publicURL || feature.icon">
                    <video v-if="isVideoMediaValue(feature.image)" :src="feature.image?.publicURL"
                        class="feature-image" muted loop playsinline></video>
                    <img v-else-if="feature.image?.publicURL" :src="feature.image.publicURL" alt="Feature image"
                        class="feature-image" />
                    <Icon v-else-if="feature.icon" :name="`tabler:${feature.icon}`" class="feature-icon" :size="36" />
                    <div class="gradient-underline"></div>
                </div>

                <div class="feature-text">
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-desc">{{ feature.description }}</p>
                </div>

                <a v-if="feature.link" v-bind="linkAttrs(feature.link)" class="feature-link">
                    {{ t('learnMore') }}
                    <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </a>
            </div>
        </div>
    </div>
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

.features-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 3rem;
}

.feature-card {
    width: 100%;
    padding: 1.25rem;
    background-color: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    transition: background-color 200ms ease-in-out;
}

.dark .feature-card {
    background-color: #1f1f1f;
}

.dark .feature-card:hover,
.dark .feature-card:focus-within {
    background-color: #27272a;
}

.feature-card:hover,
.feature-card:focus-within {
    background-color: #f3f4f6;
}

.feature-card:focus-visible {
    outline: 2px solid rgba(var(--primaryColor), 0.5);
}

@container (min-width: 640px) {
    .feature-card {
        width: 48%;
    }
}

@container (min-width: 1024px) {
    .feature-card {
        width: 23%;
    }
}

.feature-image {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    object-fit: cover;
}

.feature-icon {
    width: 2.25rem;
    height: 2.25rem;
    color: #1f2937;
}

.dark .feature-icon {
    color: #ffffff;
}

.gradient-underline {
    height: 0.125rem;
    margin-top: 1.5rem;
    background-image: linear-gradient(to right,
            rgb(var(--primaryColor)),
            rgb(var(--primaryColor)),
            transparent);
}

.rtl .gradient-underline {
    background-image: linear-gradient(to left,
            rgb(var(--primaryColor)),
            rgb(var(--primaryColor)),
            transparent);
}

.feature-text {
    margin-top: 1.25rem;
}

.feature-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
}

.dark .feature-title {
    color: #ffffff;
}

.feature-desc {
    margin-top: 0.25rem;
    color: #6b7280;
}

.dark .feature-desc {
    color: #9ca3af;
}

.feature-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    text-decoration: none;
    transition: transform 200ms ease-in-out;
}

.dark .feature-link {
    color: #e5e7eb;
}

.arrow-icon {
    flex-shrink: 0;
    transition: transform 200ms ease-in-out;
}


.rtl .arrow-icon {
    transform: scaleX(-1);
}

.feature-card:hover .arrow-icon,
.feature-card:focus-within .arrow-icon {
    transform: translateX(0.25rem);
}

.rtl .feature-card:hover .arrow-icon,
.rtl .feature-card:focus-within .arrow-icon {
    transform: translateX(-0.25rem) scaleX(-1);
}
</style>