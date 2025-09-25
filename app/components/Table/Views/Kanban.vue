<template>
	<div>
		<ClientOnly>
			<Teleport to="#navbarExtraButtons">
				<NPopover style="max-height: 240px;" :style="`width: ${isMobile ? '350px' : '500px'}`"
					placement="bottom-end" trigger="click" scrollable>
					<template #trigger>
						<NTooltip :delay="1500">
							<template #trigger>
								<NButton round>
									<template #icon>
										<NIcon>
											<Icon name="tabler:search" />
										</NIcon>
									</template>
								</NButton>
							</template>
							{{ t("search") }}
						</NTooltip>
					</template>
					<template #footer>
						<NFlex justify="end">
							<NButtonGroup>
								<NButton round type="error" secondary :loading="visibleColumns?.[0]?.loading"
									:disabled="isSearchDisabled" @click="searchArray = undefined">
									<template #icon>
										<NIcon>
											<Icon name="tabler:x" />
										</NIcon>
									</template>
									{{ t("reset") }}
								</NButton>
								<NButton round type="primary" secondary :loading="visibleColumns?.[0]?.loading"
									:disabled="isSearchDisabled" @click="executeSearch">
									<template #icon>
										<NIcon>
											<Icon name="tabler:search" />
										</NIcon>
									</template>
									{{ t("search") }}
								</NButton>
							</NButtonGroup>
						</NFlex>
					</template>
					<LazyTableSearch v-model="localSearchArray" :callback="executeSearch" />
				</NPopover>
			</Teleport>
		</ClientOnly>
		<div class="kanban-scroll">
			<div class="kanban-columns">
				<NCard v-for="(column, index) in visibleColumns" :key="index" hoverable class="kanban-column">
					<NTag size="large" :color="column.color"
						style="width: 100%; justify-content: space-between; flex-direction: row-reverse; margin-bottom: 20px"
						:bordered="false" round>
						{{ column.label }}
						<NButton circle :color="column.color?.textColor" size="tiny" :text-color="column.color?.color">
							{{ column.pagination?.total || 0 }}
						</NButton>
						<template #icon>
							<NButton circle secondary size="tiny" @click.prevent="() => {
								if (!isMobile)
									openDrawer(table?.slug as string, undefined, { [field?.key as string]: column.key === UNSET_KEY ? '' : column.key })
								else
									navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table?.slug}/new`);
							}">
								<template #icon>
									<NIcon :color="column.color?.textColor">
										<Icon name="tabler:plus" />
									</NIcon>
								</template>
							</NButton>
						</template>
					</NTag>
					<NScrollbar style="max-height: 350px;">
						<Draggable v-model="column.items" :group="{ name: 'items', pull: true, put: true }"
							item-key="id" ghost-class="ghost" :sort="false" @move="({ to, from }) => from !== to"
							@change="e => onItemDrop(e, column)">
							<template #item="{ element, index }">
								<NCard size="small" style="border-radius: 8px;margin-bottom: 10px;" hoverable>
									<component v-if="props.slots.itemActions" :is="props.slots.itemActions(element)" />
									<component v-else-if="props.slots.itemExtraActions"
										:is="props.slots.itemExtraActions(element)" />
									<NPopover scrollable style="max-height: 240px;border-radius:34px"
										contentStyle="padding: 0">
										<template #trigger>
											<NButton size="tiny" round class="dotsButton" secondary type="primary">
												<template #icon>
													<NIcon>
														<Icon name="tabler:dots" />
													</NIcon>
												</template>
											</NButton>
										</template>
										<component :is="renderItemButtons(column.items[index])" />
									</NPopover>
									<ClientOnly v-if="props.slots.item">
										<component
											v-for="(slot, slotIndex) in ([] as VNode[]).concat(props.slots.item(element))"
											:is="slot" :key="slotIndex" :item="element"></component>
									</ClientOnly>
									<div v-else v-html="renderLabel(table, element).replaceAll('\n', '<br />')"></div>
								</NCard>
							</template>
						</Draggable>
						<template v-if="column.items.length === 0 && column.loading">
							<NSkeleton :height="calculateHeight" style="border-radius: 8px;margin-bottom: 10px;" />
							<NSkeleton :height="calculateHeight" style="border-radius: 8px;" />
						</template>
						<NEmpty v-else-if="column.items.length === 0" style="height: 100%;justify-content: center" />
					</NScrollbar>
				</NCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { pageInfo } from "inibase"
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils"
import Inison from "inison"
import type { TagColor } from "naive-ui/es/tag/src/common-props"
import Draggable from "vuedraggable"

defineTranslation({
	ar: {
		unspecified: "غير محددة",
	},
})

const props = defineProps<{
	slots: any
}>()

type columnType = {
	label: string
	key: string | number
	items: Item[]
	pagination?: pageInfo
	color?: TagColor
	loading?: boolean
}

const data = defineModel<columnType[]>("data")
const searchArray = defineModel<searchType>("searchArray")

const renderItemButtons = inject("renderItemButtons") as (item: Item) => VNode

const appConfig = useAppConfig()
const { isMobile } = useDevice()

const database = useState<Database>("database")
const table = useState<Table>("table")
const field = table.value?.schema?.find(({ id }) => id === table.value?.groupBy)

const UNSET_KEY = "__unset__" // internal sentinel

const visibleColumns = ref();

const route = useRoute()
const router = useRouter()

const whereQuery = ref<string | undefined>(
	route.query.search as string | undefined,
)

const localSearchArray = ref<searchType | undefined>(
	JSON.parse(JSON.stringify(searchArray.value ?? { and: [[null, "=", null]] })),
)
function executeSearch() {
	searchArray.value = JSON.parse(JSON.stringify(localSearchArray.value))
}
watch(
	localSearchArray,
	(value) => {
		if (!value || !Object.keys(value).length)
			localSearchArray.value = { and: [[null, "=", null]] }
	},
	{ deep: true },
)
watch(
	searchArray,
	(value) => {
		localSearchArray.value = JSON.parse(JSON.stringify(value))
		if (!value) {
			whereQuery.value = undefined
			executeFetch()
		} else {
			const generatedSearchInput = generateSearchInput(value)
			if (generatedSearchInput && whereQuery.value !== Inison.stringify(generatedSearchInput)) {
				whereQuery.value = Inison.stringify(generatedSearchInput)
				executeFetch()
			}
		}
	},
	{ deep: true },
)

function generateSearchInput(searchArray: any) {
	const RETURN: Record<string, any> = {}
	for (const condition in searchArray) {
		for (const item of searchArray[condition]) {
			if (!RETURN[condition]) RETURN[condition] = {}
			if (Array.isArray(item) && item[0])
				RETURN[condition][item[0]] =
					`${item[1] === "=" ? "" : item[1]}${item[2]}`
			// else RETURN[condition] = generateSearchInput(item)
		}
	}
	// Helper to check if an object is empty or all its values are empty objects (recursively)
	function isDeepEmpty(obj: any): boolean {
		if (typeof obj !== "object" || obj === null) return false
		const keys = Object.keys(obj)
		if (keys.length === 0) return true
		return keys.every((k) => isDeepEmpty(obj[k]))
	}
	return !isDeepEmpty(RETURN) ? RETURN : undefined
}

watch(whereQuery, (v) => {
	const { search, page, ...Query }: any = route.query
	return v
		? router.push({
			query: {
				...(Query ?? {}),
				search: v,
			},
		})
		: router.push({
			query: Query ?? {},
		})
})
const isSearchDisabled = computed(
	() =>
		!!(
			localSearchArray.value &&
			Object.keys(localSearchArray.value).length === 1 &&
			(
				localSearchArray.value[
				Object.keys(localSearchArray.value)[0] as "and" | "or"
				]?.[0] as any
			)[0] === null
		),
)
if (field?.options) {
	if (isArrayOfArrays(field.options))
		data.value = (field.options as [string | number, string][]).map(
			([label]) => ({
				label: t(label),
				key: label,
				color: getColorObj(label, field.options as [string | number, string][]),
				items: [],
				loading: true,
			}),
		)
	else if (isArrayOfObjects(field.options))
		data.value = (
			field.options as {
				label: string
				value: string | number
			}[]
		).map(({ label, value }) => ({
			label: t(label),
			key: value,
			items: [],
			loading: true,
		}))
	else
		data.value = (field.options as string[]).map((value) => ({
			label: t(value),
			key: value,
			items: [],
			loading: true,
		}))

	const unsetColumn: columnType = {
		label: t("unspecified"),
		key: UNSET_KEY,
		items: [],
		loading: true,
		color: { color: "#f0f0f0", textColor: "#606060" } satisfies TagColor,
	}

	nextTick(() => {
		if (data.value) {
			data.value.push(unsetColumn)
			visibleColumns.value = data.value.filter((c) => c && (c.key !== UNSET_KEY || c.items.length > 0))
		}
		nextTick(executeFetch)
	})
}

async function executeFetch() {
	for await (const column of data.value as columnType[]) {
		column.loading = true
		const columnWhere = Inison.stringify({
			[(field as Field).key]: column.key === UNSET_KEY ? "" : column.key,
		})
		const _data = await $fetch<apiResponse<Item[]>>(
			`${appConfig.apiBase}${database.value.slug}/${table.value?.slug}`,
			{
				query: {
					where: whereQuery.value ? `${columnWhere.slice(0, -1)},${whereQuery.value.slice(1)}` : columnWhere,
				},
				credentials: "include",
			},
		)
		column.items = _data.result || []
		column.pagination = _data.options
		column.loading = false
	}
}

const calculateHeight = computed(() => {
	const baseHeight = 50 // Base height for skeleton
	const lineHeight = 20 // Height per line
	const maxHeight = 200 // Maximum height limit

	const lineBreaks = (table.value?.label?.match(/\n/g) || []).length
	const calculatedHeight = baseHeight + lineBreaks * lineHeight
	return `${Math.min(calculatedHeight, maxHeight)}px`
})

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const onItemDrop = async (evt: any, targetColumn: columnType) => {
	if (!evt.added || !field?.key || !data.value || !table.value?.slug) return

	const card = evt.added.element as Item
	const fromKey = card[field.key] // old column key
	const toKey = targetColumn.key // new column key
	if (fromKey === toKey) return

	/* optimistic UI ------------------------------------------------- */
	card[field.key] = toKey
	adjustTotals(fromKey, toKey)

	/* API call ------------------------------------------------------ */
	const _data = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/${table.value.slug}/${card.id}`,
		{
			method: "PUT",
			body: { [field.key]: toKey === UNSET_KEY ? "" : toKey },
			params: {
				return: false,
				locale: Language.value,
			},
			credentials: "include",
		},
	)
	if (!_data.result) {
		/* rollback ---------------------------------------------------- */
		card[field.key] = fromKey
		adjustTotals(toKey, fromKey) // undo the optimistic counts

		/* put card back visually */
		const origin = data.value.find((c) => c.key === fromKey)
		if (origin)
			origin.items.push(targetColumn.items.splice(evt.added.newIndex, 1)[0])

		window.$message.error(_data.message)
	}
}

function adjustTotals(from: any, to: any) {
	const dec = data.value?.find((c) => c.key === from)
	const inc = data.value?.find((c) => c.key === to)
	if (dec?.pagination)
		dec.pagination.total = Math.max((dec.pagination.total ?? 1) - 1, 0)
	if (inc?.pagination) inc.pagination.total = (inc.pagination.total ?? 0) + 1
}
</script>


<style scoped>
.dotsButton {
	position: absolute;
}

.ltr .dotsButton {
	right: 10px;
}

.rtl .dotsButton {
	left: 10px;
}

.kanban-scroll {
	overflow-x: auto;
	padding-bottom: 10px;
}

.kanban-columns {
	display: flex;
	gap: 20px;
	min-width: max-content;
}

.kanban-column {
	flex: 0 0 300px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	border-radius: 8px;
}

.kanban-card {
	min-height: 300px;
}
</style>