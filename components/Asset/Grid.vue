<template>
    <LazyAssetDrawer v-if="CurrentAsset" v-model="CurrentAsset" />
    <NGrid v-if="modelValue && modelValue.length" :x-gap="12" :y-gap="12"
        cols="100:2 200:3 300:4 400:5 500:6 700:8 900:11">
        <template v-if="modelValue === undefined || Loading.AssetData" #default>
            <NGridItem v-for="(_) in [...Array(15).keys()]">
                <NSkeleton class="asset"></NSkeleton>
            </NGridItem>
        </template>
        <template v-else #default>
            <NGridItem
                v-for="(asset) in modelValue.toSorted((a, b) => a.type === b.type ? 0 : a.type === 'folder' ? -1 : 1)">
                <NFlex vertical class="assetContainer">
                    <NFlex class="assetActions">
                        <slot v-bind="asset"></slot>
                        <NDropdown v-if="table.allowedMethods?.includes('u') || table.allowedMethods?.includes('d')"
                            trigger="click" :options="dropdownOptions" @select="(key) => dropdownOnSelect(key, asset)">
                            <NIcon class="assetActionsButton">
                                <IconDots />
                            </NIcon>
                        </NDropdown>
                    </NFlex>
                    <NImage v-if="isImage(asset.publicURL)" class="asset" :src="`${asset.publicURL}?fit=100&q=1`"
                        preview-disabled :intersection-observer-options="{
                            root: `#${targetId}`
                        }" lazy :preview-src="asset.publicURL" @click="() => handleOnClickAsset(asset)" />
                    <NIcon v-else class="asset" @click="() => handleOnClickAsset(asset)">
                        <LazyAssetIcon :type="asset.type" class="icon" />
                    </NIcon>
                    <NPerformantEllipsis expand-trigger="click" :tooltip="false" line-clamp="1">{{ asset.name }}
                    </NPerformantEllipsis>
                </NFlex>
            </NGridItem>
        </template>
    </NGrid>
    <NEmpty v-else />
</template>

<script lang="ts" setup>
import { IconDots, IconPencil, IconTrash, IconUpload } from "@tabler/icons-vue";
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
} from "naive-ui";

const { path, isAssetRoute } = defineProps({
    targetId: {
        type: String,
        default: "container"
    },
    isAssetRoute: Boolean,
    path: {
        type: String,
        default: ""
    }
});
const emit = defineEmits(["update:path"])

useLanguage({
    ar: {
        theFollowingActionIsIrreversible: "الإجراء التالي لا رجعة فيه",
    },
    en: {},
});

const modelValue = defineModel({
    type: [Array, null] as PropType<Asset[] | null>,
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const table = useState<Table>("table");

async function deleteAsset(name: string) {
    Loading.value[`deleteAsset${name}`] = true;
    const data = await $fetch<apiResponse>(
        `${useRuntimeConfig().public.apiBase}${database.value.slug}/asset${path
        }/${name}`,
        {
            method: "DELETE",
        },
    ),
        singleAsset = modelValue.value?.find((asset) => asset.name === name);
    if (data?.result) {
        modelValue.value = modelValue.value?.filter((asset) => asset.name !== name);

        if (database.value.size) database.value.size -= singleAsset?.size ?? 0;
        window.$message.success(data?.message ?? t("success"));
    } else window.$message.error(data?.message ?? t("error"));
    Loading.value[`deleteAsset${name}`] = false;
}
const dropdownOptions = [
    {
        label: t("delete"),
        key: "delete",
        show: table.value.allowedMethods?.includes("d"),
        icon: () => h(NIcon, () => h(IconTrash))
    },
    {
        label: t("changeName"),
        key: "changeName",
        disabled: true,
        show: table.value.allowedMethods?.includes("u"),
        icon: () => h(NIcon, () => h(IconPencil))
    },
    {
        label: t("replace"),
        key: "replace",
        disabled: true,
        show: table.value.allowedMethods?.includes("u"),
        icon: () => h(NIcon, () => h(IconUpload))
    },
];

const dialog = useDialog();
function dropdownOnSelect(key: string, asset: Asset) {
    switch (key) {
        case "delete":
            {
                const d = dialog.info({
                    title: `${t("deleteAsset: ")} ${asset.name}`,
                    content: t("theFollowingActionIsIrreversible"),
                    positiveText: t("delete"),
                    async onPositiveClick() {
                        d.loading = true;
                        await deleteAsset(asset.name);
                        return true;
                    },
                });
            }
            break;
        default:
            break;
    }
}

const CurrentAsset = ref<Asset>()
function handleOnClickAsset(asset: Asset) {
    if (asset.type === "folder") {
        if (isAssetRoute)
            return navigateTo(
                `${path}/${asset.name}`,
            );
        return emit("update:path", `${path
            }/${asset.name}`);
    }
    CurrentAsset.value = asset;
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
