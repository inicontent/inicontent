<template>
    <div v-if="value === null || value === undefined || (Array.isArray(value) && value.length === 0)">
        <ColumnBoolean v-if="detectedFieldType === 'boolean'" />
        <span :depth="3" v-else>--</span>
    </div>
    <div v-else>
        <ColumnRole v-if="detectedFieldType === 'role'" :value />
        <ColumnId v-else-if="['id', 'ip'].includes(detectedFieldType)" :value />
        <div class="overflow-auto" v-else-if="['table', 'tags', 'select', 'radio', 'checkbox'].includes(detectedFieldType)"
            x-scrollable>
            <ColumnAsset v-if="field.table === 'assets'" :value />
            <ColumnTable v-else-if="detectedFieldType === 'table'" :value :field />
            <ColumnTags v-else-if="['tags', 'select', 'radio', 'checkbox'].includes(detectedFieldType)" :value :field />
        </div>
        <ColumnColor v-else-if="detectedFieldType === 'color'" :value />
        <ColumnUrl v-else-if="detectedFieldType === 'url'" :value />
        <ColumnEmail v-else-if="detectedFieldType === 'email'" :value />
        <ColumnHtml v-else-if="detectedFieldType === 'html'" :value :field />
        <ColumnPassword v-else-if="detectedFieldType === 'password'" :value />
        <ColumnBoolean v-else-if="detectedFieldType === 'boolean'" :value />
        <ColumnDate v-else-if="detectedFieldType === 'date'" :value />
        <ColumnObject v-else-if="detectedFieldType === 'object'" :value :field />
        <ColumnArray v-else-if="detectedFieldType === 'array'" :value :field />
        <ColumnText
            v-else-if="['string', 'text', 'textarea', 'number', 'radio', 'multiple'].includes(detectedFieldType)"
            :value />
    </div>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value?: any }>()

let detectedFieldType = (field.subType ?? field.type) as
    | DB_FieldType
    | CMS_FieldType
if (Array.isArray(detectedFieldType)) detectedFieldType = getField(field).key
</script>