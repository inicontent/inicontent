<template>
	<NFlex vertical :size="12">
		<NCard size="small" :title="t('product.dataSource')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('product.table')">
					<NSelect :value="modelValue?.table" @update:value="onTableChange" :options="tableOptions"
						:placeholder="t('product.selectTable')" clearable filterable />
				</NFormItem>

				<template v-if="selectedTable">
					<NFormItem v-for="slot in mappingSlots" :key="slot" :label="t(`product.${slot}`)">
						<NSelect :value="modelValue?.[slot] ?? null" @update:value="(v) => patchMapping(slot, v)"
							:options="mappingColumnOptions" :placeholder="t('product.selectColumn')"
							clearable filterable />
					</NFormItem>
					<NText depth="3" class="product-hint">{{ t('product.pageHint') }}</NText>
				</template>
				<NEmpty v-else :description="t('product.noTableSelected')" />
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('product.ratingReviews')" :bordered="false" content-style="padding-top: 0;">
			<NText depth="3" class="product-hint">{{ t('product.ratingReviewsHint') }}</NText>
			<NText strong class="product-subtitle">{{ t('product.rating') }}</NText>
			<BlockProductMetricEditor v-model="modelValue.ratingSource"
				:default-aggregation="'avg'" :aggregations="ratingAggregations" />
			<NDivider style="margin: 12px 0;" />
			<NText strong class="product-subtitle">{{ t('product.reviewsTitle') }}</NText>
			<BlockProductMetricEditor v-model="modelValue.reviewsSource"
				:default-aggregation="'count'" :aggregations="reviewsAggregations" />
		</NCard>

		<NCard size="small" :title="t('product.images')" :bordered="false" content-style="padding-top: 0;">
			<NText depth="3" class="product-hint">{{ t('product.imagesHint') }}</NText>
			<LazyField :field="galleryField" v-model="galleryValue" />
		</NCard>

		<NCard size="small" :title="t('product.buyCard')" :bordered="false" content-style="padding-top: 0;">
			<NFlex vertical :size="12">
				<NFormItem :label="t('product.buttonLabel')">
					<NInput :value="modelValue?.buttonLabel"
						@update:value="(v) => (modelValue.buttonLabel = v ?? undefined)"
						:placeholder="t('product.addToCart')" clearable />
				</NFormItem>
				<NFormItem :label="t('product.linkToPage')">
					<NSelect :value="pageLinkValue" @update:value="onPageLinkChange" :options="pageOptions"
						:loading="pageLoading" :placeholder="t('product.selectPage')" filterable clearable />
				</NFormItem>
				<NFormItem :label="t('product.currency')">
					<NInput :value="modelValue?.currency" @update:value="(v) => (modelValue.currency = v ?? undefined)"
						placeholder="$" clearable style="max-width: 8rem;" />
				</NFormItem>
			</NFlex>
		</NCard>

		<NCard size="small" :title="t('product.specs')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="specsSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('product.heading')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="headingSchema" v-model="modelValue" />
		</NCard>

		<NCard size="small" :title="t('product.responsive')" :bordered="false" content-style="padding-top: 0;">
			<LazyFieldS :schema="hideOnSchema" v-model="modelValue" />
		</NCard>
	</NFlex>
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils";

const modelValue = defineModel<Product>({ default: () => ({}) });

const props = defineProps<{ defaultTable?: string }>();

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
	"galleryField",
	"titleField",
	"taglineField",
	"priceField",
	"oldPriceField",
	"descriptionField",
	"ratingField",
	"reviewsField",
	"badgeField",
] as const;

const ratingAggregations: AggregateSource["aggregation"][] = [
	"avg",
	"sum",
	"min",
	"max",
	"count",
];

const reviewsAggregations: AggregateSource["aggregation"][] = ["count", "sum"];

const mappingColumnOptions = computed(() =>
	selectedTable.value?.schema
		? flattenSchema(selectedTable.value.schema).map((column) => ({
				label: column.key,
				value: column.id,
			}))
		: [],
);

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

// On a single-product (template) page the block should default to the page's
// bound table so the editor already shows the right columns.
watch(
	() => props.defaultTable,
	(slug) => {
		if (slug && !modelValue.value?.table) modelValue.value.table = slug;
	},
	{ immediate: true },
);

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
	(blockTypes.Product.schema as Schema).filter((field) =>
		HEADING_KEYS.includes(field.key),
	),
);

const specsSchema: Schema = [
	{
		key: "specs",
		type: "array",
		isTable: false,
		expand: true,
		children: [
			{ key: "label", type: "string", required: true },
			{ key: "value", type: "string", required: true },
		],
	},
	{ key: "showQuantity", type: "boolean" },
];

const hideOnSchema: Schema = [
	{ key: "hideOn", type: "array", options: ["mobile", "tablet", "desktop"] },
];
</script>

<style scoped>
.product-hint {
	display: block;
	font-size: 0.8125rem;
}

.product-subtitle {
	display: block;
	margin-top: 0.75rem;
}
</style>