<template>
    <section class="faq-section">
        <LazyBlockHeading v-if="hasHeading" v-model="modelValue" :design="1" />
        <div v-for="(item, idx) in modelValue?.items ?? []" :key="idx" class="accordion-item">
            <button class="accordion-trigger" @click="toggle(idx)" :aria-expanded="openIndex === idx">
                {{ item.question }}
                <span class="accordion-arrow" :class="{ open: openIndex === idx }"></span>
            </button>
            <div v-show="openIndex === idx" class="accordion-panel">
                <p>{{ item.answer }}</p>
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
    max-width: 85rem;
    margin: 0 auto;
    padding: 1rem;
}

.accordion-item {
    background-color: #ffffff;
    padding: 1.5rem 0;
}

.dark .accordion-item {
    background-color: #1f2937;
}

.accordion-trigger {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
}

.rtl .accordion-trigger {
    text-align: right;
}

.dark .accordion-trigger {
    color: #e5e7eb;
}

.accordion-arrow {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
}

.dark .accordion-arrow {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.accordion-arrow.open {
    transform: rotate(180deg);
}

.accordion-panel {
    margin-top: 0.75rem;
    color: #4b5563;
}

.dark .accordion-panel {
    color: #9ca3af;
}
</style>