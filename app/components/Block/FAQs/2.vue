<template>
    <section class="faq-section">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div v-for="(item, idx) in modelValue?.items ?? []" :key="idx" class="faq-item">
            <button class="faq-question" @click="toggle(idx)" :aria-expanded="openIndex === idx">
                {{ item.question }}
                <span class="arrow" :class="{ 'open': openIndex === idx }"></span>
            </button>
            <div v-show="openIndex === idx" class="faq-answer">
                {{ item.answer }}
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const modelValue = defineModel<FAQs>();
const openIndex = ref<number | null>(0);

const hasHeading = computed(
	() =>
		!!modelValue.value?.heading ||
		!!modelValue.value?.preHeading ||
		!!modelValue.value?.preHeadingLink ||
		!!modelValue.value?.description,
);

function toggle(idx: number) {
	openIndex.value = openIndex.value === idx ? null : idx;
}
</script>

<style scoped>
.faq-section {
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.faq-item {
    background-color: #f3f4f6;
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.dark .faq-item {
    background-color: #27272a;
}

.faq-question {
    width: 100%;
    background: none;
    border: none;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    position: relative;
    padding-right: 2rem;
    cursor: pointer;
}

.rtl .faq-question {
    padding-right: 0;
    padding-left: 2rem;
}

.faq-item,
.faq-question {
    text-align: left;
}

.rtl .faq-item,
.rtl .faq-question {
    text-align: right;
}

.dark .faq-question {
    color: #e5e7eb;
}

.arrow {
    position: absolute;
    right: 0;
    top: 50%;
    width: 1rem;
    height: 1rem;
    transform: translateY(-50%) rotate(0deg);
    transition: transform 0.3s ease;
}

.rtl .arrow {
    right: auto;
    left: 0;
}

.arrow::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
}

.dark .arrow::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.arrow.open {
    transform: translateY(-50%) rotate(180deg);
}

.faq-answer {
    margin-top: 0.75rem;
    color: #4b5563;
    font-size: 1rem;
}

.dark .faq-answer {
    color: #e5e7eb;
}
</style>