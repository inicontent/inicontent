<template>
	<NFlex :wrap="false">
		<NButton v-for="singleValue in ([] as Item[]).concat(value)" tag="a"
			:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${singleValue.id}/edit`"
			@click.prevent.stop="handleClick(singleValue)" :loading="Loading[`Drawer_${field.table}_${singleValue.id}`]"
			size="small" round>
			<template v-if="table" #icon>
				<NIcon>
					<component :is="getTableIcon(table)"></component>
				</NIcon>
			</template>
			{{ renderLabel(table, singleValue) }}
		</NButton>
	</NFlex>
</template>

<script lang="ts" setup>
import { NFlex, NButton, NIcon } from "naive-ui";

const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>();
const route = useRoute();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const table = computed(() =>
	database.value.tables?.find(({ slug }) => slug === field.table),
);

const { isMobile } = useDevice();
const Drawer = useState<DrawerRef>("drawer", () => ({
	show: false,
	id: undefined,
	table: undefined,
	data: {},
}));
async function handleClick(item: Item) {
	if (item.id && field.table) {
		if (!isMobile)
			Drawer.value = {
				...Drawer.value,
				id: item.id,
				table: field.table,
				show: true,
			};
		else
			await navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/${field.table}/${item.id}/edit`,
			);
	}
}
</script>