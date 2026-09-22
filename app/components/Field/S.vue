<template>
	<NFlex>
		<template v-for="field of formatedSchema" :key="field.id ?? field.key">
			<Field
				v-if="!isComputedField(field)"
				:field="field"
				:item="modelValue"
				v-model="modelValue[field.key]"
			/>
			<NFormItem
				v-else
				:style="{ flex: '1 1 100%' }"
				:label="field.labelKey ? t(field.labelKey) : (field.label ?? t(field.key))"
			>
				<DataValue :field="field" :value="modelValue[field.key]" />
			</NFormItem>
		</template>
	</NFlex>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils";

function addIdToSchema(schema: Schema, startWithID = 0) {
	function _addIdToField(field: Field) {
		if (!field.id) {
			startWithID++;
			field.id = `temp-${startWithID}`;
		}

		if (
			(field.type === "array" || field.type === "object") &&
			isArrayOfObjects(field.children)
		)
			field.children = _addIdToSchema(field.children);
		return field;
	}
	const _addIdToSchema = (schema: Schema) => schema.map(_addIdToField);

	return _addIdToSchema(schema);
}

// TO-DO:
// Add fields: Mention, Range, Slider
const schema = defineModel<Schema>("schema");
const formatedSchema = computed(() =>
	schema.value?.length ? addIdToSchema(toRaw(schema.value)) : [],
);

const modelValue = defineModel<Record<string | number, any>>({
	default: () => reactive({}),
});
</script>