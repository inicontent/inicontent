<template>
	<RenderField v-for="field of schema" :field="field" :schema="newSchema" v-model="modelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider

const { schema } = defineProps<{ schema?: Schema }>()

let newSchema = schema ?? []
if (newSchema.every(({ id }) => !id))
	newSchema = addIdToSchema(newSchema)

const modelValue = defineModel({
	type: Object,
	default: () => reactive({}),
})
</script>