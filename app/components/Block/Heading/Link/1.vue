<template>
    <a class="link" v-bind="linkAttrs(modelValue?.link)">
        {{ modelValue?.label }}
        <span class="link-badge">
            <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
            </svg>
        </span>
    </a>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Button>();
const { linkAttrs } = usePageLinks();
</script>

<style scoped>
.link {
    display: inline-flex;
    align-items: center;
    column-gap: 0.5rem;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #1f2937;
    padding: 0.25rem 0.25rem 0.25rem 0.75rem;
    border-radius: 9999px;
    transition: all 150ms ease-in-out;
}

.rtl .link {
    padding: 0.25rem 0.75rem 0.25rem 0.25rem;
}

.link:hover,
.link:focus {
    border-color: #d1d5db;
    outline: none;
}

.dark .link {
    background-color: #27272a;
    border-color: #3f3f46;
    color: #e4e4e7;
}

.dark .link:hover,
.dark .link:focus {
    border-color: #52525b;
}

.link-badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: 9999px;
    background-color: #e5e7eb;
    font-weight: 600;
    font-size: 0.875rem;
    color: #4b5563;
}

.dark .link-badge {
    background-color: #3f3f46;
    color: #9ca3af;
}

.link-icon {
    flex-shrink: 0;
}

.rtl .link-icon {
    transform: scaleX(-1);
}
</style>