<template>
    <NFlex :wrap="false">
        <NTag v-for="singleValue in ([] as string[]).concat(value)" round :bordered="false">{{ singleValue }}</NTag>
    </NFlex>
</template>

<script lang="ts" setup>
import { NFlex, NTag } from "naive-ui";

defineProps<{ value: string | string[] }>();
</script>