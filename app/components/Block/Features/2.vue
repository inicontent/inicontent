<template>
    <div class="container">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div class="features-grid">
            <div v-for="(feature, index) in modelValue?.items" :key="index" class="feature-card" tabindex="0">
                <div v-if="feature.image?.publicURL || feature.icon" class="feature-image-container">
                    <div class="feature-icon-bg">
                        <video v-if="isVideoMediaValue(feature.image)" :src="feature.image?.publicURL"
                            class="feature-image" muted loop playsinline></video>
                        <img v-else-if="feature.image?.publicURL" :src="feature.image.publicURL" alt="Feature image"
                            class="feature-image" />
                        <Icon v-else-if="feature.icon" :name="`tabler:${feature.icon}`" class="feature-icon" :size="24" />
                    </div>
                </div>

                <div class="feature-content">
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
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
    display: grid;
    gap: 1.5rem;
    align-items: center;
    grid-template-columns: 1fr;
}

@container (min-width: 640px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@container (min-width: 1024px) {
    .features-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2.5rem;
    }
}

.feature-card {
    background-color: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
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

.feature-image-container {
    flex-shrink: 0;
}

.feature-icon-bg {
    width: 3.5rem;
    height: 3.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 4px solid #EFF6FF;
    background-color: #DBEAFE;
    border-radius: 9999px;
}

.dark .feature-icon-bg {
    border-color: rgb(var(--primaryColor));
    background-color: rgba(var(--primaryColor), .8);
}

.feature-image {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    object-fit: cover;
}

.feature-icon {
    color: #000000;
}

.dark .feature-icon {
    color: #ffffff;
}

.feature-content h3,
.feature-content p {
    margin: 0;
    color: #1f2937;
}

.dark .feature-content h3,
.dark .feature-content p {
    color: #e5e7eb;
}

.feature-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
}

.feature-content p {
    margin-top: 0.5rem;
    color: #6b7280;
}

.dark .feature-content p {
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