<template>
	<NFlex item-style="width: 100%">
		<template v-for="(item, index) in formatedItems">
			<NInputGroup v-if="Array.isArray(item)">
				<NCascader size="small" :consistent-menu-width="false" filterable :value="item[0]"
					@update:value="(v) => item[0] = v"
					:options="generateSearchInOptions(
						table.schema, formatedItems?.toSpliced(index, 1).filter((_item => Array.isArray(_item) && _item[0])).map(([value1]) => value1))"
					:style="`width:${item[3] ? 33.33 : 100}%`" check-strategy="child" />
				<template v-if="item[3]">
					<NCascader size="small" filterable check-strategy="child" :value="item[1]"
						@update:value="(v) => updateOperator(item, v)"
						:options="getAvailableComparisonOperator(item[3])" style="width:33.33%" />
					<template v-if="isRelativeOperator(item[1])">
						<NAutoComplete size="small" style="width:33.33%" :value="item[2] ?? ''"
							:placeholder="t('relativePlaceholder')" :options="getRelativeAutocompleteOptions(item[2])"
							:fallback-option="createRelativeFallback"
							@update:value="(v) => updateRelativeValue(item, v)" @keydown.enter.prevent="callback()" />
					</template>
					<Field v-else :model-value="item[2]" @update:modelValue="(v) => updateFieldValue(item, v)"
						:field="getFieldFromItem(item)" />
				</template>
				<NButton :disabled="formatedItems?.length === 1" @click="modelValue?.splice(index, 1)" circle
					size="small">
					<template #icon>
						<NIcon>
							<Icon name="tabler:minus" />
						</NIcon>
					</template>
				</NButton>
			</NInputGroup>
			<LazyTableSearch v-else v-model="(modelValue[index] as searchType)" :callback />
		</template>
	</NFlex>
</template>

<script lang="ts" setup>
import {
	getField as getFieldFromSchema,
	isArrayOfObjects,
	isObject,
} from "inibase/utils"
import { Icon } from "#components"

defineTranslation({
	en: {
		relativeGroup: "Relative",
		relativePlaceholder: "e.g. 3 days ago",
	},
	ar: {
		relativeGroup: "نسبي",
		relativePlaceholder: "مثال: قبل 3 أيام",
	},
})

const { callback } = defineProps<{ callback: CallableFunction }>()

const modelValue = defineModel<searchTypeValue>({
	default: [[null, "=", null]],
})

type OperatorOption = {
	label?: string
	value?: string
	children?: OperatorOption[]
	type?: string
	key?: string
}

const relativeBaseSuggestionValues = [
	"current",
	"now",
	"today",
	"yesterday",
	"tomorrow",
	"this week",
	"last week",
	"last month",
	"last year",
]

const relativeBaseAutocompleteOptions = relativeBaseSuggestionValues.map(
	(value) => ({
		label: value,
		value,
	}),
)

const formatedItems = computed(() =>
	modelValue.value?.map((item) => {
		if (Array.isArray(item) && item[0])
			item[3] = getFieldFromSchema(item[0], table.value.schema as any)
		return item
	}),
)
const table = useState<Table>("table")

function getFieldFromItem(item: searchTypeValueItem) {
	return {
		...item[3],
		subType: ["radio", "checkbox"].includes(item[3].subType)
			? "select"
			: item[3].subType,
		required: false,
		labelProps: {
			showLabel: false,
			style: "width:33.33%",
			showFeedback: false,
		},
		inputProps: {
			size: "small",
			onKeydown: ({ key }: KeyboardEvent) => {
				if (key === "Enter") callback()
			},
		},
	}
}

function getAvailableComparisonOperator(field: Field) {
	const baseOptions = comparisonOperatorOptions() as OperatorOption[]
	const selectableOptions = baseOptions.filter((option) => {
		const optionValue = option.value
		if (!optionValue) return false

		if (Array.isArray(field.type))
			return [
				"=",
				"!=",
				...(field.type.some((type: string) =>
					["string", "email", "url"].includes(type),
				)
					? ["*", "!*"]
					: []),
				...(field.type.some((type: string) => ["number", "date"].includes(type))
					? [">", ">=", "<", "<="]
					: []),
			].includes(optionValue)

		if (checkFieldType(field.type, ["number", "date"]))
			return ["=", "!=", ">", ">=", "<", "<="].includes(optionValue)
		if (
			checkFieldType(field.type, "array") ||
			checkFieldType(field.type, "table")
		)
			return ![">", ">=", "<", "<="].includes(optionValue)
		return ![">", ">=", "<", "<=", "[]", "![]"].includes(optionValue)
	})

	if (checkFieldType(field.type, "date")) {
		const relativeCandidates = selectableOptions.filter(
			(option) =>
				option.value &&
				["=", "!=", ">", ">=", "<", "<="].includes(option.value),
		)
		if (relativeCandidates.length)
			return [
				{
					value: "relative",
					label: t("relativeGroup"),
					children: relativeCandidates.map((option) => ({
						label: option.label ?? option.value ?? "",
						value: `r${option.value as string}`,
					})),
				},
				...selectableOptions,
			]
	}

	return selectableOptions
}

function updateOperator(item: searchTypeValueItem, value: string | null) {
	if (value === null) {
		item[1] = "="
		item[2] = undefined
		return
	}
	if (item[1] !== value) item[2] = undefined
	item[1] = value
}

function isRelativeOperator(value: string | undefined) {
	return typeof value === "string" && value.startsWith("r")
}

function getRelativeAutocompleteOptions(value: unknown) {
	const input = typeof value === "string" ? value.trim() : ""
	const numericPattern = /^[+-]?\d+$/
	if (numericPattern.test(input)) {
		const parsed = Number.parseInt(input, 10)
		if (!Number.isFinite(parsed)) return relativeBaseAutocompleteOptions
		const absolute = Math.abs(parsed)
		if (absolute === 0) return relativeBaseAutocompleteOptions
		const units = [
			{ singular: "day", plural: "days" },
			{ singular: "week", plural: "weeks" },
			{ singular: "month", plural: "months" },
			{ singular: "year", plural: "years" },
		]
		const numberText = absolute.toString()
		const seen = new Set<string>()
		const options: { label: string; value: string }[] = []
		const addOption = (label: string) => {
			const normalized = label.trim()
			if (!normalized) return
			const key = normalized.toLowerCase()
			if (seen.has(key)) return
			seen.add(key)
			options.push({ label: normalized, value: normalized })
		}
		for (const { singular, plural } of units) {
			const unitText = absolute === 1 ? singular : plural
			const baseLabel = `${numberText} ${unitText}`
			addOption(`${baseLabel} ago`)
			addOption(`in ${baseLabel}`)
		}
		return options
	}
	return relativeBaseAutocompleteOptions
}

function createRelativeFallback(value: string) {
	return { label: value, value }
}

function updateRelativeValue(
	item: searchTypeValueItem,
	value: string | null,
) {
	const sanitized = value?.trim()
	item[2] = sanitized ? sanitized : undefined
}

function updateFieldValue(item: searchTypeValueItem, value: any) {
	if (value !== undefined) {
		if (isObject(value) && Object.hasOwn(value, "id"))
			value = value.id
		else if (
			isArrayOfObjects(value) &&
			value.every((_v: any) => Object.hasOwn(_v, "id"))
		)
			value = value.map((_value: any) => _value.id)
		item[2] = Array.isArray(value) ? value.join(",") : value
	} else item[2] = undefined
}
</script>
