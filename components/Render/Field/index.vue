<template>
    <LazyRenderFieldText v-if="['string', 'text', 'id'].includes(detectedFieldType)" v-model="modelValue"
        :field="field" />
    <LazyRenderFieldSelect v-else-if="detectedFieldType === 'role'" v-model="modelValue" :field="{
        ...field, options: database.roles?.map(({ name, id }) => ({
            label: t(name),
            value: id,
        }))
    }" />
    <LazyRenderFieldTextarea v-else-if="detectedFieldType === 'textarea'" v-model="modelValue" :field="field" />
    <LazyRenderFieldRadio v-else-if="detectedFieldType === 'radio'" v-model="modelValue" :field="field" />
    <LazyRenderFieldUpload v-else-if="field.table === 'asset'" v-model="modelValue" :field="field" />
    <LazyRenderFieldTable v-else-if="detectedFieldType === 'table'" v-model="modelValue" :field="field" />
    <LazyRenderFieldColor v-else-if="detectedFieldType === 'color'" v-model="modelValue" :field="field" />
    <LazyRenderFieldUrl v-else-if="detectedFieldType === 'url'" v-model="modelValue" :field="field" />
    <LazyRenderFieldEmail v-else-if="detectedFieldType === 'email'" v-model="modelValue" :field="field" />
    <LazyRenderFieldHtml v-else-if="detectedFieldType === 'html'" v-model="modelValue" :field="field" />
    <LazyRenderFieldNumber v-else-if="detectedFieldType === 'number'" v-model="modelValue" :field="field" />
    <LazyRenderFieldPassword v-else-if="detectedFieldType === 'password'" v-model="modelValue" :field="field" />
    <LazyRenderFieldBoolean v-else-if="detectedFieldType === 'boolean'" v-model="modelValue" :field="field" />
    <LazyRenderFieldDate v-else-if="detectedFieldType === 'date'" v-model="modelValue" :field="field" />
    <LazyRenderFieldSelect v-else-if="detectedFieldType === 'select'" v-model="modelValue" :field="field" />
    <LazyRenderFieldCheckbox v-else-if="detectedFieldType === 'checkbox'" v-model="modelValue" :field="field" />
    <LazyRenderFieldTags v-else-if="detectedFieldType === 'tags'" v-model="modelValue" :field="field" />
    <LazyRenderFieldMention v-else-if="detectedFieldType === 'mention'" v-model="modelValue" :field="field" />
    <LazyRenderFieldObject v-else-if="detectedFieldType === 'object'" v-model="modelValue" :field="field" />
    <LazyRenderFieldArray v-else-if="detectedFieldType === 'array'" v-model="modelValue" :field="field" />
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
    type: [Array, Object, String, Boolean, Number, null],
})

function getDefaultValue(field: Field): any {
    if (Array.isArray(field.type)) {
        if (field.type.includes('array'))
            return []
        if (field.type.includes('object'))
            return {}
    } else {
        if (field.type === "array")
            return [];
        if (field.type === "object")
            return {};
    }
    return null
}

if (field.defaultValue && !modelValue.value)
    modelValue.value = field.defaultValue;
else if (
    !modelValue.value
)
    modelValue.value = getDefaultValue(field)

if (
    ((Array.isArray(field.type) && field.type.includes("array")) ||
        (typeof field.type === "string" && field.type === "array"))
)
    field.isArray = true;

let detectedFieldType = (field.subType ?? field.type) as string;
if (
    Array.isArray(detectedFieldType) &&
    modelValue.value
)
    detectedFieldType = getField(
        field.subType ?? field.type,
        modelValue.value,
    ).key;

const database = useState<Database>("database")
</script>