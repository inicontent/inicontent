<template>
    <NPopover scrollable style="max-height: 240px;" trigger="click">
        <template #trigger>
            <NButton circle>{...}</NButton>
        </template>
        <NFlex vertical>
            <NFlex v-for="child in (field.children as Schema)" align="center" inline>
                <strong>{{ child.key }}:</strong>
                <LazyRenderColumn :field="child" :value="value[child.key]" />
            </NFlex>
        </NFlex>
    </NPopover>
</template>

<script lang="ts" setup>
import { NButton, NFlex, NPopover } from 'naive-ui';

const { field } = defineProps({
    field: {
        type: Object as PropType<Field | never>,
        default: [],
    },
    value: {
        type: Object,
        required: true
    }
});
</script>