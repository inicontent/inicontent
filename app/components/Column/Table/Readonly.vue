<template>
    <NButton v-for="value in values" tag="a"
        :href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${value.id}`"
        @click.prevent.stop="handleClick(value)" :loading="Loading[`Drawer_${field.table}_${value.id}`]" size="small"
        round>
        <template v-if="table" #icon>
            <LazyTableIcon :table="table" />
        </template>
        {{ renderLabel(table, value) }}
    </NButton>
</template>

<script lang="ts" setup>
const { field, values } = defineProps<{ field: Field; values: Item[] }>()

const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))

async function handleClick(item: Item) {
    if (item.id && field.table) {
        openDrawer(field.table, item.id, {}, "view")
    }
}
</script>