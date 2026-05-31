<template>
    <NFlex :wrap="false" class="tableCellLinks">
        <NButton v-for="value in values" class="tableCellLinkButton" tag="a"
            :href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${value.id}`"
            @click.prevent.stop="handleClick(value)" :loading="Loading[`Drawer_${field.table}_${value.id}`]" size="small"
            round>
            <template v-if="table" #icon>
                <LazyTableIcon :table="table" />
            </template>
            {{ renderLabel(table, value) }}
        </NButton>
    </NFlex>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()

const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)

const values = ([] as Item[]).concat(value)

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))

async function handleClick(item: Item) {
    if (item.id && field.table) {
        openDrawer(field.table, item.id, {}, "view")
    }
}
</script>