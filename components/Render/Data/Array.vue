<template>
    <LazyRenderColumn v-if="field.subType" :field="{ ...field, type: field.subType }" :value="value" />
    <LazyRenderColumn v-else-if="!isArrayOfObjects(field.children)"
        :field="{ ...field, type: field.children === 'table' ? 'table' : 'tags' }" :value="value" />
    <NListItem v-else v-for="(, index) in value">
        <template #prefix>
            <NText strong>
                {{ index + 1 }}
            </NText>
        </template>
        <RenderData v-for="child in (field.children as Schema)" :field="child" :value="value[index][field.key]" />
    </NListItem>
</template>

<script lang="ts" setup>
import { NButton, NFlex, NPopover, NCollapse, NCollapseItem, NListItem, NText } from 'naive-ui';
import { isArrayOfObjects } from "inibase/utils";

const { field, value } = defineProps<{ field: Field, value: any }>()
</script>