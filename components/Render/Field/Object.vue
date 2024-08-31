<template>
    <NCollapse :expanded-names="field.expand ? path : undefined" display-directive="show" style="margin: 0 0 20px;"
        arrow-placement="right" :trigger-areas="['main', 'arrow']" accordion>
        <NCollapseItem display-directive="show" :title="t(field.key)" :name="path">
            <div style="padding-left: 10px">
                <LazyRenderFieldS :schema="field.children as Schema" v-model="modelValue" />
            </div>
        </NCollapseItem>
    </NCollapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from "naive-ui";

const { field, path } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const modelValue = defineModel({
    type: Object as PropType<any>,
    default: {},
})
</script>