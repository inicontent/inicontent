<template>
    <LazyDataTable v-if="field.table && field.table !== 'assets'" :field :value />
    <LazyColumn v-else-if="field.subType" :field="{ ...field, type: field.subType }" :value="value" />
    <LazyColumn v-else-if="!isArrayOfObjects(field.children)"
        :field="{ ...field, type: field.children === 'table' ? 'table' : 'tags' }" :value="value" />
    <NListItem v-else v-for="(,index) in value">
        <template #prefix>
            <NText strong>
                {{ index + 1 }}
            </NText>
        </template>
        <Data
            v-for="child in (field.children as Schema).filter(child => typeof value[index][child.key] !== 'undefined')"
            :field="child" :value="value[index][child.key]" />
    </NListItem>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"

const { field, value } = defineProps<{ field: Field; value: any }>()
</script>