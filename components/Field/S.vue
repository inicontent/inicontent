<template>
	<Field v-for="field of formatedSchema" :field="field" v-model="localVModelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema");
const formatedSchema = computed(() =>
	schema.value?.length ? addIdToSchema(schema.value) : [],
);

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