<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NSelect :value="selectValue" @update:value="onUpdateSelectValue" :options remote clearable filterable
            :loading="Loading[`options_${field.key}`]" :multiple="!!field.isArray" :consistent-menu-width="false"
            max-tag-count="responsive" :onFocus :onSearch v-bind="field.inputProps
                ? typeof field.inputProps === 'function'
                    ? field.inputProps(modelValue) ?? {}
                    : field.inputProps
                : {}" />
        <template #label>
            <NFlex v-if="field.description" align="center" :size="0">
                {{ t(field.key) }}
                <NTooltip>
                    <template #trigger>
                        <NButton circle text size="tiny">
                            <template #icon>
                                <NIcon>
                                    <IconQuestionMark />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ field.description }}
                </NTooltip>
            </NFlex>
            <template v-else>{{ t(field.key) }}</template>
        </template>
    </NFormItem>
</template>

<script lang="ts" setup>
import Inison from "inison";
import {
    NFormItem,
    NSelect,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<Item | Item[]>();

const selectValue = computed<undefined | string | string[]>(() => modelValue.value
    ? (field.isArray && Array.isArray(modelValue.value)
        ? modelValue.value.map(
            ({ id }) => id as string,
        )
        : (modelValue.value as Item).id as string)
    : undefined)

const rule = {
    type: !field.isArray ? "string" : "array",
    required: field.required,
    min: field.isArray ? field.min : undefined,
    validator(_: any, value: string | string[]) {
        if (!value || (Array.isArray(value) && value.length === 0))
            return field.required
                ? new Error(`${t(field.key)} ${t("isRequired")}`)
                : true;
        if (Array.isArray(value) && field.min && value.length < field.min)
            return new Error(`${t(field.key)} ${t("isNotValid")}`);
    },
};
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const table = database.value.tables?.find(({ slug }) => slug === field.table);

type tableOption = {
    label: string;
    value: string;
    raw: Item;
}

const options = ref<tableOption[]>();
function singleOption(option: Item): tableOption {
    return ({
        label: renderLabel(
            table?.label,
            table?.schema,
            option,
        ),
        value: option.id as string,
        raw: option
    })
}
function onUpdateSelectValue(_id: string | string[], option: tableOption | tableOption[]) {
    modelValue.value = Array.isArray(option) ? option.map(({ raw }) => raw) : option.raw
    if (modelValue.value.length === options.value?.length)
        options.value = options.value?.filter(({ value }) => Array.isArray(_id) ? _id.includes(value) : _id === value)
}
async function loadOptions(searchValue?: string | number) {
    Loading.value[`options_${field.key}`] = true;
    const data =
        (
            await $fetch<apiResponse<Item[]>>(
                `${appConfig.apiBase}${database.value.slug}/${field.table}`,
                searchValue
                    ? {
                        params: {
                            where: Inison.stringify({
                                or:
                                    field.searchIn?.reduce((result, searchKey) => {
                                        Object.assign(result, {
                                            [searchKey]: `*%${searchValue}%`,
                                        });
                                        return result;
                                    }, {}) ?? "",
                            }),
                        },
                    }
                    : undefined,
            )
        ).result?.map(singleOption) ?? [];
    if (modelValue.value) {
        const currentSelectedOptions = (options.value ?? []).filter(({ value }) => selectValue.value?.includes(value))
        options.value = [
            ...currentSelectedOptions,
            ...data.filter(({ value }) => !selectValue.value?.includes(value)),
        ];
    } else options.value = data;
    Loading.value[`options_${field.key}`] = false;
}

async function onFocus() {
    if (options.value) {
        if (field.isArray) {
            if (!modelValue.value || options.value.length !== modelValue.value.length)
                return;
        } else if (options.value.length > 1) return;
    }
    await loadOptions();
}

async function onSearch(query: string) {
    if (query.length > 1) await loadOptions(query);
}

if (modelValue.value)
    options.value = ([] as Item[])
        .concat(modelValue.value)
        .map(singleOption);
</script>
