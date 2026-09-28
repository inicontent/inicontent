<template>
    <div class="banner">
        <span class="banner-pill">{{ pillLabel }}</span>
        <p v-if="modelValue?.text" class="banner-text">
            {{ modelValue.text }}
        </p>
        <a v-if="modelValue?.button" v-bind="linkAttrs(modelValue?.button.link)" class="banner-button">
            {{ modelValue?.button.label }}
            <svg class="banner-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
            </svg>
        </a>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<HeaderAnnouncement>();
const { linkAttrs } = usePageLinks();

// Short static label — the pill is decorative, the text carries the message.
const pillLabel = "New";
</script>

<style scoped>
.banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 48px;
    min-height: 48px;
    max-height: 48px;
    padding: 0 1rem;
    background: linear-gradient(90deg, rgba(var(--primaryColor), .9), rgba(var(--primaryColor), .6));
    transition: background-color 0.3s ease-in-out;
}

.banner-pill {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.625rem;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.25);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #fff;
}

.banner-text {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.banner-button {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    font-size: 0.875rem;
    color: #fff;
    text-decoration: none;
}

.banner-button:hover,
.banner-button:focus {
    text-decoration: underline;
}

.banner-icon {
    width: 1rem;
    height: 1rem;
}

.rtl .banner-icon {
    transform: scaleX(-1);
}
</style>
