<template>
	<div>
		<LazyFormDrawer v-if="!isMobile">
			<template #default="{ onAfterCreate, onAfterUpdate }">
				<slot name="form" :onAfterCreate :onAfterUpdate></slot>
			</template>
		</LazyFormDrawer>
		<UCard :title="t(table.slug) ?? '--'" :class="`table_${table.slug}`" id="tableCard"
			:header-style="{ paddingRight: 0, paddingLeft: 0 }" content-style="padding: 0" :bordered="false">
			<template #header-extra>
				<div class="flex" align="center" id="navbarActions" style="flex-direction: row-reverse;">
					<slot name="navbarActions">
						<UButtonGroup id="navbarExtraButtons">
							<UDropdown :options="toolsDropdownOptions" @select="toolsDropdownOnSelect" trigger="click">
								<UTooltip :delay="1500">
									<template #trigger>
										<UButton round>
											<template #icon>
												<div class="inline-block">
													<Icon name="tabler:tools" />
												</div>
											</template>
										</UButton>
									</template>
									{{ t("tools") }}
								</UTooltip>
							</UDropdown>

							<UDropdown v-if="table.allowedMethods?.includes('c')" placement="bottom" trigger="hover"
								size="small" :options="createDropdownOptions" @select="createDropdownOnSelect">
								<UTooltip placement="top" :delay="1500">
									<template #trigger>
										<UButton round :disabled="!table.schema" tag="a"
											:href="table.schema ? `${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new` : '#'"
											@click.prevent="() => {
												if (!isMobile)
													openDrawer(table.slug)
												else
													navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table.slug}/new`);
											}">
											<template #icon>
												<div class="inline-block">
													<Icon name="tabler:plus" />
												</div>
											</template>
										</UButton>
									</template>
									{{ t("newItem") }}
								</UTooltip>
							</UDropdown>
							<UPopover style="max-height: 240px;" :style="`width: ${isMobile ? '350px' : '500px'}`"
								placement="bottom-end" trigger="click" scrollable v-model:show="isSearchPopoverVisible">
								<template #trigger>
									<UTooltip :delay="1500">
										<template #trigger>
											<UButton round>
												<template #icon>
													<div class="inline-block">
														<Icon name="tabler:search" />
													</div>
												</template>
											</UButton>
										</template>
										{{ t("search") }}
									</UTooltip>
								</template>
								<template #footer>
									<div class="flex" justify="space-between">
										<UTooltip :delay="500" placement="bottom">
											<template #trigger>
												<UPopover trigger="click" scrollable style="max-height: 300px;">
													<template #trigger>
														<UButton round type="success" size="small" secondary>
															<template #icon>
																<div class="inline-block">
																	<Icon name="tabler:bookmark" />
																</div>
															</template>
														</UButton>
													</template>
													<template #footer>
														<UInputGroup style="width: 100%;">
															<UInput v-model:value="newFilterName"
																:placeholder="t('filterName')" size="small" round
																@keyup.enter="() => { saveFavoriteFilter(newFilterName); newFilterName = '' }" />
															<UButton round type="success" secondary size="small"
																:loading="false" :disabled="!newFilterName.trim()"
																@click="() => { saveFavoriteFilter(newFilterName); newFilterName = '' }">
																<template #icon>
																	<div class="inline-block">
																		<Icon name="tabler:plus" />
																	</div>
																</template>
															</UButton>
														</div>
													</template>
													<div class="text-center py-8 text-gray-500" v-if="favoriteFilters.length === 0" size="small"
														:description="t('noFavoriteFilters')" />
													<div class="flex" v-else vertical size="small" style="padding: 0 8px;">
														<div class="flex" justify="space-between" v-for="filter in favoriteFilters"
															:key="filter.id" block quaternary
															@click="loadFavoriteFilter(filter)"
															style="cursor: pointer;">
															<template #default>
																<div class="flex" justify="space-between" style="width: 100%;">
																	<span>{{ filter.name }}</span>
																	<UButton circle size="tiny" type="error" text
																		@click.stop="deleteFavoriteFilter(filter.id)">
																		<template #icon>
																			<div class="inline-block">
																				<Icon name="tabler:trash" />
																			</div>
																		</template>
																	</UButton>
																</div>
															</template>
														</div>
													</div>
												</UPopover>
											</template>
											{{ t("favoriteFilters") }}
										</UTooltip>

										<UButtonGroup>
											<UButton round type="error" secondary size="small" :loading="Loading.data"
												:disabled="isSearchDisabled"
												@click="() => { localSearchArray = { and: [[null, '=', null]] }; whereQuery = undefined; executeSearch() }">
												<template #icon>
													<div class="inline-block">
														<Icon name="tabler:x" />
													</div>
												</template>
												{{ t("reset") }}
											</UButton>
											<UButton round type="primary" secondary size="small" :loading="Loading.data"
												:disabled="isSearchDisabled" @click="executeSearch">
												<template #icon>
													<div class="inline-block">
														<Icon name="tabler:search" />
													</div>
												</template>
												{{ t("search") }}
											</UButton>
										</div>
									</div>
								</template>
								<LazyTableSearch v-model="localSearchArray" :callback="executeSearch" />
							</UPopover>
							<slot name="navbarExtraButtons"></slot>
						</div>
						<slot name="navbarExtraActions"></slot>
					</slot>
					<template v-if="isSlotSet('navbarActions')">
						<div id="navbarExtraButtons"></div>
						<div id="navbarExtraActions"></div>
					</template>
				</div>
			</template>
			<slot name="default" :data>
				<LazyTableViewsKanban v-if="table.displayAs === 'kanban'" v-model:columns="columns" v-model:data="data"
					v-model:searchArray="searchArray" :slots />
				<LazyTableViewsTable v-else v-model:columns="columns" v-model:data="data"
					v-model:searchArray="searchArray" ref="tableViewRef" :slots />
			</slot>
		</UCard>
		<LazyTableLogs v-if="table.config?.log" />
	</div>
</template>

<script setup lang="ts">
import { FormatObjectCriteriaValue, isStringified } from "inibase/utils"
import Inison from "inison"
import type {
	DataTableColumns,
	DropdownOption,
	NotificationReactive,
} from "naive-ui"
import {
	Icon,
	NuxtLink,
	NButton,
	NButtonGroup,
	NIcon,
	NPopconfirm,
	NProgress,
	NTime,
	NPopover,
	NTooltip,
	NFlex,
	LazyTableSearch,
	NEmpty,
	NInput,
} from "#components"
import { deepClone } from "~/composables"

const user = useState<User>("user")
const route = useRoute()
const router = useRouter()
const isSearchPopoverVisible = ref(false)
const searchArray = ref<searchType>(
	route.query.search
		? generateSearchArray(Inison.unstringify(route.query.search as string))
		: { and: [[null, "=", null]] },
)

// Search-related state
const whereQuery = ref<string | undefined>(
	route.query.search as string | undefined,
)

const whereQueryFetch = computed(() => {
	const generated = generateSearchInput(searchArray.value, "fetch")
	return generated ? Inison.stringify(generated) : ""
})


const columns = ref<DataTableColumns>()
const data = ref<apiResponse<Item[]>>()

const database = useState<Database>("database")
const table = useState<Table>("table")

// localSearchArray should start as a deep clone so mutations don't affect searchArray
const localSearchArray = ref<searchType | undefined>(
	deepClone(searchArray.value) ?? { and: [[null, "=", null]] },
)

function executeSearch() {
	// Ensure we set a deep clone to avoid sharing nested references
	const cloned = deepClone(localSearchArray.value)
	if (cloned !== undefined) {
		searchArray.value = cloned
	}
	isSearchPopoverVisible.value = false
}


function generateSearchInput(
	searchArray: any,
	mode: "display" | "fetch" = "display",
) {
	const RETURN: Record<string, any> = {}
	if (!searchArray) return undefined
	for (const condition in searchArray) {
		const items = searchArray[condition]
		if (!Array.isArray(items)) continue
		for (const item of items) {
			if (!Array.isArray(item)) continue
			const fieldKey = item[0]
			if (!fieldKey) continue
			if (!RETURN[condition]) RETURN[condition] = {}
			const { operator, value } = prepareCriterionForMode(
				typeof item[1] === "string" ? item[1] : "=",
				item[2],
				mode,
			)
			if (value === undefined) continue
			const finalValue = value === undefined ? "" : value
			RETURN[condition][fieldKey] = `${operator === "=" ? "" : operator}${finalValue}`
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


function decodeStoredCriterion(value: any): [string, any] {
	const RELATIVE_OPERATORS = ["r>=", "r<=", "r!=", "r>", "r<", "r="] as const

	if (typeof value === "string" && value.startsWith("r")) {
		const matched = RELATIVE_OPERATORS.find((operator) =>
			value.startsWith(operator),
		)
		if (matched)
			return [matched, value.slice(matched.length)] as [string, any]
	}
	if (typeof value === "string") return FormatObjectCriteriaValue(value)
	return ["=", value]
}

function prepareCriterionForMode(
	operator: string | undefined,
	rawValue: any,
	mode: "display" | "fetch",
) {
	const normalizedOperator = typeof operator === "string" && operator ? operator : "="
	if (mode === "fetch" && normalizedOperator.startsWith("r")) {
		const absoluteValue = resolveRelativeDate(rawValue)
		if (absoluteValue === undefined)
			return { operator: normalizedOperator, value: undefined }
		const strippedOperator =
			normalizedOperator.length > 1 ? normalizedOperator.slice(1) : "="
		return { operator: strippedOperator, value: absoluteValue }
	}
	return { operator: normalizedOperator, value: rawValue }
}

type RelativeUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

const arabicDigitMap: Record<string, string> = {
	"٠": "0",
	"١": "1",
	"٢": "2",
	"٣": "3",
	"٤": "4",
	"٥": "5",
	"٦": "6",
	"٧": "7",
	"٨": "8",
	"٩": "9",
	"۰": "0",
	"۱": "1",
	"۲": "2",
	"۳": "3",
	"۴": "4",
	"۵": "5",
	"۶": "6",
	"۷": "7",
	"۸": "8",
	"۹": "9",
}

function normalizeRelativeToken(value: string) {
	return value
		.normalize("NFC")
		.toLowerCase()
		.replace(/[٠-٩۰-۹]/g, (digit) => arabicDigitMap[digit] ?? digit)
		.replace(/[\u064B-\u065F\u0670\u0640]/g, "")
		.replace(/[إأآ]/g, "ا")
		.replace(/ؤ/g, "و")
		.replace(/ئ/g, "ي")
		.replace(/ة/g, "ه")
		.replace(/ى/g, "ي")
		.replace(/\s+/g, " ")
		.trim()
}

const relativeUnitSynonyms: Record<RelativeUnit, string[]> = {
	year: [
		"year",
		"years",
		"yr",
		"yrs",
		"سنة",
		"سنوات",
		"عام",
		"اعوام",
		"سنه",
		"سنين",
	],
	month: [
		"month",
		"months",
		"mo",
		"mos",
		"شهر",
		"اشهر",
		"شهور",
		"أشهر",
		"شهرًا",
		"شهرا",
	],
	week: ["week", "weeks", "wk", "wks", "أسبوع", "اسبوع", "أسابيع", "اسابيع"],
	day: ["day", "days", "d", "يوم", "ايام", "أيام", "يومًا", "يوما"],
	hour: ["hour", "hours", "hr", "hrs", "ساعة", "ساعات", "الساعة"],
	minute: ["minute", "minutes", "min", "mins", "دقيقة", "دقائق"],
	second: ["second", "seconds", "sec", "secs", "ثانية", "ثواني", "ثوان"],
}

const relativeUnitMap = Object.fromEntries(
	Object.entries(relativeUnitSynonyms).flatMap(([unit, tokens]) =>
		tokens.map((token) => [normalizeRelativeToken(token), unit as RelativeUnit]),
	),
) as Record<string, RelativeUnit>

const directionSynonyms: Record<"past" | "future", string[]> = {
	past: ["ago", "before", "earlier", "منذ", "قبل"],
	future: [
		"from now",
		"later",
		"after",
		"ahead",
		"بعد",
		"لاحقا",
		"لاحقاً",
		"لاحقًا",
		"من الان",
	],
}

const directionTokenMap = Object.fromEntries(
	Object.entries(directionSynonyms).flatMap(([direction, tokens]) =>
		tokens.map((token) => [normalizeRelativeToken(token), direction as "past" | "future"]),
	),
) as Record<string, "past" | "future">

const leadingDirectionTokens: Record<"past" | "future", string[]> = {
	past: ["منذ", "قبل", "before"],
	future: ["بعد", "لاحقا", "لاحقاً", "لاحقًا", "after"],
}

function resolveRelativeDate(rawValue: unknown): number | undefined {
	if (rawValue === null || rawValue === undefined) return undefined
	const text = String(rawValue).trim()
	if (!text) return undefined
	const normalized = normalizeRelativeToken(text)
	if (!normalized) return undefined
	if (["current", "now", "today", "الان", "اليوم"].includes(normalized))
		return Date.now()
	if (["yesterday", "امس"].includes(normalized))
		return shiftDate(new Date(), -1, "day")
	if (["tomorrow", "غدا"].includes(normalized))
		return shiftDate(new Date(), 1, "day")

	let expression = normalized
	let implicitFuture = false
	if (expression.startsWith("in ")) {
		expression = expression.slice(3).trim()
		implicitFuture = true
	}

	let leadingDirection: "past" | "future" | undefined
	for (const direction of Object.keys(leadingDirectionTokens) as Array<
		"past" | "future"
	>) {
		for (const token of leadingDirectionTokens[direction]) {
			const normalizedToken = normalizeRelativeToken(token)
			if (expression.startsWith(`${normalizedToken} `)) {
				leadingDirection = direction
				expression = expression.slice(normalizedToken.length).trim()
				break
			}
		}
		if (leadingDirection) break
	}

	const match = expression.match(/^([+-]?\d+)\s*([\p{L}]+)(?:\s+(.+))?$/u)
	if (match) {
		const amountText = match[1]
		const unitToken = match[2]
		if (!amountText || !unitToken) return undefined
		let amount = Number.parseInt(amountText, 10)
		if (!Number.isFinite(amount)) return undefined
		const mappedUnit = relativeUnitMap[normalizeRelativeToken(unitToken)]
		if (!mappedUnit) return undefined
		const trailingToken = match[3] ? normalizeRelativeToken(match[3]) : undefined
		let direction =
			trailingToken && directionTokenMap[trailingToken]
				? directionTokenMap[trailingToken]
				: undefined
		if (!direction && leadingDirection) direction = leadingDirection
		if (!direction && implicitFuture) direction = "future"
		if (direction === "past") amount = -Math.abs(amount)
		else if (direction === "future") amount = Math.abs(amount)
		return shiftDate(new Date(), amount, mappedUnit)
	}

	const fallback = Date.parse(text)
	return Number.isNaN(fallback) ? undefined : fallback
}

function shiftDate(baseDate: Date, amount: number, unit: RelativeUnit) {
	const date = new Date(baseDate.getTime())
	switch (unit) {
		case "year":
			date.setFullYear(date.getFullYear() + amount)
			break
		case "month":
			date.setMonth(date.getMonth() + amount)
			break
		case "week":
			date.setDate(date.getDate() + amount * 7)
			break
		case "day":
			date.setDate(date.getDate() + amount)
			break
		case "hour":
			date.setHours(date.getHours() + amount)
			break
		case "minute":
			date.setMinutes(date.getMinutes() + amount)
			break
		case "second":
			date.setSeconds(date.getSeconds() + amount)
			break
	}
	return date.getTime()
}

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
		localSearchArray.value = deepClone(value) ?? { and: [[null, "=", null]] }
		if (!value) {
			if (whereQuery.value) {
				whereQuery.value = undefined
			}
		} else {
			const generatedSearchInput = generateSearchInput(value)
			if (
				generatedSearchInput &&
				whereQuery.value !== Inison.stringify(generatedSearchInput)
			) {
				whereQuery.value = Inison.stringify(generatedSearchInput)
			}
		}
	},
	{ deep: true },
)

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

// UI states for favorite filters
const newFilterName = ref("")

const tablesConfig = computed({
	get: () => user.value?.config?.tables ?? {},
	set: (v) => {
		user.value.config = { ...(user.value.config ?? {}), tables: v }
		$fetch(
			`${appConfig.apiBase}${database.value.slug}/users/${user.value?.id}`,
			{
				method: "PUT",
				body: user.value,
				params: {
					return: false,
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		).catch((err) => window.$message.error(err.message))
	},
})

// Favorite filters management
const favoriteFilters = computed({
	get: () => {
		const filters = user.value?.config?.filters ?? {}
		return filters[table.value?.slug] ?? []
	},
	set: (v) => {
		const allFilters = { ...(user.value?.config?.filters ?? {}) }
		allFilters[table.value?.slug] = v
		user.value.config = { ...(user.value.config ?? {}), filters: allFilters }
		$fetch(
			`${appConfig.apiBase}${database.value.slug}/users/${user.value?.id}`,
			{
				method: "PUT",
				body: user.value,
				params: {
					return: false,
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		).catch((err) => window.$message.error(err.message))
	},
})

if (tablesConfig.value[table.value.slug]?.view)
	table.value.displayAs = tablesConfig.value[table.value.slug]?.view

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const Language = useCookie<LanguagesType>("language", { sameSite: true })
const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function deleteItem(id?: string | number | (string | number)[]) {
	if (!data.value) return
	Loading.value.data = true
	const deleteResponse = await $fetch<apiResponse>(
		`${appConfig.apiBase}${database.value.slug}/${table.value?.slug}${!id || Array.isArray(id) ? "" : `/${id}`}`,
		{
			method: "DELETE",
			query: {
				where: id && Array.isArray(id) ? Inison.stringify(id) : undefined,
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	)
	if (deleteResponse.result) window.$message.success(deleteResponse.message)
	else window.$message.error(deleteResponse.message)
	if (isSlotSet("default") && !table.value.displayAs)
		data.value = await $fetch<apiResponse<Item[]>>(
			`${appConfig.apiBase}${database.value.slug}/${table.value?.slug as string}`,
			{
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
			},
		)
	else
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}`,
		)
	if (table.value.config?.log)
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}/logs`,
		)
}
provide("deleteItem", deleteItem)

provide("whereQuery", whereQuery)
provide("whereQueryFetch", whereQueryFetch)
provide("localSearchArray", localSearchArray)
provide("executeSearch", executeSearch)
provide("isSearchDisabled", isSearchDisabled)
provide("generateSearchInput", generateSearchInput)

// Favorite filters functions
async function saveFavoriteFilter(filterName: string) {
	if (!filterName.trim()) {
		window.$message.error(t("filterNameCannotBeEmpty"))
		return
	}

	// Check if filter name already exists
	if (favoriteFilters.value.some((f: any) => f.name === filterName)) {
		window.$message.error(t("filterNameAlreadyExists"))
		return
	}

	const newFilter = {
		id: Date.now().toString(),
		name: filterName,
		searchArray: deepClone(searchArray.value),
		createdAt: new Date().toISOString(),
	}

	const updatedFilters = [...favoriteFilters.value, newFilter]
	favoriteFilters.value = updatedFilters
	window.$message.success(t("filterSavedSuccessfully"))
}

function loadFavoriteFilter(filter: any) {
	searchArray.value = deepClone(filter.searchArray) ?? {
		and: [[null, "=", null]],
	}
	window.$message.success(`${t("filterLoaded")}: ${filter.name}`)
}

function deleteFavoriteFilter(filterId: string) {
	const updatedFilters = favoriteFilters.value.filter(
		(f: any) => f.id !== filterId,
	)
	favoriteFilters.value = updatedFilters
	window.$message.success(t("filterDeletedSuccessfully"))
}

function renderItemButtons(row: Item) {
	return h(NButtonGroup, { vertical: isMobile }, () =>
		[
			slots.itemExtraButtons ? slots.itemExtraButtons(row) : undefined,
			table.value?.allowedMethods?.includes("r")
				? h(
					NButton,
					{
						class: "viewItemButton",
						secondary: true,
						circle: true,
						type: "primary",
					},
					{
						icon: () =>
							h(
								NuxtLink,
								{
									to: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}`,
								},
								() => h(NIcon, () => h(Icon, { name: "tabler:eye" })),
							),
					},
				)
				: null,
			table.value?.allowedMethods?.includes("u")
				? h(
					NButton,
					{
						class: "editItemButton",
						tag: "a",
						href: `${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
						onClick: (e) => {
							e.preventDefault()
							if (!isMobile)
								openDrawer(table.value?.slug as string, row.id, toRaw(row))
							else
								navigateTo(
									`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value?.slug}/${row.id}/edit`,
								)
						},
						secondary: true,
						circle: true,
						type: "info",
					},
					{ icon: () => h(NIcon, () => h(Icon, { name: "tabler:pencil" })) },
				)
				: null,
			table.value?.allowedMethods?.includes("d")
				? h(
					NPopconfirm,
					{
						onPositiveClick: () => deleteItem(row.id),
					},
					{
						trigger: () =>
							h(
								NButton,
								{
									class: "deleteItemButton",
									strong: true,
									secondary: true,
									circle: true,
									type: "error",
								},
								{
									icon: () =>
										h(NIcon, () => h(Icon, { name: "tabler:trash" })),
								},
							),
						default: () => t("theFollowingActionIsIrreversible"),
					},
				)
				: null,
		].filter((i) => i !== null),
	)
}
provide("renderItemButtons", renderItemButtons)

defineExpose<TableRef>({
	search: searchArray as searchType,
	columns: columns as any,
	delete: deleteItem,
	data: data as any,
})

const slots = defineSlots<{
	default(props: { data?: apiResponse<Item[]> }): any
	form(props: {
		onAfterCreate: () => Promise<void>
		onAfterUpdate: () => Promise<void>
	}): any
	navbarActions(): any
	navbarExtraButtons(): any
	navbarExtraActions(): any
	itemActions(props: Item): any
	itemExtraActions(props: Item): any
	itemExtraButtons(props: Item): any
	item(props: Item): any
}>()

const isSlotSet = (slotName: keyof typeof slots) => !!slots[slotName]

provide("isSlotSet", isSlotSet)

if (isSlotSet("default") && !table.value.displayAs)
	data.value = await $fetch<apiResponse<Item[]>>(
		`${appConfig.apiBase}${database.value.slug}/${table.value?.slug as string}`,
		{
			credentials: "include",
			query: { [`${database.value.slug}_sid`]: sessionID.value },
		},
	)

defineTranslation({
	ar: {
		search: "بحث",
		reset: "إفراغ",
		tools: "الأدوات",
		clearTable: "إفراغ الجدول",
		export: "تصدير",
		import: "إستيراد",
		exportCurrentData: "تصدير البيانات الحالية",
		exportAllData: "تصدير كل البيانات",
		columns: "الأعمدة",
		an_export_job_is_running_in_background: "هناك عملية تصدير جارية",
		an_export_job_is_done: "عملية التصدير إنتهت",
		table: "جدول",
		kanban: "كانبان",
		small: "صغير",
		medium: "متوسط",
		large: "كبير",
		favoriteFilters: "المرشحات المفضلة",
		saveCurrentFilter: "حفظ المرشح الحالي",
		filterName: "اسم المرشح",
		filterNameCannotBeEmpty: "اسم المرشح لا يمكن أن يكون فارغاً",
		filterNameAlreadyExists: "اسم المرشح موجود بالفعل",
		filterSavedSuccessfully: "تم حفظ المرشح بنجاح",
		filterLoaded: "تم تحميل المرشح",
		filterDeletedSuccessfully: "تم حذف المرشح بنجاح",
		save: "حفظ",
		cancel: "إلغاء",
		delete: "حذف",
		noFavoriteFilters: "لا توجد مرشحات مفضلة محفوظة",
	},
})

const { isMobile } = useDevice()

const notificationRef = ref<NotificationReactive>()
const currentJob = computed(() => table.value?.currentJob)
async function jobNotification() {
	if (currentJob.value) {
		if (!notificationRef.value)
			notificationRef.value = window.$notification.info({
				title: t(`an_${currentJob.value}_job_is_running_in_background`),
				onClose() {
					notificationRef.value?.destroy()
					notificationRef.value = undefined
					table.value.currentJob = undefined
				},
				meta: () => h(NTime),
			})

		const jobTimer = setInterval(async () => {
			if (notificationRef.value) {
				const currentJobProgress = (
					await $fetch<apiResponse<number>>(
						`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/${currentJob.value}`,
						{
							credentials: "include",
							query: { [`${database.value.slug}_sid`]: sessionID.value },
						},
					)
				).result

				if (currentJobProgress === 100) {
					clearInterval(jobTimer)
					notificationRef.value.title = t(`an_${currentJob.value}_job_is_done`)
					if (currentJob.value === "export")
						notificationRef.value.action = () =>
							h(
								NButton,
								{
									text: true,
									type: "primary",
									onClick: () => {
										window.open(
											`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export/download?${`${database.value.slug}_sid`}=${sessionID.value}`,
										)
										notificationRef.value?.destroy()
										notificationRef.value = undefined
										table.value.currentJob = undefined
									},
								},
								{
									default: () => t("download"),
								},
							)
					setTimeout(() => {
						if (notificationRef.value) notificationRef.value.content = undefined
					}, 500)
				} else
					notificationRef.value.content = () =>
						h(NProgress, {
							type: "line",
							percentage: currentJobProgress,
							indicatorPlacement: "inside",
							processing: true,
						})
			}
		}, 1000)
	}
}
watch(currentJob, jobNotification)
onMounted(jobNotification)

function generateSearchArray(searchQuery: any): searchType {
	const RETURN: searchType = {}
	for (const [condition, items] of Object.entries(searchQuery)) {
		if (!RETURN[condition as "and" | "or"])
			RETURN[condition as "and" | "or"] = []
		for (const [key, value] of Object.entries(items)) {
			if (["and", "or"].includes(key))
				RETURN[condition as "and" | "or"]?.push({
					[key]: generateSearchArray(value),
				})
			else
				RETURN[condition as "and" | "or"]?.push([
					key,
					...decodeStoredCriterion(value),
				])
		}
	}
	return RETURN
}

const tableViewRef = ref()

const toolsDropdownOptions = computed(() => [
	{
		icon: () =>
			h(NIcon, () => h(Icon, { name: "tabler:layout-dashboard-filled" })),
		label: t("view"),
		key: "view",
		children: [
			{
				icon: () => h(NIcon, () => h(Icon, { name: "tabler:table" })),
				label: t("table"),
				key: "viewTable",
				children: [
					{
						icon: () => "S",
						label: t("small"),
						key: "tableSizeS",
						disabled:
							!table.value.displayAs &&
							tablesConfig.value[table.value.slug]?.size === "small",
					},
					{
						icon: () => "M",
						label: t("medium"),
						key: "tableSizeM",
						disabled:
							!table.value.displayAs &&
							!tablesConfig.value[table.value.slug]?.size,
					},
					{
						icon: () => "L",
						label: t("large"),
						key: "tableSizeL",
						disabled:
							!table.value.displayAs &&
							tablesConfig.value[table.value.slug]?.size === "large",
					},
				],
			},
			{
				icon: () =>
					h(NIcon, () => h(Icon, { name: "tabler:layout-kanban-filled" })),
				label: t("kanban"),
				key: "viewKanban",
				disabled: table.value.displayAs === "kanban",
				show: !!table.value?.groupBy,
			},
		],
	},
	{
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-import" })),
		label: t("import"),
		key: "import",
		disabled: true,
		show: user.value?.role === appConfig.idOne,
	},
	{
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-export" })),
		label: t("export"),
		key: "export",
		disabled: !table.value?.schema,
		show: user.value?.role === appConfig.idOne,
		children: [
			{
				icon: () =>
					h(NIcon, () => h(Icon, { name: "tabler:file-arrow-right" })),
				label: t("exportCurrentData"),
				key: "exportCurrentData",
			},
			{
				icon: () => h(NIcon, () => h(Icon, { name: "tabler:table-export" })),
				disabled: !!currentJob.value,
				label: t("exportAllData"),
				key: "exportAllData",
			},
		],
	},
])

async function toolsDropdownOnSelect(
	value:
		| "import"
		| "exportCurrentData"
		| "exportAllData"
		| "viewTable"
		| "viewKanban"
		| "tableSizeS"
		| "tableSizeM"
		| "tableSizeL",
) {
	switch (value) {
		case "exportAllData": {
			await $fetch(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug}/${table.value?.slug}/export`,
				{
					method: "POST",
					credentials: "include",
					query: { [`${database.value.slug}_sid`]: sessionID.value },
				},
			)
			table.value.currentJob = "export"
			break
		}
		case "exportCurrentData": {
			tableViewRef.value.dataTableRef?.downloadCsv({
				fileName: `${table.value.slug}-${new Date().toISOString().split("T")[0]}`,
				keepOriginalData: false,
			})
			break
		}
		case "tableSizeS":
		case "tableSizeM":
		case "tableSizeL":
		case "viewTable":
		case "viewKanban": {
			const clonedTablesConfig = structuredClone(toRaw(tablesConfig.value))
			const displayAs = value === "viewKanban" ? "kanban" : undefined
			if (!clonedTablesConfig[table.value.slug])
				clonedTablesConfig[table.value.slug] = {}
			// @ts-ignore
			clonedTablesConfig[table.value.slug].view = displayAs

			if (value.startsWith("tableSize"))
				// @ts-ignore
				clonedTablesConfig[table.value.slug].size = value.endsWith("S")
					? "small"
					: value.endsWith("L")
						? "large"
						: undefined
			else data.value = undefined
			table.value.displayAs = displayAs
			tablesConfig.value = clonedTablesConfig
			break
		}
	}
}

const createDropdownOptions: DropdownOption[] = [
	{
		label: t("createFromClipboard"),
		key: "paste",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:copy" })),
	},
]
async function createDropdownOnSelect(value: string) {
	try {
		const itemFromClipboard = await navigator.clipboard.readText()

		if (!itemFromClipboard) {
			window.$message.error(t("clipboardEmpty"))
			return
		}
		if (!isStringified(itemFromClipboard)) {
			window.$message.error(t("clipboardItemIsNotCorrect"))
			return
		}

		const unstringifiedItem = Inison.unstringify<Item>(itemFromClipboard)
		if (!unstringifiedItem) {
			window.$message.error(t("clipboardItemIsNotCorrect"))
			return
		}

		switch (value) {
			case "paste": {
				if (!isMobile)
					openDrawer(table.value.slug, undefined, unstringifiedItem)
				else
					await navigateTo(
						`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${table.value.slug}/new?data=${itemFromClipboard}`,
					)
			}
		}
	} catch {
		window.$message.error(t("clipboardItemIsNotCorrect"))
	}
}

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>