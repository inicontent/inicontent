<template>
	<Field v-if="schema?.length" v-for="field of addIdToSchema(schema)" :field="field"
		v-model="localVModelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema");

const modelValue = defineModel<Record<string | number, any>>();

const localVModelValue = ref<Record<string | number, any>>(
	toRaw(modelValue.value ?? {}),
);
watch(
	localVModelValue,
	(v) => {
		modelValue.value = v;
	},
	{ deep: true },
);
</script>