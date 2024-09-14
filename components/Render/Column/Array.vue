<template>
    <LazyRenderColumn v-if="field.subType" :field="{ ...field, type: field.subType }" :value="value" />
    <LazyRenderColumn v-else-if="!isArrayOfObjects(field.children)"
        :field="{ ...field, type: field.children === 'table' ? 'table' : 'tags' }" :value="value" />
    <NPopover v-else scrollable style="max-height: 240px;" trigger="click">
        <template #trigger>
            <NButton circle>{{ `[${[].concat(value).length}]` }}</NButton>
        </template>
        <NCollapse accordion arrow-placement="right">
            <NCollapseItem v-for="(singleValue, index) in [].concat(value)" :title="`${t(field.key)} ${index + 1}`">
                <NFlex vertical>
                    <NFlex v-for="child in (field.children as Schema)" align="center" inline>
                        <strong>{{ child.key }}:</strong>
                        <LazyRenderColumn :field="child" :value="singleValue[child.key]" />
                    </NFlex>
                </NFlex>
            </NCollapseItem>
        </NCollapse>
    </NPopover>
</template>

<script lang="ts" setup>
import { NButton, NFlex, NPopover, NCollapse, NCollapseItem } from 'naive-ui';
import { isArrayOfObjects } from "inibase/utils";

const { field } = defineProps({
    field: {
        type: Object as PropType<Field | never>,
        default: [],
    },
    value: {
        type: Array as PropType<any>,
        required: true
    }
});
</script>