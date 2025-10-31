<template>
    <div class="flex flex-col" :size="0">
        <Data v-for="child in (field.children as Schema).filter(child => typeof value[child.key] !== 'undefined')"
            :field="child" :value="value[child.key]" />
    </div>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value: any }>()
</script>