<template>
    <div class="overflow-auto" v-if="!disableScroll" x-scrollable>
        <ul class="list" class="printable" hoverable :bordered="false">
            <Data v-for="field in schema.filter(field => typeof value[field.key] !== 'undefined')" :field
                :value="value[field.key]"></Data>
        </ul>
    </div>
    <ul class="list" v-else hoverable :bordered="false">
        <Data v-for="field in schema.filter(field => typeof value[field.key] !== 'undefined')" :field
            :value="value[field.key]"></Data>
    </ul>
</template>

<script lang="ts" setup>
const { schema, value, disableScroll } = defineProps<{ schema: Schema; value: Item; disableScroll?: boolean }>()
</script>
