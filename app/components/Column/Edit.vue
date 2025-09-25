<template>
	<NTooltip :show="tooltipShow && !isEdit && isEditable" @update:show="(show) => tooltipShow = show" :delay="1500">
		<template #trigger>
			<NSpin :show="!!loading" size="small" style="min-height: 22px" :onContextmenu
				:class="{ 'editable': !isEdit && isEditable }">
				<LazyColumn v-if="!isEdit" :field="field" :value="modelValue" />
				<Field v-else-if="isEdit" :field="inputField" v-model="inputValue" />
			</NSpin>
		</template>
		{{ t('rightClickToEdit') }}
	</NTooltip>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"

const { field, loading, ...props } = defineProps<{
	field: Field
	loading?: boolean
	modelValue?: any
}>()

const emit = defineEmits(["update:modelValue"])

const modelValue = computed({
	get: () => props.modelValue,
	set: (newValue) => emit("update:modelValue", newValue),
})

const isEditable = !isArrayOfObjects(field.children) && field.type !== "html"

defineTranslation({
	ar: {
		rightClickToEdit: "اضغط بزر الماوس الأيمن للتعديل",
	},
})

const tooltipShow = ref(false)

const inputValue = ref(modelValue.value)
const inputRef = ref()
const inputField = {
	...field,
	subType: field.subType
		? ["radio", "checkbox"].includes(field.subType)
			? "select"
			: field.subType
		: undefined,
	labelProps: { showLabel: false, showFeedback: false },
	inputProps: {
		show: true,
		round: true,
		ref: inputRef,
		onBlur: handleChange,
	},
}
const isEdit = ref(false)

function onContextmenu(e: MouseEvent | TouchEvent) {
	if (!isEditable) return

	e.preventDefault()

	isEdit.value = true

	setTimeout(() => {
		if (inputRef.value) {
			if (inputRef.value.focusInput) return inputRef.value.focusInput()
			inputRef.value.focus()
		}
	}, 100)
}

function handleChange() {
	if (inputValue.value !== modelValue.value) modelValue.value = inputValue.value
	isEdit.value = false
	tooltipShow.value = false
}
</script>

<style scoped>
.editable,
.editable * {
	cursor: context-menu !important;
}
</style>