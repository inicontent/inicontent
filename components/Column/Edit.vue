<template>
	<NTooltip :show="tooltipShow && !isEdit" @update:show="(show) => tooltipShow = show" :delay="500">
		<template #trigger>
			<NSpin :show="!!loading" size="small" style="min-height: 22px" :onClick
				:class="{ 'editable': !isEdit && !isArrayOfObjects(field.children) && !field.table }">
				<Column v-if="!isEdit" :field="field" :value="modelValue" />
				<Field v-else-if="isEdit" :field="inputField" v-model="inputValue" />
			</NSpin>
		</template>
		{{ t('clickToEdit') }}
	</NTooltip>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils";
import { NSpin, NTooltip } from "naive-ui";

const { field, loading, ...props } = defineProps<{
	field: Field;
	loading?: boolean;
	modelValue?: any;
}>();

const emit = defineEmits(["update:modelValue"]);

defineTranslation({
	ar: {
		clickToEdit: "اضغط للتعديل",
	},
});

const modelValue = computed({
	get: () => props.modelValue,
	set: (newValue) => emit("update:modelValue", newValue),
});

const tooltipShow = ref(false);

const inputValue = ref(modelValue.value);
const inputRef = ref();
const inputField = {
	...field,
	labelProps: { showLabel: false, showFeedback: false },
	inputProps: {
		show: true,
		round: true,
		ref: inputRef,
		onBlur: handleChange,
	},
};
const isEdit = ref(false);

function onClick() {
	if (isArrayOfObjects(field.children) || field.table) return;
	isEdit.value = true;
	nextTick(() => {
		if (inputRef.value) {
			if (inputRef.value.focusInput) return inputRef.value.focusInput();
			inputRef.value.focus();
		}
	});
}

function handleChange() {
	if (inputValue.value !== modelValue.value)
		modelValue.value = inputValue.value;
	isEdit.value = false;
	tooltipShow.value = false;
}

onMounted(() => {
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			isEdit.value = false;
			tooltipShow.value = false;
		}
	}

	window.addEventListener("keydown", handleKeydown);

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeydown);
	});
});
</script>

<style scoped>
.editable,
.editable * {
	cursor: context-menu !important;
}
</style>