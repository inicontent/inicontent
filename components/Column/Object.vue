<template>
    <NPopover scrollable style="max-height: 240px;max-width: 200px;" trigger="click">
        <template #trigger>
            <NButton size="small" circle>{{ `\{${Object.keys(value).length}\}` }}</NButton>
        </template>
        <NFlex vertical>
            <NFlex v-for="child in (field.children as Schema).filter(({ key }) => typeof value[key] !== 'undefined')"
                align="center" inline>
                <strong>{{ child.key }}:</strong>
                <Column :field="child" :value="value[child.key]" />
            </NFlex>
        </NFlex>
    </NPopover>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value?: any }>()
</script>