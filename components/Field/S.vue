<template>
	<Field v-for="field of addIdToSchema(schema ?? [])" :field="field" v-model="modelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema");

const modelValue = defineModel<Record<string | number, any>>({
	default: () => reactive({}),
});
</script>