<template>
    <div v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
        <ColumnBoolean v-if="detectedFieldType === 'boolean'" />
        <NText :depth="3" v-else>--</NText>
    </div>
    <div v-else>
        <ColumnRole v-if="detectedFieldType === 'role'" :value />
        <ColumnId v-else-if="detectedFieldType === 'id'" :value />
        <NScrollbar v-else-if="['table', 'tags', 'select', 'checkbox'].includes(detectedFieldType)" x-scrollable>
            <ColumnUpload v-if="detectedFieldType === 'table' && field.table === 'assets'" :value />
            <ColumnTable v-else-if="detectedFieldType === 'table'" :value :field="field" />
            <ColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)" :value />
        </NScrollbar>
        <ColumnColor v-else-if="detectedFieldType === 'color'" :value />
        <ColumnUrl v-else-if="detectedFieldType === 'url'" :value />
        <ColumnEmail v-else-if="detectedFieldType === 'email'" :value />
        <ColumnHtml v-else-if="detectedFieldType === 'html'" :value />
        <ColumnPassword v-else-if="detectedFieldType === 'password'" :value />
        <ColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
        <ColumnDate v-else-if="detectedFieldType === 'date'" :value />
        <ColumnObject v-else-if="detectedFieldType === 'object'" :value :field="field" />
        <ColumnArray v-else-if="detectedFieldType === 'array'" :value :field="field" />
        <ColumnText v-else-if="['string', 'text', 'textarea', 'number', 'radio'].includes(detectedFieldType)" :value />
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