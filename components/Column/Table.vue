<template>
	<NPopover v-if="valueArray.length > 1" style="max-height: 240px" scrollable trigger="hover" placement="top">
		<template #trigger>
			<NButton size="small" round :loading="Loading[`Drawer_${field.table}`]">
				<template v-if="table" #icon>
								<LazyTableIcon :table="table" />
				</template>
				{{ valueArray.length }}
			</NButton>
		</template>
		<NFlex vertical>
			<NButton v-for="singleValue in valueArray" tag="a"
				:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${singleValue.id}/edit`"
				@click.prevent.stop="handleClick(singleValue)"
				:loading="Loading[`Drawer_${field.table}_${singleValue.id}`]" size="small" round>
				<template v-if="table" #icon>
					<LazyTableIcon :table="table" />
				</template>
				{{ renderLabel(table, singleValue) }}
			</NButton>
		</NFlex>
	</NPopover>
	<NButton v-else-if="valueArray.length === 1" tag="a"
		:href="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${field.table}/${valueArray[0].id}/edit`"
		@click.prevent.stop="handleClick(valueArray[0])" :loading="Loading[`Drawer_${field.table}_${valueArray[0].id}`]"
		size="small" round>
		<template v-if="table" #icon>
								<LazyTableIcon :table="table" />
		</template>
		{{ renderLabel(table, valueArray[0]) }}
	</NButton>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: Item | Item[] }>()
const route = useRoute()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const table = database.value.tables?.find(({ slug }) => slug === field.table)

const valueArray = ([] as Item[]).concat(value)

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