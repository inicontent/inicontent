<template>
	<BlockLoopPlaceholder v-if="isEmpty" />
	<BlockLoop1 v-else-if="design === 1" :cards="filteredCards" :tags="tags"
		:activeTag="activeTag" @update:activeTag="activeTag = $event"
		:showTagFilter="showTagFilter" v-model="localModelValue" />
	<BlockLoop2 v-else-if="design === 2" :cards="filteredCards" :tags="tags"
		:activeTag="activeTag" @update:activeTag="activeTag = $event"
		:showTagFilter="showTagFilter" v-model="localModelValue" />
	<BlockLoop3 v-else-if="design === 3" :cards="filteredCards" :tags="tags"
		:activeTag="activeTag" @update:activeTag="activeTag = $event"
		:showTagFilter="showTagFilter" v-model="localModelValue" />
</template>

<script lang="ts" setup>
import defaultConfigs from "./config";

const design = defineModel<number>("design", {
	default: 1,
});

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

const defaultConfig = computed(() => defaultConfigs[Language.value ?? "en"]);

const localModelValue = ref<Loop>({});
const modelValue = defineModel<Loop>();
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

const { cards, tags } = useLoop(localModelValue);

/** Nothing to render: manual mode without cards, or table mode without a table or demo. */
const isEmpty = computed(() => {
	const m = localModelValue.value;
	if (m.dataSourceMode === "manual") return (m.demo?.length ?? 0) === 0;
	return !m.table && (m.demo?.length ?? 0) === 0;
});

/** Active tag filter — null means "show all". */
const activeTag = ref<string | null>(null);

const showTagFilter = computed(
	() => localModelValue.value.showTagFilter !== false && tags.value.length > 1,
);

const filteredCards = computed(() =>
	activeTag.value
		? cards.value.filter((card) => card.tag === activeTag.value)
		: cards.value,
);

// Reset active tag when cards change (e.g. new table selected).
watch(cards, () => {
	activeTag.value = null;
});
</script>