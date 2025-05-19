<template>
    <NTag round :style="{ backgroundColor: value }">
        <NText style="mix-blend-mode: difference;">{{ value }}</NText>
    </NTag>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>();
</script>