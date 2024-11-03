<template>
    <NFormItem :label="t(field.key)" :rule :path="field.id" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(modelValue) ?? {}
            : field.labelProps
        : {})">
        <NSelect :value="value" @update:value="(value) => modelValue = value" :options remote clearable filterable
            :loading="Loading[`options_${field.key}`]" :multiple="!!field.isArray" :consistent-menu-width="false"
            max-tag-count="responsive" @focus="onFocus" @search="onSearch" />
    </NFormItem>
</template>

<script lang="ts" setup>
import { isArrayOfObjects, isObject } from "inibase/utils";
import Inison from "inison";
import {
    NFormItem,
    NSelect,
    type SelectOption,
} from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<Item | Item[]>();

const value: any = computed(() => modelValue.value
    ? (field.isArray
        ? isArrayOfObjects(modelValue.value)
            ? modelValue.value.map(
                ({ id }) => id,
            )
            : modelValue
        : isObject(modelValue.value)
            ? (modelValue.value as Item).id
            : modelValue.value)
    : null)

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
const options = ref<SelectOption[]>();

const singleOption = (option: any) => ({
    label: renderLabel(
        table?.label,
        table?.schema,
        option,
    ),
    value: option.id
});
async function loadOptions(searchValue?: string | number) {
    Loading.value[`options_${field.key}`] = true;
    const data =
        (
            await $fetch<apiResponse>(
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
    if (modelValue.value)
        options.value = [
            ...(options.value ?? []).slice(
                0,
                field.isArray ? modelValue.value.length : 1,
            ),
            ...data,
        ];
    else options.value = data;
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

if (modelValue.value) {
    if (
        (Array.isArray(modelValue.value) &&
            modelValue.value.every(isObject)) ||
        isObject(modelValue.value)
    )
        options.value = ([] as Item[])
            .concat(modelValue.value)
            .map(singleOption);
    else
        options.value =
            (
                await $fetch<apiResponse>(
                    `${appConfig.apiBase}${useRuntimeConfig().public.databaseName || "inicontent"
                    }/${field.table}`,
                    {
                        params: {
                            where: Inison.stringify({
                                id: `[]${[]
                                    .concat(modelValue.value)
                                    .join(",")}`,
                            }),
                        },
                    },
                )
            ).result?.map(singleOption) ?? [];
}
</script>
