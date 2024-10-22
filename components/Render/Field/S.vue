<template>
	<RenderField v-for="field of schema" :field="field" :schema="newSchema" v-model="modelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider

let { schema } = defineProps({
	schema: {
		type: Object as PropType<Schema>,
		default: [],
	},
})
let newSchema = schema
if (schema.every(({ id }) => !id))
	newSchema = addIdToSchema(schema)
const modelValue = defineModel({
	type: Object,
	default: () => reactive({}),
})
</script>