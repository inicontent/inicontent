<template>
	<LazyBlockHeaderAnnouncement1 v-if="design === 1" v-model="localModelValue" />
	<LazyBlockHeaderAnnouncement2 v-else-if="design === 2" v-model="localModelValue" />
	<LazyBlockHeaderAnnouncement3 v-else-if="design === 3" v-model="localModelValue" />
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<HeaderAnnouncement>({});
const modelValue = defineModel<HeaderAnnouncement>();

// Merge the default announcement with the stored config key by key, so a
// partial announcement (e.g. only the text) keeps its default button/design.
watch(
	[() => modelValue.value, Language],
	([v]) => {
		localModelValue.value = mergeConfig(defaultConfig.value, v);
	},
	{ deep: true },
);
localModelValue.value = mergeConfig(defaultConfig.value, modelValue.value);
</script>