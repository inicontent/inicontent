<template>
    <a class="link-group" v-bind="linkAttrs(modelValue?.link)">
        {{ modelValue?.label }}
        <svg class="link-group-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    </a>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Button>();
const { linkAttrs } = usePageLinks();
</script>

<style scoped>
.link-group {
    display: inline-flex;
    align-items: center;
    column-gap: 0.25rem;
    font-size: 0.875rem;
    color: rgb(var(--primaryColor));
    text-decoration-thickness: 2px;
    font-weight: 500;
    outline: none;
}

.link-group:hover,
.link-group:focus {
    text-decoration-line: underline;
}

.link-group-icon {
    flex-shrink: 0;
    transition: all 150ms ease-in-out;
}

.link-group:hover .link-group-icon,
.link-group:focus .link-group-icon {
    transform: translateX(-0.25rem);
}

.rtl .link-group-icon {
    transform: scaleX(-1);
}

.rtl .link-group:hover .link-group-icon,
.rtl .link-group:focus .link-group-icon {
    transform: scaleX(-1) translateX(0.25rem);
}
</style>