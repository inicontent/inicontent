<template>
    <div class="banner">
        <svg class="banner-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 11v3a1 1 0 0 0 1 1h1l4 4V6l-4 4H4a1 1 0 0 0-1 1Z" />
            <path d="M15 8a5 5 0 0 1 0 8" />
        </svg>
        <p v-if="modelValue?.text" class="banner-text">
            {{ modelValue.text }}
        </p>
        <a v-if="modelValue?.button" v-bind="linkAttrs(modelValue?.button.link)" class="banner-button">
            {{ modelValue?.button.label }}
        </a>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<HeaderAnnouncement>();
const { linkAttrs } = usePageLinks();
</script>

<style scoped>
.banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 48px;
    min-height: 48px;
    max-height: 48px;
    padding: 0 1rem;
    background-color: rgba(var(--primaryColor), .12);
    transition: background-color 0.3s ease-in-out;
}

.banner-icon {
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
    color: rgb(var(--primaryColor));
}

.rtl .banner-icon {
    transform: scaleX(-1);
}

.banner-text {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dark .banner-text {
    color: #fff;
}

.banner-button {
    flex-shrink: 0;
    font-weight: 700;
    font-size: 0.875rem;
    color: rgb(var(--primaryColor));
    text-decoration: underline;
    text-underline-offset: 2px;
}

.banner-button:hover,
.banner-button:focus {
    text-decoration: none;
}
</style>
