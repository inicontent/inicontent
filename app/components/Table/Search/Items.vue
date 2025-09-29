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
					<NSelect size="small" :consistent-menu-width="false" tag filterable :value="item[1]"
						@update:value="(v) => item[1] = v" :options="getAvailableComparisonOperator(item[3])"
						style="width:33.33%" />
					<Field :model-value="item[2]" @update:modelValue="(v) => {
						if (v !== undefined) {
							if (isObject(v) && Object.hasOwn(v, 'id'))
								v = v.id
							else if (isArrayOfObjects(v) && v.every(_v => Object.hasOwn(_v, 'id')))
								v = v.map(({ id }) => id);
							item[2] = Array.isArray(v) ? v.join(',') : v;
						} else item[2] = undefined
					}" :field="getFieldFromItem(item)" />
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

const { callback } = defineProps<{ callback: CallableFunction }>()

const modelValue = defineModel<searchTypeValue>({
	default: [[null, "=", null]],
})

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
function getAvailableComparisonOperator(field: Field): {
	label: string
	value: string
}[] {
	return comparisonOperatorOptions().filter(({ value }) => {
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
			].includes(value)

		if (checkFieldType(field.type, ["number", "date"]))
			return ["=", "!=", ">", ">=", "<", "<="].includes(value)
		if (
			checkFieldType(field.type, "array") ||
			checkFieldType(field.type, "table")
		)
			return ![">", ">=", "<", "<="].includes(value)
		return ![">", ">=", "<", "<=", "[]", "![]"].includes(value)
	})
}
</script>
