<template>
    <LazyRenderFieldText v-if="detectedFieldType === 'string' || detectedFieldType === 'text'" v-model="modelValue"
        :path="finalPath" :field="field" />
    <LazyRenderFieldRole v-else-if="detectedFieldType === 'role'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldId v-else-if="detectedFieldType === 'id'" v-model="modelValue" :path="finalPath" :field="field" />
    <LazyRenderFieldTextarea v-else-if="detectedFieldType === 'textarea'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldRadio v-else-if="detectedFieldType === 'radio'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldTable v-else-if="detectedFieldType === 'table'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldUpload v-else-if="detectedFieldType === 'upload'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldColor v-else-if="detectedFieldType === 'color'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldUrl v-else-if="detectedFieldType === 'url'" v-model="modelValue" :path="finalPath" :field="field" />
    <LazyRenderFieldEmail v-else-if="detectedFieldType === 'email'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldHtml v-else-if="detectedFieldType === 'html'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldNumber v-else-if="detectedFieldType === 'number'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldPassword v-else-if="detectedFieldType === 'password'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldBoolean v-else-if="detectedFieldType === 'boolean'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldDate v-else-if="detectedFieldType === 'date'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldSelect v-else-if="detectedFieldType === 'select'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldCheckbox v-else-if="detectedFieldType === 'checkbox'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldTags v-else-if="detectedFieldType === 'tags'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldMention v-else-if="detectedFieldType === 'mention'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldObject v-else-if="detectedFieldType === 'object'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldArray v-else-if="detectedFieldType === 'array'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <NEmpty v-else :description="`${t('fieldTypeNotExisting')}: '${String(detectedFieldType)}'`" />
</template>

<script lang="ts" setup>
import { deleteProperty, getProperty, hasProperty, setProperty } from "inidot";
import { NEmpty } from "naive-ui";

const { schema, field, path } = defineProps({
    schema: {
        type: Object as PropType<Schema | never>,
        default: [],
    },
    field: {
        type: Object as PropType<Field | never>,
        default: [],
    },
    path: {
        type: String,
    },
});
const modelValue = defineModel({
    type: Object as PropType<any>,
    default: {},
})
const finalPath = path ?? getPath(schema, field.id);

if (field.defaultValue && !hasProperty(modelValue.value, finalPath))
    setProperty(modelValue.value, finalPath, field.defaultValue);

if (
    hasProperty(modelValue.value, finalPath) &&
    getProperty(modelValue.value, finalPath) === null
)
    deleteProperty(modelValue.value, finalPath);

if (
    field.subType &&
    ((Array.isArray(field.type) && field.type.includes("array")) ||
        (typeof field.type === "string" && field.type === "array"))
)
    field.isArray = true;

let detectedFieldType = field.subType ?? field.type;
if (
    Array.isArray(detectedFieldType) &&
    hasProperty(modelValue.value, finalPath)
)
    detectedFieldType = getField(
        field.subType ?? field.type,
        getProperty(modelValue.value, finalPath),
    ).key;
</script>