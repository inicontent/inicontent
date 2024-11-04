<template>
    <div v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
        <RenderColumnBoolean v-if="detectedFieldType === 'boolean'" />
        <NText :depth="3" v-else>--</NText>
    </div>
    <div v-else>
        <RenderColumnRole v-if="detectedFieldType === 'role'" :value />
        <RenderColumnId v-else-if="detectedFieldType === 'id'" :value />
        <NScrollbar v-else-if="['table', 'tags', 'select', 'checkbox'].includes(detectedFieldType)" x-scrollable>
            <RenderColumnUpload v-if="detectedFieldType === 'table' && field.table === 'assets'" :value />
            <RenderColumnTable v-else-if="detectedFieldType === 'table'" :value :field="field" />
            <RenderColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)" :value />
        </NScrollbar>
        <RenderColumnColor v-else-if="detectedFieldType === 'color'" :value />
        <RenderColumnUrl v-else-if="detectedFieldType === 'url'" :value />
        <RenderColumnEmail v-else-if="detectedFieldType === 'email'" :value />
        <RenderColumnHtml v-else-if="detectedFieldType === 'html'" :value />
        <RenderColumnPassword v-else-if="detectedFieldType === 'password'" :value />
        <RenderColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
        <RenderColumnDate v-else-if="detectedFieldType === 'date'" :value />
        <RenderColumnObject v-else-if="detectedFieldType === 'object'" :value :field="field" />
        <RenderColumnArray v-else-if="detectedFieldType === 'array'" :value :field="field" />
        <RenderColumnText v-else-if="['string', 'text', 'textarea', 'number', 'radio'].includes(detectedFieldType)"
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