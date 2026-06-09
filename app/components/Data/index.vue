<template>
    <NListItem>
        <template #prefix>
            <NButton text>
                <strong>{{ t(field.key) }}:</strong>
            </NButton>
        </template>
        <DataValue :field :value />
    </NListItem>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: any }>()
</script>
