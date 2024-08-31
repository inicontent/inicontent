<template>
    <div>
        <NButton v-if="JSON.stringify(tableCopy) !== JSON.stringify(table)"
            style="bottom: 15px;right: 18px;z-index: 9999997;position: fixed" circle secondary
            :loading="Loading.updateTable" type="primary" size="large" @click="saveFlow">
            <template #icon>
                <NIcon>
                    <IconDeviceFloppy />
                </NIcon>
            </template>
        </NButton>
        <NTabs type="segment" animated v-model:value="currentFlow">
            <NTabPane v-for="flowName of ['onRequest', 'onResponse']" :name="flowName" :tab="flowName">
                <div class="masonry">
                    <div v-for="(flow, index) of tableCopy[flowName]"
                        @mouseover="() => Hover[`${currentFlow}-${index}`] = true"
                        @mouseleave="() => Hover[`${currentFlow}-${index}`] = false">
                        <NButtonGroup vertical size="small" style="position:absolute;top:0;right:0;z-index:999999"
                            :style="Hover[`${currentFlow}-${index}`] ? '' : 'visibility:hidden'">
                            <NButton secondary type="primary" @click="() => currentFlowCard =
                                currentFlowCard ===
                                    `${currentFlow}-${index}`
                                    ? undefined
                                    : `${currentFlow}-${index}`">
                                <template #icon>
                                    <NIcon>
                                        <IconEye v-if="currentFlowCard === `${currentFlow}-${index}`" />
                                        <IconPencil v-else />
                                    </NIcon>
                                </template>
                            </NButton>
                            <NButton secondary type="error"
                                @click="() => { if (currentFlowCard === `${currentFlow}-${index}`) currentFlowCard = undefined; tableCopy[flowName].splice(index, 1) }">
                                <template #icon>
                                    <NIcon>
                                        <IconTrash />
                                    </NIcon>
                                </template>
                            </NButton>
                        </NButtonGroup>
                        <NCard hoverable content-style="padding: 0">
                            <NScrollbar x-scrollable>
                                <NFlex vertical :wrap="false" style="padding:  20px 22px;">
                                    <NEmpty v-if="!flow.length" />
                                    <template v-if="currentFlowCard === `${currentFlow}-${index}`"
                                        v-for="([firstValue, secondValue, thirdValue], index) of flow"
                                        :key="firstValue">
                                        <NInputGroup>
                                            <template v-if="firstValue === 'set'">
                                                <NDropdown v-bind="DropdownProps(flow, index)">
                                                    <NButton size="small" type="success" secondary
                                                        style="border-radius: 50px 0 0 50px;width: 47px;">
                                                        {{ t('set') }}
                                                    </NButton>
                                                </NDropdown>
                                                <NCascader size="small" style="height: fit-content;"
                                                    :options="generateFlowCascaderOptions()" check-strategy="child"
                                                    expand-trigger="hover" show-path separator="." filterable
                                                    v-model:value="flow[index][1]" />
                                                <NSelect size="small"
                                                    style="border-radius: 0 50px 50px 0!important;overflow: hidden;"
                                                    :consistent-menu-width="false" filterable tag :options="generateFlowSelectOptions(
                                                        secondValue,
                                                        false,
                                                        true,
                                                    )" :value="String(flow[index][2])"
                                                    @update:value="(value) => flow[index][2] = value === 'null' ? null : value" />
                                            </template>
                                            <template v-else-if="firstValue === 'error'">
                                                <NDropdown v-bind="DropdownProps(flow, index)">
                                                    <NButton size="small" type="error" secondary
                                                        style="border-radius: 50px 0 0 50px;width: 96px;">
                                                        {{ t('throwError') }}
                                                    </NButton>
                                                </NDropdown>
                                                <NSelect size="small"
                                                    style="border-radius: 0 50px 50px 0!important;overflow: hidden;"
                                                    :consistent-menu-width="false" filterable tag
                                                    :options="[{ label: 'accessDenied', value: 'accessDenied' }]"
                                                    v-model:value="flow[index][1]" />
                                            </template>
                                            <template v-else-if="firstValue === 'unset'">
                                                <NDropdown v-bind="DropdownProps(flow, index)">
                                                    <NButton size="small" type="warning" secondary
                                                        style="border-radius: 50px 0 0 50px;width: 96px;">
                                                        {{ t('unset') }}
                                                    </NButton>
                                                </NDropdown>
                                                <NCascader size="small" style="height: fit-content;"
                                                    :options="generateFlowCascaderOptions()" check-strategy="child"
                                                    expand-trigger="hover" show-path separator="." filterable
                                                    v-model:value="flow[index][1]" />
                                            </template>
                                            <template v-else>
                                                <NDropdown v-bind="DropdownProps(flow, index)">
                                                    <NButton size="small" type="info" secondary
                                                        style="border-radius: 50px 0 0 50px;width: 37px;">
                                                        {{ t('if') }}
                                                    </NButton>
                                                </NDropdown>
                                                <NCascader size="small" style="height: fit-content;max-width: 156px;"
                                                    :options="[
                                                        ...generateFlowCascaderOptions(true, true),
                                                        { label: '@method', value: '@method' },
                                                    ]" check-strategy="child" expand-trigger="hover" show-path
                                                    separator="." filterable v-model:value="flow[index][0]" />
                                                <NSelect size="small" style="width: 136px;"
                                                    :consistent-menu-width="false" filterable
                                                    :render-tag="({ option }) => option.value" :options="checkFieldType(
                                                        formatValue(firstValue, 'type', 'string'),
                                                        ['number', 'date'],
                                                    )
                                                        ? comparisonOperatorOptions().filter(
                                                            ({ value }) => !['*', '!*'].includes(value),
                                                        )
                                                        : comparisonOperatorOptions().filter(
                                                            ({ value }) =>
                                                                ![
                                                                    '>',
                                                                    '>=',
                                                                    '<',
                                                                    '<=',
                                                                    ...(firstValue === '@method' ? ['*', '!*'] : []),
                                                                ].includes(value),
                                                        )" v-model:value="flow[index][1]" />
                                                <NSelect size="small"
                                                    style="border-radius: 0 50px 50px 0!important;overflow: hidden;"
                                                    :consistent-menu-width="false" filterable tag :options="generateFlowSelectOptions(
                                                        firstValue,
                                                        false,
                                                        true,
                                                    )" :multiple="['[]', '![]'].includes(secondValue as string)"
                                                    max-tag-count="responsive" :value="String(flow[index][2])"
                                                    @update:value="(value) => flow[index][2] = value === 'null' ? null : value" />
                                            </template>
                                        </NInputGroup>
                                    </template>
                                    <template v-else v-for="[firstValue, secondValue, thirdValue] of flow">
                                        <template v-if="firstValue === 'set'">
                                            <NFlex align="center" :wrap="false">
                                                <NFlex :wrap="false" :size="0">
                                                    <NTag type="success" :bordered="false"
                                                        style="padding: 0 13px; border-radius: 50px 0 0 50px;">
                                                        {{ t('set') }}
                                                    </NTag>
                                                    <NTag type="primary" :bordered="false"
                                                        style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                        {{ formatValue(secondValue) }}
                                                    </NTag>
                                                </NFlex>
                                                <NTag v-if="thirdValue === undefined" :bordered="false" round>--
                                                </NTag>
                                                <NScrollbar v-else>
                                                    <NFlex :wrap="false">
                                                        <NTag v-for="value of [].concat(thirdValue)" :bordered="false"
                                                            round>
                                                            {{ String(
                                                                secondValue &&
                                                                    (secondValue ===
                                                                        "@user.c12f82766d02ae29c6a94a3acf11cda4" ||
                                                                        (table.slug === "user" &&
                                                                            secondValue.endsWith(
                                                                                ".c12f82766d02ae29c6a94a3acf11cda4",
                                                                            ))) &&
                                                                    isValidID(value)
                                                                    ? database.roles?.find(
                                                                        ({ id }) => id === value,
                                                                    )?.name
                                                                    : formatValue(value),
                                                            ) }}
                                                        </NTag>
                                                    </NFlex>
                                                </NScrollbar>
                                            </NFlex>
                                        </template>
                                        <template v-else-if="firstValue === 'error'">
                                            <NFlex :wrap="false" :size="0">
                                                <NTag type="error" :bordered="false"
                                                    style="padding: 0 13px; border-radius: 50px 0 0 50px;">
                                                    {{ t('throwError') }}
                                                </NTag>
                                                <NTag v-if="secondValue" :bordered="false"
                                                    style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                    {{ t(secondValue) }}
                                                </NTag>
                                                <NTag v-else :bordered="false"
                                                    style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                    --
                                                </NTag>
                                            </NFlex>
                                        </template>
                                        <template v-else-if="firstValue === 'unset'">
                                            <NFlex :wrap="false" :size="0">
                                                <NTag type="warning" :bordered="false"
                                                    style="padding: 0 13px; border-radius: 50px 0 0 50px;">
                                                    {{ t('unset') }}
                                                </NTag>
                                                <NTag
                                                    v-if="(Array.isArray(secondValue) && secondValue.length) || secondValue"
                                                    v-for="value of [].concat(secondValue)" :bordered="false"
                                                    style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                    {{ value }}
                                                </NTag>
                                                <NTag v-else :bordered="false"
                                                    style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                    --
                                                </NTag>
                                            </NFlex>
                                        </template>
                                        <template v-else>
                                            <NFlex align="center" :wrap="false">
                                                <NFlex :wrap="false" :size="0">
                                                    <NTag type="info" :bordered="false"
                                                        style="padding: 0 13px; border-radius: 50px 0 0 50px;">
                                                        {{ t('if') }}
                                                    </NTag>
                                                    <NTag type="primary" :bordered="false"
                                                        style="padding-right: 10px; border-radius: 0 50px 50px 0;">
                                                        {{ formatValue(firstValue) }}
                                                    </NTag>
                                                </NFlex>
                                                <NTooltip :delay="500">
                                                    <template #trigger>
                                                        <NTag round :bordered="false" size="small">
                                                            {{ secondValue }}
                                                        </NTag>
                                                    </template>
                                                    {{ comparisonOperatorOptions().find(
                                                        ({ value }) => value === (secondValue ?? '='),
                                                    )?.label }}
                                                </NTooltip>
                                                <NTag v-if="thirdValue === undefined" :bordered="false" round>--
                                                </NTag>
                                                <NScrollbar v-else>
                                                    <NFlex :wrap="false" :size="[4, 8]">
                                                        <NTag v-for="value of [].concat(thirdValue)" :bordered="false"
                                                            round>
                                                            {{ value === null ? '@null' : String(
                                                                firstValue &&
                                                                    (firstValue ===
                                                                        "@user.c12f82766d02ae29c6a94a3acf11cda4" ||
                                                                        (table.slug === "user" &&
                                                                            firstValue.endsWith(
                                                                                ".c12f82766d02ae29c6a94a3acf11cda4",
                                                                            ))) &&
                                                                    isValidID(value)
                                                                    ? database.roles?.find(
                                                                        ({ id }) => id === value,
                                                                    )?.name
                                                                    : formatValue(value),
                                                            ) }}
                                                        </NTag>
                                                    </NFlex>
                                                </NScrollbar>
                                            </NFlex>
                                        </template>
                                    </template>
                                </NFlex>
                            </NScrollbar>
                        </NCard>
                    </div>
                    <NPopover placement="bottom" :delay="500">
                        <template #trigger>
                            <NCard style="cursor: pointer;" content-style="padding: 34px 0" hoverable @click="() => {
                                if (tableCopy[flowName] && Array.isArray(tableCopy[flowName]))
                                    currentFlowCard = `${currentFlow}-${tableCopy[flowName].push([]) - 1
                                        }`;
                                else {
                                    tableCopy[flowName] = [[]];
                                    currentFlowCard = `${currentFlow}-${0}`;
                                }
                            }">
                                <NFlex justify="center" align="center">
                                    <NIcon :size="36">
                                        <IconPlus />
                                    </NIcon>
                                </NFlex>
                            </NCard>
                        </template>
                        {{ t('newCard') }}
                    </NPopover>
                </div>
            </NTabPane>
        </NTabs>
    </div>
</template>

<script lang="ts" setup>
import {
    IconDeviceFloppy,
    IconEye,
    IconArrowDown,
    IconArrowUp,
    IconPencil,
    IconPlus,
    IconTrash,
} from "@tabler/icons-vue";
import {
    NButton,
    NButtonGroup,
    NCard,
    NCascader,
    NDropdown,
    NEmpty,
    NFlex,
    NIcon,
    NInputGroup,
    NPopover,
    NScrollbar,
    NSelect,
    NTabPane,
    NTabs,
    NTag,
    type CascaderOption,
    type SelectOption,
    type SelectGroupOption,
    NTooltip,
} from "naive-ui";
import { isArrayOfObjects, isValidID } from "inibase/utils";
onMounted(() => {
    document.onkeydown = (e) => {
        if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
        e.preventDefault();
        saveFlow();
    };
});

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database"),
    table = useState<Table>("table"),
    tableCopy = ref(JSON.parse(JSON.stringify(table.value))),
    currentFlow = ref<string>("onRequest"),
    currentFlowCard = ref<string>(),
    Hover = useState<Record<string | number, boolean>>("Hover", () => ({})),
    saveFlow = async () => {
        Loading.value.updateTable = true;
        const bodyContent = JSON.parse(JSON.stringify(tableCopy.value));
        await $fetch<apiResponse>(
            `${useRuntimeConfig().public.apiBase}inicontent/database/${database.value.slug
            }/${table.value.slug}`,
            {
                method: "PUT",
                body: (({ onResponse, onRequest }) => ({
                    onResponse,
                    onRequest,
                }))(bodyContent),
            },
        );
        Loading.value.updateTable = false;
    },
    flattenSchema = (schema: Schema, keepParents = false) => {
        const result: Schema = [];

        function flattenHelper(item: Field, parentKey: string) {
            if (item.children && isArrayOfObjects(item.children)) {
                if (keepParents)
                    result.push((({ children, ...rest }) => rest)(item));
                for (const child of item.children) flattenHelper(child, item.key);
            } else
                result.push({
                    ...item,
                    key: parentKey ? `${parentKey}.${item.key}` : item.key,
                });
        }
        for (const item of schema) flattenHelper(item, "");

        return result;
    },
    generateFlowCascaderOptions = (
        withWhereOr = true,
        withUser?: boolean,
    ) => {
        const result: CascaderOption[] = [];
        if (withUser) {
            let userSchema = database.value.tables?.find(
                ({ slug }) => slug === "user",
            )?.schema;
            if (userSchema) {
                userSchema = flattenSchema(userSchema);
                result.push({
                    label: "@user",
                    value: "@user",
                    children: userSchema.map(({ id, key }) => ({
                        label: key,
                        value: `@user.${id}`,
                    })),
                });
            }
        }
        if (table.value.schema) {
            const schema = flattenSchema(table.value.schema);
            result.push({
                label: "@where",
                value: "@where",
                children: [
                    ...(withWhereOr
                        ? [
                            {
                                label: "or",
                                value: "@where.or",
                                children: schema.map(({ id, key }) => ({
                                    label: key,
                                    value: `@where.or.${id}`,
                                })),
                            },
                        ]
                        : []),
                    ...schema.map(({ id, key }) => ({
                        label: key,
                        value: `@where.${id}`,
                    })),
                ],
            });
            result.push({
                label: "@data",
                value: "@data",
                children: schema.map(({ id, key }) => ({
                    label: key,
                    value: `@data.${id}`,
                })),
            });
        }
        return result;
    },
    generateFlowSelectOptions = (
        value: string,
        withWhereOr = true,
        withUser?: boolean,
    ) => {
        const result: (SelectOption | SelectGroupOption)[] = [];
        if (value === "@method")
            return ["get", "post", "put", "delete"].map((method) => ({
                label: method.toUpperCase(),
                value: method.toUpperCase(),
            }));

        result.push({
            label: "@null",
            value: "null",
        });

        if (
            value &&
            (value === "@user.c12f82766d02ae29c6a94a3acf11cda4" ||
                (table.value.slug === "user" &&
                    value.endsWith(".c12f82766d02ae29c6a94a3acf11cda4")))
        )
            // @user.role
            result.push({
                key: "@role",
                label: "@role",
                type: "group",
                children: database.value.roles?.map(({ name, id }) => ({
                    label: name,
                    value: id,
                })),
            });
        if (withUser) {
            let userSchema = database.value.tables?.find(
                ({ slug }) => slug === "user",
            )?.schema;
            if (userSchema) {
                userSchema = flattenSchema(userSchema);
                result.push({
                    key: "@user",
                    label: "@user",
                    type: "group",
                    children: userSchema.map(({ id, key }) => ({
                        label: `@user.${key}`,
                        value: `@user.${id}`,
                    })),
                });
            }
        }
        if (table.value.schema) {
            const schema = flattenSchema(table.value.schema);
            result.push({
                key: "@where",
                label: "@where",
                type: "group",
                children: [
                    ...(withWhereOr
                        ? [
                            {
                                key: "@where.or",
                                label: "or",
                                type: "group",
                                children: schema.map(({ id, key }) => ({
                                    label: `@where.or.${key}`,
                                    value: `@where.or.${id}`,
                                })),
                            },
                        ]
                        : []),
                    ...schema.map(({ id, key }) => ({
                        label: `@where.${key}`,
                        value: `@where.${id}`,
                    })),
                ],
            });
            result.push({
                key: "@data",
                label: "@data",
                type: "group",
                children: schema.map(({ id, key }) => ({
                    label: `@data.${key}`,
                    value: `@data.${id}`,
                })),
            });
        }
        return result;
    },
    formatValue = (
        value?: string | number | boolean | null,
        property: keyof Field = "key",
        defaultValue?: string,
    ) => {
        if (
            value &&
            typeof value === "string" &&
            (value.startsWith("@user.") ||
                value.startsWith("@data.") ||
                value.startsWith("@where."))
        ) {
            const splitedValue = value.split("."),
                lastItem = splitedValue.pop();
            let schema =
                splitedValue[0] === "@user"
                    ? database.value?.tables?.find(({ slug }) => slug === "user")
                        ?.schema
                    : table.value.schema;
            if (schema) {
                schema = flattenSchema(schema, true);
                const item = schema.find(({ id }) => id === lastItem);

                if (!item) return undefined;

                if (property === "key")
                    return `${splitedValue.join(".")}.${item?.key}`;

                return item[property] ?? defaultValue;
            }
        }
        return value || defaultValue;
    },
    DropdownProps = (flow: FlowType, index: number) => ({
        options: [
            {
                label: t("delete"),
                key: "delete",
                icon: () => h(NIcon, () => h(IconTrash)),
            },
            {
                label: t("moveUp"),
                key: "moveUp",
                icon: () => h(NIcon, () => h(IconArrowUp)),
                disabled: index === 0,
            },
            {
                label: t("moveDown"),
                key: "moveDown",
                icon: () => h(NIcon, () => h(IconArrowDown)),
                disabled: index + 1 === flow.length,
            },
        ],
        onSelect(key: string) {
            switch (key) {
                case "delete":
                    flow.splice(index, 1);
                    break;
                case "moveUp": {
                    const element = flow[index];
                    flow.splice(index, 1);
                    flow.splice(index - 1, 0, element);
                    break;
                }
                case "moveDown": {
                    const element = flow[index];
                    flow.splice(index, 1);
                    flow.splice(index + 1, 0, element);
                    break;
                }
            }
        },
    })


useHead({
    title: `${database.value.slug} | ${t(table.value.slug)} > ${t("flows")}`,
    link: [{ rel: "icon", href: database.value?.icon ?? "" }],
});
</script>
