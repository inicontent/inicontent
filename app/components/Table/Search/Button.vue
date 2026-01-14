<template>
    <NPopover style="max-height: 240px;" :style="`width: ${isMobile ? '100vw' : '500px'}`" placement="bottom-end"
        scrollable v-model:show="isSearchPopoverVisible" :x="isMobile ? 0 : undefined" :y="isMobile ? 180 : undefined"
        :show-arrow="!isMobile" trigger="manual">
        <template #trigger>
            <NTooltip :delay="1500">
                <template #trigger>
                    <NButton round :size="props.size" @click="isSearchPopoverVisible = !isSearchPopoverVisible"
                        :tertiary="isSearchPopoverVisible" :type="isSearchPopoverVisible ? 'primary' : undefined">
                        <template #icon>
                            <NIcon>
                                <Icon v-if="isSearchPopoverVisible" name="tabler:x" />
                                <Icon v-else name="tabler:search" />
                            </NIcon>
                        </template>
                    </NButton>
                </template>
                {{ t("search") }}
            </NTooltip>
        </template>
        <template #footer>
            <NFlex justify="space-between">
                <NTooltip :delay="500" placement="bottom">
                    <template #trigger>
                        <NPopover trigger="click" scrollable style="max-height: 300px;">
                            <template #trigger>
                                <NButton round type="success" size="small" secondary>
                                    <template #icon>
                                        <NIcon>
                                            <Icon name="tabler:bookmark" />
                                        </NIcon>
                                    </template>
                                </NButton>
                            </template>
                            <template #footer>
                                <NInputGroup style="width: 100%;">
                                    <NInput v-model:value="newFilterName" :placeholder="t('filterName')" size="small"
                                        round
                                        @keyup.enter="() => { saveFavoriteFilter(newFilterName); newFilterName = '' }" />
                                    <NButton round type="success" secondary size="small" :loading="false"
                                        :disabled="!newFilterName.trim()"
                                        @click="() => { saveFavoriteFilter(newFilterName); newFilterName = '' }">
                                        <template #icon>
                                            <NIcon>
                                                <Icon name="tabler:plus" />
                                            </NIcon>
                                        </template>
                                    </NButton>
                                </NInputGroup>
                            </template>
                            <NEmpty v-if="favoriteFilters.length === 0" size="small"
                                :description="t('noFavoriteFilters')" />
                            <NFlex v-else vertical size="small" style="padding: 0 8px;">
                                <NFlex justify="space-between" v-for="filter in favoriteFilters" :key="filter.id" block
                                    quaternary @click="loadFavoriteFilter(filter)" style="cursor: pointer;">
                                    <template #default>
                                        <NFlex justify="space-between" style="width: 100%;">
                                            <span>{{ filter.name }}</span>
                                            <NButton circle size="tiny" type="error" text
                                                @click.stop="deleteFavoriteFilter(filter.id)">
                                                <template #icon>
                                                    <NIcon>
                                                        <Icon name="tabler:trash" />
                                                    </NIcon>
                                                </template>
                                            </NButton>
                                        </NFlex>
                                    </template>
                                </NFlex>
                            </NFlex>
                        </NPopover>
                    </template>
                    {{ t("favoriteFilters") }}
                </NTooltip>

                <NButtonGroup>
                    <NButton round type="error" secondary size="small" :loading="Loading.data"
                        :disabled="props.disabled" @click="handleReset">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:x" />
                            </NIcon>
                        </template>
                        {{ t("reset") }}
                    </NButton>
                    <NButton round type="primary" secondary size="small" :loading="Loading.data"
                        :disabled="props.disabled" @click="handleSearch">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:search" />
                            </NIcon>
                        </template>
                        {{ t("search") }}
                    </NButton>
                </NButtonGroup>
            </NFlex>
        </template>
        <LazyTableSearch v-model="localSearchArray" :callback="handleSearch" v-model:schema="schema" />
    </NPopover>
</template>

<script setup lang="ts">
import Inison from "inison";
import {
	Icon,
	NButton,
	NButtonGroup,
	NIcon,
	NPopover,
	NTooltip,
	NFlex,
	LazyTableSearch,
	NEmpty,
	NInput,
	NInputGroup,
} from "#components";
import { deepClone } from "~/composables";
import { generateSearchString } from "~/composables/search";

const props = withDefaults(
	defineProps<{
		size?: "small" | "medium" | "large";
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	},
);

const schema = defineModel<Schema>("schema");

const searchString = defineModel<string | undefined>("string");
const searchArray = defineModel<searchType>("array", {
	default: () => reactive({ and: [[null, "=", null]] }),
});

const appConfig = useAppConfig();
const { isMobile } = useDevice();
const user = useState<User>("user");
const database = useState<Database>("database");
const table = useState<Table>("table");
const sessionID = useState<string>("sessionID");
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

const isSearchPopoverVisible = ref(false);
const newFilterName = ref("");

// Local working copy of search array
const localSearchArray = ref<searchType>({ and: [[null, "=", null]] });

// Watch for external changes to searchArray
watch(
	() => searchArray.value,
	(newVal) => {
		localSearchArray.value = newVal;
		emitSearchQuery(newVal);
	},
	{ deep: true, immediate: true },
);

// Convert searchArray back to string for emit
function emitSearchQuery(locSearchArray: searchType) {
	const searchInput = generateSearchString(locSearchArray, "display");
	searchArray.value = locSearchArray;
	searchString.value = searchInput ? Inison.stringify(searchInput) : undefined;
}

// Handle search button click
function handleSearch() {
	emitSearchQuery(localSearchArray.value);
}

// Handle reset button click
function handleReset() {
	const resetArray = { and: [[null, "=", null]] } as searchType;
	localSearchArray.value = resetArray;
	emitSearchQuery(resetArray);
}

// Get favorite filters for current table
const favoriteFilters = computed({
	get: () => {
		const filters = user.value?.config?.filters ?? {};
		return (filters as Record<string, any>)[table.value?.slug ?? ""] ?? [];
	},
	set: (v) => {
		updateFavoriteFilters(v);
	},
});

// Update favorite filters in user config
async function updateFavoriteFilters(filters: any[]) {
	if (!user.value || !table.value || !database.value) return;

	try {
		const allFilters = { ...(user.value?.config?.filters ?? {}) };
		allFilters[table.value.slug] = filters;
		const updatedUser = {
			...user.value,
			config: { ...(user.value.config ?? {}), filters: allFilters },
		};

		await $fetch(
			`${appConfig.apiBase}${database.value.slug}/users/${user.value.id}`,
			{
				method: "PUT",
				body: updatedUser,
				params: { [`${database.value.slug}_sid`]: sessionID.value },
				credentials: "include",
			},
		);
	} catch (err: any) {
		window.$message.error(err.message);
	}
}

// ==================== FAVORITE FILTERS LOGIC ====================

async function saveFavoriteFilter(filterName: string) {
	if (!filterName.trim()) {
		window.$message.error(t("filterNameCannotBeEmpty"));
		return;
	}

	if (favoriteFilters.value.some((f: any) => f.name === filterName)) {
		window.$message.error(t("filterNameAlreadyExists"));
		return;
	}

	const newFilter = {
		id: Date.now().toString(),
		name: filterName,
		searchArray: deepClone(localSearchArray.value),
		createdAt: new Date().toISOString(),
	};

	const updatedFilters = [...favoriteFilters.value, newFilter];
	favoriteFilters.value = updatedFilters;
	window.$message.success(t("filterSavedSuccessfully"));
}

function loadFavoriteFilter(filter: any) {
	const loadedArray = (deepClone(filter.searchArray) as searchType) ?? {
		and: [[null, "=", null]],
	};
	localSearchArray.value = loadedArray;
	emitSearchQuery(loadedArray);
	window.$message.success(`${t("filterLoaded")}: ${filter.name}`);
}

function deleteFavoriteFilter(filterId: string) {
	const updatedFilters = favoriteFilters.value.filter(
		(f: any) => f.id !== filterId,
	);
	favoriteFilters.value = updatedFilters;
	window.$message.success(t("filterDeletedSuccessfully"));
}
</script>
