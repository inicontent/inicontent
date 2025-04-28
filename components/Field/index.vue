<template>
    <LazyFieldText v-if="['string', 'text', 'id', 'multiple'].includes(detectedFieldType)" v-model="modelValue"
        :field />
    <LazyFieldSelect v-else-if="detectedFieldType === 'role'" v-model="modelValue" :field="{
        ...field, options: database.roles?.map(({ name, id }) => ({
            label: t(name),
            value: id,
        }))
    }" />
    <LazyFieldIcon v-else-if="detectedFieldType === 'icon'" v-model="modelValue" :field />
    <LazyFieldTextarea v-else-if="detectedFieldType === 'textarea'" v-model="modelValue" :field />
    <LazyFieldRadio v-else-if="detectedFieldType === 'radio'" v-model="modelValue" :field />
    <LazyFieldCheckbox v-else-if="detectedFieldType === 'checkbox'" v-model="modelValue" :field />
    <LazyFieldAsset v-else-if="field.table === 'assets'" v-model="modelValue" :field />
    <LazyFieldTable v-else-if="detectedFieldType === 'table' || detectedFieldType === 'array-table'"
        v-model="modelValue" :field />
    <LazyFieldColor v-else-if="detectedFieldType === 'color'" v-model="modelValue" :field />
    <LazyFieldUrl v-else-if="detectedFieldType === 'url'" v-model="modelValue" :field />
    <LazyFieldEmail v-else-if="detectedFieldType === 'email'" v-model="modelValue" :field />
    <LazyFieldHtml v-else-if="detectedFieldType === 'html'" v-model="modelValue" :field />
    <LazyFieldNumber v-else-if="detectedFieldType === 'number'" v-model="modelValue" :field />
    <LazyFieldPassword v-else-if="detectedFieldType === 'password'" v-model="modelValue" :field />
    <LazyFieldBoolean v-else-if="detectedFieldType === 'boolean'" v-model="modelValue" :field />
    <LazyFieldDate v-else-if="detectedFieldType === 'date'" v-model="modelValue" :field />
    <LazyFieldSelect v-else-if="['locale', 'select'].includes(detectedFieldType)" v-model="modelValue" :field="detectedFieldType === 'locale' ? {
        ...field, subType: 'select', options: translationLanguages.map((language) => ({
            label: t(`languages.${language}`),
            value: language,
        }))
    } : field" />
    <LazyFieldTags v-else-if="detectedFieldType === 'tags'" v-model="modelValue" :field />
    <LazyFieldMention v-else-if="detectedFieldType === 'mention'" v-model="modelValue" :field />
    <LazyFieldObject v-else-if="detectedFieldType === 'object'" v-model="modelValue" :field />
    <LazyFieldArray v-else-if="detectedFieldType === 'array'" v-model="modelValue" :field />
    <component v-else-if="detectedFieldType === 'custom' && field.render" :is="field.render"></component>
    <NEmpty v-else :description="`${t('fieldTypeNotExisting')}: '${String(detectedFieldType)}'`" />
</template>

<script lang="ts" setup>
import { NEmpty } from "naive-ui";

const field = defineModel<Field>("field", { required: true });
const detectedFieldType = computed<DB_FieldType | CMS_FieldType>(() => {
	const fieldType = (field.value.subType ?? field.value.type) as
		| DB_FieldType
		| CMS_FieldType;
	if (Array.isArray(fieldType)) return getField(field.value).key;
	return fieldType;
});

const modelValue = defineModel<any>();
const database = useState<Database>("database");

watchEffect(() => {
	if (field.value.defaultValue && !modelValue.value)
		modelValue.value = field.value.defaultValue;

	if (
		(Array.isArray(field.value.type) && field.value.type.includes("array")) ||
		(typeof field.value.type === "string" && field.value.type === "array")
	)
		field.value.isArray = true;
});
</script>