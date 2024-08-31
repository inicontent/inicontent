<template>
    <LazyRenderFieldText v-if="deletectedFieldType === 'string' || deletectedFieldType === 'text'" v-model="modelValue"
        :path="finalPath" :field="field" />
    <LazyRenderFieldRole v-else-if="deletectedFieldType === 'role'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldId v-else-if="deletectedFieldType === 'id'" v-model="modelValue" :path="finalPath" :field="field" />
    <LazyRenderFieldTextarea v-else-if="deletectedFieldType === 'textarea'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldRadio v-else-if="deletectedFieldType === 'radio'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldTable v-else-if="deletectedFieldType === 'table'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldUpload v-else-if="deletectedFieldType === 'upload'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldColor v-else-if="deletectedFieldType === 'color'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldUrl v-else-if="deletectedFieldType === 'url'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldEmail v-else-if="deletectedFieldType === 'email'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldHtml v-else-if="deletectedFieldType === 'html'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldNumber v-else-if="deletectedFieldType === 'number'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldPassword v-else-if="deletectedFieldType === 'password'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldBoolean v-else-if="deletectedFieldType === 'boolean'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldDate v-else-if="deletectedFieldType === 'date'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldSelect v-else-if="deletectedFieldType === 'select'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldCheckbox v-else-if="deletectedFieldType === 'checkbox'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldTags v-else-if="deletectedFieldType === 'tags'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldObject v-else-if="deletectedFieldType === 'object'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <LazyRenderFieldArray v-else-if="deletectedFieldType === 'array'" v-model="modelValue" :path="finalPath"
        :field="field" />
    <NEmpty v-else :description="`${t('fieldTypeNotExisting')}: '${String(deletectedFieldType)}'`" />
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

let deletectedFieldType = field.subType ?? field.type;
if (
    Array.isArray(deletectedFieldType) &&
    hasProperty(modelValue.value, finalPath)
)
    deletectedFieldType = getField(
        field.subType ?? field.type,
        getProperty(modelValue.value, finalPath),
    ).key;
</script>