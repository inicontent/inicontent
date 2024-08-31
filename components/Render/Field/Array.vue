<template>
    <LazyRenderField v-if="field.subType" :field="{
        ...field,
        type: field.subType,
        isArray: true,
    }" :path="path" v-model="modelValue" />
    <LazyRenderField v-else-if="!isArrayOfObjects(field.children)" :field="{
        ...field,
        type: field.children === 'table' ? 'table' : 'tags',
        isArray: true,
    }" :path="path" v-model="modelValue" />
    <NCollapse v-else-if="field.children.filter(
        (f: any) => f.type === 'array' && isArrayOfObjects(f.children),
    ).length" display-directive="show" style="margin: 0 0 20px;" arrow-placement="right"
        :trigger-areas="['main', 'arrow']" accordion>
        <template #arrow>
            <NIcon v-if="getProperty(
                modelValue,
                path,
                [],
            )?.length > 0">
                <IconChevronRight />
            </NIcon>
        </template>
        <NCollapseItem display-directive="show" :title="t(field.key)" :name="path" :disabled="getProperty(
            modelValue,
            path,
            [],
        )?.length === 0">
            <template #header-extra>
                <NButton size="small" round @click="handleAddNewItem">
                    <template #icon>
                        <NIcon>
                            <IconPlus />
                        </NIcon>
                    </template>
                </NButton>
            </template>
            <NCollapse display-directive="show" accordion>
                <NCollapseItem v-for="(_item, index) of getProperty(
                    modelValue,
                    path,
                    [],
                )" display-directive="show" :title="`${t(field.key)} ${index}`" :name="`${path}.${index}`">
                    <template #header-extra>
                        <NButton size="small" round type="error" quaternary :disabled="field.disabledItems?.includes(
                            index,
                        )" @click="() => deleteProperty(
                            modelValue,
                            `${path
                            }.${index}`
                        )">
                            <template #icon>
                                <NIcon>
                                    <IconTrash />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    <div style="padding-left: 10px">
                        <LazyRenderField v-for="child in field.children" :field="{
                            ...child,
                            ...(field.disabledItems
                                ? {
                                    inputProps: {
                                        disabled:
                                            field.disabledItems?.includes(
                                                index,
                                            ),
                                    },
                                }
                                : {}),
                        }" :path="`${path}.${index}.${child.key}`" v-model="modelValue" />
                    </div>
                </NCollapseItem>
            </NCollapse>
        </NCollapseItem>
    </NCollapse>
    <NCard v-else :title="t(field.key)" :bordered="false" content-style="padding-left: 0; padding-right: 0;"
        header-style="padding-top: 0; padding-left: 0; padding-right: 0;">
        <template #header-extra v-if="!field.disableActions">
            <NButton size="small" round @click="handleAddNewItem">
                <template #icon>
                    <NIcon>
                        <IconPlus />
                    </NIcon>
                </template>
            </NButton>
        </template>
        <NDataTable v-if="field.children" :columns="[
            ...field.children.map((child) => ({
                width: t(child.key) && child.key.length > 10 ? child.key.length * 15 : 200,
                title: () => [
                    t(child.key),
                    child.required
                        ? h(
                            NText,
                            {
                                type: 'error',
                            },
                            () => ' *',
                        )
                        : null,
                ],
                key: `${path}.${child.key}`,
                render: (_item: any, index: number) =>
                    h(LazyRenderField, {
                        field: {
                            ...child,
                            ...(field.disabledItems?.includes(index)
                                ? {
                                    inputProps: {
                                        disabled: true,
                                    },
                                }
                                : {}),
                            labelProps: {
                                style: {
                                    marginTop: '24px',
                                },
                                showLabel: false,
                            },
                            isArray: true,
                            isTable: true,
                        },
                        path: `${path}.${index}.${child.key}`,
                    }),
            })) as any,
            field.disableActions === true
                ? {}
                : {
                    title: t('actions'),
                    fixed: 'right',
                    align: 'center',
                    width: 100,
                    key: 'actions',
                    render(_row: any, index: number) {
                        return h(
                            NTooltip,
                            { delay: 500 },
                            {
                                trigger: () =>
                                    h(
                                        NButton,
                                        {
                                            disabled: field.disabledItems?.includes(index),
                                            strong: true,
                                            secondary: true,
                                            circle: true,
                                            type: 'error',
                                            onClick: () =>
                                                deleteProperty(modelValue, `${path}.${index}`),
                                        },
                                        {
                                            icon: () => h(NIcon, () => h(IconTrash)),
                                        },
                                    ),
                                default: () => t('delete'),
                            },
                        );
                    },
                },
        ]" :data="getProperty(
            modelValue, path, [])" :scroll-x="(field.children as Schema).reduce(
        (accumulator: number, child: any) => {
            return (
                accumulator +
                (t(child.key) && child.key.length > 10
                    ? child.key.length * 15
                    : 200)
            );
        },
        100,
    )" />
    </NCard>
</template>

<script setup lang="ts">
import {
    NIcon,
    NCollapse,
    NCollapseItem,
    NButton,
    NCard,
    NDataTable,
    NText,
    NTooltip,
} from "naive-ui";
import { isArrayOfObjects } from "inibase/utils";
import { IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-vue";
import { deleteProperty, getProperty, setProperty } from "inidot";
import { LazyRenderField } from "#components";

useLanguage({
    ar: {
        delete: "حذف",
        actions: "أوامر",
    },
    en: {},
});

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
    type: Object as PropType<any>,
    default: {},
});

function handleAddNewItem() {
    const currentFieldValue = getProperty(modelValue.value, path);
    if (currentFieldValue)
        if (Array.isArray(currentFieldValue))
            setProperty(
                modelValue.value,
                `${path}.${currentFieldValue.length}`,
                field.onCreate
                    ? field.onCreate instanceof Function
                        ? field.onCreate(currentFieldValue.length)
                        : field.onCreate
                    : {},
            );
        else
            setProperty(modelValue.value, `${path}`, [
                field.onCreate
                    ? field.onCreate instanceof Function
                        ? field.onCreate(0)
                        : field.onCreate
                    : {},
            ]);
    else
        setProperty(modelValue.value, `${path}`, [
            field.onCreate
                ? field.onCreate instanceof Function
                    ? field.onCreate(0)
                    : field.onCreate
                : {},
        ]);
}
</script>