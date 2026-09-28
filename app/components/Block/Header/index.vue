<template>
	<LazyBlockHeaderAnnouncement v-if="hasAnnouncement" v-model="localModelValue.announcement"
		:design="localModelValue.announcement.design" />
	<LazyBlockHeader1 v-if="design === 1" v-model="localModelValue" />
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<Header>({});
const modelValue = defineModel<Header>();
const hasAnnouncement = computed(
	() => !modelValue.value || !isModelValueEmpty(modelValue.value.announcement),
);

// Merge the block's default config with the stored config key by key, so
// editing only some of the keys (e.g. the announcement) keeps the untouched
// keys (logo, menu, buttons, ...) on their default values.
watch(
	[() => modelValue.value, Language],
	([v]) => {
		localModelValue.value = mergeConfig(defaultConfig.value, v);
	},
	{ deep: true },
);
localModelValue.value = mergeConfig(defaultConfig.value, modelValue.value);
</script>