<template>
    <section class="faq-section">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div v-if="modelValue?.items?.length">
            <div v-for="(item, index) in modelValue.items" :key="index" class="faq-item">
                <h3 class="faq-question">{{ item.question }}</h3>
                <p class="faq-answer">{{ item.answer }}</p>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const modelValue = defineModel<FAQs>();

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);
</script>

<style scoped>
.faq-section {
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .faq-section {
        padding-inline: 1.5rem;
    }
}

@media (min-width: 1024px) {
    .faq-section {
        padding-inline: 2rem;
        padding-block: 3.5rem;
    }
}

.faq-preheading-link {
    display: inline-block;
    margin-inline: auto;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.dark .faq-preheading-link {
    color: #e5e7eb;
}

.faq-preheading {
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
    background: linear-gradient(to right, #000, #4b5563);
    background-clip: text;
    color: transparent;
    margin-block: 0.5rem 1.5rem;
}

.faq-title-container {
    max-width: 42rem;
    margin-inline: auto;
    text-align: center;
    margin-block-end: 2.5rem;
}

@media (min-width: 1024px) {
    .faq-title-container {
        margin-block-end: 3.5rem;
    }
}

.faq-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.dark .faq-title {
    color: #e5e7eb;
}

.faq-description {
    max-width: 64rem;
    margin-inline: auto;
    text-align: center;
    color: #4b5563;
    margin-block-end: 2rem;
}

.dark .faq-description {
    color: #9ca3af;
}

.faq-item {
    padding: 0;
}

.faq-question {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.dark .faq-question {
    color: #e5e7eb;
}

.faq-answer {
    margin-block-start: 0.5rem;
    color: #6b7280;
}

.dark .faq-answer {
    color: #9ca3af;
}
</style>