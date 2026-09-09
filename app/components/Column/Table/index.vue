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
const props = defineProps<{
	field: Field;
	value: Item | Item[] | string | number | (string | number)[];
}>();
// Computed (not setup-time constants): the grid replaces `value` when the row
// data reloads on language switch, and this component instance is patched in
// place rather than remounted — stale values made the cell keep showing the
// previous language's reference.
const values = computed(() => ([] as unknown[]).concat(props.value));
const firstValue = computed(() => values.value[0]);
const restValues = computed(() => values.value.slice(1));

// Register every id of the cell up front (including the +N popover rest) so the
// whole page's references land in the single batched fetch.
const referenced = useReferencedItems(props.field.table);

watch(
	() => props.value,
	(value) => referenced.register(value),
	{ immediate: true },
);
</script>