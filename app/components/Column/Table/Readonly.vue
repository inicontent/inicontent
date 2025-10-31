<template>
    <UButton v-for="value in values" disabled size="small" round>
        <template v-if="table" #icon>
            <LazyTableIcon :table="table" />
        </template>
        {{ renderLabel(table, value) }}
    </UButton>
</template>

<script lang="ts" setup>
const { field, values } = defineProps<{ field: Field; values: Item[] }>()

const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)
</script>