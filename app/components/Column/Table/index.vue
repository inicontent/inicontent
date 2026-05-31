<template>
    <NButtonGroup v-if="values.length > 1" class="tableGroup">
        <LazyColumnTableSingle :field="field" :values="[firstValue]" />

        <NPopover style="max-height: 240px" scrollable>
            <template #trigger>
                <NButton size="small">
                    +{{ values.length - 1 }}
                </NButton>
            </template>
            <NFlex vertical>
                <LazyColumnTableSingle :field="field" :values="restValues" />
            </NFlex>
        </NPopover>
    </NButtonGroup>

    <LazyColumnTableSingle v-else :field="field" :values="values" />
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()
const values = ([] as Item[]).concat(value)
const firstValue = values[0] as Item
const restValues = values.slice(1)
</script>