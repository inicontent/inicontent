<template>
    <LazyDataTable v-if="field.table && field.table !== 'assets'" :field :value />
    <LazyColumn v-else-if="field.subType" :field="{ ...field, type: field.subType }" :value="value" />
    <LazyColumn v-else-if="!isArrayOfObjects(field.children)"
        :field="{ ...field, type: field.children === 'table' ? 'table' : 'tags' }" :value="value" />
    <NListItem v-else-if="shouldRenderAsTable">
        <div class="array-table-wrapper">
            <table class="array-table">
                <thead>
                    <tr>
                        <th class="index-col">#</th>
                        <th v-for="column in field.children" :key="column.key">
                            {{ column.label || column.key }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                        <td class="index-col">{{ rowIndex + 1 }}</td>
                        <td v-for="column in field.children" :key="column.key">
                           <DataValue :field="column" :value="row[column.key]" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </NListItem>
    <NListItem v-else v-for="(,index) in rows">
        <template #prefix>
            <NText strong>
                {{ index + 1 }}
            </NText>
        </template>
        <Data
            v-for="child in childrenSchema.filter(child => typeof rows[index][child.key] !== 'undefined')"
            :field="child" :value="rows[index][child.key]" />
    </NListItem>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"

type Row = Record<string, unknown>

const { field, value } = defineProps<{ field: Field; value: unknown }>()

const rows = computed<Row[]>(() => {
    return Array.isArray(value) ? (value as Row[]) : []
})

const childrenSchema = computed<Schema>(() => {
    return Array.isArray(field.children) ? (field.children as Schema) : []
})

const hasNestedArrayObjectChild = computed(() => {
    return childrenSchema.value.some(child => {
        const type = child.type
        if (Array.isArray(type)) {
            const normalized = type.map(entry => String(entry).toLowerCase())
            return normalized.includes('array') && normalized.includes('object')
        }

        const normalized = String(type || '').toLowerCase()
        if (normalized.includes('array') && normalized.includes('object')) {
            return true
        }

        return normalized === 'array' && Array.isArray(child.children) && child.children.length > 0
    })
})

const shouldRenderAsTable = computed(() => {
    return isArrayOfObjects(field.children) && rows.value.length > 0 && !hasNestedArrayObjectChild.value
})
</script>

<style scoped>
.array-table-wrapper {
    overflow-x: auto;
}

.array-table {
    width: 100%;
    border-collapse: collapse;
}

.array-table th,
.array-table td {
    padding: 8px;
    border-bottom: 1px solid var(--n-border-color);
    white-space: nowrap;
}

.array-table th {
    font-weight: 600;
}

.index-col {
    width: 56px;
    min-width: 56px;
}
</style>