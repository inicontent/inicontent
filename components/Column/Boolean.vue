<template>
    <NIconWrapper :color="value === true ? 'green' : 'red'" :border-radius="50" :size="18">
        <NIcon :size="16">
            <IconCheck v-if="value === true" />
            <IconX v-else />
        </NIcon>
    </NIconWrapper>
</template>

<script lang="ts" setup>
import { IconCheck, IconX } from "@tabler/icons-vue";
import { NIcon, NIconWrapper } from "naive-ui";

const { value } = defineProps<{ value?: boolean }>();
</script>