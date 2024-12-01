<template>
    <NTag round :style="{ backgroundColor: value }">
        <NText style="mix-blend-mode: difference;">{{ value }}</NText>
    </NTag>
</template>

<script lang="ts" setup>
import { NTag, NText } from "naive-ui";

const { value } = defineProps<{ value?: string }>();
</script>