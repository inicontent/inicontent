<template>
    <NIconWrapper :color="value === true ? 'green' : 'red'" :border-radius="50" :size="18">
        <NIcon :size="16">
            <DataIcon value="check" v-if="value === true" />
            <DataIcon value="x" v-else />
        </NIcon>
    </NIconWrapper>
</template>

<script lang="ts" setup>
import { NIcon, NIconWrapper } from 'naive-ui';

const { value } = defineProps<{ value?: boolean }>()
</script>