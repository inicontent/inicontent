<template>
	<LazyRenderField v-for="field of schema" :field="field" :schema="schema" v-model="modelValue" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider

let { schema } = defineProps({
	schema: {
		type: Object as PropType<Schema | never>,
		default: [],
	},
})
if (schema.every(({ id }) => !id))
	schema = addIdToSchema(schema)
const modelValue = defineModel({
	type: Object as PropType<any>,
	default: {},
})
</script>