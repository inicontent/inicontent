<template>
	<Field v-for="field of formatedSchema" :field="field" v-model="localModelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema");
const formatedSchema = computed(() =>
	schema.value?.length ? addIdToSchema(schema.value) : [],
);

const modelValue = defineModel<Record<string | number, any>>();
const localModelValue = ref<Record<string | number, any>>(
	modelValue.value ? toRaw(modelValue.value) : {},
);
watch(
	localModelValue,
	(v) => {
		modelValue.value = v;
	},
	{ deep: true },
);
</script>