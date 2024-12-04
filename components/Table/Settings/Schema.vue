<template>
	<NCollapse style="margin-top: 15px;" accordion :trigger-areas="['main', 'arrow']"
		v-model:expanded-names="expandedNames">
		<draggable :list="schema" item-key="id" handle=".handle">
			<template #item="{ element, index }: { element: Field, index: number }">
				<NCollapseItem :name="element.id" :id="`element-${element.id}`" :disabled="isDisabled(element.key)">
					<template #header>
						<NTooltip v-if="!isDisabled(element.key)" :delay="500">
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
								v-if="['array', 'object'].includes(element.type as string) && isArrayOfObjects(element.children)">
								<NDropdown :options="fieldsList()" style="max-height: 200px;" scrollable
									@select="(type) => pushToChildrenSchema(type, index)">
									<NButton :disabled="!element.key" circle size="small">
										<template #icon>
											<NIcon>
												<IconPlus />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
							</template>
							<template v-else-if="!isDisabled(element.key)">
								<NButton :round="!$device.isMobile" :circle="$device.isMobile" strong secondary
									size="small" :type="element.required ? 'error' : 'tertiary'"
									@click="schema[index].required = !schema[index].required">
									<template #icon>
										<NIcon>
											<IconAsterisk />
										</NIcon>
									</template>
									<template v-if="!$device.isMobile" #default>
										{{ t('required') }}
									</template>
								</NButton>
							</template>
							<NDropdown :disabled="isDisabled(element.key)" :options="fieldsList()"
								style="max-height: 200px" trigger="click" scrollable
								@select="(type) => schema[index] = changeFieldType(element, type)">
								<NButton round strong secondary size="small" type="primary"
									:disabled="isDisabled(element.key)">
									<template #icon>
										<component :is="getField(element).icon" />
									</template>
									<template v-if="!$device.isMobile" #default>
										{{ getField(element).label }}
									</template>
								</NButton>
							</NDropdown>
							<NButton v-if="!isDisabled(element.key)" circle secondary size="small" type="error"
								@click="schema.splice(index, 1)">
								<template #icon>
									<NIcon>
										<IconTrash />
									</NIcon>
								</template>
							</NButton>
						</NFlex>
					</template>
					<NFormItem :label="t('fieldName')" style="margin-bottom:20px">
						<template #feedback>
							{{ `#${getPath(table.schema ?? [], element.id, true) ?? '--'}` }}
						</template>
						<NInput v-model:value="schema[index].key" />
					</NFormItem>
					<NFormItem
						v-if="element.table === 'assets' || Array.isArray(element.type) || !['array', 'object'].includes(element.type)"
						:label="t('fieldDescription')">
						<NInput v-model:value="schema[index].description" />
					</NFormItem>
					<template v-if="element.table === 'assets'">
						<NFormItem :label="t('allowedFiles')">
							<NSelect multiple :render-label="selectRenderLabelWithIcon" :options="fileTypeSelectOptions"
								v-model:value="schema[index].accept" />
						</NFormItem>
						<NFormItem :label="t('uploadParams')">
							<NInput v-model:value="schema[index].params" />
							<template #feedback>
								{{ t('ie') }}: <strong>q=</strong>6&<strong>f=</strong>webp&<strong>fit=</strong>100
							</template>
						</NFormItem>
					</template>
					<template v-else-if="element.subType === 'select'">
						<NFormItem :label="t('options')">
							<NSelect
								:value="element.options ? (element.options.every(option => typeof option !== 'object') ? element.options : element.options.map(({ value }: any) => value)) : []"
								@update:value="(value: string[]) => schema[index].options = [...new Set(value)]"
								filterable multiple tag :show-arrow="false" :show="false" />
						</NFormItem>
						<NFormItem :label="t('allowCustomValues')" label-placement="left">
							<NSwitch v-model:value="schema[index].custom" />
						</NFormItem>
					</template>
					<template v-else-if="!Array.isArray(element.type) && element.type === 'object'">
						<NFormItem :label="t('expandByDefault')" label-placement="left">
							<NSwitch v-model:value="schema[index].expand" />
						</NFormItem>
					</template>
					<template v-else-if="element.subType === 'tags'">
						<NFormItem :label="t('valuesType')">
							<NSelect v-model:value="(schema[index].children as any)" filterable multiple
								:render-label="selectRenderLabelWithIcon" :options="valuesTypeSelectOptions" />
						</NFormItem>
					</template>
					<template
						v-else-if="!Array.isArray(element.type) && ((element.type === 'array' && element.children === 'table') || element.type === 'table')">
						<NFormItem :label="t('tableName')">
							<NSelect filterable v-model:value="schema[index].table" :options="tableSelectOptions" />
						</NFormItem>
					</template>
					<template v-if="!Array.isArray(element.type) && element.type === 'array'">
						<NFormItem :label="t('minimumItems')">
							<NInputNumber :value="schema[index].min"
								@update:value="(value) => { if (value) schema[index].min = value; else delete schema[index].min }" />
						</NFormItem>
						<NFormItem :label="t('maximumItems')">
							<NInputNumber :value="schema[index].max"
								@update:value="(value) => { if (value) schema[index].max = value; else delete schema[index].max }" />
						</NFormItem>
					</template>

					<NFormItem :label="t('unique')" label-placement="left"
						v-if="!['table', 'array', 'object'].includes((element.subType ?? element.type) as string)">
						<NSwitch v-model:value="schema[index].unique" />
					</NFormItem>
					<LazyTableSettingsSchema
						v-if="!Array.isArray(element.type) && ['array', 'object'].includes(element.type) && isArrayOfObjects(element.children)"
						v-model="element.children" v-model:expanded-names="expandedChildNames" />
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
	type Icon,
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
	NTooltip,
	type SelectOption,
} from "naive-ui";
import draggable from 'vuedraggable/src/vuedraggable'
import { isArrayOfObjects } from "inibase/utils";

defineTranslation({
	ar: {
		fieldName: "إسم الحقل",
		fieldDescription: "وصف الحقل",
		allowedFiles: "الملفات المسموح بها",
		options: "الخيارات",
		valuesType: "نوع القيم",
		showAsTable: "إظهار كجدول",
		labelText: "النص الظاهري",
		tableName: "إسم الجدول",
		labelImage: "الصورة", // TO-DO: support image in table field
		expandByDefault: "توسيع بشكل افتراضي",
		dragToMove: "اسحب للتحريك",
		fileType: {
			image: "صورة",
			video: "فيديو",
			audio: "صوت",
			document: "نص",
			archive: "أرشيف",
		},
		allowCustomValues: "السماح بإدخال قيم جديدة",
		username: "إسم المستخدم",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		role: "الصلاحية",
		createdBy: "أُنشأ من قبل",
		unique: "فريد",
		uploadParams: "إعدادات الرفع",
		minimumItems: "الحد الأدنى للعناصر",
		maximumItems: "الحد الأقصى للعناصر",
		ie: "على سبيل المثال",
	},
});

function isDisabled(key?: string) {
	if (key) {
		const defaultFields: string[] = ["id", "createdAt", "updatedAt"];
		switch (table.value.slug) {
			case "users":
				defaultFields.push(
					"username",
					"email",
					"password",
					"role",
					"createdBy",
				);
				break;
			case "pages":
				defaultFields.push("slug", "content", "seo");
				break;
			case "components":
				defaultFields.push("component", "config", "hideOn");
				break;
			default:
				break;
		}
		return defaultFields.includes(key);
	}
	return false;
}
const expandedNames = defineModel<string[]>("expandedNames");
const expandedChildNames = ref<string[]>();
function pushToChildrenSchema(type: string, index: number) {
	if (!schema.value[index].children)
		schema.value[index].children = [] as Schema;
	(schema.value[index].children as Schema).push({
		id: `temp-${randomID()}`,
		key: null,
		required: false,
		...handleSelectedSchemaType(type),
	} as any);
	expandedNames.value = [schema.value[index].id as string];
	const newElementId = (
		(schema.value[index].children as Schema).at(-1) as Field
	).id as string;
	expandedChildNames.value = [newElementId];
	setTimeout(
		() => document.getElementById(`element-${newElementId}`)?.scrollIntoView(),
		300,
	);
}
const schema = defineModel<Schema>({
	default: () => reactive([]),
});
const database = useState<Database>("database");
const table = useState<Table>("table");

function changeFieldType(
	{ id, key, required, children }: any,
	newType: string,
): Field {
	switch (newType) {
		case "object":
		case "array":
			return { id, key, type: newType, required, children };
		default:
			return {
				id,
				key,
				...(handleSelectedSchemaType(newType) as any),
				required,
			};
	}
}

function renderIcon(icon: Icon) {
	return () => h(NIcon, () => h(icon));
}

const fileTypeSelectOptions = [
	{
		label: t("fileType.image"),
		value: "image",
		icon: renderIcon(IconPhoto),
	},
	{
		label: t("fileType.video"),
		value: "video",
		icon: renderIcon(IconVideo),
	},
	{
		label: t("fileType.audio"),
		value: "audio",
		icon: renderIcon(IconMusic),
	},
	{
		label: t("fileType.documents"),
		value: "document",
		icon: renderIcon(IconFileDescription),
	},
	{
		label: t("fileType.archive"),
		value: "archive",
		icon: renderIcon(IconFileZip),
	},
];
function selectRenderLabelWithIcon(
	option: SelectOption & { icon: CallableFunction },
) {
	return h(NFlex, { align: "center" }, () => [
		option.icon(),
		option.label as string,
	]);
}

const valuesTypeSelectOptions = flatFieldsList()
	?.filter(({ key }) =>
		["string", "number", "password", "email", "url", "id"].includes(key),
	)
	.map((field) => ({
		label: field.label,
		value: field.key,
		icon: field.icon,
	}));

const tableSelectOptions = computed(() =>
	database.value.tables?.map(({ slug }) => ({
		label: t(slug),
		value: slug,
	})),
);
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
