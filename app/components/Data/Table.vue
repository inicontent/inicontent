<template>
    <NFlex :wrap="false" class="tableCellLinks">
        <NButton v-for="value in values" class="tableCellLinkButton" tag="a"
            :href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${idOf(value)}`"
            @click.prevent.stop="handleClick(value)" :loading="Loading[`Drawer_${field.table}_${idOf(value)}`]" size="small"
            round>
            <template v-if="table" #icon>
                <LazyTableIcon :table="table" />
            </template>
            {{ renderLabel(table, resolvedItem(value) ?? ({ id: idOf(value) } as Item)) }}
        </NButton>
    </NFlex>
</template>

<script lang="ts" setup>
import { isObject } from "inibase/utils";

const props = defineProps<{
	field: Field;
	value?: Item | Item[] | string | number | (string | number)[];
}>();

const database = useState<Database>("database");
const table = database.value.tables?.find(({ slug }) => slug === props.field.table);

const values = computed(() => ([] as unknown[]).concat(props.value ?? []));

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

// Table references can be raw ids (translated / stored values). Resolve them
// through the shared cache which batches all ids of the current page into a
// single request per referenced table. Object values are used as-is and never
// trigger a fetch.
const referenced = useReferencedItems(props.field.table);

watch(values, (list) => referenced.register(list), { immediate: true });

function idOf(value: unknown): string {
	return isObject(value) ? String((value as Item).id ?? "") : String(value);
}

function resolvedItem(value: unknown): Item | undefined {
	if (isObject(value)) return value as Item;
	return referenced.items.value[idOf(value)];
}

async function handleClick(value: unknown) {
	const id = idOf(value);
	if (id && props.field.table) {
		openDrawer(props.field.table, id, {}, "view");
	}
}
</script>