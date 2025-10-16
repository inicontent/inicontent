<template>
	<template v-if="(modelValue && modelValue.length) || Loading.AssetData">
		<NDrawer v-model:show="showDrawer" :placement="Language === 'ar' ? 'left' : 'right'" class="assetDrawer">
			<NDrawerContent :native-scrollbar="false" v-if="CurrentAsset">
				<NFlex vertical>
					<NImage
						v-if="CurrentAsset?.type.startsWith('image/') || (CurrentAsset?.type === 'application/pdf' && CurrentAsset.publicURL.startsWith('https://cdn.inicontent.com/'))"
						class="asset"
						:src="`${CurrentAsset.publicURL}${CurrentAsset.type === 'application/pdf' ? '?raw' : ''}`"
						:preview-src="`${CurrentAsset.publicURL}${CurrentAsset.type === 'application/pdf' ? '?raw' : ''}`"
						:img-props="{ class: 'image' }"
						:renderToolbar="(props) => renderToolbar(props, CurrentAsset)" />
					<NIcon v-else class="asset">
						<NA :href="CurrentAsset.publicURL" target="_blank">
							<LazyAssetIcon :type="CurrentAsset.type" class="icon" />
						</NA>
					</NIcon>
					<div v-if="CurrentAsset.name">
						<NText strong>{{ t("name") }}: </NText>
						<NText>{{ CurrentAsset.name }}</NText>
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
		<NImageGroup>
			<NGrid :x-gap="12" :y-gap="12" cols="100:2 200:3 300:4 400:5 500:6 700:8 900:11">
				<template v-if="modelValue === undefined || Loading.AssetData" #default>
					<NGridItem v-for="(_) in [...Array(22).keys()]">
						<NSkeleton class="asset"></NSkeleton>
					</NGridItem>
				</template>
				<template v-else #default>
					<NGridItem v-for="(asset) in (modelValue as Asset[]).sort((a, b) => {
						if (a.type === 'dir' && b.type !== 'dir') return -1;
						if (a.type !== 'dir' && b.type === 'dir') return 1;
						return 0;
					})">
						<div @contextmenu="handleContextMenu($event, asset)">
							<NFlex vertical class="assetContainer">
								<NFlex class="assetActions">
									<slot :asset></slot>
								</NFlex>
								<NImage
									v-if="asset.type.startsWith('image/') || (asset.type === 'application/pdf' && asset.publicURL.startsWith('https://cdn.inicontent.com/'))"
									class="asset"
									:src="`${asset.publicURL}${asset.type === 'application/pdf' ? '?raw' : ''}`"
									:intersection-observer-options="{
										root: `#${targetID ?? 'container'}`
									}" lazy :preview-src="`${asset.publicURL}${asset.type === 'application/pdf' ? '?raw' : ''}`" />
								<NIcon v-else class="asset" @click="handleOnClickAsset($event, asset)">
									<LazyAssetIcon :type="asset.type" class="icon" />
								</NIcon>
								<NPerformantEllipsis expand-trigger="click" :tooltip="false" line-clamp="1">
									{{ asset.name }}
								</NPerformantEllipsis>
							</NFlex>
						</div>
					</NGridItem>
				</template>
			</NGrid>
		</NImageGroup>
		<NDropdown v-if="table?.allowedMethods?.includes('u') || table?.allowedMethods?.includes('d')"
			placement="bottom-start" trigger="manual" :x="x" :y="y" :show="showDropdown" :options="dropdownOptions"
			@clickoutside="dropdownOnClickOutside" @select="(key: string) => dropdownOnSelect(key)" />
	</template>
	<NEmpty v-else />
</template>

<script lang="ts" setup>
import type { ImageRenderToolbarProps } from "naive-ui"
import type { VNodeChild } from "vue"
import { Icon, NIcon } from "#components"

const path = defineModel<string>("path", {
	default: "",
})
const { isAssetRoute, table } = defineProps<{
	targetID?: string
	isAssetRoute?: boolean
	table: Table
}>()

const Language = useCookie<LanguagesType>("language", { sameSite: true })

defineTranslation({
	ar: {
		name: "الإسم",
		size: "الحجم",
		type: "النوع",
		link: "الرابط",
		rename: "تغيير الإسم",
		replace: "إستبدال",
	},
})

const modelValue = defineModel<Asset[] | null>()
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const database = useState<Database>("database")
const CurrentAsset = ref<Asset>()

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function deleteAsset(asset: Asset) {
	Loading.value[`deleteAsset${asset.id}`] = true
	const data = await $fetch<apiResponse>(
			`${appConfig.apiBase}${database.value.slug}/assets${path.value}/${asset.id}`,
			{
				method: "DELETE",
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		),
		singleAsset = modelValue.value?.find((value) => value.id === asset.id)
	if (data?.result) {
		modelValue.value = modelValue.value?.filter(
			(value) => value.id !== asset.id,
		)

		if (database.value.size) database.value.size -= singleAsset?.size ?? 0
		window.$message.success(data?.message ?? t("success"))
	} else window.$message.error(data?.message ?? t("error"))
	Loading.value[`deleteAsset${asset.id}`] = false
}
const dropdownOptions = [
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
]

function dropdownOnSelect(key: string) {
	switch (key) {
		case "delete":
			deleteAsset(CurrentAsset.value as Asset)
			showDropdown.value = false
			break
		default:
			break
	}
}

const showDrawer = ref(false)
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
async function handleContextMenu(e: MouseEvent, asset: Asset) {
	e.preventDefault()
	showDropdown.value = false
	await nextTick()
	CurrentAsset.value = asset
	showDropdown.value = true
	x.value = e.clientX + 8
	y.value = e.clientY + 8
}
function dropdownOnClickOutside(e: MouseEvent) {
	const isRightClick = e.button === 2
	if (!isRightClick) showDropdown.value = false
}
const route = useRoute()
async function handleOnClickAsset(e: MouseEvent, asset: Asset) {
	if (e.ctrlKey || e.metaKey) {
		e.preventDefault()
		window.open(asset.publicURL)
		return
	}
	if (asset.type === "dir") {
		if (isAssetRoute)
			return navigateTo(
				`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/assets${path.value}/${asset.name}`,
			)
		path.value += `/${asset.name}`
		return
	}
	CurrentAsset.value = asset
	showDrawer.value = true
}

const renderToolbar: (
	props: ImageRenderToolbarProps,
	file?: Asset,
) => VNodeChild = (
	{
		nodes: {
			rotateCounterclockwise,
			rotateClockwise,
			resizeToOriginalSize,
			zoomOut,
			zoomIn,
			download,
			close,
		},
	},
	file?: Asset,
) => {
	if (download.props && file?.publicURL)
		download.props.onClick = (event: MouseEvent) => {
			event?.preventDefault()
			window.open(file.publicURL as string, "_blank")
			close?.props?.onClick?.()
		}
	return [
		rotateCounterclockwise,
		rotateClockwise,
		zoomIn,
		zoomOut,
		resizeToOriginalSize,
		download,
		close,
	]
}
</script>