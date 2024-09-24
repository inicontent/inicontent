<template>
    <LazyRenderFieldText v-if="['string', 'text', 'id'].includes(detectedFieldType)" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldSelect v-else-if="detectedFieldType === 'role'" v-model="modelValue[field.key]" :field="{
        ...field, options: database.roles?.map(({ name, id }) => ({
            label: t(name),
            value: id,
        }))
    }" />
    <LazyRenderFieldTextarea v-else-if="detectedFieldType === 'textarea'" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldRadio v-else-if="detectedFieldType === 'radio'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldTable v-else-if="detectedFieldType === 'table'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldUpload v-else-if="detectedFieldType === 'upload'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldColor v-else-if="detectedFieldType === 'color'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldUrl v-else-if="detectedFieldType === 'url'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldEmail v-else-if="detectedFieldType === 'email'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldHtml v-else-if="detectedFieldType === 'html'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldNumber v-else-if="detectedFieldType === 'number'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldPassword v-else-if="detectedFieldType === 'password'" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldBoolean v-else-if="detectedFieldType === 'boolean'" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldDate v-else-if="detectedFieldType === 'date'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldSelect v-else-if="detectedFieldType === 'select'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldCheckbox v-else-if="detectedFieldType === 'checkbox'" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldTags v-else-if="detectedFieldType === 'tags'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldMention v-else-if="detectedFieldType === 'mention'" v-model="modelValue[field.key]"
        :field="field" />
    <LazyRenderFieldObject v-else-if="detectedFieldType === 'object'" v-model="modelValue[field.key]" :field="field" />
    <LazyRenderFieldArray v-else-if="detectedFieldType === 'array'" v-model="modelValue[field.key]" :field="field" />
    <NEmpty v-else :description="`${t('fieldTypeNotExisting')}: '${String(detectedFieldType)}'`" />
</template>

<script lang="ts" setup>
import { NEmpty } from "naive-ui";

const { field } = defineProps({
    field: {
        type: Object as PropType<Field | never>,
        default: {},
    }
});

const modelValue = defineModel({
    type: Object as PropType<Item>,
    default: {},
})

if (field.defaultValue && !modelValue.value[field.key])
    modelValue.value[field.key] = field.defaultValue;

if (
    modelValue.value[field.key] &&
    modelValue.value[field.key] === null
)
    delete modelValue.value[field.key]

if (
    field.subType &&
    ((Array.isArray(field.type) && field.type.includes("array")) ||
        (typeof field.type === "string" && field.type === "array"))
)
    field.isArray = true;

let detectedFieldType = (field.subType ?? field.type) as string;
if (
    Array.isArray(detectedFieldType) &&
    modelValue.value[field.key]
)
    detectedFieldType = getField(
        field.subType ?? field.type,
        modelValue.value[field.key],
    ).key;

const database = useState<Database>("database")
</script>