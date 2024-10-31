<template>
    <div v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
        <LazyRenderColumnBoolean v-if="detectedFieldType === 'boolean'" />
        <NText :depth="3" v-else>--</NText>
    </div>
    <div v-else>
        <LazyRenderColumnRole v-if="detectedFieldType === 'role'" :value />
        <LazyRenderColumnId v-else-if="detectedFieldType === 'id'" :value />
        <NScrollbar v-else-if="['table', 'tags', 'select', 'checkbox'].includes(detectedFieldType)" x-scrollable>
            <LazyRenderColumnUpload v-if="detectedFieldType === 'table' && field.table === 'asset'" :value />
            <LazyRenderColumnTable v-else-if="detectedFieldType === 'table'" :value :field="field" />
            <LazyRenderColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)" :value />
        </NScrollbar>
        <LazyRenderColumnColor v-else-if="detectedFieldType === 'color'" :value />
        <LazyRenderColumnUrl v-else-if="detectedFieldType === 'url'" :value />
        <LazyRenderColumnEmail v-else-if="detectedFieldType === 'email'" :value />
        <LazyRenderColumnHtml v-else-if="detectedFieldType === 'html'" :value />
        <LazyRenderColumnPassword v-else-if="detectedFieldType === 'password'" :value />
        <LazyRenderColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
        <LazyRenderColumnDate v-else-if="detectedFieldType === 'date'" :value />
        <LazyRenderColumnObject v-else-if="detectedFieldType === 'object'" :value :field="field" />
        <LazyRenderColumnArray v-else-if="detectedFieldType === 'array'" :value :field="field" />
        <LazyRenderColumnText v-else-if="['string', 'text', 'textarea', 'number', 'radio'].includes(detectedFieldType)"
            :value />
    </div>
</template>

<script lang="ts" setup>
import { NText, NScrollbar } from "naive-ui"

const { field, value } = defineProps<{ field: Field, value?: any }>();

let detectedFieldType = field.subType ?? field.type;
if (Array.isArray(detectedFieldType))
    detectedFieldType = getField(
        field.subType ?? field.type,
        value,
    ).key;
detectedFieldType = detectedFieldType as FieldType | CMS_FieldType
</script>