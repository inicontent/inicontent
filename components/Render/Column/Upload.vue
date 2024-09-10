<template>
    <NImageGroup>
        <NFlex :wrap="false">
            <template v-for="singleValue in ([] as string[]).concat(value)" #default>
                <NImage v-if="isImage(singleValue)" lazy
                    :src="singleValue.includes('inicontent.') ? `${singleValue}?fit=32` : singleValue"
                    :preview-src="singleValue" :width="32" />
                <a v-else :href="singleValue" target="_blank">
                    <NIcon>
                        <IconFileUpload />
                    </NIcon>
                </a>
            </template>
        </NFlex>
    </NImageGroup>
</template>

<script lang="ts" setup>
import { IconFileUpload } from "@tabler/icons-vue";
import { NIcon, NImageGroup, NImage, NFlex } from "naive-ui";

defineProps({
    value: {
        type: [String, Array] as PropType<string | string[]>,
        required: true
    }
})

function isImage(singleValue: string) {
    return ["png", "jpg", "jpeg", "ico", "webp", "svg", "gif"].includes(
        singleValue.split(".").pop() as string,
    );
}
</script>