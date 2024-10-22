<template>
    <NCollapse style="margin-top: 15px;" accordion :trigger-areas="['main', 'arrow']">
        <draggable :list="schema" item-key="id" handle=".handle">
            <template #item="{ element, index }">
                <NCollapseItem :name="index" :disabled="element.id === 'b6477d47f0b3cb6d75a8c2771d4d9469'">
                    <template #header>
                        <NTooltip v-if="element.id !== 'b6477d47f0b3cb6d75a8c2771d4d9469'" :delay="500">
                            <template #trigger>
                                <NIcon class="handle" :size="18">
                                    <IconMenu2 />
                                </NIcon>
                            </template>
                            {{ t('dragToMove') }}
                        </NTooltip>
                        {{ element.key ? t(element.key) : "--" }}
                    </template>
                    <template #header-extra>
                        <NFlex>
                            <template
                                v-if="['array', 'object'].includes(element.type) && isArrayOfObjects(element.children)">
                                <NDropdown :options="fieldsList()" style="max-height: 200px;" scrollable @select="(type) => schema[index].children = ([
                                    ...(schema[index].children ?? []),
                                    {
                                        id: `temp-${randomID()}`,
                                        key: null,
                                        required: false,
                                        ...handleSelectedSchemaType(type),
                                    },
                                ] as any)">
                                    <NButton :disabled="!element.key" circle size="small">
                                        <template #icon>
                                            <NIcon>
                                                <IconPlus />
                                            </NIcon>
                                        </template>
                                    </NButton>
                                </NDropdown>
                            </template>
                            <template v-else-if="element.id !== 'b6477d47f0b3cb6d75a8c2771d4d9469'">
                                <NButton :round="!isMobile" :circle="isMobile" strong secondary size="small"
                                    :type="schema[index].required ? 'error' : 'tertiary'"
                                    @click="schema[index].required = !schema[index].required">
                                    <template #icon>
                                        <NIcon>
                                            <IconAsterisk />
                                        </NIcon>
                                    </template>
                                    <template v-if="!isMobile" #default>
                                        {{ t('required') }}
                                    </template>
                                </NButton>
                            </template>
                            <NDropdown :disabled="element.id === 'b6477d47f0b3cb6d75a8c2771d4d9469'"
                                :options="fieldsList()" style="max-height: 200px" trigger="click" scrollable
                                @select="(type) => schema[index] = changeFieldType(schema[index], type)">
                                <NButton round strong secondary size="small" type="primary"
                                    :disabled="element.id === 'b6477d47f0b3cb6d75a8c2771d4d9469'">
                                    <template #icon>
                                        <component :is="getField(element.subType ?? element.type).icon" />
                                    </template>
                                    <template v-if="!isMobile" #default>
                                        {{ getField(
                                            element.subType ?? element.type,
                                        ).label }}
                                    </template>
                                </NButton>
                            </NDropdown>
                            <NButton v-if="element.id !== 'b6477d47f0b3cb6d75a8c2771d4d9469'" circle secondary
                                size="small" type="error" @click="schema.splice(index, 1)">
                                <template #icon>
                                    <NIcon>
                                        <IconTrash />
                                    </NIcon>
                                </template>
                            </NButton>
                        </NFlex>
                    </template>
                    <NFormItem :label="t('fieldName')">
                        <template #feedback>
                            {{ `#${getPath(table.schema ?? [], element.id, true)}` }}
                        </template>
                        <NInput v-model:value="schema[index].key" />
                    </NFormItem>
                    <template v-if="schema[index].table === 'asset'">
                        <NFormItem :label="t('allowedFiles')">
                            <NSelect multiple :render-label="(option: any) =>
                                h(NFlex, { align: 'center' }, () => [
                                    h(NIcon, () => option.icon),
                                    option.label as string,
                                ])" :options="[
                                    {
                                        label: t('image'),
                                        value: 'image',
                                        icon: h(IconPhoto),
                                    },
                                    {
                                        label: t('video'),
                                        value: 'video',
                                        icon: h(IconVideo),
                                    },
                                    {
                                        label: t('audio'),
                                        value: 'audio',
                                        icon: h(IconMusic),
                                    },
                                    {
                                        label: t('documents'),
                                        value: 'document',
                                        icon: h(IconFileDescription),
                                    },
                                    {
                                        label: t('archive'),
                                        value: 'archive',
                                        icon: h(IconFileZip),
                                    },
                                ]" v-model:value="schema[index].accept" />
                        </NFormItem>
                    </template>
                    <template v-else-if="(schema[index].subType ?? schema[index].type) === 'select'">
                        <NFormItem :label="t('options')">
                            <NSelect
                                :value="schema[index].options ? (schema[index].options.every(option => typeof option !== 'object') ? schema[index].options : schema[index].options.map(({ value }: any) => value)) : []"
                                @update:value="(value: string[]) => schema[index].options = [...new Set(value)]"
                                filterable multiple tag :show-arrow="false" :show="false" />
                        </NFormItem>
                        <NFormItem :label="t('allowCustomValues')" label-placement="left">
                            <NSwitch v-model:value="schema[index].custom" />
                        </NFormItem>
                        <NFormItem v-if="schema[index].type === 'array'" :label="t('minimumItems')">
                            <NInputNumber :value="schema[index].min"
                                @update:value="(value) => { if (value) schema[index].min = value; else delete schema[index].min }" />
                        </NFormItem>
                    </template>
                    <template v-else-if="(schema[index].subType ?? schema[index].type) === 'object'">
                        <NFormItem :label="t('expandByDefault')" label-placement="left">
                            <NSwitch v-model:value="schema[index].expand" />
                        </NFormItem>
                    </template>
                    <template v-else-if="(schema[index].subType ?? schema[index].type) === 'tags'">
                        <NFormItem :label="t('contentType')">
                            <NSelect v-model:value="(schema[index].children as any)" filterable multiple :render-label="(option: any) =>
                                h(NFlex, { align: 'center' }, () => [
                                    h(NIcon, () => option.icon),
                                    option.label as string,
                                ])" :options="flatFieldsList()
                                    ?.filter(({ key }) =>
                                        [
                                            'string',
                                            'number',
                                            'password',
                                            'email',
                                            'url',
                                            'id',
                                        ].includes(key),
                                    )
                                    .map((field) => ({
                                        label: field.label,
                                        value: field.key,
                                        icon: field.icon,
                                    }))" />
                        </NFormItem>
                    </template>
                    <template v-else-if="(schema[index].subType ?? schema[index].type) === 'table'">
                        <NFormItem :label="t('tableName')">
                            <NSelect filterable v-model:value="schema[index].table" :options="database.tables
                                ?.filter(
                                    ({ slug }) =>
                                        slug !== $route.params.table ||
                                        $route.params.table === 'user',
                                )
                                .map(({ slug, id }) => ({
                                    label: t(slug),
                                    value: slug,
                                }))" />
                        </NFormItem>
                        <NFormItem :label="t('searchIn')" :disabled="!schema[index].key">
                            <NCascader :disabled="!schema[index].key" multiple clearable filterable
                                expand-trigger="hover" check-strategy="child" :cascard="false"
                                v-model:value="schema[index].searchIn" :options="schema[index].key
                                    ? database.tables
                                        ?.find(({ slug }) => slug === schema[index].table)
                                        ?.schema?.map((_item, _index: number, schema) =>
                                            generateSearchInOptions(schema),
                                        )
                                        .flat(Number.POSITIVE_INFINITY) ?? []
                                    : []" />
                            <NFormItem v-if="schema[index].type === 'array'" :label="t('minimumItems')">
                                <NInputNumber :value="schema[index].min"
                                    @update:value="(value) => { if (value) schema[index].min = value; else delete schema[index].min }" />
                            </NFormItem>
                        </NFormItem>
                    </template>
                    <LazyRenderSettingSchema
                        v-if="['array', 'object'].includes(element.type) && isArrayOfObjects(element.children)"
                        v-model="element.children" />
                </NCollapseItem>
            </template>
        </draggable>
    </NCollapse>
</template>

<script lang="ts" setup>
import {
    IconPlus,
    IconMenu2,
    IconAsterisk,
    IconTrash,
    IconFileDescription,
    IconFileZip,
    IconMusic,
    IconPhoto,
    IconVideo,
} from "@tabler/icons-vue";
import {
    NCollapse,
    NCollapseItem,
    NIcon,
    NFlex,
    NDropdown,
    NCascader,
    NButton,
    NFormItem,
    NInput,
    NSelect,
    NSwitch,
    NInputNumber,
    NTooltip
} from "naive-ui";
import draggable from "vuedraggable";
import { isArrayOfObjects } from "inibase/utils";

useLanguage({
    ar: {
        fieldName: "ﻞﻘﺤﻟا ﻢﺳﺇ",
        allowedFiles: "ﺎﻬﺑ ﺡﻮﻤﺴﻤﻟا ﺕﺎﻔﻠﻤﻟا",
        options: "ﺕاﺭﺎﻴﺨﻟا",
        contentType: "ﻯﻮﺘﺤﻤﻟا ﻉﻮﻧ",
        showAsTable: "ﻝﻭﺪﺠﻛ ﺮﻬﻇﺃ",
        labelText: "ﺔﻴﻤﺴﺘﻟا ﺺﻧ",
        searchIn: "ﻲﻓ ﺚﺤﺒﻟا",
        labelImage: "ﺔﻴﻤﺴﺘﻟا ﺓﺭﻮﺻ", // TO-DO: support image in table field
    },
    en: {},
});
const schema = defineModel<Schema>({
    default: () => reactive([]),
});
const database = useState<Database>("database");
const table = useState<Table>("table");
const { isMobile } = useDevice();

function changeFieldType(
    { id, key, required, children }: any,
    newType: string,
): Field {
    switch (newType) {
        case "object":
        case "array":
            return { id, key, type: newType, required, children };
        default:
            return { id, key, ...(handleSelectedSchemaType(newType) as any), required };
    }
}
</script>

<style lang="css" scoped>
.rtl .handle {
    margin-left: 10px
}

.ltr .handle {
    margin-right: 10px
}

.notSortable .handle {
    display: none;
}
</style>
