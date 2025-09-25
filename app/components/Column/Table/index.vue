<template>
    <NPopover v-if="values.length > 1" style="max-height: 240px" scrollable trigger="hover" placement="top">
        <template #trigger>
            <NButton size="small" round>
                <template v-if="table" #icon>
                    <LazyTableIcon :table="table" />
                </template>
                {{ values.length }}
            </NButton>
        </template>
        <NFlex vertical>
            <LazyColumnTableEditable v-if="isEditable" :field="field" :values="values" />
            <LazyColumnTableReadonly v-else :field="field" :values="values" />
        </NFlex>
    </NPopover>
    <template v-else>
        <LazyColumnTableEditable v-if="isEditable" :field="field" :values="values" />
        <LazyColumnTableReadonly v-else :field="field" :values="values" />
    </template>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()

const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)

const isEditable = !!table?.allowedMethods?.includes("u")
const values = ([] as Item[]).concat(value)
</script>