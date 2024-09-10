<template>
	<LazyRenderColumn v-for="field of schema" :field="field" v-model="modelValue" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider

const { schema } = defineProps({
	schema: {
		type: Object as PropType<Schema | never>,
		default: [],
	},
})

const modelValue = defineModel({
	type: Object as PropType<any>,
	default: {},
})
</script>