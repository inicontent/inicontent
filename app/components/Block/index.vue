<template>
	<template v-if="!isHidden(modelValue.hideOn)">
		<LazyBlockHeader v-if="block === 'Header'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockHero v-else-if="block === 'Hero'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockFooter v-else-if="block === 'Footer'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockPricing v-else-if="block === 'Pricing'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockTestimonials v-else-if="block === 'Testimonials'" v-model:design="design"
			v-model="resolvedConfig" />
		<LazyBlockFeatures v-else-if="block === 'Features'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockFAQs v-else-if="block === 'FAQs'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockLoop v-else-if="block === 'Loop'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockTable v-else-if="block === 'Table'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockForm v-else-if="block === 'Form'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockProduct v-else-if="block === 'Product'" v-model:design="design" v-model="resolvedConfig" />
		<LazyBlockCta v-else-if="block === 'Cta'" v-model:design="design" v-model="resolvedConfig" />
	</template>
</template>

<script lang="ts" setup>
import { resolveItemRepeatPlaceholders } from "~/composables/itemBindings";

const modelValue = defineModel<Content>({
	required: true,
});
const block = ref<Blocks>();
const design = ref(1);

watchEffect(() => {
	const splitedName = modelValue.value.name.split("/");
	if (splitedName) {
		block.value = splitedName[0] as Blocks;
		design.value = parseInt(splitedName[1], 10);
	}

	if (
		Array.isArray(modelValue.value.config) &&
		block.value &&
		blockTypes[block.value]
	)
		modelValue.value.config = convertArrayToObject(
			modelValue.value.config,
			blockTypes[block.value].schema,
		);
});

const { isMobile, isTablet, isDesktop } = useDevice();

function isHidden(hideOn?: Content["hideOn"]): boolean {
	if (!hideOn) return false;
	if (hideOn.includes("mobile") && isMobile) return true;
	if (hideOn.includes("tablet") && isTablet) return true;
	if (hideOn.includes("desktop") && isDesktop) return true;
	return false;
}

// Dynamic ("template") pages render one item; every block value in `{{item.x}}`
// notation is resolved against it. Non-dynamic pages (and the Builder) render
// the raw config unchanged.
const templateItem = useState<Item | null>("templateItem", () => null);

const resolvedConfig = computed<
	Content["config"] | Record<string, unknown> | undefined
>({
	get: () => {
		if (!templateItem.value) return modelValue.value.config;
		const resolved = resolveItemRepeatPlaceholders(
			modelValue.value.config,
			templateItem.value as Record<string, unknown>,
		);
		if (
			(block.value === "Loop" || block.value === "Table") &&
			resolved.repeated.length &&
			resolved.config &&
			typeof resolved.config === "object" &&
			!Array.isArray(resolved.config)
		) {
			return {
				...(resolved.config as Record<string, unknown>),
				repeatItems: resolved.repeated,
			};
		}
		return resolved.config;
	},
	set: (value) => {
		modelValue.value.config = value;
	},
});
</script>