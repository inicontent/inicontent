<template>
    <UPopover scrollable style="max-height: 240px;max-width: 200px;" trigger="click">
        <template #trigger>
            <UButton size="small" circle>{{ `\{${Object.keys(value).length}\}` }}</UButton>
        </template>
        <div class="flex flex-col">
            <div class="flex" v-for="child in (field.children as Schema).filter(({ key }) => typeof value[key] !== 'undefined')"
                align="center" inline>
                <strong>{{ t(child.key) }}:</strong>
                <LazyColumn :field="child" :value="value[child.key]" />
            </div>
        </div>
    </UPopover>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value?: any }>()
</script>