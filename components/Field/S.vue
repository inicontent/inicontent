<template>
	<Field v-for="field of newSchema" :field="field" v-model="modelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const { schema } = defineProps<{ schema?: Schema }>();

let newSchema = schema ?? [];
if (newSchema.every(({ id }) => !id)) newSchema = addIdToSchema(newSchema);

const modelValue = defineModel<Record<string | number, any>>({
	default: () => reactive({}),
});
</script>