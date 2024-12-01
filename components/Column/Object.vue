<template>
    <NPopover scrollable style="max-height: 240px;" trigger="click">
        <template #trigger>
            <NButton size="small" circle>{{ `\{${Object.keys(value).length}\}` }}</NButton>
        </template>
        <NFlex vertical>
            <NFlex v-for="child in (field.children as Schema)" align="center" inline>
                <strong>{{ child.key }}:</strong>
                <Column :field="child" :value="value[child.key]" />
            </NFlex>
        </NFlex>
    </NPopover>
</template>

<script lang="ts" setup>
import { NButton, NFlex, NPopover } from "naive-ui";

const { field, value } = defineProps<{ field: Field; value?: any }>();
</script>