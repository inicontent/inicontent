<template>
    <LazyRenderField v-if="field.subType" :field="{
        ...field,
        type: field.subType,
        isArray: true,
    }" v-model="modelValue" />
    <LazyRenderField v-else-if="!isArrayOfObjects(field.children)" :field="{
        ...field,
        type: field.children === 'table' ? 'table' : 'tags',
        isArray: true,
    }" v-model="modelValue" />
    <NCollapse v-else-if="field.isTable === false || field.children.filter(
        (f: any) => f.type === 'array' && isArrayOfObjects(f.children),
    ).length" display-directive="show" style="margin: 0 0 20px;" arrow-placement="right"
        :trigger-areas="['main', 'arrow']" :default-expanded-names="field.expand ? field.id : undefined" accordion>
        <template #arrow>
            <NIcon v-if="modelValue.length > 0">
                <IconChevronRight />
            </NIcon>
        </template>
        <NCollapseItem display-directive="show" :title="t(field.key)" :name="field.id"
            :disabled="modelValue.length === 0">
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
                <NCollapseItem v-for="(_item, index) of modelValue" display-directive="show"
                    :title="field.children[0].type === 'string' ? modelValue[index][field.children[0].key] : `${field.id}.${index}`"
                    :name="`${field.id}.${index}`">
                    <template #header-extra>
                        <NButton size="small" round type="error" quaternary :disabled="field.disabledItems?.includes(
                            index,
                        )" @click="() => modelValue.splice(index, 1)">
                            <template #icon>
                                <NIcon>
                                    <IconTrash />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    <div style="padding-left: 10px">
                        <LazyRenderFieldS :schema="field.children.map((child) => ({
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
                        }))" v-model="modelValue[index]" />
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
        <NDataTable v-if="field.children" :columns="getTableColumns()" :data="modelValue" :scroll-x="getTableWidth()" />
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
    type DataTableColumns
} from "naive-ui";
import { isArrayOfObjects } from "inibase/utils";
import { IconChevronRight, IconPlus, IconTrash } from "@tabler/icons-vue";
import { LazyRenderField } from "#components";
import type { PropType } from "vue";

useLanguage({
    ar: {
        delete: "حذف",
        actions: "أوامر",
    },
    en: {},
});

const { field } = defineProps({
    field: {
        type: Object as PropType<Field>,
        required: true,
    }
});


const modelValue = defineModel({
    type: Array as PropType<any>,
    default: []
});

function handleAddNewItem() {
    const oldLength = toRaw(modelValue.value).length;
    modelValue.value?.push(field.onCreate
        ? field.onCreate instanceof Function
            ? field.onCreate(oldLength)
            : field.onCreate
        : {})
}

function getTableWidth(): number {
    return (field.children as Schema).reduce(
        (accumulator: number, child: any) => {
            return (
                accumulator +
                (t(child.key) && child.key.length > 10
                    ? child.key.length * 15
                    : 200)
            );
        },
        100,
    )
}

function getTableColumns(): DataTableColumns {
    return [
        ...(field.children as Schema).map((child) => ({
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
            key: child.id,
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
                    modelValue: modelValue.value[index],
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
                                        onClick: () => modelValue.splice(index, 1),
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
    ]
}
</script>