<template>
	<!-- Edit mode: draggable grid with per-widget controls -->
	<div v-if="editMode" class="dashboard-edit">
		<VueDraggable
			v-if="editWidgets.length"
			v-model="editWidgets"
			item-key="id"
			handle=".drag-handle"
			:animation="200"
			:custom-update="ignoreReorder"
			@start="onDragStart"
			@end="onDragEnd"
			class="dashboard-grid"
		>
			<div
				v-for="(widget, index) in editWidgets"
				:key="widget.id"
				:data-widget-id="widget.id"
				class="dashboard-grid-item"
				:style="widgetGridStyle(widget)"
			>
				<NCard
					size="small"
					:title="widget.title || t('untitledWidget')"
					content-style="flex: 1; display: flex; align-items: center"
					:style="
						widget.color
							? `border-inline-start: 3px solid ${widget.color}`
							: ''
					"
				>
					<template #header-extra>
						<NFlex :size="4" align="center">
							<span
								class="drag-handle"
								style="
									cursor: grab;
									display: inline-flex;
									align-items: center;
									padding: 4px;
								"
							>
								<NIcon :size="16">
									<Icon name="tabler:grip-vertical" />
								</NIcon>
							</span>
							<NSelect
								size="tiny"
								:value="widget.size || 'small'"
								:options="sizeOptions"
								style="width: 100px"
								@update:value="(size) => updateWidth(widget, size)"
							/>
							<NButton size="tiny" quaternary @click="openEditor(index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:edit" />
									</NIcon>
								</template>
							</NButton>
							<NButton size="tiny" quaternary type="error" @click="removeWidget(index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:trash" />
									</NIcon>
								</template>
							</NButton>
						</NFlex>
					</template>
					<component
						:is="widgetRenderer(widget.type)"
						:widget="widget"
						:database-slug="databaseSlug"
						:date-range-override="dateRangeOverride"
					/>
				</NCard>
			</div>
		</VueDraggable>

		<NEmpty v-if="!editWidgets.length" :description="t('noWidgets')" />

		<NModal
			v-model:show="showWidgetModal"
			preset="card"
			:title="pendingNewWidget ? t('addWidget') : t('editWidget')"
			style="width: min(680px, 90vw)"
		>
			<DashboardWidgetEditor v-if="editingWidget" v-model="editingWidget" />
			<template #footer>
				<NFlex justify="end">
					<NButton @click="closeEditor">{{ t("cancel") }}</NButton>
					<NButton type="primary" @click="confirmWidget">{{ t("confirm") }}</NButton>
				</NFlex>
			</template>
		</NModal>
	</div>

	<!-- View mode: read-only grid, same layout rules as the editor -->
	<div
		v-else-if="dashboard.widgets?.length"
		class="dashboard-grid"
	>
		<div
			v-for="widget in dashboard.widgets"
			:key="widget.id + dateRangeKey"
			class="dashboard-grid-item"
			:style="widgetGridStyle(widget)"
		>
			<NCard
				:title="widget.title"
				size="small"
				content-style="flex: 1; display: flex; align-items: center"
				:style="
					widget.color
						? `border-inline-start: 3px solid ${widget.color}`
						: ''
				"
			>
				<template #header-extra>
					<DashboardWidgetSearchButton
						v-if="widgetHasActiveFilter(widget)"
						:schema="widgetSearchSchema(widget)"
						v-model:array="widget.searchArray"
					/>
				</template>
				<component
					:is="widgetRenderer(widget.type)"
					:widget="widget"
					:database-slug="databaseSlug"
					:date-range-override="dateRangeOverride"
				/>
			</NCard>
		</div>
	</div>
	<NEmpty v-else :description="t('noWidgets')" />
</template>

<script lang="ts" setup>
import { VueDraggable } from "vue-draggable-plus";
import {
	DashboardWidgetBarChart,
	DashboardWidgetCounter,
	DashboardWidgetLineChart,
	DashboardWidgetPieChart,
	DashboardWidgetSearchButton,
	DashboardWidgetTable,
} from "#components";
import {
	computePlacements,
	type WidgetPlacement,
} from "~/composables/dashboardLayout";
import { generateSearchString } from "~/composables/search";
import { resolveWidgetTable } from "~/composables/widgetSchema";

const props = defineProps<{
	dashboard: Dashboard;
	databaseSlug: string;
	dateRangeOverride?: WidgetDateRange;
	editMode?: boolean;
}>();

const editWidgets = defineModel<Widget[]>("widgets", { default: () => [] });

const database = useState<Database>("database");

// A widget gets a search affordance in its card header only when it carries
// an active filter (non-empty searchArray). Reads `widget.searchArray`, so the
// button appears/disappears reactively as the filter changes.
function widgetHasActiveFilter(widget: Widget): boolean {
	return !!generateSearchString(widget.searchArray, "display");
}

// Schema backing the widget's search builder: its source table's schema.
function widgetSearchSchema(widget: Widget): Schema | undefined {
	return resolveWidgetTable(database.value?.tables, widget.table)?.schema;
}

const dateRangeKey = computed(() => props.dateRangeOverride ?? "default");

const editingWidgetIndex = ref<number | null>(null);
const showWidgetModal = ref(false);
const pendingNewWidget = ref<Widget | null>(null);

const editingWidget = computed({
	get: () => {
		if (pendingNewWidget.value) return pendingNewWidget.value;
		return editingWidgetIndex.value !== null
			? (editWidgets.value[editingWidgetIndex.value] ?? null)
			: null;
	},
	set: (v) => {
		if (pendingNewWidget.value) {
			pendingNewWidget.value = v;
		} else if (editingWidgetIndex.value !== null && v) {
			editWidgets.value[editingWidgetIndex.value] = v;
		}
	},
});

watch(editingWidgetIndex, (v) => {
	showWidgetModal.value = v !== null;
});

watch(showWidgetModal, (v) => {
	if (!v) {
		editingWidgetIndex.value = null;
		pendingNewWidget.value = null;
	}
});

function addWidget() {
	pendingNewWidget.value = {
		id: `w_${Date.now()}`,
		type: "counter",
		title: undefined,
		table: undefined,
		operation: "count",
		size: "small",
		dateRange: "all",
		searchArray: { and: [[null, "=", null]] },
	};
	showWidgetModal.value = true;
}

function removeWidget(index: number) {
	editWidgets.value.splice(index, 1);
}

function openEditor(index: number) {
	editingWidgetIndex.value = index;
}

function closeEditor() {
	showWidgetModal.value = false;
}

function confirmWidget() {
	// Newly added widgets must have a source table before they can render.
	if (pendingNewWidget.value) {
		if (!pendingNewWidget.value.table) {
			window.$message.error(t("selectTable"));
			return;
		}
		editWidgets.value.push(pendingNewWidget.value);
	}
	showWidgetModal.value = false;
}

function updateWidth(widget: Widget, size: string) {
	if (size === "small" || size === "medium" || size === "large") {
		widget.size = size;
	}
}

const sizeOptions = [
	{ label: t("small"), value: "small" },
	{ label: t("medium"), value: "medium" },
	{ label: t("large"), value: "large" },
];

const widgetRenderers = {
	counter: DashboardWidgetCounter,
	line: DashboardWidgetLineChart,
	bar: DashboardWidgetBarChart,
	pie: DashboardWidgetPieChart,
	table: DashboardWidgetTable,
} as const;

function widgetRenderer(
	type: Widget["type"],
): (typeof widgetRenderers)[keyof typeof widgetRenderers] | null {
	return widgetRenderers[type] ?? null;
}

// While a drag is in progress the layout is frozen: vue-draggable-plus would
// otherwise reorder the model mid-drag and recompute placements under the
// pointer, making tall (multi-row) widgets jump and breaking the drop.
const dragPlacements = ref<Record<string, WidgetPlacement> | null>(null);
const dragStartOrder = ref<Widget[]>([]);
const draggedWidgetId = ref<string | null>(null);

const placements = computed<Record<string, WidgetPlacement>>(() => {
	if (dragPlacements.value) return dragPlacements.value;
	const widgets = props.editMode
		? editWidgets.value
		: (props.dashboard.widgets ?? []);
	return computePlacements(widgets);
});

type DragEventPayload = {
	oldIndex?: number;
	originalEvent?: {
		clientX?: number;
		clientY?: number;
		touches?: Array<{ clientX?: number; clientY?: number }>;
		changedTouches?: Array<{ clientX?: number; clientY?: number }>;
	};
};

// Prevent vue-draggable-plus from reordering the model while dragging. The
// drop position is translated to a list order ourselves (see onDragEnd), so a
// live reorder would only fight the frozen layout.
function ignoreReorder() {}

function onDragStart(evt: DragEventPayload) {
	dragStartOrder.value = [...editWidgets.value];
	draggedWidgetId.value =
		evt.oldIndex != null
			? (dragStartOrder.value[evt.oldIndex]?.id ?? null)
			: null;
	dragPlacements.value = computePlacements(editWidgets.value);
}

function onDragEnd(evt: DragEventPayload) {
	const id = draggedWidgetId.value;
	const pt = evt.originalEvent;
	const clientX =
		pt?.touches?.[0]?.clientX ??
		pt?.changedTouches?.[0]?.clientX ??
		pt?.clientX;
	const clientY =
		pt?.touches?.[0]?.clientY ??
		pt?.changedTouches?.[0]?.clientY ??
		pt?.clientY;
	if (id && clientX != null && clientY != null) {
		reorderToDropPoint(id, clientX, clientY);
	}
	draggedWidgetId.value = null;
	dragStartOrder.value = [];
	dragPlacements.value = null;
}

function rectContainsPoint(rect: DOMRect, x: number, y: number) {
	return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function rectDistance(rect: DOMRect, x: number, y: number) {
	const dx = Math.max(rect.left - x, 0, x - rect.right);
	const dy = Math.max(rect.top - y, 0, y - rect.bottom);
	return Math.hypot(dx, dy);
}

// SortableJS maps a drop to a DOM index, but with an auto layout a stacked
// column has no "before" zone, so dropping a tall widget over the counters
// keeps it where it was. Instead, translate the pointer position into a list
// order: drop onto a column and the widget lands on that column's side.
function reorderToDropPoint(
	draggedId: string,
	clientX: number,
	clientY: number,
) {
	const items = [...editWidgets.value];
	const curIndex = items.findIndex((w) => w.id === draggedId);
	if (curIndex === -1) return;

	const cells = Array.from(
		document.querySelectorAll(".dashboard-edit .dashboard-grid-item"),
	)
		.map((el) => {
			const rect = el.getBoundingClientRect();
			return { id: el.getAttribute("data-widget-id"), rect };
		})
		.filter((c): c is { id: string; rect: DOMRect } => c.id != null);

	let anchor = cells[0] ?? null;
	let best = Number.POSITIVE_INFINITY;
	for (const cell of cells) {
		const dist = rectContainsPoint(cell.rect, clientX, clientY)
			? 0
			: rectDistance(cell.rect, clientX, clientY);
		if (dist < best) {
			best = dist;
			anchor = cell;
		}
	}
	if (!anchor || anchor.id === draggedId) return;

	const frozen = dragPlacements.value;
	if (!frozen) return;
	const anchorIndex = items.findIndex((w) => w.id === anchor.id);
	if (anchorIndex === -1) return;

	const draggedPlacement = frozen[draggedId];
	const anchorPlacement = frozen[anchor.id];
	const sameColumn =
		draggedPlacement != null &&
		anchorPlacement != null &&
		draggedPlacement.colStart === anchorPlacement.colStart &&
		draggedPlacement.colSpan === anchorPlacement.colSpan;

	// Column group: the contiguous run of widgets sharing the anchor column.
	const anchorColStart = anchorPlacement?.colStart ?? -1;
	let groupStart = anchorIndex;
	while (
		groupStart > 0 &&
		frozen[items[groupStart - 1].id]?.colStart === anchorColStart
	) {
		groupStart -= 1;
	}
	let groupEnd = anchorIndex;
	while (
		groupEnd < items.length - 1 &&
		frozen[items[groupEnd + 1].id]?.colStart === anchorColStart
	) {
		groupEnd += 1;
	}

	let dest: number;
	if (sameColumn) {
		// Same stacked column: reorder vertically by the pointer's row.
		const anchorRect = cells.find((c) => c.id === anchor.id)?.rect;
		dest =
			anchorRect && clientY < anchorRect.top + anchorRect.height / 2
				? anchorIndex
				: anchorIndex + 1;
	} else {
		// Other column: insert at the edge of the anchor's column group on the
		// side the pointer is on (direction-aware).
		const anchorRect = cells.find((c) => c.id === anchor.id)?.rect;
		const rtl =
			getComputedStyle(
				document.querySelector(".dashboard-edit") ?? document.body,
			).direction === "rtl";
		const onStartSide =
			anchorRect != null &&
			(rtl
				? clientX > anchorRect.left + anchorRect.width / 2
				: clientX < anchorRect.left + anchorRect.width / 2);
		dest = onStartSide ? groupStart : groupEnd + 1;
	}

	const [item] = items.splice(curIndex, 1);
	if (item && curIndex < dest) dest -= 1;
	items.splice(dest, 0, item);
	editWidgets.value = items;
}

function widgetGridStyle(widget: Widget) {
	const p = placements.value[widget.id];
	if (!p) return {};
	return {
		gridColumn: `${p.colStart} / span ${p.colSpan}`,
		gridRow: `${p.rowStart} / span ${p.rowSpan}`,
	};
}

defineExpose({ addWidget });
</script>

<style scoped>
.dashboard-grid {
	display: grid;
	grid-template-columns: repeat(24, 1fr);
	/* Dense auto-fill lets short widgets stack into gaps left by tall ones. */
	grid-auto-flow: row dense;
	gap: 12px;
}

.dashboard-grid-item {
	min-width: 0;
	/* Let the card stretch to the full cell height so its content can be
	   vertically centered (helps short widgets in tall rows). */
	display: flex;
}

@media (max-width: 768px) {
	.dashboard-grid-item {
		grid-column: 1 / -1 !important;
	}
}
</style>