<template>
    <NFormItem :label="t(field.key)" :path="path" :rule="rule" v-bind="(field.labelProps
        ? typeof field.labelProps === 'function'
            ? field.labelProps(getProperty(modelValue, path)) ?? {}
            : field.labelProps
        : {})">
        <NSelect :value="hasProperty(modelValue, path)
            ? field.isArray
                ? isArrayOfObjects(getProperty(modelValue, path))
                    ? getProperty(modelValue, path).map(
                        ({ id }: Item) => id,
                    )
                    : getProperty(modelValue, path)
                : isObject(getProperty(modelValue, path))
                    ? getProperty(modelValue, path).id
                    : getProperty(modelValue, path)
            : null" @update:value="(value) => setProperty(modelValue, path, value)" :options="options" remote clearable
            filterable :loading="Loading[`options_${field.key}`]" :multiple="!!field.isArray"
            :consistent-menu-width="false" max-tag-count="responsive" @focus="onFocus" @search="onSearch"
            :render-label="renderSelectLabel" :render-tag="renderSelectTag" />
    </NFormItem>
</template>

<script lang="ts" setup>
import { isArrayOfObjects, isObject } from "inibase/utils";
import { getProperty, hasProperty, setProperty } from "inidot";
import Inison from "inison";
import {
    NAvatar,
    NFormItem,
    NSelect,
    NTag,
    type SelectOption,
} from "naive-ui";

const { field, path } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
});

const modelValue = defineModel({
    type: [Object, Array] as PropType<Item | Item[]>,
    default: {},
});

const rule = {
    type: !field.isArray ? "string" : "array",
    required: field.required,
    trigger: "change",
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

const Language = useCookie("Language");
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
    value: option.id,
    image: field.image
        ? Array.isArray(getProperty(option, field.image))
            ? getProperty(option, `${field.image}[0]`)
            : getProperty(option, field.image)
        : null,
});
async function loadOptions(searchValue?: string | number) {
    Loading.value[`options_${field.key}`] = true;
    const data =
        (
            await $fetch<apiResponse>(
                `${useRuntimeConfig().public.apiBase}${database.value.slug}/${field.table}`,
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
    if (getProperty(modelValue.value, path))
        options.value = [
            ...(options.value as any).slice(
                0,
                field.isArray ? getProperty(modelValue.value, path).length : 1,
            ),
            ...data,
        ];
    else options.value = data;
    Loading.value[`options_${field.key}`] = false;
}

async function onFocus() {
    if (options.value) {
        if (field.isArray) {
            if (options.value.length !== getProperty(modelValue.value, path).length)
                return;
        } else if (options.value.length > 1) return;
    }
    await loadOptions();
}

async function onSearch(query: string) {
    if (query.length > 1) await loadOptions(query);
}
const renderSelectLabel = field.image
    ? (option: any) =>
        h(
            "div",
            {
                style: {
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                },
            },
            [
                h(NAvatar, {
                    src: []
                        .concat(option.image)
                        .map((link: string) =>
                            link.includes("inicontent") &&
                                [
                                    "png",
                                    "jpg",
                                    "jpeg",
                                    "ico",
                                    "webp",
                                    "svg",
                                    "gif",
                                ].includes(link?.split(".")?.pop() ?? "")
                                ? `${link}?fit=80`
                                : link,
                        )[0],
                    round: true,
                    size: "large",
                    style:
                        Language.value === "ar"
                            ? {
                                marginLeft: "12px",
                            }
                            : {
                                marginRight: "12px",
                            },
                }),
                option.label,
            ],
        )
    : undefined
const renderSelectTag = field.image
    ? ({
        option,
        handleClose,
    }: {
        option: any;
        handleClose: () => void;
    }) =>
        !field.isArray
            ? h(
                "div",
                {
                    style: {
                        display: "flex",
                        alignItems: "center",
                    },
                },
                () => [
                    h(NAvatar, {
                        src: ([] as string[])
                            .concat(option.image)
                            .map((link) =>
                                link.includes("inicontent") &&
                                    [
                                        "png",
                                        "jpg",
                                        "jpeg",
                                        "ico",
                                        "webp",
                                        "svg",
                                        "gif",
                                    ].includes(link?.split(".")?.pop() ?? "")
                                    ? `${link}?fit=24`
                                    : link,
                            )[0],
                        round: true,
                        size: 24,
                        style:
                            Language.value === "ar"
                                ? {
                                    marginLeft: "12px",
                                }
                                : {
                                    marginRight: "12px",
                                },
                    }),
                    option.label,
                ],
            )
            : h(
                NTag,
                {
                    style: {
                        padding: "0 6px 0 4px",
                    },
                    round: true,
                    closable: true,
                    onClose: (e) => {
                        e.stopPropagation();
                        handleClose();
                    },
                },
                {
                    default: () =>
                        h(
                            "div",
                            {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                },
                            },
                            () => [
                                h(NAvatar, {
                                    src: []
                                        .concat(option.image as any)
                                        .map((link: string) =>
                                            link.includes("inicontent") &&
                                                [
                                                    "png",
                                                    "jpg",
                                                    "jpeg",
                                                    "ico",
                                                    "webp",
                                                    "svg",
                                                    "gif",
                                                ].includes(link?.split(".")?.pop() ?? "")
                                                ? `${link}?fit=22`
                                                : link,
                                        )[0],
                                    round: true,
                                    size: 22,
                                    style:
                                        Language.value === "ar"
                                            ? {
                                                marginLeft: "4px",
                                            }
                                            : {
                                                marginRight: "4px",
                                            },
                                }),
                                option.label,
                            ],
                        ),
                },
            )
    : undefined;

if (hasProperty(modelValue.value, path)) {
    if (
        (Array.isArray(getProperty(modelValue.value, path)) &&
            getProperty(modelValue.value, path).every(isObject)) ||
        isObject(getProperty(modelValue.value, path))
    )
        options.value = []
            .concat(getProperty(modelValue.value, path))
            .map(singleOption);
    else
        options.value =
            (
                await $fetch<apiResponse>(
                    `${useRuntimeConfig().public.apiBase}${useRuntimeConfig().public.databaseName ?? "inicontent"
                    }/${field.table}`,
                    {
                        params: {
                            where: Inison.stringify({
                                id: `[]${[]
                                    .concat(getProperty(modelValue.value, path))
                                    .join(",")}`,
                            }),
                        },
                    },
                )
            ).result?.map(singleOption) ?? [];
}
</script>
