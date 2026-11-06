<template>
    <NIcon>
        <Icon :name="`tabler:${value}`" />
    </NIcon>
</template>

<script setup lang="ts">
import { Icon } from "#components";

const { value } = defineProps<{ value: `tabler:${string}` }>()
</script>