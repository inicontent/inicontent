<template>
	<LazyBlockFAQs1 v-if="design === 1" v-model="localModelValue" />
	<LazyBlockFAQs2 v-else-if="design === 2" v-model="localModelValue" />
	<LazyBlockFAQs3 v-else-if="design === 3" v-model="localModelValue" />
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<FAQs>({});
const modelValue = defineModel<FAQs>();
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