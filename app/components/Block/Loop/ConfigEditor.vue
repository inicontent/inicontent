<template>
	<NFlex vertical :size="12">
		<NCard size="small" :title="t('loop.heading')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="headingSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('loop.dataSource')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('loop.sourceMode')">
					<NRadioGroup :value="dataSourceMode" @update:value="onModeChange">
						<NRadioButton value="table">{{ t("loop.modeTable") }}</NRadioButton>
						<NRadioButton value="manual">{{ t("loop.modeManual") }}</NRadioButton>
					</NRadioGroup>
				</NFormItem>

				<template v-if="dataSourceMode === 'table'">
					<NFormItem :label="t('loop.table')">
						<NSelect :value="modelValue?.table" @update:value="onTableChange" :options="tableOptions"
							:placeholder="t('loop.selectTable')" clearable filterable />
					</NFormItem>

					<template v-if="selectedTable">
						<NFormItem v-for="slot in mappingSlots" :key="slot" :label="t(`loop.${slot}`)">
							<NSelect :value="modelValue?.[slot] ?? null"
								@update:value="(v) => patchMapping(slot, v)"
								:options="mappingColumnOptions" :placeholder="t('loop.selectColumn')"
								clearable filterable />
						</NFormItem>
						<NFormItem :label="t('loop.limit')">
							<NInputNumber :value="modelValue?.limit ?? 6"
								@update:value="(v) => (modelValue.limit = v ?? undefined)"
								:min="1" :max="50" style="width: 100%;" />
						</NFormItem>
					</template>
					<NEmpty v-else :description="t('loop.noTableSelected')" />
				</template>

				<template v-else>
					<NFormItem :label="t('loop.manualCards')">
						<NInput :value="demoJson" @update:value="onDemoChange" type="textarea"
							:rows="10" :placeholder="t('loop.manualPlaceholder')"
							:status="demoJsonError ? 'error' : undefined" />
					</NFormItem>
					<NText v-if="demoJsonError" type="error" depth="3">{{ demoJsonError }}</NText>
					<NText v-else depth="3">{{ t("loop.manualHint") }}</NText>
					<NFlex :size="8">
						<NButton size="small" secondary @click="formatDemoJson">
							{{ t("loop.formatJson") }}
						</NButton>
						<NButton v-if="modelValue?.demo?.length" size="small" tertiary type="error"
							@click="modelValue.demo = []">
							{{ t("loop.clearCards") }}
						</NButton>
					</NFlex>
				</template>
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('loop.buttonCard')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('loop.buttonLabel')">
					<NInput :value="modelValue?.label"
						@update:value="(v) => (modelValue.label = v ?? undefined)"
						:placeholder="t('loop.buttonLabel')" clearable />
				</NFormItem>
				<NText depth="3" class="loop-link-hint">{{ t("loop.clickableHint") }}</NText>
				<NFormItem :label="t('loop.linkToPage')">
					<NSelect :value="pageLinkValue" @update:value="onPageLinkChange" :options="pageOptions"
						:loading="pageLoading" :placeholder="t('loop.selectPage')" filterable clearable />
				</NFormItem>
				<NText v-if="selectedTemplateSegments" depth="3" class="loop-link-hint">
					{{ t("loop.linkHint") }}
					<code>{{ selectedTemplateSegments }}</code>
				</NText>
				<NFormItem :label="t('loop.cardHeaderTemplate')">
					<NInput :value="modelValue?.cardHeaderTemplate"
						@update:value="(v) => (modelValue.cardHeaderTemplate = v ?? undefined)"
						:placeholder="t('loop.cardHeaderPlaceholder')" clearable />
				</NFormItem>
				<NText depth="3" class="loop-link-hint">{{ t("loop.cardHeaderHint") }}</NText>
				<NFormItem :label="t('loop.tagFilter')">
					<NSwitch :value="modelValue?.showTagFilter !== false"
						@update:value="(v) => (modelValue.showTagFilter = v)" />
				</NFormItem>
				<NText depth="3" class="loop-link-hint">{{ t("loop.tagFilterHint") }}</NText>
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('loop.logosStyle')" :bordered="false" content-style="padding-top: 0;padding-bottom: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('loop.logosFilter')">
					<NSelect :value="modelValue?.logosFilter ?? 'none'"
						@update:value="(v) => (modelValue.logosFilter = v ?? 'none')" :options="logosFilterOptions"
						clearable />
				</NFormItem>
				<NFormItem :label="t('loop.logosMarquee')">
					<NSwitch :value="!!modelValue?.logosMarquee"
						@update:value="(v) => (modelValue.logosMarquee = v)" />
				</NFormItem>
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('loop.responsive')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="hideOnSchema" v-model="modelValue" />
		</NCard>
	</NFlex>
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils";

const modelValue = defineModel<Loop>({ default: () => ({}) });

const database = useState<Database>("database");
const { pages, pagesMap, loading: pageLoading, refresh } = usePageLinks();

const internalTableSlugs = new Set([
	"sessions",
	"assets",
	"translations",
	"dashboards",
]);

const tableOptions = computed(() =>
	(database.value?.tables ?? [])
		.filter(({ slug, show }) => show !== false && !internalTableSlugs.has(slug))
		.map((table) => ({
			value: table.slug,
			label: t(table.slug),
		})),
);

const selectedTable = computed(() =>
	(database.value?.tables ?? []).find(
		(table) => table.slug === modelValue.value?.table,
	),
);

const mappingSlots = [
	"imageField",
	"titleField",
	"subtitleField",
	"tagsField",
	"metaField",
	"descriptionField",
	"linkField",
] as const;

const mappingColumnOptions = computed(() =>
	selectedTable.value?.schema
		? flattenSchema(selectedTable.value.schema).map((column) => ({
				label: column.key,
				value: column.id,
			}))
		: [],
);

// Data source mode — legacy configs default to "table" when a table is mapped.
const dataSourceMode = computed<"table" | "manual">(() => {
	const mode = modelValue.value?.dataSourceMode;
	if (mode === "table" || mode === "manual") return mode;
	return modelValue.value?.table ? "table" : "manual";
});

function onModeChange(mode: "table" | "manual") {
	modelValue.value.dataSourceMode = mode;
	if (mode === "manual") {
		// Demo cards aren't tied to a table — drop the mapping so the preview
		// immediately shows manual data.
		modelValue.value.demo = modelValue.value.demo ?? [];
	}
}

function onTableChange(slug: string | null) {
	modelValue.value.table = slug ?? undefined;
	// Column ids belong to the previous table — clear every mapping.
	for (const slot of mappingSlots) modelValue.value[slot] = undefined;
}

function patchMapping(slot: (typeof mappingSlots)[number], value: unknown) {
	if (value === null || value === undefined || value === "")
		modelValue.value[slot] = undefined;
	else modelValue.value[slot] = value;
}

// ---- Manual cards (JSON editor) ----
const demoJson = ref("");
const demoJsonError = ref<string | null>(null);

/** Pretty-print the stored demo array once into the editor textarea. */
function syncDemoJson() {
	const demo = modelValue.value?.demo;
	demoJson.value = demo?.length ? JSON.stringify(demo, null, 2) : "";
	demoJsonError.value = null;
}

function onDemoChange(value: string) {
	demoJson.value = value ?? "";
	if (!demoJson.value.trim()) {
		modelValue.value.demo = [];
		demoJsonError.value = null;
		return;
	}
	try {
		const parsed = JSON.parse(demoJson.value);
		if (!Array.isArray(parsed)) throw new Error("not an array");
		modelValue.value.demo = parsed;
		demoJsonError.value = null;
	} catch {
		demoJsonError.value = t("loop.invalidJson");
	}
}

function formatDemoJson() {
	if (!demoJson.value.trim()) return;
	try {
		demoJson.value = JSON.stringify(JSON.parse(demoJson.value), null, 2);
		demoJsonError.value = null;
	} catch {
		demoJsonError.value = t("loop.invalidJson");
	}
}

watch(
	() => modelValue.value?.demo,
	() => syncDemoJson(),
	{ immediate: true, deep: true },
);

// Page-template link for the loop's card buttons. Stored like every builder
// link (as a page ID) and resolved per item at render time.
const pageLinkValue = computed<string | null>(() => {
	const link = modelValue.value?.link;
	if (!link || typeof link === "string") return link ?? null;
	return link.type === "page" ? String(link.id) : (link.url ?? null);
});

function onPageLinkChange(value: string | null) {
	if (value === null || value === undefined || value === "") {
		modelValue.value.link = undefined;
		return;
	}
	const page = pages.value.find((p) => String(p.id) === value);
	modelValue.value.link = page
		? { type: "page", id: page.id as string | number }
		: { type: "custom", url: value };
}

const pageOptions = computed(() =>
	pages.value.map((page) => {
		const slug = String(page.slug ?? "");
		return {
			label: slug.includes("[")
				? `${page.name || slug} · ${slug}`
				: page.name || slug || String(page.id),
			value: String(page.id),
		};
	}),
);

// When the linked page is a dynamic template, surface its `[segment]` slots —
// they are filled from each item automatically.
const selectedTemplateSegments = computed<string | undefined>(() => {
	const link = modelValue.value?.link;
	if (!link || typeof link === "string" || link.type !== "page")
		return undefined;
	const slug = pagesMap.value.get(String(link.id))?.slug;
	const segments = String(slug ?? "").match(/\[[^\]]+\]/g);
	return segments?.length ? segments.join(" ") : undefined;
});

watch(
	() => [modelValue.value?.table, modelValue.value?.link],
	() => {
		const link = modelValue.value?.link;
		if (link && typeof link !== "string" && link.type === "page") {
			// Ensure the page list holds the selected page.
			if (!pagesMap.value.has(String(link.id))) refresh();
		}
	},
	{ immediate: true },
);

const HEADING_KEYS = [
	"preHeadingLink",
	"preHeading",
	"heading",
	"description",
	"tag",
];

const headingSchema = computed<Schema>(() =>
	(blockTypes.Loop.schema as Schema).filter((field) =>
		HEADING_KEYS.includes(field.key),
	),
);

const hideOnSchema: Schema = [
	{ key: "hideOn", type: "array", options: ["mobile", "tablet", "desktop"] },
];

const logosFilterOptions = [
	{ label: t("loop.filterNone"), value: "none" },
	{ label: t("loop.filterGrayscale"), value: "grayscale" },
	{ label: t("loop.filterSepia"), value: "sepia" },
	{ label: t("loop.filterBrand"), value: "brand" },
];
</script>

<style scoped>
.loop-link-hint {
	display: block;
	font-size: 0.8125rem;
	margin-top: -0.25rem;
}
.loop-link-hint code {
	background: rgba(128, 128, 128, 0.15);
	border-radius: 0.25rem;
	padding: 0 0.25rem;
}
</style>