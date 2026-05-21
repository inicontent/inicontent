<template>
    <template v-if="values.length > 1">
        <NButtonGroup>
            <LazyColumnTableEditable v-if="isEditable" :field="field" :values="[firstValue]" />
            <LazyColumnTableReadonly v-else :field="field" :values="[firstValue]" />

            <NPopover style="max-height: 240px" scrollable trigger="click" placement="top">
                <template #trigger>
                    <NButton size="small" aria-label="Show more related records">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:dots" />
                            </NIcon>
                        </template>
                    </NButton>
                </template>
                <NFlex vertical>
                    <LazyColumnTableEditable v-if="isEditable" :field="field" :values="restValues" />
                    <LazyColumnTableReadonly v-else :field="field" :values="restValues" />
                </NFlex>
            </NPopover>
        </NButtonGroup>
    </template>
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
const firstValue = values[0] as Item
const restValues = values.slice(1)
</script>