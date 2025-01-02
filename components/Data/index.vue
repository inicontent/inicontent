<template>
    <NListItem>
        <template #prefix>
            <NButton text>
                <NText strong>
                    {{ t(field.key) }}:
                </NText>
            </NButton>
        </template>
        <template v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
            <LazyColumnBoolean v-if="detectedFieldType === 'boolean'" />
            <NText :depth="3" v-else>--</NText>
        </template>
        <template v-else>
            <LazyColumnRole v-if="detectedFieldType === 'role'" :value />
            <NScrollbar v-else-if="['table', 'tags', 'select', 'checkbox'].includes(detectedFieldType)" x-scrollable>
                <LazyColumnAsset v-if="detectedFieldType === 'table' && field.table === 'assets'" :value />
                <LazyColumnTable v-else-if="detectedFieldType === 'table'" :value :field />
                <LazyColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)" :value />
            </NScrollbar>
            <LazyColumnColor v-else-if="detectedFieldType === 'color'" :value />
            <LazyColumnUrl v-else-if="detectedFieldType === 'url'" :value />
            <LazyColumnEmail v-else-if="detectedFieldType === 'email'" :value />
            <LazyDataHtml v-else-if="detectedFieldType === 'html'" :value />
            <LazyColumnPassword v-else-if="detectedFieldType === 'password'" :value />
            <LazyColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
            <LazyColumnDate v-else-if="detectedFieldType === 'date'" :value />
            <LazyDataObject v-else-if="detectedFieldType === 'object'" :value :field />
            <LazyDataArray v-else-if="detectedFieldType === 'array'" :value :field />
            <LazyColumnText
                v-else-if="['string', 'text', 'textarea', 'number', 'radio', 'id', 'multiple'].includes(detectedFieldType)"
                :value />
        </template>
    </NListItem>
</template>

<script lang="ts" setup>
import { NButton, NText, NListItem, NScrollbar } from "naive-ui";

const { field, value } = defineProps<{ field: Field; value: any }>();

let detectedFieldType = (field.subType ?? field.type) as
	| FieldType
	| CMS_FieldType;
if (Array.isArray(detectedFieldType)) detectedFieldType = getField(field).key;
</script>
