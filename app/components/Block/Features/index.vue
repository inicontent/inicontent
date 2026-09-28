<template>
	<LazyBlockFeatures1 v-if="design === 1" v-model="localModelValue" />
	<LazyBlockFeatures2 v-else-if="design === 2" v-model="localModelValue" />
	<LazyBlockFeatures3 v-else-if="design === 3" v-model="localModelValue" />
	<LazyBlockFeatures4 v-else-if="design === 4" v-model="localModelValue" />
	<LazyBlockFeatures5 v-else-if="design === 5" v-model="localModelValue" />
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<Features>({});
const modelValue = defineModel<Features>();
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