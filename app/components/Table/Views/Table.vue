<template>
	<NDataTable :bordered="false" :scroll-x="tableWidth" resizable id="DataTable" remote ref="dataTableRef" :columns
		:data="data?.result ?? []" :loading="Loading.data" :pagination="dataTablePagination" :row-key="(row) => row.id"
		v-model:checked-row-keys="checkedRowKeys" @update:sorter="handleSorterChange" :getCsvCell :getCsvHeader
		:rowProps @scroll="handleScroll" :size="tablesConfig[table.slug]?.size" />
	<NDropdown show-arrow size="small" placement="right" trigger="manual" :x :y :options="dropdownOptions"
		:show="showDropdown" :onClickoutside @select="handleSelect" />
</template>
<script setup lang="ts">
import { isArrayOfObjects, isObject } from "inibase/utils";
import Inison from "inison";
import type {
	DataTableColumns,
	DataTableGetCsvCell,
	DataTableGetCsvHeader,
	DataTableInst,
	DropdownOption,
} from "naive-ui";
import type { VNodeChild } from "vue";

import {
	LazyColumn,
	LazyColumnEdit,
	Icon,
	NButton,
	NFlex,
	NIcon,
	NPerformantEllipsis,
	NPopover,
} from "#components";

const dataTableRef = ref<DataTableInst>();
defineExpose({ dataTableRef });

const props = defineProps<{
	slots: any;
}>();

const columns = defineModel<DataTableColumns>("columns");
const searchString = defineModel<string>("searchString");
const data = defineModel<apiResponse<Item[]>>("data");

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const table = useState<Table>("table");
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { isMobile } = useDevice();

const renderItemButtons = inject("renderItemButtons") as (item: Item) => VNode;

const deleteItem = inject("deleteItem") as (
	ids?: string | string[],
) => Promise<apiResponse<Item[]>>;

const isSlotSet = inject("isSlotSet") as (slotName: string) => boolean;

function isSlotEmpty(slotName: string): boolean {
	// Check if all nodes are comments or have undefined children
	return ((props.slots[slotName] as any)({}) as VNode[])?.every(
		(vnode) => vnode.type === Comment || vnode.children === undefined,
	);
}

watch(
	searchString,
	(value) => {
		if (!value || value === undefined) {
			// Reset to page 1 when search is cleared
			pagination.onUpdatePage(1);
		}
	},
	{ deep: true },
);

const pagination = reactive({
	page: route.query.page ? Number(route.query.page) : 1,
	pageCount: 1,
	pageSize: route.query.perPage ? Number(route.query.perPage) : 15,
	itemCount: 0,
	async onUpdatePage(currentPage: number) {
		pagination.page = currentPage;
		let { page, ...Query }: any = route.query;
		Query = {
			...Query,
			page: currentPage !== 1 ? currentPage : undefined,
		};
		router.push({ query: Query });
		await refreshNuxtData(
			`${database.value.slug}/${table.value?.slug as string}`,
		);
	},
	async onUpdatePageSize(pageSize: number) {
		const OLD_pageSize = toRaw(pagination.pageSize);
		pagination.pageSize = pageSize;
		let { perPage, page, ...Query }: any = route.query;
		if (pageSize !== 15) {
			pagination.page = Math.round(
				OLD_pageSize < pageSize
					? page / (pageSize / OLD_pageSize)
					: page * (pageSize / OLD_pageSize),
			);
			if (Number.isNaN(pagination.page)) pagination.page = 1;
			Query = {
				...Query,
				perPage: pageSize,
				page: pagination.page === 1 ? undefined : pagination.page,
			};
			router.push({
				query: Query,
			});
			await refreshNuxtData(
				`${database.value.slug}/${table.value?.slug as string}`,
			);
		}
	},
});

const sort = ref<Record<string, "asc" | "desc">>({});

const queryOptions = computed(() =>
	Inison.stringify({
		page: pagination.page,
		perPage: pagination.pageSize,
		columns: table.value?.columns,
		sort: Object.keys(sort.value).length ? sort.value : "",
	}),
);

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useSessionCookie();

const { data: _data } = await useLazyFetch<apiResponse<Item[]>>(
	`${config.public.apiBase}${database.value.slug}/${table.value?.slug as string}`,
	{
		key: `${database.value.slug}/${table.value?.slug as string}`,
		query: {
			options: queryOptions,
			where: searchString,
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		onRequest() {
			Loading.value.data = true;
		},
		onResponse({ response: { _data } }) {
			Loading.value.data = false;
			pagination.pageCount = _data?.options.totalPages ?? 0;
			pagination.itemCount = _data?.options.total ?? 0;
			// TODO
			// if (![202, 404].includes(code)) window.$message.error(message)
		},
		credentials: "include",
	},
);

watch(_data, (v) => {
	data.value = v || undefined;
});

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
}));

const currentItem = ref<Item>();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
const rowTouchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

async function handleSelect(value: string) {
	showDropdown.value = false;
	if (!currentItem.value) return;
	switch (value) {
		case "copy": {
			await copyToClipboard(Inison.stringify(currentItem.value));
			window.$message.success(t("copiedSuccessfully"));
			currentItem.value = undefined;
		}
	}
}
function onClickoutside(e: MouseEvent) {
	const isRightClick = e.button === 2;
	if (!isRightClick) showDropdown.value = false;
}
const dropdownOptions: DropdownOption[] = [
	{
		label: t("copyItem"),
		key: "copy",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:copy" })),
	},
];

function clearRowTouchTimeout() {
	if (rowTouchTimeout.value) {
		clearTimeout(rowTouchTimeout.value);
		rowTouchTimeout.value = null;
	}
}

function shouldIgnoreRowContextMenu(target: HTMLElement | null) {
	if (!target) return true;

	return !!(
		target.closest("a[href]") ||
		target.closest("img") ||
		target.closest("button") ||
		target.closest('[role="button"]') ||
		target.closest("input, textarea, select") ||
		target.closest('[contenteditable="true"]') ||
		target.closest(".editable") ||
		target.closest(".n-ellipsis") ||
		target.closest(".n-tag") ||
		target.closest(".n-text")
	);
}

async function openRowDropdown(
	row: Item,
	{
		target,
		clientX,
		clientY,
		checkSelection = false,
	}: {
		target: HTMLElement | null;
		clientX: number;
		clientY: number;
		checkSelection?: boolean;
	},
) {
	if (shouldIgnoreRowContextMenu(target)) {
		showDropdown.value = false;
		return;
	}

	if (checkSelection) {
		const selection = window.getSelection();
		if (
			selection &&
			selection.toString().trim() !== "" &&
			selection.rangeCount
		) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			if (
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom
			) {
				showDropdown.value = false;
				return;
			}
		}
	}

	showDropdown.value = false;
	await nextTick();
	currentItem.value = (({ id, createdAt, updatedAt, ...rest }) => rest)(row);
	showDropdown.value = true;
	x.value = clientX + 8;
	y.value = clientY + 6;
}

function rowProps(row: Item) {
	return {
		onContextmenu: async (e: MouseEvent) => {
			e.preventDefault();
			clearRowTouchTimeout();
			await openRowDropdown(row, {
				target: e.target as HTMLElement,
				clientX: e.clientX,
				clientY: e.clientY,
				checkSelection: true,
			});
		},
		onTouchstart: (e: TouchEvent) => {
			const touch = e.touches[0];
			const target = e.target as HTMLElement | null;
			if (!touch || shouldIgnoreRowContextMenu(target)) return;

			clearRowTouchTimeout();
			rowTouchTimeout.value = window.setTimeout(() => {
				openRowDropdown(row, {
					target,
					clientX: touch.clientX,
					clientY: touch.clientY,
				});
			}, 450);
		},
		onTouchend: clearRowTouchTimeout,
		onTouchcancel: clearRowTouchTimeout,
		onTouchmove: clearRowTouchTimeout,
	};
}

onBeforeUnmount(clearRowTouchTimeout);

function getVNodeTextContent(vnode: VNodeChild): string {
	if (vnode === null || vnode === undefined || vnode === false) return "";
	// primitive text
	if (typeof vnode === "string" || typeof vnode === "number")
		return String(vnode);

	// arrays of VNodes
	if (Array.isArray(vnode))
		return vnode.map((n) => getVNodeTextContent(n)).join("");

	// VNode shape (element/component)
	const vn: any = vnode as any;

	// direct children string (common for elements)
	if (typeof vn.children === "string") return vn.children;

	// children as array or single VNode
	if (Array.isArray(vn.children))
		return vn.children.map((c: any) => getVNodeTextContent(c)).join("");

	// children as function (scoped slot) -> invoke safely
	if (typeof vn.children === "function") {
		try {
			const res = vn.children();
			return getVNodeTextContent(res);
		} catch {
			return "";
		}
	}

	// children as slots object { default: fn, ... }
	if (vn.children && typeof vn.children === "object") {
		let out = "";
		for (const key of Object.keys(vn.children)) {
			const slot = (vn.children as Record<string, any>)[key];
			if (typeof slot === "function") {
				try {
					out += getVNodeTextContent(slot());
				} catch {
					/* ignore */
				}
			} else {
				out += getVNodeTextContent(slot);
			}
		}
		if (out) return out;
	}

	// if this vnode is a mounted component, prefer its rendered subTree
	if (vn.component?.subTree) return getVNodeTextContent(vn.component.subTree);

	// fallback empty
	return "";
}
const getCsvCell: DataTableGetCsvCell = (value, row, column) => {
	if (["boolean", "string", "number"].includes(typeof value))
		return String(value);

	if (column.type === "custom" && column.render)
		return getVNodeTextContent((column as any).render(row));

	if (!value) return null;

	if (isObject(value) && Object.hasOwn(value, "id")) {
		const columnField = table.value?.schema?.find(
			({ key }) => key === column.key,
		);
		if (!columnField) return value.id;

		const columnTable = database.value.tables?.find(
			({ slug }) => slug === columnField.table,
		);
		if (!columnTable) return value.id;

		return renderLabel(columnTable, value);
	}
	if (
		Array.isArray(value) &&
		isArrayOfObjects(value) &&
		value.every((_v) => Object.hasOwn(_v, "id"))
	) {
		const columnTable = database.value.tables?.find(
			({ slug }) => slug === column.key,
		);
		if (!columnTable) value = value.map((_v) => _v.id);
		else value = value.map((_v) => renderLabel(columnTable, _v));
	}
	return `"${Inison.stringify(value)}"`;
};

const getCsvHeader: DataTableGetCsvHeader = (col) => {
	if (col.key === "actions") return "";
	return (col.key as string) || "Unknown";
};

function handleSorterChange({
	columnKey,
	order,
}: {
	columnKey: string;
	order: string;
}) {
	if (!order) delete sort.value[columnKey];
	else sort.value[columnKey] = order.slice(0, -3) as "asc" | "desc";
}

const checkedRowKeys = ref<string[]>([]);
const user = useState<User>("user");
const tablesConfig = computed({
	get: () => user.value?.config?.tables ?? {},
	set: (v) => {
		user.value.config = { ...(user.value.config ?? {}), tables: v };
		$fetch(
			`${config.public.apiBase}${database.value.slug}/users/${user.value?.id}`,
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
		).catch((err) => window.$message.error(err.message));
	},
});

function handleScroll() {
	clearRowTouchTimeout();
	showDropdown.value = false; // Hide dropdown on scroll
}

const tableWidth = ref<number>(0);
let measureTextWidthSpan: HTMLSpanElement | null = null;
const visualWidthCache = new WeakMap<Item[], Map<string, number[]>>();
const visualWidthVersion = ref(0);
const textWidthCache = new Map<string, number>();
let refreshVisualWidthsTask: Promise<void> | null = null;
let tableWidthResizeObserver: ResizeObserver | null = null;
let tableObserverStartTimer: ReturnType<typeof setTimeout> | null = null;

function invalidateVisualWidthCache() {
	visualWidthVersion.value += 1;
	const rows = _data.value?.result;
	if (rows) visualWidthCache.delete(rows);
}

function updateTableWidthFromColumns() {
	tableWidth.value =
		columns.value?.reduce(
			(accumulator: number, { width }) =>
				accumulator + ((width as number | undefined) ?? 0),
			40,
		) ?? 40;
}

async function refreshVisualWidths() {
	if (typeof window === "undefined") {
		updateTableWidthFromColumns();
		return;
	}

	if (refreshVisualWidthsTask) return refreshVisualWidthsTask;

	refreshVisualWidthsTask = (async () => {
		invalidateVisualWidthCache();

		// First load can render table internals lazily; retry for a few frames.
		for (let attempt = 0; attempt < 8; attempt += 1) {
			await nextTick();
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			const measured = applyVisualColumnWidths();
			if (measured) break;
		}

		await nextTick();
		updateTableWidthFromColumns();
	})().finally(() => {
		refreshVisualWidthsTask = null;
	});

	return refreshVisualWidthsTask;
}

async function ensureVisualWidthsReady(maxAttempts = 8) {
	if (typeof window === "undefined") {
		updateTableWidthFromColumns();
		return;
	}

	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		await refreshVisualWidths();

		if (!_data.value?.result?.length || !columns.value?.length) return;

		if (getVisualColumnWidths().length) {
			updateTableWidthFromColumns();
			return;
		}

		await new Promise<void>((resolve) => setTimeout(resolve, 80));
	}
}

function stopTableWidthObservers() {
	if (tableObserverStartTimer) {
		clearTimeout(tableObserverStartTimer);
		tableObserverStartTimer = null;
	}

	tableWidthResizeObserver?.disconnect();
	tableWidthResizeObserver = null;
}

function startTableWidthObservers() {
	if (typeof window === "undefined") return;

	stopTableWidthObservers();

	const tableElement = document.getElementById("DataTable");
	if (!tableElement) {
		tableObserverStartTimer = setTimeout(() => {
			startTableWidthObservers();
		}, 120);
		return;
	}

	tableWidthResizeObserver = new ResizeObserver(() => {
		void ensureVisualWidthsReady(3);
	});
	tableWidthResizeObserver.observe(tableElement);
}

function measureTextWidth(
	text: string,
	opts?: { min?: number; startWith?: number },
): number {
	const str = String(text ?? "");
	const startWith = opts?.startWith || 0;
	const min = opts?.min;
	const cacheKey = `${str}:${startWith}:${min ?? ""}`;
	const cachedWidth = textWidthCache.get(cacheKey);
	if (cachedWidth !== undefined) return cachedWidth;

	if (typeof document === "undefined") {
		const fallbackWidth = Math.ceil((str || " ").length * 8) + startWith;
		const result = min ? Math.max(fallbackWidth, min) : fallbackWidth;
		if (textWidthCache.size > 1000) textWidthCache.clear();
		textWidthCache.set(cacheKey, result);
		return result;
	}

	if (!measureTextWidthSpan) {
		measureTextWidthSpan = document.createElement("span");
		const s = measureTextWidthSpan.style;
		s.position = "absolute";
		s.visibility = "hidden";
		s.whiteSpace = "pre";
		s.pointerEvents = "none";
		s.left = "-9999px";
		s.top = "-9999px";
	}

	if (!measureTextWidthSpan.parentElement)
		document.body.appendChild(measureTextWidthSpan);

	measureTextWidthSpan.textContent = str || " ";
	const width = Math.ceil(measureTextWidthSpan.getBoundingClientRect().width);
	measureTextWidthSpan.textContent = "";

	const measuredWidth = width + startWith;
	const result = min ? Math.max(measuredWidth, min) : measuredWidth;
	if (textWidthCache.size > 1000) textWidthCache.clear();
	textWidthCache.set(cacheKey, result);
	return result;
}

function getVisualColumnWidths(): number[] {
	const resultRows = _data.value?.result;
	if (typeof document === "undefined" || !resultRows?.length) return [];

	const tableElement = document.getElementById("DataTable");
	if (!tableElement) return [];

	const sizeKey = tablesConfig.value[table.value.slug]?.size ?? "default";
	const columnSignature = (columns.value ?? [])
		.map((column) => {
			if ("key" in column) {
				return `${String(column.type ?? "")}:${String(column.key ?? "")}`;
			}
			return String(column.type ?? "");
		})
		.join("|");
	const rowSignature = resultRows
		.map((row, index) => String(row?.id ?? `row-${index}`))
		.join("|");
	const cacheKey = `${sizeKey}:${pagination.page}:${pagination.pageSize}:${resultRows.length}:${rowSignature}:${columnSignature}:${visualWidthVersion.value}`;
	const cachedColumns = visualWidthCache.get(resultRows)?.get(cacheKey);
	if (cachedColumns) return cachedColumns;

	const headerCells = Array.from(
		tableElement.querySelectorAll<HTMLElement>(".n-data-table-th"),
	);
	if (!headerCells.length) return [];

	const widths = headerCells.map((headerCell, index) => {
		const column = columns.value?.[index] as
			| { minWidth?: number }
			| undefined;
		const minWidth = typeof column?.minWidth === "number" ? column.minWidth : 0;
		const headerTitle =
			headerCell
				.querySelector<HTMLElement>(".n-data-table-th__title")
				?.textContent?.trim() ?? "";
		const measuredHeaderWidth = headerTitle
			? measureTextWidth(headerTitle, { startWith: 56, min: minWidth })
			: minWidth;
		return Math.ceil(Math.max(minWidth, measuredHeaderWidth));
	});
	const rows = tableElement.querySelectorAll<HTMLElement>(".n-data-table-tr");

	function getCellVisualWidth(cell: HTMLElement): number {
		const buttonElements = Array.from(
			cell.querySelectorAll<HTMLElement>(".n-button"),
		).filter((button) => button.getClientRects().length > 0);
		if (buttonElements.length) {
			const cellRect = cell.getBoundingClientRect();
			let minLeft = Number.POSITIVE_INFINITY;
			let maxRight = 0;
			let intrinsicButtonsWidth = 0;

			buttonElements.forEach((button, index) => {
				const buttonRect = button.getBoundingClientRect();
				const left = buttonRect.left - cellRect.left;
				const right = buttonRect.right - cellRect.left;
				minLeft = Math.min(minLeft, left);
				maxRight = Math.max(maxRight, right);

				const buttonContent = button.querySelector<HTMLElement>(
					".n-button__content",
				);
				const buttonLabel = buttonContent?.textContent?.trim() ?? "";
				const labelWidth = buttonLabel ? measureTextWidth(buttonLabel) : 0;
				const iconPadding = button.querySelector(".n-icon") ? 52 : 32;
				const intrinsicWidth = Math.max(
					button.scrollWidth,
					buttonContent?.scrollWidth ?? 0,
					labelWidth + iconPadding,
					Math.ceil(buttonRect.width),
				);
				intrinsicButtonsWidth += intrinsicWidth;
				if (index < buttonElements.length - 1) intrinsicButtonsWidth += 6;
			});

			const visualSpan =
				Number.isFinite(minLeft) && maxRight > minLeft ? maxRight - minLeft : 0;
			return Math.ceil(Math.max(visualSpan, intrinsicButtonsWidth) + 24);
		}

		const tagElements = cell.querySelectorAll<HTMLElement>(".n-tag");
		if (tagElements.length) {
			let tagWidth = 0;
			tagElements.forEach((tag, index) => {
				tagWidth += tag.getBoundingClientRect().width;
				if (index < tagElements.length - 1) tagWidth += 6;
			});
			return Math.ceil(tagWidth + 24);
		}

		const textLikeElements = Array.from(
			cell.querySelectorAll<HTMLElement>(
				".n-base-selection-label, .n-radio__label, .n-checkbox__label, .n-ellipsis, .n-text",
			),
		).filter((element) => element.getClientRects().length > 0);
		if (textLikeElements.length) {
			const contentWidth = textLikeElements.reduce((maxWidth, element) => {
				const label = element.textContent?.trim() ?? "";
				const measuredTextWidth = label ? measureTextWidth(label) : 0;
				return Math.max(
					maxWidth,
					element.scrollWidth,
					Math.ceil(element.getBoundingClientRect().width),
					measuredTextWidth,
				);
			}, 0);
			return Math.ceil(contentWidth + 32);
		}

		const plainText = cell.textContent?.trim() ?? "";
		if (plainText) {
			return Math.ceil(measureTextWidth(plainText, { startWith: 32 }));
		}

		const childWidths = Array.from(cell.children).map((child) =>
			Math.ceil((child as HTMLElement).getBoundingClientRect().width),
		);
		if (childWidths.length) {
			return Math.max(...childWidths) + 24;
		}

		return 0;
	}

	for (const row of rows) {
		if (!row.querySelector(".n-data-table-td")) continue;
		const cells = row.children;
		const limit = Math.min(cells.length, widths.length);
		for (let index = 0; index < limit; index += 1) {
			const cell = cells.item(index) as HTMLElement | null;
			if (!cell) continue;
			widths[index] = Math.max(widths[index] ?? 0, getCellVisualWidth(cell));
		}
	}

	let cache = visualWidthCache.get(resultRows);
	if (!cache) {
		cache = new Map();
		visualWidthCache.set(resultRows, cache);
	}
	cache.set(cacheKey, widths);

	return widths;
}

function applyVisualColumnWidths(): boolean {
	if (!columns.value?.length) return false;
	const measuredWidths = getVisualColumnWidths();
	if (!measuredWidths.length) return false;

	columns.value = columns.value.map((column, index) => {
		if (
			column.type === "selection" ||
			("key" in column && column.key === "actions")
		)
			return column;

		const measured = measuredWidths[index];
		if (!measured) return column;

		const minWidth =
			typeof column.minWidth === "number" ? column.minWidth : 150;
		const targetWidth = Math.max(measured, minWidth);

		if (column.width === targetWidth) return column;

		return {
			...column,
			width: targetWidth,
		};
	}) as DataTableColumns;

	return true;
}

function dedupeColumnsByKey(cols: DataTableColumns): DataTableColumns {
	const seenKeys = new Set<string | number>();
	return cols.filter((col) => {
		if (!("key" in col)) return true;
		const key = col.key;
		if (typeof key !== "string" && typeof key !== "number") return true;
		if (seenKeys.has(key)) return false;
		seenKeys.add(key);
		return true;
	}) as DataTableColumns;
}

function getContentAwareMinWidth(field: Field, headerMinWidth: number): number {
	if (!field.table || !_data.value?.result?.length) return headerMinWidth;

	const relatedTable = database.value.tables?.find(
		({ slug }) => slug === field.table,
	);
	if (!relatedTable) return headerMinWidth;

	let longestLabel = "";
	let hasMultipleRelations = false;

	for (const row of _data.value.result) {
		const raw = row[field.key];
		if (raw === undefined || raw === null) continue;

		const relations = ([] as Item[]).concat(raw as Item | Item[]);
		if (relations.length > 1) hasMultipleRelations = true;

		for (const relation of relations) {
			if (!relation || typeof relation !== "object") continue;
			const label = renderLabel(relatedTable, relation);
			if (label.length > longestLabel.length) longestLabel = label;
		}
	}

	if (!longestLabel) return headerMinWidth;

	const labelWidth = measureTextWidth(longestLabel, {
		// Icon + rounded button paddings + spacing.
		startWith: 96,
		min: headerMinWidth,
	});

	// In grouped mode we show "first +N", so reserve room for the count button.
	return hasMultipleRelations ? labelWidth + 56 : labelWidth;
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
														await deleteItem();
														checkedRowKeys.value = [];
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
														await deleteItem();
														checkedRowKeys.value = [];
													},
												},
												() => h(Icon, { name: "tabler:trash" }),
											),
									},
								],
								onSelect: async () => {
									await deleteItem(checkedRowKeys.value);
									checkedRowKeys.value = [];
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
														]?.columns?.filter(
															(itemID: number) => itemID !== id,
														);
													else {
														const clonedTablesConfig = structuredClone(
															toRaw(tablesConfig.value),
														);
														if (
															!clonedTablesConfig[table.value?.slug as string]
														)
															clonedTablesConfig[table.value?.slug as string] =
																{ columns: [] };

														// @ts-ignore
														clonedTablesConfig[
															table.value?.slug as string
														].columns?.push(id as number);

														tablesConfig.value = clonedTablesConfig;
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
			.map((field) => {
				const headerMinWidth = measureTextWidth(t(field.key), {
					startWith: 70,
					min: 150,
				});
				const minWidth = getContentAwareMinWidth(field, headerMinWidth);
				return {
					title: () =>
						h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
							getField(field).icon(),
							h(NPerformantEllipsis, () => t(field.key)),
						]),
					minWidth,
					width: minWidth,
					key: field.key,
					sorter: !!_data.value?.result,
					ellipsis: field.table !== undefined ? false : ({
						tooltip: true,
					}),
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
										editKey: `${row.id ?? "row"}-${field.key}`,
										itemLabel: renderLabel(table.value, row),
										loading:
											!!row.id && Loading.value[`${row.id}-${field.key}`],
										modelValue: row[field.key],
										"onUpdate:modelValue": async (value: any) => {
											if (!row.id) return;
											Loading.value[`${row.id}-${field.key}`] = true;
											row[field.key] = value;
											await refreshVisualWidths();
											const __data = await $fetch<apiResponse<Item | boolean>>(
												`${config.public.apiBase}${database.value.slug}/${
													table.value?.slug
												}/${row.id}`,
												{
													method: "PUT",
													body: row,
													params: {
														return: false,
														locale: Language.value,
														[`${database.value.slug}_sid`]: sessionID.value,
													},
													credentials: "include",
												},
											);
											if (
												(typeof __data?.result === "boolean" &&
													__data.result !== true) ||
												(typeof __data.result !== "boolean" &&
													!__data.result?.id)
											)
												window.$message.error(__data.message);
											Loading.value[`${row.id}-${field.key}`] = false;
										},
										field,
									})
								: h(LazyColumn, {
										value: row[field.key],
										itemLabel: renderLabel(table.value, row),
										field,
									}),
				};
			}) ?? []),
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
														trigger: "click",
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
	] as DataTableColumns;

	const uniqueCols = dedupeColumnsByKey(cols);

	if (uniqueCols.length > 2 || table.value?.defaultTableColumns)
		columns.value = uniqueCols;
	
	await ensureVisualWidthsReady();
}
watch([Language, checkedRowKeys, _data, tablesConfig, table], setColumns, {
	deep: true,
	immediate: true,
	flush: "post",
});

onMounted(() => {
	void ensureVisualWidthsReady();
});

onBeforeUnmount(() => {
	stopTableWidthObservers();
});
</script>