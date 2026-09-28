<template>
    <p v-if="modelValue?.preHeading" class="preheading">
        {{ modelValue?.preHeading }}
    </p>

    <component :is="`h${modelValue?.tag || 1}`" v-if="modelValue?.heading" v-html="modelValue?.heading" class="heading">
    </component>

    <p v-if="modelValue?.description" class="description" v-html="modelValue?.description.replace(/\n/g, '<br>')"></p>
</template>

<script lang="ts" setup>
const modelValue = defineModel<Heading>();
</script>

<style scoped>
.preheading {
    display: inline-block;
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: black;
}

.dark .preheading {
    color: white;
}

.heading {
    display: block;
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.dark .heading {
    color: #ffffff;
}

.heading :deep(span) {
    font-weight: 800;
    position: relative;
    z-index: 1;
    color: white
}

.heading :deep(span::before) {
    content: "";
    z-index: -1;
    position: absolute;
    top: 0;
    left: -8%;
    width: 120%;
    margin-top: 22%;
    height: 60%;
    background-color: rgb(var(--primaryColor));
    border-radius: 8px;

}

.description {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    color: #1f2937;
}

.dark .description {
    color: #9ca3af;
}

@container (min-width: 640px) {
    .description {
        margin-top: 0.75rem;
    }
}

@container (min-width: 1024px) {
    .heading {
        font-size: 3.75rem;
        line-height: 1;
    }
}
</style>
