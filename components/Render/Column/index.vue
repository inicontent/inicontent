<template>
    <div v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
        <LazyRenderColumnBoolean v-if="detectedFieldType === 'boolean'" />
        <NText :depth="3" v-else>--</NText>
    </div>
    <div v-else>
        <LazyRenderColumnRole v-if="detectedFieldType === 'role'" :value="value" />
        <LazyRenderColumnId v-else-if="detectedFieldType === 'id'" :value="value" />
        <NScrollbar v-else-if="['table', 'upload', 'tags', 'select', 'checkbox'].includes(detectedFieldType)"
            x-scrollable>
            <LazyRenderColumnTable v-if="detectedFieldType === 'table'" :value="value" :field="field" />
            <LazyRenderColumnUpload v-else-if="detectedFieldType === 'upload'" :value="value" />
            <LazyRenderColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)"
                :value="value" />
        </NScrollbar>
        <LazyRenderColumnColor v-else-if="detectedFieldType === 'color'" :value="value" />
        <LazyRenderColumnUrl v-else-if="detectedFieldType === 'url'" :value="value" />
        <LazyRenderColumnEmail v-else-if="detectedFieldType === 'email'" :value="value" />
        <LazyRenderColumnHtml v-else-if="detectedFieldType === 'html'" :value="value" />
        <LazyRenderColumnPassword v-else-if="detectedFieldType === 'password'" :value="value" />
        <LazyRenderColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value="value" />
        <LazyRenderColumnDate v-else-if="detectedFieldType === 'date'" :value="value" />
        <LazyRenderColumnObject v-else-if="detectedFieldType === 'object'" :value="value" :field="field" />
        <LazyRenderColumnArray v-else-if="detectedFieldType === 'array'" :value="value" :field="field" />
        <LazyRenderColumnText v-else-if="['string', 'text', 'textarea', 'number', 'radio'].includes(detectedFieldType)"
            :value="value" />
    </div>
</template>

<script lang="ts" setup>
import { NText, NScrollbar } from "naive-ui"
const { field, ...props } = defineProps({
    field: {
        type: Object as PropType<Field | never>,
        default: [],
    },
    value: null
});


let detectedFieldType = field.subType ?? field.type;
if (Array.isArray(detectedFieldType))
    detectedFieldType = getField(
        field.subType ?? field.type,
        props.value,
    ).key;
detectedFieldType = detectedFieldType as string
</script>