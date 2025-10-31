<template>
    <div class="flex">
        <LazyColumnTableEditable v-if="isEditable" :field="field" :values="values" />
        <LazyColumnTableReadonly v-else :field="field" :values="values" />
    </div>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()

const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)

const isEditable = !!table?.allowedMethods?.includes("u")
const values = ([] as Item[]).concat(value)
</script>