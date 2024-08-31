<template>
    <NCollapse :triggerAreas="['main', 'arrow']" accordion default-expanded-names="0">
        <NCollapseItem v-for="([condition, items], index) in Object.entries(
            path ? getProperty(searchArray, path) : searchArray,
        )" :title="t(`${condition}Group`)" :name="index.toString()">
            <template #header-extra>
                <NFlex>
                    <NDropdown :options="[
                        {
                            key: 'and',
                            label: t('andGroup'),
                        },
                        {
                            key: 'or',
                            label: t('orGroup'),
                        },
                    ]" :style="{
                        maxHeight: '200px',
                    }" scrollable @select="(value) =>
                        setProperty(
                            searchArray,
                            `${path ? `${path}.` : ''}${condition}.${items.length
                            }.${value}`,
                            [[null, '=', null]],
                        )">
                        <NButton @click="() => setProperty(
                            searchArray,
                            `${path ? `${path}.` : ''}${condition}.${items.length
                            }`,
                            [null, '=', null],
                        )" circle size="small">
                            <template #icon>
                                <NIcon>
                                    <IconPlus />
                                </NIcon>
                            </template>
                        </NButton>
                    </NDropdown>

                    <NTooltip :delay="500">
                        <template #trigger>
                            <NButton @click="() => {
                                setProperty(
                                    searchArray,
                                    `${path ? `${path}.` : ''}${condition === 'and' ? 'or' : 'and'
                                    }`,
                                    getProperty(
                                        searchArray,
                                        `${path ? `${path}.` : ''}${condition}`,
                                        [[null, '=', null]],
                                    ),
                                );
                                deleteProperty(
                                    searchArray,
                                    `${path ? `${path}.` : ''}${condition}`,
                                );
                            }" circle size="small">
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
                    <NButton :disabled="['and', 'or'].includes(`${path ? `${path}.` : ''}${condition}`)" @click="() => deleteProperty(
                        searchArray,
                        `${path ? `${path}.` : ''}${condition}`,
                    )" circle size="small">
                        <template #icon>
                            <NIcon>
                                <IconTrash />
                            </NIcon>
                        </template>
                    </NButton>
                </NFlex>
            </template>
            <NFlex item-style="width: 100%">
                <template v-for="(item, index) in items.map((item: any) => {
                    if (item[0]) item[3] = getFieldFromSchema(
                        item[0],
                        table.schema as any
                    ); return item
                })">
                    <NInputGroup v-if="Array.isArray(item)">
                        <NSelect :consistent-menu-width="false" tag filterable :value="item[0]"
                            @update:value="(v) => item[0] = v" :options="generateSearchInOptions(
                                table.schema,
                            )" :style="`width:${item[3] ? 33.33 : 100}%`" />
                        <template v-if="item[3]">
                            <NSelect :consistent-menu-width="false" tag filterable :value="item[1]"
                                @update:value="(v) => item[1] = v" :options="searchSelectOptions(item[3])"
                                style="width:33.33%" />
                            <LazyRenderField :model-value="ref({
                                [item[3].key]: item[2] ?? undefined,
                            })" @update:modelValue="(v: any) => {
                                console.log(v)
                                item[2] = Array.isArray(
                                    v[item[3].key],
                                )
                                    ? v[item[3].key].join(',')
                                    : v[item[3].key];
                            }" :schema="[
                                {
                                    ...item[3],
                                    required: false,
                                    labelProps: {
                                        showLabel: false,
                                        style: 'width:33.33%',
                                        showFeedback: false,
                                    },
                                    inputProps: {
                                        onKeydown: ({
                                            key,
                                        }: KeyboardEvent) => {
                                            if (key === 'Enter') {
                                                searchQuery =
                                                    searchArray
                                                        ? generateSearchInput(
                                                            searchArray,
                                                        )
                                                        : undefined;
                                                pagination.onUpdatePage(
                                                    1,
                                                );
                                            }
                                        },
                                    },
                                },
                            ] as any" />
                        </template>
                        <NButton :disabled="items.length === 1" @click="() => deleteProperty(
                            searchArray,
                            `${path ? `${path}.` : ''
                            }${condition}.${index}`,
                        )" circle size="small">
                            <template #icon>
                                <NIcon>
                                    <IconMinus />
                                </NIcon>
                            </template>
                        </NButton>
                    </NInputGroup>
                    <LazyRenderSearch v-else :path="`${path ? `${path}.` : ''
                        }${condition}.${index}`" />
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
    IconMinus
} from "@tabler/icons-vue";
import { getField as getFieldFromSchema } from "inibase/utils";
import { deleteProperty, getProperty, setProperty } from "inidot";
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
} from "naive-ui";

defineProps(["path"])

const searchArray = useState<{
    and?: [string | null, string, any][];
    or?: [string | null, string, any][];
}>("searchArray");
const searchQuery = useState<string>("searchQuery")
const pagination = useState<any>("pagination")
const table = useState<Table>("table")

function searchSelectOptions(field: any): any {
    return comparisonOperatorOptions().filter(
        ({ value }) => {
            if (
                checkFieldType(field.type, [
                    "number",
                    "date",
                ])
            )
                return [
                    "=",
                    "!=",
                    ">",
                    ">=",
                    "<",
                    "<=",
                ].includes(value);
            if (
                checkFieldType(
                    field.type,
                    "array",
                ) ||
                checkFieldType(
                    field.type,
                    "table",
                )
            )
                return ![
                    ">",
                    ">=",
                    "<",
                    "<=",
                ].includes(value);
            return ![
                ">",
                ">=",
                "<",
                "<=",
                "[]",
                "![]",
            ].includes(value);
        },
    )
}
</script>
