<template>
    <ul class="list"Item>
        <template #prefix>
            <UButton text>
                <strong>{{ t(field.key) }}:</strong>
            </UButton>
        </template>
        <template v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
            <LazyColumnBoolean v-if="detectedFieldType === 'boolean'" />
            <span :depth="3" v-else>--</span>
        </template>
        <template v-else>
            <LazyColumnRole v-if="detectedFieldType === 'role'" :value />
            <div class="overflow-auto" v-else-if="['table', 'tags', 'select', 'checkbox'].includes(detectedFieldType)" x-scrollable>
                <LazyColumnAsset v-if="detectedFieldType === 'table' && field.table === 'assets'" :value />
                <LazyDataTable v-else-if="detectedFieldType === 'table'" :value :field />
                <LazyColumnTags v-else-if="['tags', 'select', 'checkbox'].includes(detectedFieldType)" :field :value />
            </div>
            <LazyColumnColor v-else-if="detectedFieldType === 'color'" :value />
            <LazyColumnUrl v-else-if="detectedFieldType === 'url'" :value />
            <LazyColumnEmail v-else-if="detectedFieldType === 'email'" :value />
            <LazyDataHtml v-else-if="detectedFieldType === 'html' || detectedFieldType === 'textarea'" :value />
            <LazyColumnPassword v-else-if="detectedFieldType === 'password'" :value />
            <LazyColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
            <LazyColumnDate v-else-if="detectedFieldType === 'date'" :value />
            <LazyDataObject v-else-if="detectedFieldType === 'object'" :value :field />
            <LazyDataArray v-else-if="detectedFieldType === 'array'" :value :field />
            <LazyColumnText
                v-else-if="['string', 'text', 'number', 'radio', 'id', 'multiple'].includes(detectedFieldType)"
                :value />
        </template>
    </li>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: any }>()

let detectedFieldType = (field.subType ?? field.type) as
    | DB_FieldType
    | CMS_FieldType
if (Array.isArray(detectedFieldType)) detectedFieldType = getField(field).key
</script>
