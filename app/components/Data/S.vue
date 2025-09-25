<template>
    <NScrollbar v-if="!disableScroll" x-scrollable>
        <NList class="printable" hoverable :bordered="false">
            <Data v-for="field in schema.filter(field => typeof value[field.key] !== 'undefined')" :field
                :value="value[field.key]"></Data>
        </NList>
    </NScrollbar>
    <NList v-else hoverable :bordered="false">
        <Data v-for="field in schema.filter(field => typeof value[field.key] !== 'undefined')" :field
            :value="value[field.key]"></Data>
    </NList>
</template>

<script lang="ts" setup>
const { schema, value, disableScroll } = defineProps<{ schema: Schema; value: Item; disableScroll: boolean }>()
</script>
