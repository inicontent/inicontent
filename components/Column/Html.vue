<template>
    <NButton circle @click="showModal = true" :disabled="!value || value.length < 8" size="small"
        @mouseover="buttonHovered = true" @mouseout="buttonHovered = false">
        <template #icon>
            <NIcon>
                <IconZoomIn v-if="buttonHovered" />
                <IconBracketsAngle v-else />
            </NIcon>
        </template>
    </NButton>
    <NModal v-model:show="showModal" preset="card">
        <div v-html="value?.replaceAll('<img ', '<img style=\'width:100%\'') || ''"></div>
    </NModal>
</template>

<script lang="ts" setup>
import { IconBracketsAngle, IconZoomIn } from "@tabler/icons-vue";
import { NButton, NIcon, NModal } from "naive-ui";

const { value } = defineProps<{ value?: string }>();
const showModal = ref(false);
const buttonHovered = ref(false);
</script>