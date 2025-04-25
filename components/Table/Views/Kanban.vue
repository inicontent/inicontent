<template>
	<div class="kanban-scroll">
		<div class="kanban-columns">
			<NCard v-for="(column, index) in visibleColumns" :key="index" hoverable class="kanban-column">
				<NTag size="large" :color="column.color" :style="getDynamicStyle"
					style="width: 100%; justify-content: space-between; flex-direction: row-reverse; margin-bottom: 20px"
					:bordered="false" round>
					{{ column.label }}
					<NButton circle :color="column.color?.textColor" size="tiny" :text-color="column.color?.color">
						{{ column.pagination?.total || 0 }}
					</NButton>
					<template #icon>
						<NButton circle secondary size="tiny" @click.prevent="() => {
							if (!isMobile)
								openDrawer(table?.slug as string)
							else
								navigateTo(`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${table?.slug}/new`);
						}">
							<template #icon>
								<NIcon :color="column.color?.textColor">
									<IconPlus />
								</NIcon>
							</template>
						</NButton>
					</template>
				</NTag>
				<Draggable v-model="column.items" :group="{ name: 'items', pull: true, put: true }" item-key="id"
					ghost-class="ghost" :sort="false" @move="({ to, from }) => from !== to"
					@change="e => onItemDrop(e, column)">
					<template #item="{ element, index }">
						<NCard size="small" style="border-radius: 8px;margin-bottom: 10px;" hoverable>
							<component v-if="props.slots.itemActions" :is="props.slots.itemActions(element)" />
							<component v-else-if="props.slots.itemExtraActions"
								:is="props.slots.itemExtraActions(element)" />
							<NPopover scrollable style="max-height: 240px;border-radius:34px" contentStyle="padding: 0">
								<template #trigger>
									<NButton size="tiny" round style="position: absolute;" secondary type="primary">
										<template #icon>
											<NIcon>
												<IconDots />
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
							<template v-else>{{ renderLabel(table, element) }}</template>
						</NCard>
					</template>
				</Draggable>
				<template v-if="column.items.length === 0 && column.loading">
					<NSkeleton :height="calculateHeight" style="border-radius: 8px;margin-bottom: 10px;" />
					<NSkeleton :height="calculateHeight" style="border-radius: 8px;" />
				</template>
				<NEmpty v-else-if="column.items.length === 0" style="height: 100%;justify-content: center" />
			</NCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { IconDots, IconPlus } from "@tabler/icons-vue";
import type { pageInfo } from "inibase";
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils";
import Inison from "inison";
import {
	NButton,
	NCard,
	NEmpty,
	NIcon,
	NPopover,
	NSkeleton,
	NTag,
} from "naive-ui";
import type { TagColor } from "naive-ui/es/tag/src/common-props";
import Draggable from "vuedraggable";

defineTranslation({
	ar: {
		unspecified: "غير محددة",
	},
});

const props = defineProps<{
	slots: any;
}>();

type columnType = {
	label: string;
	key: string | number;
	items: Item[];
	pagination?: pageInfo;
	color?: TagColor;
	loading?: boolean;
};

const data = defineModel<columnType[]>("data");

const renderItemButtons = inject("renderItemButtons") as (item: Item) => VNode;

const appConfig = useAppConfig();
const { isMobile } = useDevice();

const database = useState<Database>("database");
const table = useState<Table>("table");
const field = table.value?.schema?.find(
	({ id }) => id === table.value?.groupBy,
);

const UNSET_KEY = "__unset__"; // internal sentinel

const visibleColumns = computed(() =>
	data.value?.filter((c) => c.key !== UNSET_KEY || c.items.length > 0),
);

if (field?.options) {
	if (isArrayOfArrays(field.options))
		data.value = (field.options as [string | number, string][]).map(
			([label]) => ({
				label: t(label),
				key: label,
				color: getColorObj(label, field?.options),
				items: [],
				loading: true,
			}),
		);
	else if (isArrayOfObjects(field.options))
		data.value = (
			field.options as {
				label: string;
				value: string | number;
			}[]
		).map(({ label, value }) => ({
			label: t(label),
			key: value,
			items: [],
			loading: true,
		}));
	else
		data.value = (field.options as string[]).map((value) => ({
			label: t(value),
			key: value,
			items: [],
			loading: true,
		}));

	const unsetColumn: columnType = {
		label: t("unspecified"),
		key: UNSET_KEY,
		items: [],
		loading: true,
		color: { color: "#f0f0f0", textColor: "#606060" } satisfies TagColor,
	};

	nextTick(() => {
		(data.value as columnType[]).push(unsetColumn);

		nextTick(async () => {
			for await (const column of data.value as columnType[]) {
				const _data = await $fetch<apiResponse<Item[]>>(
					`${appConfig.apiBase}${database.value.slug}/${table.value?.slug}`,
					{
						query: {
							where: Inison.stringify({
								[field.key]: column.key === UNSET_KEY ? "" : column.key,
							}),
						},
					},
				);
				column.items = _data.result || [];
				column.pagination = _data.options;
				column.loading = false;
			}
		});
	});
}

const calculateHeight = computed(() => {
	const baseHeight = 50; // Base height for skeleton
	const lineHeight = 20; // Height per line
	const maxHeight = 200; // Maximum height limit

	const lineBreaks = (table.value?.label?.match(/\n/g) || []).length;
	const calculatedHeight = baseHeight + lineBreaks * lineHeight;
	return `${Math.min(calculatedHeight, maxHeight)}px`;
});

const onItemDrop = async (evt: any, targetColumn: columnType) => {
	if (!evt.added || !field?.key || !data.value || !table.value?.slug) return;

	const card = evt.added.element as Item;
	const fromKey = (card as any)[field.key]; // old column key
	const toKey = targetColumn.key; // new column key
	if (fromKey === toKey) return;

	/* optimistic UI ------------------------------------------------- */
	(card as any)[field.key] = toKey;
	adjustTotals(fromKey, toKey);

	/* API call ------------------------------------------------------ */
	try {
		await $fetch(
			`${appConfig.apiBase}${database.value.slug}/${table.value.slug}/${card.id}`,
			{
				method: "PUT",
				body: { [field.key]: toKey === UNSET_KEY ? "" : toKey },
			},
		);
	} catch (err) {
		/* rollback ---------------------------------------------------- */
		(card as any)[field.key] = fromKey;
		adjustTotals(toKey, fromKey); // undo the optimistic counts

		/* put card back visually */
		const origin = data.value.find((c) => c.key === fromKey);
		if (origin) {
			origin.items.push(targetColumn.items.splice(evt.added.newIndex, 1)[0]);
		}
	}
};

function adjustTotals(from: any, to: any) {
	const dec = data.value?.find((c) => c.key === from);
	const inc = data.value?.find((c) => c.key === to);
	if (dec?.pagination)
		dec.pagination.total = Math.max((dec.pagination.total ?? 1) - 1, 0);
	if (inc?.pagination) inc.pagination.total = (inc.pagination.total ?? 0) + 1;
}
</script>


<style scoped>
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

.ghost {
	opacity: 0.4;
}
</style>