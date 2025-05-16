<template>
	<NFlex :wrap="false">
		<NButton v-for="singleValue in ([] as Item[]).concat(value)" tag="a"
			:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${singleValue.id}/edit`"
			@click.prevent.stop="handleClick(singleValue)" :loading="Loading[`Drawer_${field.table}_${singleValue.id}`]"
			size="small" round>
			<template v-if="table" #icon>
				<component :is="getTableIcon(table)"></component>
			</template>
			{{ renderLabel(table, singleValue) }}
		</NButton>
	</NFlex>
</template>

<script lang="ts" setup>
import { NFlex, NButton } from "naive-ui"

const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()
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