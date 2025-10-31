<template>
    <UButton v-for="value in values" tag="a"
        :href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${value.id}/edit`"
        @click.prevent.stop="handleClick(value)" :loading="Loading[`Drawer_${field.table}_${value.id}`]" size="small"
        round>
        <template v-if="table" #icon>
            <LazyTableIcon :table="table" />
        </template>
        {{ renderLabel(table, value) }}
    </UButton>
</template>

<script lang="ts" setup>
const { field, values } = defineProps<{ field: Field; values: Item[] }>()

const route = useRoute()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)

const { isMobile } = useDevice()

async function handleClick(item: Item) {
    if (item.id && field.table) {
        if (!isMobile) openDrawer(field.table, item.id)
        else
            await navigateTo(
                `${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/${field.table}/${item.id}/edit`,
                { open: { target: "_blank" } },
            )
    }
}
</script>