<template>
	<div class="container" :class="localModelValue.align ?? 'center'">
		<LazyBlockHeadingLink v-if="localModelValue.preHeadingLink" :design="localModelValue.preHeadingLink?.design"
			v-model="localModelValue.preHeadingLink" />
		<LazyBlockHeading1 v-if="design === 1" v-model="localModelValue" />
		<LazyBlockHeading2 v-else-if="design === 2" v-model="localModelValue" />
		<LazyBlockHeading3 v-else-if="design === 3" v-model="localModelValue" />
		<LazyBlockHeading4 v-else-if="design === 4" v-model="localModelValue" />
	</div>
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<Heading>({});
const modelValue = defineModel<Heading>();
watch(
	[() => modelValue.value, Language],
	([v]) => {
		if (isModelValueEmpty(v)) localModelValue.value = defaultConfig.value;
		else localModelValue.value = modelValue.value || defaultConfig.value;
	},
	{ deep: true },
);
if (isModelValueEmpty(modelValue.value))
	localModelValue.value = defaultConfig.value;
else localModelValue.value = modelValue.value || defaultConfig.value;
</script>
<style scoped>
.container {
	max-width: 85rem;
	padding-block: 2.5rem;
	padding-inline: 1rem;
	margin-top: 3.5rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.container.center {
	align-items: center;
	text-align: center;
}

.container.left {
	align-items: flex-start;
	text-align: start;
}

.container.right {
	align-items: flex-end;
	text-align: end;
}

.container.right :deep(.preheading),
.container.left :deep(.preheading) {
	margin-inline-start: 0.5rem;
}

.container.center :deep(.link-group) {
	padding-inline-start: 24px;
}
</style>