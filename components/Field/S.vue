<template>
	<Field v-for="field of addIdToSchema(schema)" :field="field" v-model="localVModelValue[field.key]" />
</template>

<script lang="ts" setup>
// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema", { default: () => reactive([]) });

const localVModelValue = ref<Record<string | number, any>>({})
watch(localVModelValue, (v) => { modelValue.value = v }, { deep: true })

const modelValue = defineModel<Record<string | number, any>>();
</script>