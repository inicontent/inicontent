<template>
    <NFlex vertical :size="0">
        <Data v-for="child in (field.children as Schema).filter(child => typeof value[child.key] !== 'undefined')"
            :field="child" :value="value[child.key]" />
    </NFlex>
</template>

<script lang="ts" setup>
import { NFlex } from "naive-ui";

const { field, value } = defineProps<{ field: Field; value: any }>();
</script>