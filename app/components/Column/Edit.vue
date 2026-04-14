<template>
	<NTooltip :show="tooltipShow && !isEdit && isEditable" @update:show="(show) => tooltipShow = show" :delay="1500"
		placement="bottom">
		<template #trigger>
			<NSpin
				:show="!!loadingRef"
				size="small"
				style="min-height: 22px"
				:onContextmenu="onContextmenu"
				:onTouchstart="handleTouchStart"
				:onTouchend="clearLongPress"
				:onTouchcancel="clearLongPress"
				:onTouchmove="clearLongPress"
				:class="{ 'editable': !isEdit && isEditable }"
			>
				<LazyColumn v-if="!isEdit || isModalEdit" :field="fieldRef" :value="currentValue" />
				<Field v-else-if="isEdit" :field="inputField" v-model="inputValue" />
			</NSpin>
		</template>
		{{ editHint }}
	</NTooltip>

	<NModal
		v-if="isModalEdit"
		:show="isEdit"
		preset="card"
		:style="modalStyle"
		:title="modalTitle"
		@update:show="(show) => (!show ? handleChange() : undefined)"
	>
		<Field :field="inputField" v-model="inputValue" />
		<template #footer>
			<NFlex justify="end">
				<NButton secondary @click="cancelEdit">{{ t('cancel') }}</NButton>
				<NButton type="primary" @click="handleChange">{{ t('save') }}</NButton>
			</NFlex>
		</template>
	</NModal>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"

const props = defineProps<{
	field: Field
	loading?: boolean
	modelValue?: unknown
	editKey?: string
	itemLabel?: string
}>()

const fieldRef = toRef(props, "field")
const loadingRef = toRef(props, "loading")
const editKeyRef = toRef(props, "editKey")

const emit = defineEmits(["update:modelValue"])

const currentValue = computed({
	get: () => props.modelValue,
	set: (newValue) => emit("update:modelValue", newValue),
})

const isEditable = computed(
	() => !isArrayOfObjects(fieldRef.value.children),
)
const isAssetField = computed(
	() => fieldRef.value.type === "asset" || fieldRef.value.table === "assets",
)
const isModalEdit = computed(
	() => fieldRef.value.type === "html" || isAssetField.value,
)

const tooltipShow = ref(false)
const isTouchDevice = ref(false)
const longPressTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const editHint = computed(() =>
	t(isTouchDevice.value ? "pressAndHoldToEdit" : "rightClickToEdit"),
)
const modalTitle = computed(() => {
	const titleParts = [t(fieldRef.value.key)]
	if (props.itemLabel && props.itemLabel !== "--") titleParts.push(props.itemLabel)
	return titleParts.join(" - ")
})
const modalStyle = computed(() => ({
	width: isAssetField.value ? "min(1200px, 96vw)" : "min(1000px, 95vw)",
}))

const inputValue = ref(currentValue.value)
const inputRef = ref()
const inputField = computed(() => ({
	...fieldRef.value,
	subType: fieldRef.value.subType
		? ["radio", "checkbox"].includes(fieldRef.value.subType)
			? "select"
			: fieldRef.value.subType
		: undefined,
	labelProps: { showLabel: false, showFeedback: false },
	inputProps: {
		show: true,
		round: true,
		ref: inputRef,
		onBlur: isModalEdit.value ? undefined : handleChange,
	},
}))
const isEdit = ref(false)
const instance = getCurrentInstance()
const activeEditKey = useState<string | null>("activeTableEditKey", () => null)
const editorKey = computed(
	() =>
		editKeyRef.value ??
		`${fieldRef.value.id ?? fieldRef.value.key ?? "field"}-${instance?.uid ?? 0}`,
)

watch(
	() => props.modelValue,
	(value) => {
		if (!isEdit.value) inputValue.value = value
	},
)

watch(activeEditKey, (newKey) => {
	if (isEdit.value && newKey !== editorKey.value) handleChange()
})

onMounted(() => {
	isTouchDevice.value =
		"ontouchstart" in window || navigator.maxTouchPoints > 0
	document.addEventListener("keydown", handleKeydown)
})

function clearLongPress() {
	if (longPressTimeout.value) {
		clearTimeout(longPressTimeout.value)
		longPressTimeout.value = null
	}
}

function startEdit() {
	inputValue.value = currentValue.value
	activeEditKey.value = editorKey.value
	isEdit.value = true

	if (isModalEdit.value) return

	setTimeout(() => {
		if (inputRef.value) {
			if (inputRef.value.focusInput) return inputRef.value.focusInput()
			inputRef.value.focus()
		}
	}, 100)
}

function onContextmenu(e: MouseEvent | TouchEvent) {
	if (!isEditable.value || isEdit.value) return

	e.preventDefault()
	e.stopPropagation()
	clearLongPress()
	startEdit()
}

function handleTouchStart(e: TouchEvent) {
	if (!isTouchDevice.value || !isEditable.value || isEdit.value) return

	clearLongPress()
	longPressTimeout.value = window.setTimeout(() => {
		onContextmenu(e)
	}, 450)
}

onBeforeUnmount(() => {
	clearLongPress()
	document.removeEventListener("keydown", handleKeydown)
	if (activeEditKey.value === editorKey.value) activeEditKey.value = null
})

function finishEdit(save = true) {
	clearLongPress()
	if (save && inputValue.value !== currentValue.value)
		currentValue.value = inputValue.value
	else inputValue.value = currentValue.value
	isEdit.value = false
	tooltipShow.value = false
	if (activeEditKey.value === editorKey.value) activeEditKey.value = null
}

function handleKeydown(e: KeyboardEvent) {
	if (
		!isEdit.value ||
		!((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "s" || e.key === "س"))
	)
		return

	e.preventDefault()
	handleChange()
}

function cancelEdit() {
	finishEdit(false)
}

function handleChange() {
	finishEdit(true)
}
</script>

<style scoped>
.editable,
.editable * {
	cursor: context-menu !important;
	touch-action: manipulation;
	-webkit-touch-callout: none;
}
</style>