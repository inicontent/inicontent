<template>
	<template v-if="(modelValue && modelValue.length) || Loading.AssetData">
		<NDrawer v-model:show="showDrawer" :placement="Language === 'ar' ? 'left' : 'right'" class="assetDrawer">
			<NDrawerContent :native-scrollbar="false" v-if="CurrentAsset">
				<NFlex vertical>
					<LazyAssetThumb :asset="CurrentAsset" container-selector=".assetDrawer"
						@click="handleOnClickAsset($event, CurrentAsset)" />

					<div v-if="CurrentAsset.name">
						<NText strong>{{ t("name") }}: </NText>
						<NText>{{ CurrentAsset.name }}{{ CurrentAsset.extension ? `.${CurrentAsset.extension}` : '' }}
						</NText>
					</div>
					<div>
						<NText strong>{{ t("size") }}: </NText>
						<NText>{{ humanFileSize(CurrentAsset.size) }}</NText>
					</div>
					<div>
						<NText strong>{{ t("type") }}: </NText>
						<NText>{{ CurrentAsset.type }}</NText>
					</div>
					<div>
						<NText strong>{{ t("link") }}: </NText>
						<NA :href="CurrentAsset.publicURL" target="_blank">{{ decodeURIComponent(CurrentAsset.publicURL)
						}}
						</NA>
					</div>
					<div>
						<NText strong>{{ t("createdAt") }}: </NText>
						<NTime :time="CurrentAsset.createdAt" />
					</div>
				</NFlex>
			</NDrawerContent>
		</NDrawer>
		<NGrid :x-gap="12" :y-gap="12" cols="100:2 200:3 300:4 400:5 500:6 700:8 900:10">
				<template v-if="Loading.AssetData" #default>
					<NGridItem v-for="(_) in [...Array(22).keys()]">
						<NSkeleton class="asset"></NSkeleton>
					</NGridItem>
				</template>
				<template v-else #default>
					<NGridItem v-for="asset in sortedAssets">
						<div @contextmenu="handleContextMenu($event, asset)">
							<NFlex vertical class="assetContainer">
								<NFlex class="assetActions">
									<slot :asset></slot>
								</NFlex>
								<div class="previewOverlay">
									<div v-if="['pdf', ...imageExtensions, ...videoExtensions].includes(asset.extension)"
										class="fileType">
										<LazyAssetIcon :type="asset.type" />
									</div>
									<div v-if="isVideoAsset(asset)" class="assetIndicator">
										<NIcon :size="18">
											<Icon name="tabler:player-play-filled" />
										</NIcon>
									</div>
									<div v-else-if="isOpenInNewTabAsset(asset)" class="assetIndicator">
										<NIcon :size="17">
											<Icon name="tabler:external-link" />
										</NIcon>
									</div>
									<LazyAssetThumb :asset="asset" :container-selector="`#${targetID ?? 'container'}`"
										@click="handleOnClickAsset($event, asset)" :hide-tooltip="true"
										:preview-disabled="true" :disable-default-click-action="true" />
								</div>
								<span>
									<NPerformantEllipsis style="max-width:calc(100% - 29px)">{{ asset.name }}</NPerformantEllipsis>{{ asset.extension ? `.${asset.extension}` : '' }}
								</span>
							</NFlex>
						</div>
					</NGridItem>
				</template>
		</NGrid>
		<NDropdown v-if="table?.allowedMethods?.includes('u') || table?.allowedMethods?.includes('d')"
			placement="bottom-start" trigger="manual" :x="x" :y="y" :show="showDropdown" :options="dropdownOptions"
			@clickoutside="dropdownOnClickOutside" @select="(key: string) => dropdownOnSelect(key)" />
	</template>
	<NEmpty v-else />
</template>

<script lang="ts" setup>
import { Icon, NIcon } from "#components";
import { imageExtensions, officeExtensions, videoExtensions } from "~/composables";
import { useAssetPreview } from "~/composables/useAssetPreview";

const path = defineModel<string>("path");
const { isAssetRoute, table } = defineProps<{
	targetID?: string;
	isAssetRoute?: boolean;
	table: Table;
}>();

const Language = useCookie<LanguagesType>("language", { sameSite: true });

const modelValue = defineModel<Asset[]>();
const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const CurrentAsset = ref<Asset>();
const { openPreview } = useAssetPreview();

const sessionID = useSessionCookie();

async function deleteAsset(asset: Asset) {
	Loading.value[`deleteAsset${asset.id}`] = true;
	const data = await $fetch<apiResponse>(
		`${config.public.apiBase}${database.value.slug}/assets${path.value}/${asset.type === "dir" ? asset.name : asset.id}`,
		{
			method: "DELETE",
			params: {
				locale: Language.value,
				[`${database.value.slug}_sid`]: sessionID.value,
			},
			credentials: "include",
		},
	),
		singleAsset = modelValue.value?.find((value) => value.id === asset.id);
	if (data?.result) {
		modelValue.value = modelValue.value?.filter(
			(value) => value.id !== asset.id,
		);

		if (database.value.size) database.value.size -= singleAsset?.size ?? 0;
		window.$message.success(data?.message ?? t("success"));
	} else window.$message.error(data?.message ?? t("error"));
	Loading.value[`deleteAsset${asset.id}`] = false;
}
const dropdownOptions = computed(() => [
	{
		label: t("info"),
		key: "info",
		show:
			!!CurrentAsset.value?.type &&
			(imageExtensions.includes(CurrentAsset.value.extension) ||
				videoExtensions.includes(CurrentAsset.value.extension) ||
				CurrentAsset.value.extension === "pdf"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:info-square-rounded" })),
	},
	{
		label: t("delete"),
		key: "delete",
		show: table?.allowedMethods?.includes("d"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
	},
	{
		label: t("rename"),
		key: "rename",
		disabled: true,
		show:
			table?.allowedMethods?.includes("u") &&
			CurrentAsset.value?.type === "dir",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:pencil" })),
	},
	{
		label: t("replace"),
		key: "replace",
		disabled: true,
		show: table?.allowedMethods?.includes("u"),
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:upload" })),
	},
]);

function dropdownOnSelect(key: string) {
	switch (key) {
		case "delete":
			deleteAsset(CurrentAsset.value as Asset);
			showDropdown.value = false;
			break;
		case "info":
			showDrawer.value = true;
			showDropdown.value = false;
			break;
		default:
			break;
	}
}

const showDrawer = ref(false);
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
async function handleContextMenu(e: MouseEvent, asset: Asset) {
	e.preventDefault();
	showDropdown.value = false;
	await nextTick();
	CurrentAsset.value = asset;
	showDropdown.value = true;
	x.value = e.clientX + 8;
	y.value = e.clientY + 8;
}
function dropdownOnClickOutside(e: MouseEvent) {
	const isRightClick = e.button === 2;
	if (!isRightClick) showDropdown.value = false;
}
const route = useRoute();
const sortedAssets = computed(() =>
	((modelValue.value ?? []) as Asset[]).slice().sort((a, b) => {
		if (a.type === "dir" && b.type !== "dir") return -1;
		if (a.type !== "dir" && b.type === "dir") return 1;
		return 0;
	}),
);

function isVideoAsset(asset: Asset) {
	return asset.type !== "dir" && videoExtensions.includes(asset.extension);
}

function isOpenInNewTabAsset(asset: Asset) {
	if (asset.type === "dir") return false;
	if (asset.extension === "pdf") return true;
	if (!officeExtensions.includes(asset.extension)) return false;
	return !["docx", "xlsx"].includes(asset.extension);
}

async function handleOnClickAsset(_e: MouseEvent, asset: Asset) {
	if (asset.type === "dir") {
		if (isAssetRoute)
			return navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${path.value}/${asset.name}`,
			);
		path.value += `/${asset.name}`;
		return;
	}

	openPreview(asset, { assets: sortedAssets.value });
}
</script>

<style scoped>
.previewOverlay {
	position: relative;
}

.assetIndicator {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 34px;
	height: 34px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: color-mix(in srgb, var(--n-color) 72%, #000 28%);
	border: 1px solid color-mix(in srgb, var(--n-text-color) 20%, transparent);
	color: var(--n-text-color);
	pointer-events: none;
	z-index: 2;
	backdrop-filter: blur(2px);
}
</style>