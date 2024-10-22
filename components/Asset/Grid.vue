<template>
    <template v-if="(modelValue && modelValue.length) || Loading.AssetData">
        <NDrawer v-model:show="showDrawer" :placement="Language === 'ar' ? 'left' : 'right'" class="assetDrawer">
            <NDrawerContent :native-scrollbar="false" v-if="CurrentAsset">
                <NFlex vertical>
                    <NImage v-if="CurrentAsset?.type.startsWith('image/')" class="asset"
                        :src="`${CurrentAsset.publicURL}?fit=200&q=1`" :preview-src="CurrentAsset.publicURL"
                        :img-props="{ class: 'image' }" />
                    <NIcon v-else class="asset">
                        <NA :href="CurrentAsset.publicURL" target="_blank">
                            <LazyAssetIcon :type="CurrentAsset.type" class="icon" />
                        </NA>
                    </NIcon>
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
        <NGrid :x-gap="12" :y-gap="12" cols="100:2 200:3 300:4 400:5 500:6 700:8 900:11">
            <template v-if="modelValue === undefined || Loading.AssetData" #default>
                <NGridItem v-for="(_) in [...Array(22).keys()]">
                    <NSkeleton class="asset"></NSkeleton>
                </NGridItem>
            </template>
            <template v-else #default>
                <NGridItem
                    v-for="(asset) in (modelValue as Asset[]).toSorted((a, b) => a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1)">
                    <div @contextmenu="handleContextMenu($event, asset)">
                        <NFlex vertical class="assetContainer">
                            <NFlex class="assetActions">
                                <slot :asset></slot>
                            </NFlex>
                            <NImage v-if="asset.type.startsWith('image/')" class="asset"
                                :src="`${asset.publicURL}?fit=100&q=1`" preview-disabled :intersection-observer-options="{
                                    root: `#${targetId}`
                                }" lazy :preview-src="asset.publicURL" @click="handleOnClickAsset($event, asset)" />
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
        <NDropdown v-if="table.allowedMethods?.includes('u') || table.allowedMethods?.includes('d')"
            placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :show="showDropdown"
            :options="dropdownOptions" @clickoutside="dropdownOnClickOutside"
            @select="(key: string) => dropdownOnSelect(key)" />
    </template>
    <NEmpty v-else />
</template>

<script lang="ts" setup>
import { IconPencil, IconTrash, IconUpload } from "@tabler/icons-vue";
import {
    NDropdown,
    NFlex,
    NGrid,
    NGridItem,
    NIcon,
    NImage,
    NSkeleton,
    NPerformantEllipsis,
    useDialog,
    NEmpty,
    NA, NDrawer, NDrawerContent, NText, NTime
} from "naive-ui";

const { path, isAssetRoute, table } = defineProps({
    targetId: {
        type: String,
        default: "container"
    },
    isAssetRoute: Boolean,
    path: {
        type: String,
        default: ""
    },
    table: {
        type: Object as PropType<Table>,
        required: true
    }
});
const emit = defineEmits(["update:path"])

const Language = useCookie("Language")

useLanguage({
    ar: {
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
        name: "الإسم",
        size: "الحجم",
        type: "النوع",
        link: "الرابط",
        createdAt: "تاريخ الرفع",
    },
    en: {},
});

const modelValue = defineModel({
    type: [Array, null] as PropType<Asset[] | null>,
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const CurrentAsset = ref<Asset>()

async function deleteAsset(asset: Asset) {
    Loading.value[`deleteAsset${asset.id}`] = true;
    const data = await $fetch<apiResponse>(
        `${useRuntimeConfig().public.apiBase}${database.value.slug}/asset${path
        }/${asset.id}`,
        {
            method: "DELETE",
        },
    ),
        singleAsset = modelValue.value?.find((value) => value.id === asset.id);
    if (data?.result) {
        modelValue.value = modelValue.value?.filter((value) => value.id !== asset.id);

        if (database.value.size) database.value.size -= singleAsset?.size ?? 0;
        window.$message.success(data?.message ?? t("success"));
    } else window.$message.error(data?.message ?? t("error"));
    Loading.value[`deleteAsset${asset.id}`] = false;
}
const dropdownOptions = [
    {
        label: t("delete"),
        key: "delete",
        show: table.allowedMethods?.includes("d"),
        icon: () => h(NIcon, () => h(IconTrash))
    },
    {
        label: t("rename"),
        key: "rename",
        disabled: true,
        show: table.allowedMethods?.includes("u") && CurrentAsset.value?.type === 'dir',
        icon: () => h(NIcon, () => h(IconPencil))
    },
    {
        label: t("replace"),
        key: "replace",
        disabled: true,
        show: table.allowedMethods?.includes("u"),
        icon: () => h(NIcon, () => h(IconUpload))
    },
];

const dialog = useDialog();
function dropdownOnSelect(key: string) {
    switch (key) {
        case "delete":
            {
                const d = dialog.create({
                    showIcon: false,
                    title: `${t("deleteAsset")}: ${(CurrentAsset.value as Asset).id}`,
                    content: t("theFollowingActionIsIrreversible"),
                    positiveText: t("delete"),
                    async onPositiveClick() {
                        d.loading = true;
                        await deleteAsset((CurrentAsset.value as Asset));
                        return true;
                    },
                });
            }
            break;
        default:
            break;
    }
}

const showDrawer = ref(false)
const showDropdown = ref(false)
const xRef = ref(0)
const yRef = ref(0)
function handleContextMenu(e: MouseEvent, asset: Asset) {
    e.preventDefault()
    showDropdown.value = false
    nextTick().then(() => {
        CurrentAsset.value = asset
        showDropdown.value = true
        xRef.value = e.clientX + 8
        yRef.value = e.clientY + 8
    })
}
function dropdownOnClickOutside(e: MouseEvent) {
    const isRightClick = e.button === 2
    if (!isRightClick)
        showDropdown.value = false
}
function handleOnClickAsset(e: MouseEvent, asset: Asset) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        window.open(asset.publicURL)
        return;
    }
    if (asset.type === "folder") {
        if (isAssetRoute)
            return navigateTo(
                `${path}/${asset.name}`,
            );
        return emit("update:path", `${path
            }/${asset.name}`);
    }
    CurrentAsset.value = asset;
    showDrawer.value = true
}
const ThemeConfig = useState<ThemeConfig>("ThemeConfig")
</script>


<style lang="css">
.assetContainer {
    position: relative;
    border-radius: 15px 15px 0 0;
    overflow: hidden;
}

.assetActions {
    position: absolute;
    top: 5px;
    z-index: 9;
    right: 5px;
}

.rtl .assetActions {
    right: unset;
    left: 5px;
}

.asset,
.assetActionsButton {
    cursor: pointer;
}

.assetActionsButton {
    background: v-bind('ThemeConfig.primaryColor');
    padding: 4px;
    border-radius: 50%;
    box-shadow: 0 0 8px #00000035;
}

.asset,
.asset img,
.asset .icon {
    width: 100%;
    height: 100px;
    border-radius: 15px;
}

.assetDrawer .asset,
.assetDrawer .asset img,
.assetDrawer .asset .icon {
    height: 200px;
}

.dark .asset {
    background: rgb(179 179 179 / 10%);
}

.light .asset {
    background: rgb(0 0 0 / 5%);
}

.asset:hover {
    opacity: .8;
}

.asset .icon {
    color: v-bind('ThemeConfig.primaryColor')
}
</style>
