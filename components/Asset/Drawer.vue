<template>
    <NDrawer show @update:show="$emit('update:modelValue', undefined)" :placement="Language === 'ar' ? 'left' : 'right'"
        class="assetDrawer">
        <NDrawerContent :native-scrollbar="false" closable v-if="modelValue">
            <template #header>
                {{ modelValue?.name }}
            </template>
            <NFlex vertical>
                <NImage v-if="isImage(modelValue?.publicURL)" class="asset" :src="`${modelValue.publicURL}?fit=200&q=1`"
                    :preview-src="modelValue.publicURL" :img-props="{ class: 'image' }" />
                <NIcon v-else class="asset">
                    <a :href="modelValue.publicURL" target="_blank">
                        <LazyAssetIcon :type="modelValue.type" class="icon" />
                    </a>
                </NIcon>
                <div>
                    <NText strong>{{ t("name") }}: </NText>
                    <NText>{{ modelValue.name }}</NText>
                </div>
                <div>
                    <NText strong>{{ t("size") }}: </NText>
                    <NText>{{ humanFileSize(modelValue.size) }}</NText>
                </div>
                <div>
                    <NText strong>{{ t("type") }}: </NText>
                    <NText>{{ modelValue.type }}</NText>
                </div>
                <div>
                    <NText strong>{{ t("link") }}: </NText>
                    <NA :href="modelValue.publicURL" target="_blank">{{ decodeURIComponent(modelValue.publicURL) }}</NA>
                </div>
                <div>
                    <NText strong>{{ t("createdAt") }}: </NText>
                    <NTime :time="modelValue.createdAt" />
                </div>
            </NFlex>
        </NDrawerContent>
    </NDrawer>
</template>

<script lang="ts" setup>
import { NA, NDrawer, NDrawerContent, NFlex, NIcon, NImage, NText, NTime } from 'naive-ui';

const modelValue = defineModel({
    type: Object as PropType<Asset>
});
const Language = useCookie("Language")

useLanguage({
    ar: {
        name: "الإسم",
        size: "الحجم",
        type: "النوع",
        link: "الرابط",
        createdAt: "تاريخ الرفع",
    },
    en: {},
});

</script>