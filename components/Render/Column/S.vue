<template>
	<RenderColumn v-for="field of schema" :field="field" v-model="modelValue" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider

const { schema } = defineProps<{ schema?: Schema }>()

const modelValue = defineModel({
	default: {},
})
</script>