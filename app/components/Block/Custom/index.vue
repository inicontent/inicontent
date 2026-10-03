<template>
	<div :data-block="definition.type">
		<!-- biome-ignore lint/security/noDangerouslySetInnerHtml: a custom
		     block's Liquid template is authored in a repo file and compiled
		     here; interpolated values are escaped by the engine (see
		     app/composables/blockTemplate.ts) and opt out per value with | raw. -->
		<div v-html="html" />
	</div>
</template>

<script lang="ts" setup>
/**
 * Renders a custom block — one declared in `app/components/Block/customBlocks.ts`
 * rather than as a `.vue` component.
 *
 * A custom block has no per-design component: the design selects an entry in
 * `templates`, and Liquid turns it into an HTML string. Scope is the block's own
 * config fields at the root plus `item`, the row a dynamic (`articles/[slug]`)
 * page matched — the same binding the built-in blocks use, so a custom block
 * drops into a template page with no extra wiring.
 *
 * Note this bypasses `Block/index.vue`'s `resolveItemRepeatPlaceholders`: Liquid
 * does the interpolation here, so running both would be redundant at best.
 */
const props = defineProps<{
	definition: CustomBlock;
	design?: number;
	/** The block's config, already normalized from its stored positional array. */
	config?: Record<string, unknown>;
	/** Bound on dynamic pages to the row the page slug matched. */
	item?: Record<string, unknown> | null;
}>();

const templateItem = useState<Item | null>("templateItem", () => null);

const html = computed(() =>
	renderCustomBlock(
		resolveCustomBlockTemplate(props.definition, props.design),
		{
			...(props.config ?? {}),
			item: props.item ?? templateItem.value,
		},
	),
);

// The block's CSS is authored per block type, so inject it once per type rather
// than per instance — a page with six `<Promo>` blocks should carry one copy.
onMounted(() =>
	ensureCustomBlockStyle(props.definition.type, props.definition.style),
);
</script>