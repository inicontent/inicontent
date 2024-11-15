<template>
    <NImageGroup>
        <NFlex :wrap="false">
            <template v-for="singleValue in ([] as Asset[]).concat(value)" #default>
                <NImage v-if="singleValue.type.startsWith('image/')" lazy :src="`${singleValue.publicURL}?fit=32`"
                    :preview-src="singleValue.publicURL" :width="32" />
                <NA v-else :href="singleValue.publicURL" target="_blank">
                    <NIcon>
                        <IconFileUpload />
                    </NIcon>
                </NA>
            </template>
        </NFlex>
    </NImageGroup>
</template>

<script lang="ts" setup>
import { IconFileUpload } from "@tabler/icons-vue";
import { NIcon, NImageGroup, NImage, NFlex, NA } from "naive-ui";

defineProps<{ value: Asset | Asset[] }>()
</script>