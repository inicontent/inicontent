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
				<!-- Computed values are engine-owned and read-only. While editing we
				     show the value the next save will store, evaluated in the browser;
				     anything that cannot be evaluated locally falls back to the stored
				     value so the form never blanks or errors mid-edit. -->
				<DataValue :field="field" :value="displayValue(field)" />
			</NFormItem>
		</template>
	</NFlex>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils";

import { COMPUTED_PREVIEW_KEY } from "~/composables/useComputedPreview";

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

const props = defineProps<{
	/** Table slug — required to resolve link hops while previewing. */
	table?: string;
	/** Index of this element inside its array-of-objects column. */
	elementIndex?: number;
	/** Key of the array-of-objects column this element belongs to. */
	arrayKey?: string;
}>();

const {
	preview,
	compute,
	displayValue: computedDisplay,
} = useComputedPreview();

/**
 * A computed child of an array column renders inside
 * `components/Field/Array.vue`, which hands this component one *element* as
 * `modelValue`. But compiled expressions address field ids from the whole
 * schema, so an element cannot be evaluated on its own — the nested set reads
 * the row-level preview instead of recomputing. The top-level set (the one
 * `components/Form/index.vue` renders) owns the preview and publishes it.
 */
const injected = inject<ComputedPreviewContext | null>(
	COMPUTED_PREVIEW_KEY,
	null,
);
const isRowOwner = !injected;

// Re-publish the owner's context unchanged so a deeper level never shadows it
// with a preview that was never computed.
provide(
	COMPUTED_PREVIEW_KEY,
	injected ??
		({
			preview,
			displayValue: (field: Field, elementIndex?: number) => {
				// Computed children carry one preview entry per array element.
				if (Array.isArray(preview.value[field.key]))
					return elementIndex === undefined
						? undefined
						: preview.value[field.key][elementIndex];
				return computedDisplay(field, toRaw(modelValue.value));
			},
		} satisfies ComputedPreviewContext),
);

/** The value to show for a field: local preview, else the stored value. */
function displayValue(field: Field) {
	if (isRowOwner) return computedDisplay(field, toRaw(modelValue.value));
	// Inside an array-of-objects column: the row-level preview, by position.
	const value = preview.value[field.key];
	if (Array.isArray(value)) return value[props.elementIndex as number];
	return value === undefined || value === null
		? modelValue.value?.[field.key]
		: value;
}

let computeSequence = 0;
async function refreshComputed() {
	// Only the row owner evaluates: a nested set holds a schema fragment and a
	// single element, which the compiled (whole-schema) ASTs cannot address.
	if (!isRowOwner || !props.table) return;
	const requestSequence = ++computeSequence;
	// `modelValue` is a reactive proxy; the evaluator works on a plain copy and
	// never writes back, so a computed result can never be mistaken for user
	// input or leak into a create/update body.
	await compute(toRaw(schema.value), toRaw(modelValue.value), props.table);
	// A newer edit already started; its result is the one that counts.
	if (requestSequence !== computeSequence) return;
}

watch([modelValue, schema], refreshComputed, { deep: true, immediate: true });
</script>
