<template>
	<div>
		<ClientOnly>
			<Teleport to="#navbarExtraButtons">
				<NPopover :disabled="!whereQuery && (!data?.result || !table?.schema)" style="max-height: 240px;"
					:style="`width: ${isMobile ? '350px' : '500px'}`" placement="bottom-end" trigger="click" scrollable>
					<template #trigger>
						<NTooltip :delay="1500">
							<template #trigger>
								<NButton round :disabled="!whereQuery && (!data?.result || !table?.schema)">
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
								<NButton round type="error" secondary :loading="Loading.data"
									:disabled="isSearchDisabled" @click="searchArray = undefined">
									<template #icon>
										<NIcon>
											<Icon name="tabler:x" />
										</NIcon>
									</template>
									{{ t("reset") }}
								</NButton>
								<NButton round type="primary" secondary :loading="Loading.data"
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
		<NDataTable :bordered="false" :scroll-x="tableWidth" resizable id="DataTable" remote ref="dataTableRef" :columns
			:data="data?.result ?? []" :loading="Loading.data" :pagination="dataTablePagination"
			:row-key="(row) => row.id" v-model:checked-row-keys="checkedRowKeys" @update:sorter="handleSorterChange"
			:getCsvCell :getCsvHeader :rowProps @scroll="handleScroll" :size="tablesConfig[table.slug]?.size" />
		<NDropdown show-arrow size="small" placement="right" trigger="manual" :x :y :options="dropdownOptions"
			:show="showDropdown" :onClickoutside @select="handleSelect" />
	</div>
</template>
<script setup lang="ts">
import { isArrayOfObjects, isObject } from "inibase/utils"
import Inison from "inison"
import type {
	DataTableColumns,
	DataTableGetCsvCell,
	DataTableGetCsvHeader,
	DataTableInst,
	DropdownOption,
} from "naive-ui"
import type { VNodeChild } from "vue"

import {
	LazyColumn,
	LazyColumnEdit,
	Icon,
	NButton,
	NFlex,
	NIcon,
	NPerformantEllipsis,
	NPopover,
} from "#components"

const dataTableRef = ref<DataTableInst>()
defineExpose({ dataTableRef })

const props = defineProps<{
	slots: any
}>()

const columns = defineModel<DataTableColumns>("columns")
const searchArray = defineModel<searchType>("searchArray")
const data = defineModel<apiResponse<Item[]>>("data")

const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const table = useState<Table>("table")
const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()
const { isMobile } = useDevice()

const renderItemButtons = inject("renderItemButtons") as (item: Item) => VNode

const deleteItem = inject("deleteItem") as (
	ids?: string | string[],
) => Promise<apiResponse<Item[]>>

const isSlotSet = inject("isSlotSet") as (slotName: string) => boolean

function isSlotEmpty(slotName: string): boolean {
	// Check if all nodes are comments or have undefined children
	return ((props.slots[slotName] as any)({}) as VNode[])?.every(
		(vnode) => vnode.type === Comment || vnode.children === undefined,
	)
}

const whereQuery = ref<string | undefined>(
	route.query.search as string | undefined,
)

// Add a small deepClone helper
function deepClone<T>(v: T): T | undefined {
	if (v === undefined) return undefined
	try {
		// Use structuredClone if available (preserves more types)
		if (typeof (globalThis as any).structuredClone === "function")
			return (globalThis as any).structuredClone(v)
	} catch (e) {
		// ignore and fallback
	}
	// Fallback
	return JSON.parse(JSON.stringify(v)) as T
}

// localSearchArray should start as a deep clone so mutations don't affect searchArray
const localSearchArray = ref<searchType | undefined>(
	deepClone(searchArray.value) ?? { and: [[null, "=", null]] },
)

function executeSearch() {
	// Ensure we set a deep clone to avoid sharing nested references
	searchArray.value = deepClone(localSearchArray.value)
}

watch(
	localSearchArray,
	(value) => {
		if (!value || !Object.keys(value).length)
			localSearchArray.value = { and: [[null, "=", null]] }
	},
	{ deep: true },
)

// When external model changes, clone into localSearchArray to avoid linking refs
watch(
	searchArray,
	(value) => {
		localSearchArray.value = deepClone(value) ?? { and: [[null, "=", null]] }
		if (!value) {
			if (whereQuery.value) {
				whereQuery.value = undefined
				pagination.onUpdatePage(1)
			}
		} else {
			const generatedSearchInput = generateSearchInput(value)
			if (
				generatedSearchInput &&
				whereQuery.value !== Inison.stringify(generatedSearchInput)
			) {
				whereQuery.value = Inison.stringify(generatedSearchInput)
				pagination.onUpdatePage(1)
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

const pagination = reactive({
	page: route.query.page ? Number(route.query.page) : 1,
	pageCount: 1,
	pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
	itemCount: 0,
	async onUpdatePage(currentPage: number) {
		pagination.page = currentPage
		let { page, ...Query }: any = route.query
		Query = {
			...Query,
			page: currentPage !== 1 ? currentPage : undefined,
		}
		router.push({ query: Query })
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}`,
		)
	},
	async onUpdatePageSize(pageSize: number) {
		const OLD_pageSize = toRaw(pagination.pageSize)
		pagination.pageSize = pageSize
		let { perPage, page, ...Query }: any = route.query
		if (pageSize !== 15) {
			pagination.page = Math.round(
				OLD_pageSize < pageSize
					? page / (pageSize / OLD_pageSize)
					: page * (pageSize / OLD_pageSize),
			)
			if (Number.isNaN(pagination.page)) pagination.page = 1
			Query = {
				...Query,
				perPage: pageSize,
				page: pagination.page === 1 ? undefined : pagination.page,
			}
			router.push({
				query: Query,
			})
			await refreshNuxtData(
				`${database.value.slug}/${table.value?.slug as string}`,
			)
		}
	},
})

const sort = ref<Record<string, "asc" | "desc">>({})

const queryOptions = computed(() =>
	Inison.stringify({
		page: pagination.page,
		perPage: pagination.pageSize,
		columns: table.value?.columns,
		sort: Object.keys(sort.value).length ? sort.value : "",
	}),
)

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const { data: _data } = await useLazyFetch<apiResponse<Item[]>>(
	`${appConfig.apiBase}${database.value.slug}/${table.value?.slug as string}`,
	{
		key: `${database.value.slug}/${table.value?.slug as string}`,
		query: {
			options: queryOptions,
			where: whereQuery,
			locale: Language.value,
		},
		onRequest() {
			Loading.value.data = true
		},
		onResponse({ response: { _data } }) {
			Loading.value.data = false
			pagination.pageCount = _data?.options.totalPages ?? 0
			pagination.itemCount = _data?.options.total ?? 0
			// TODO
			// if (![202, 404].includes(code)) window.$message.error(message)
		},
		credentials: "include",
	},
)

watch(_data, (v) => {
	data.value = v || undefined
})

const dataTablePagination = computed(() => ({
	disabled: !_data.value?.options.total,
	simple: isMobile,
	showSizePicker:
		_data.value?.options &&
		(!_data.value.options.perPage ||
			(_data.value.options.total as number) > _data.value.options.perPage),
	pageSizes: [15, 30, 60, 100, 500],
	prefix: ({ itemCount }: { itemCount?: number }) => itemCount,
	...pagination,
}))

const currentItem = ref<Item>()
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
async function handleSelect(value: string) {
	showDropdown.value = false
	if (!currentItem.value) return
	switch (value) {
		case "copy": {
			await copyToClipboard(Inison.stringify(currentItem.value))
			window.$message.success(t("copiedSuccessfully"))
			currentItem.value = undefined
		}
	}
}
function onClickoutside(e: MouseEvent) {
	const isRightClick = e.button === 2
	if (!isRightClick) showDropdown.value = false
}
const dropdownOptions: DropdownOption[] = [
	{
		label: t("copyItem"),
		key: "copy",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:copy" })),
	},
]
function rowProps(row: Item) {
	return {
		onContextmenu: async (e: MouseEvent) => {
			const target = e.target as HTMLElement
			// If it's a link or an image, do not show the dropdown
			if (
				target.closest("a[href]") || // Link
				target.closest("img") || // Image
				target.closest("button") || // Button
				target.closest('[role="button"]') || // ARIA role button
				target.closest(".n-ellipsis") || // Text
				target.closest(".n-tag") || // Tag
				target.closest(".n-text") // Text
			) {
				showDropdown.value = false
				return
			}

			// Check if text is selected and the mouse is above the selection
			const selection = window.getSelection()
			if (selection && selection.toString().trim() !== "") {
				const range = selection.getRangeAt(0) // Get the range of the selected text
				const rect = range.getBoundingClientRect() // Get the bounding rectangle of the selection

				// Check if the mouse is within the bounding rectangle of the selection
				if (
					e.clientX >= rect.left &&
					e.clientX <= rect.right &&
					e.clientY >= rect.top &&
					e.clientY <= rect.bottom
				) {
					showDropdown.value = false
					return
				}
			}

			e.preventDefault()
			showDropdown.value = false
			await nextTick()
			currentItem.value = (({ id, createdAt, updatedAt, ...rest }) => rest)(row)
			showDropdown.value = true
			x.value = e.clientX + 8
			y.value = e.clientY + 6
		},
	}
}

function getVNodeTextContent(vnode: VNodeChild): string {
	if (vnode === null || vnode === undefined || vnode === false) return ""
	// primitive text
	if (typeof vnode === "string" || typeof vnode === "number")
		return String(vnode)

	// arrays of VNodes
	if (Array.isArray(vnode))
		return vnode.map((n) => getVNodeTextContent(n)).join("")

	// VNode shape (element/component)
	const vn: any = vnode as any

	// direct children string (common for elements)
	if (typeof vn.children === "string") return vn.children

	// children as array or single VNode
	if (Array.isArray(vn.children))
		return vn.children.map((c: any) => getVNodeTextContent(c)).join("")

	// children as function (scoped slot) -> invoke safely
	if (typeof vn.children === "function") {
		try {
			const res = vn.children()
			return getVNodeTextContent(res)
		} catch {
			return ""
		}
	}

	// children as slots object { default: fn, ... }
	if (vn.children && typeof vn.children === "object") {
		let out = ""
		for (const key of Object.keys(vn.children)) {
			const slot = (vn.children as Record<string, any>)[key]
			if (typeof slot === "function") {
				try {
					out += getVNodeTextContent(slot())
				} catch {
					/* ignore */
				}
			} else {
				out += getVNodeTextContent(slot)
			}
		}
		if (out) return out
	}

	// if this vnode is a mounted component, prefer its rendered subTree
	if (vn.component?.subTree) return getVNodeTextContent(vn.component.subTree)

	// fallback empty
	return ""
}
const getCsvCell: DataTableGetCsvCell = (value, row, column) => {
	if (["boolean", "string", "number"].includes(typeof value))
		return String(value)

	if (column.type === "custom" && column.render)
		return getVNodeTextContent((column as any).render(row))

	if (!value) return null

	if (isObject(value) && Object.hasOwn(value, "id")) {
		const columnField = table.value?.schema?.find(
			({ key }) => key === column.key,
		)
		if (!columnField) return value.id

		const columnTable = database.value.tables?.find(
			({ slug }) => slug === columnField.table,
		)
		if (!columnTable) return value.id

		return renderLabel(columnTable, value)
	}
	if (
		Array.isArray(value) &&
		isArrayOfObjects(value) &&
		value.every((_v) => Object.hasOwn(_v, "id"))
	) {
		const columnTable = database.value.tables?.find(
			({ slug }) => slug === column.key,
		)
		if (!columnTable) value = value.map((_v) => _v.id)
		else value = value.map((_v) => renderLabel(columnTable, _v))
	}
	return `"${Inison.stringify(value)}"`
}

const getCsvHeader: DataTableGetCsvHeader = (col) => {
	if (col.key === "actions") return ""
	return (col.key as string) || "Unknown"
}

function handleSorterChange({
	columnKey,
	order,
}: {
	columnKey: string
	order: string
}) {
	if (!order) delete sort.value[columnKey]
	else sort.value[columnKey] = order.slice(0, -3) as "asc" | "desc"
}

const checkedRowKeys = ref<string[]>([])

const tablesConfig = useCookie<TablesCookie>("tablesConfig", {
	default: () => ({}),
	sameSite: true,
})

function handleScroll() {
	showDropdown.value = false // Hide dropdown on scroll
}

const tableWidth = ref<number>(0)
function measureTextWidth(
	text: string,
	opts?: { min?: number; startWith?: number },
): number {
	const str = String(text ?? "")

	// No element/font provided -> use a hidden span that inherits the document/body font
	// (this avoids having to re-mention the font and matches browser defaults)
	let span = (measureTextWidth as any)._span as HTMLSpanElement | undefined
	if (!span) {
		span = document.createElement("span")
		const s = span.style
		s.position = "absolute"
		s.visibility = "hidden"
		s.whiteSpace = "pre"
		s.left = "-9999px"
		s.top = "-9999px"
			// do NOT set font styles here so the span inherits the document/body default font
			; (measureTextWidth as any)._span = span
	}
	span.textContent = str || " "
	if (!span.parentElement) document.body.appendChild(span)
	const width = Math.ceil(span.getBoundingClientRect().width)
	// keep span for reuse but clear text
	span.textContent = ""
	if (opts?.min) return Math.max(width + (opts?.startWith || 0), opts.min)
	return width + (opts?.startWith || 0)
}
async function setColumns() {
	const cols = [
		...(table.value?.allowedMethods !== "r"
			? [
				{
					type: "selection",
					fixed: "left",
					options: [
						{
							label: t("delete"),
							key: "delete",
							disabled: checkedRowKeys.value.length === 0,
							icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
							children: [
								{
									label: () =>
										h(
											"span",
											{
												onClick: async () => {
													await deleteItem()
													checkedRowKeys.value = []
												},
											},
											t("clearTable"),
										),
									key: "clear",
									disabled:
										checkedRowKeys.value.length !==
										_data.value?.result?.length,
									icon: () =>
										h(
											NIcon,
											{
												onClick: async () => {
													await deleteItem()
													checkedRowKeys.value = []
												},
											},
											() => h(Icon, { name: "tabler:trash" }),
										),
								},
							],
							onSelect: async () => {
								await deleteItem(checkedRowKeys.value)
								checkedRowKeys.value = []
							},
						},
						{
							label: t("columns"),
							key: "columns",
							icon: () =>
								h(NIcon, () => h(Icon, { name: "tabler:columns-3" })),
							children: table.value?.schema?.map(({ id, key }) => ({
								label: t(key),
								key: id,
								icon: () =>
									h(
										NIcon,
										{
											onClick() {
												if (
													tablesConfig?.value[
														table.value?.slug as string
													]?.columns?.includes(id as number)
												)
													// @ts-ignore
													tablesConfig.value[
														table.value?.slug as string
													].columns = tablesConfig.value[
														table.value?.slug as string
													]?.columns?.filter((itemID) => itemID !== id)
												else {
													if (
														!tablesConfig?.value[table.value?.slug as string]
													)
														tablesConfig.value[table.value?.slug as string] =
															{ columns: [] }

													// @ts-ignore
													tablesConfig.value[
														table.value?.slug as string
													].columns?.push(id as number)
												}
											},
										},
										() =>
											h(Icon, {
												name:
													id !== undefined &&
														tablesConfig.value[
															table.value?.slug as string
														]?.columns?.includes(id)
														? "tabler:eye-off"
														: "tabler:eye",
											}),
									),
							})),
						},
					],
				},
			]
			: []),
		...((table.value?.defaultTableColumns && table.value?.schema
			? [
				...(tablesConfig.value[table.value?.slug as string]?.columns
					? table.value.schema.filter(
						({ id }) =>
							id !== undefined &&
							!tablesConfig.value[
								table.value?.slug as string
							]?.columns?.includes(id) &&
							!table.value?.defaultTableColumns?.includes(id),
					)
					: []),
				...table.value.defaultTableColumns
					.map(
						(id) =>
							table.value?.schema?.find((field) => field.id === id) as Field,
					)
					.filter(Boolean),
			]
			: table.value?.schema
		)
			?.filter(
				({ id }) =>
					id !== undefined &&
					!tablesConfig.value[table.value?.slug]?.columns?.includes(id),
			)
			.map((field) => ({
				title: () =>
					h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
						getField(field).icon(),
						h(NPerformantEllipsis, () => t(field.key)),
					]),
				width: measureTextWidth(t(field.key), {
					startWith:
						tablesConfig.value[table.value.slug]?.size === "small" ? 70 : 80,
					min:
						tablesConfig.value[table.value.slug]?.size === "small" ? 100 : 150,
				}),
				key: field.key,
				sorter: !!_data.value?.result,
				ellipsis: {
					tooltip: true,
				},
				resizable: !field.children || !isArrayOfObjects(field.children),
				sortOrder: sort.value[field.key]
					? `${sort.value[field.key]}end`
					: undefined,
				render: (row: Item) =>
					field.render
						? field.render(row)
						: table.value?.allowedMethods?.includes("u") &&
							![
								"id",
								"createdAt",
								"createdBy",
								"updatedAt",
								"updatedBy",
							].includes(field.key)
							? h(LazyColumnEdit, {
								loading: !!row.id && Loading.value[`${row.id}-${field.key}`],
								modelValue: row[field.key],
								"onUpdate:modelValue": async (value: any) => {
									if (!row.id) return
									Loading.value[`${row.id}-${field.key}`] = true
									row[field.key] = value
									const __data = await $fetch<apiResponse<Item | boolean>>(
										`${appConfig.apiBase}${database.value.slug}/${table.value?.slug
										}/${row.id}`,
										{
											method: "PUT",
											body: row,
											params: {
												return: false,
												locale: Language.value,
											},
											credentials: "include",
										},
									)
									if (
										(typeof __data?.result === "boolean" &&
											__data.result !== true) ||
										(typeof __data.result !== "boolean" && !__data.result?.id)
									)
										window.$message.error(__data.message)
									Loading.value[`${row.id}-${field.key}`] = false
								},
								field,
							})
							: h(LazyColumn, {
								value: row[field.key],
								field,
							}),
			})) ?? []),
		...(isSlotSet("itemActions") && isSlotEmpty("itemActions")
			? []
			: [
				{
					title: t("actions"),
					align: "center",
					width:
						isMobile || tablesConfig.value[table.value.slug]?.size === "small"
							? 70
							: 150 +
							(isSlotSet("itemExtraButtons") &&
								!isSlotEmpty("itemExtraButtons")
								? (props.slots.itemExtraButtons as any)().length * 20
								: 0),
					key: "actions",
					fixed: "right",
					render: (row: any) =>
						isSlotSet("itemActions") && !isSlotEmpty("itemActions")
							? props.slots.itemActions(row)
							: [
								isSlotSet("itemExtraActions") &&
									!isSlotEmpty("itemExtraActions")
									? props.slots.itemExtraActions(row)
									: undefined,
								isMobile ||
									tablesConfig.value[table.value.slug]?.size === "small"
									? h(
										NPopover,
										{
											scrollable: true,
											style: "max-height: 240px;border-radius:34px",
											contentStyle: "padding: 0",
										},
										{
											trigger: () =>
												h(
													NButton,
													{
														size: "small",
														circle: true,
														secondary: true,
														type: "primary",
													},
													{
														icon: () =>
															h(NIcon, () =>
																h(Icon, { name: "tabler:dots" }),
															),
													},
												),
											default: () => renderItemButtons(row),
										},
									)
									: renderItemButtons(row),
							],
				},
			]),
	] as DataTableColumns

	if (cols.length > 2 || table.value?.defaultTableColumns) columns.value = cols

	await nextTick()

	tableWidth.value =
		columns.value?.reduce(
			(accumulator: number, { width }) =>
				accumulator + ((width as number | undefined) ?? 0),
			40,
		) ?? 40
}
watch([Language, checkedRowKeys, _data, tablesConfig], setColumns, {
	deep: true,
})
</script>