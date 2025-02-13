<template>
    <NCollapse :triggerAreas="['main', 'arrow']" accordion default-expanded-names="0">
        <NCollapseItem v-for="(items, condition, index) in modeValue" :key="condition" :name="index.toString()"
            :title="t(`${condition}Group`)">
            <template #header-extra>
                <NButtonGroup>
                    <NDropdown :options="conditionDropdownOptions" style="max-height: 200px;" scrollable
                        @select="(value: 'and' | 'or') => modeValue[condition]?.push({ [value]: [[null, '=', null]] })">
                        <NButton round type="primary" secondary @click="modeValue[condition]?.push([null, '=', null])"
                            circle size="small">
                            <template #icon>
                                <NIcon>
                                    <IconPlus />
                                </NIcon>
                            </template>
                        </NButton>
                    </NDropdown>

                    <NTooltip :delay="500">
                        <template #trigger>
                            <NButton round type="info" secondary @click="() => toggleCondition(condition)" circle
                                size="small">
                                <template #icon>
                                    <NIcon>
                                        <IconSwitchHorizontal />
                                    </NIcon>
                                </template>
                            </NButton>
                        </template>
                        {{ t(
                            `convertTo_"${condition === "and" ? "or" : "and"}"_group`,
                        ) }}
                    </NTooltip>
                    <NButton round type="error" secondary @click="delete modeValue[condition]" circle size="small">
                        <template #icon>
                            <NIcon>
                                <IconTrash />
                            </NIcon>
                        </template>
                    </NButton>
                </NButtonGroup>
            </template>
            <NFlex v-if="items" item-style="width: 100%">
                <template v-for="(item, index) in formatItems(items)">
                    <NInputGroup v-if="Array.isArray(item)">
                        <NSelect size="small" :consistent-menu-width="false" tag filterable :value="item[0]"
                            @update:value="(v) => item[0] = v"
                            :options="generateSearchInOptions(
                                table.schema, formatItems(items).toSpliced(index, 1).filter((_item => Array.isArray(_item) && _item[0])).map(([value1]) => value1))"
                            :style="`width:${item[3] ? 33.33 : 100}%`" />
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
                        <NButton :disabled="items.length === 1" @click="modeValue[condition]?.splice(index, 1)" circle
                            size="small">
                            <template #icon>
                                <NIcon>
                                    <IconMinus />
                                </NIcon>
                            </template>
                        </NButton>
                    </NInputGroup>
                    <LazyTableSearch v-else v-model="(modeValue[condition] as any)[index]" :callback />
                </template>
            </NFlex>
        </NCollapseItem>
    </NCollapse>
</template>

<script lang="ts" setup>
import {
	IconPlus,
	IconTrash,
	IconSwitchHorizontal,
	IconMinus,
	IconArrowMerge,
	IconArrowFork,
} from "@tabler/icons-vue";
import {
	getField as getFieldFromSchema,
	isArrayOfObjects,
	isObject,
} from "inibase/utils";
import {
	NButton,
	NTooltip,
	NCollapse,
	NCollapseItem,
	NDropdown,
	NFlex,
	NIcon,
	NInputGroup,
	NSelect,
	NButtonGroup,
} from "naive-ui";

defineTranslation({
	ar: {
		andGroup: "مجموعة و",
		orGroup: "مجموعة أو",
	},
});

const { callback } = defineProps<{ callback: CallableFunction }>();

type searchArrayValueItem =
	| [string | null, string, any]
	| [string | null, string, any, any];
type searchArrayValue = (searchArrayValueItem | searchArray)[];
type searchArray = {
	and?: searchArrayValue;
	or?: searchArrayValue;
};
const modeValue = defineModel<searchArray>({
	default: { and: [[null, "=", null]] },
});

const table = useState<Table>("table");

const conditionDropdownOptions = [
	{
		key: "and",
		label: t("andGroup"),
		icon: () => h(NIcon, () => h(IconArrowMerge)),
	},
	{
		key: "or",
		label: t("orGroup"),
		icon: () => h(NIcon, () => h(IconArrowFork)),
	},
];
function toggleCondition(oldCondition: "and" | "or") {
	modeValue.value[oldCondition === "and" ? "or" : "and"] =
		modeValue.value[oldCondition];
	delete modeValue.value[oldCondition];
}

function formatItems(items: searchArrayValue) {
	return items.map((item) => {
		if (Array.isArray(item) && item[0])
			item[3] = getFieldFromSchema(item[0], table.value.schema as any);
		return item;
	});
}
function getFieldFromItem(item: searchArrayValueItem) {
	return {
		...item[3],
		subType: ["radio", "checkbox"].includes(item[3].subType)
			? "select"
			: item[3].subType,
		required: false,
		labelProps: {
			showLabel: false,
			style: "margin-top: -3px;width:33.33%",
			showFeedback: false,
		},
		inputProps: {
			size: "small",
			onKeydown: ({ key }: KeyboardEvent) => {
				if (key === "Enter") callback();
			},
		},
	};
}
function getAvailableComparisonOperator(field: Field): {
	label: string;
	value: string;
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
			].includes(value);

		if (checkFieldType(field.type, ["number", "date"]))
			return ["=", "!=", ">", ">=", "<", "<="].includes(value);
		if (
			checkFieldType(field.type, "array") ||
			checkFieldType(field.type, "table")
		)
			return ![">", ">=", "<", "<="].includes(value);
		return ![">", ">=", "<", "<=", "[]", "![]"].includes(value);
	});
}
</script>
