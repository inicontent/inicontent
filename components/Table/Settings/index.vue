<template>
	<NGrid x-gap="12" cols="12" layout-shift-disabled>
		<NGridItem :span="!$device.isMobile ? 10 : 12">
			<NSpin :show="!!Loading.updateTable">
				<NCard :title="t('tableSettings')" hoverable>
					<template #header-extra>
						<NButtonGroup>
							<NTooltip :delay="500">
								<template #trigger>
									<NPopconfirm :show-icon="false" @positive-click="deleteTable">
										<template #activator>
											<NButton :disabled="isUnDeletable" type="error" tertiary round
												:loading="Loading.deleteTable">
												<template #icon>
													<NIcon>
														<IconTrash />
													</NIcon>
												</template>
											</NButton>
										</template>
										{{ t("theFollowingActionIsIrreversible") }}
									</NPopconfirm>
								</template>
								{{ t("deleteTable") }}
							</NTooltip>
							<NButton round type="primary" secondary :loading="Loading.updateTable" @click="updateTable">
								<template #icon>
									<NIcon>
										<IconDeviceFloppy />
									</NIcon>
								</template>
								<template v-if="!$device.isMobile" #default>
									{{ t('save') }}
								</template>
							</NButton>
						</NButtonGroup>
					</template>
					<NFlex vertical>
						<NCard :title="t('generalSettings')" id="generalSettings" hoverable>
							<NForm ref="settingsFormRef" :model="tableCopy">
								<FieldS v-model="tableCopy" :schema="generalSettingsSchema.slice(0, 2)" />
								<NFormItem path="defaultSearchableColumns" :label="t('defaultSearchableColumns')">
									<NCascader multiple clearable filterable expand-trigger="hover"
										check-strategy="child" :cascard="false"
										v-model:value="tableCopy.defaultSearchableColumns"
										:options="searchInSelectOptions" />
								</NFormItem>
								<NFormItem path="localLabel" :label="t('label')">
									<NDynamicTags v-model:value="tableCopy.localLabel" :onCreate="onAppendToLabel"
										:render-tag="renderSingleLabel">
										<template #input="{ submit, deactivate }">
											<NSelect size="small" filterable tag show :options="generateLabelOptions"
												@update:value="submit($event)"
												@update:show="(value) => value ? '' : deactivate()" />
										</template>
									</NDynamicTags>
								</NFormItem>
								<FieldS v-model="tableCopy.config" :schema="generalSettingsSchema.slice(2)" />
							</NForm>
						</NCard>
						<NCard :title="t('schemaSettings')" id="schemaSettings" hoverable>
							<template #header-extra>
								<NButtonGroup>
									<NTooltip :delay="500">
										<template #trigger>
											<NButton tertiary round :type="showDraggable ? 'primary' : 'default'"
												@click="showDraggable =
													!showDraggable">
												<template #icon>
													<NIcon>
														<IconArrowsSort />
													</NIcon>
												</template>
											</NButton>
										</template>
										{{ t("changeOrder") }}
									</NTooltip>
									<NDropdown :options="fieldsList()" style="max-height: 200px" scrollable
										@select="pushToSchema">
										<NButton secondary type="primary" round>
											<template #icon>
												<NIcon>
													<IconPlus />
												</NIcon>
											</template>
										</NButton>
									</NDropdown>
								</NButtonGroup>
							</template>
							<NEmpty v-if="!tableCopy.schema || tableCopy.schema.length === 0" />
							<NForm :class="{ notSortable: !showDraggable }" size="small">
								<TableSettingsSchema v-model="tableCopy.schema"
									v-model:expanded-names="expandedNames" />
							</NForm>
						</NCard>
					</NFlex>
				</NCard>
			</NSpin>
		</NGridItem>
		<NGridItem v-if="!$device.isMobile" span="2">
			<NAnchor affix listen-to="#container" :top="88" style="z-index: 1;" :bound="90">
				<NAnchorLink :title="t('generalSettings')" href="#generalSettings" />
				<NAnchorLink :title="t('schemaSettings')" href="#schemaSettings" />
			</NAnchor>
		</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
import {
	IconArrowsSort,
	IconDeviceFloppy,
	IconPlus,
	IconTrash,
} from "@tabler/icons-vue";
import { flattenSchema, isArrayOfObjects, isValidID } from "inibase/utils";
import {
	type FormInst,
	NAnchor,
	NAnchorLink,
	NButton,
	NCard,
	NDropdown,
	NEmpty,
	NFlex,
	NForm,
	NGridItem,
	NGrid,
	NIcon,
	NPopconfirm,
	NTooltip,
	NSpin,
	NDynamicTags,
	NFormItem,
	NSelect,
	NTag,
	NButtonGroup,
	NCascader,
} from "naive-ui";

onMounted(() => {
	document.onkeydown = (e) => {
		if (!((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "s" || e.key === "س"))) return;
		e.preventDefault();
		updateTable();
	};
});

defineTranslation({
	ar: {
		generalSettings: "إعدادات عامة",
		schemaSettings: "إعدادات الأعمدة",
		save: "حِفظ",
		required: "إلزامي",
		changeOrder: "تغيير الترتيب",
		label: "الإسم الظاهري",
		deleteTable: "حذف الجدول",
		defaultSearchableColumns: "الأعمدة الإفتراضية للبحث",
		compression: "ضغط البيانات",
		prepend: "إضافة مقدمة",
		recentItemsAppearAtTheTop: "العناصر الحديثة تظهر في الأعلى",
		cache: "التخزين المؤقت",
	},
});

const expandedNames = ref<string[]>();
function pushToSchema(type: string) {
	tableCopy.value.schema.splice(-2, 0, {
		id: `temp-${randomID()}`,
		key: null,
		required: false,
		...handleSelectedSchemaType(type),
	});
	const newElementId = tableCopy.value.schema.at(-3).id;
	expandedNames.value = [newElementId];
	setTimeout(
		() => document.getElementById(`element-${newElementId}`)?.scrollIntoView(),
		300,
	);
}

const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute();
const router = useRouter();
const showDraggable = ref(false);
const database = useState<Database>("database");
const table = useState<Table>("table");
const settingsFormRef = ref<FormInst | null>(null);
const tableCopy = ref(JSON.parse(JSON.stringify(table.value)));

async function updateTable() {
	settingsFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = JSON.parse(
				JSON.stringify(
					(({ onRequest, onResponse, ...rest }) => ({
						...rest,
					}))(tableCopy.value),
				),
			);
			Loading.value.updateTable = true;

			if (bodyContent.localLabel)
				bodyContent.label = bodyContent.localLabel
					.map(({ value }: { value: string }) => value)
					.join(" ");

			const data = await $fetch<apiResponse<Table>>(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug
				}/${route.params.table}`,
				{
					method: "PUT",
					body: bodyContent,
				},
			);
			const tableIndex = database.value.tables?.findIndex(
				({ slug }) => slug === route.params.table,
			);
			if (
				tableIndex !== undefined &&
				tableIndex !== -1 &&
				database.value.tables &&
				data?.result
			) {
				database.value.tables[tableIndex] = data.result;
				table.value = data.result;
				tableCopy.value = data.result;

				if (route.params.table !== data.result.slug)
					router.replace({
						params: { table: data.result.slug },
					});
				window.$message.success(data?.message ?? t("success"));
			} else window.$message.error(data?.message ?? t("error"));

			Loading.value.updateTable = false;
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

const isUnDeletable = computed(() =>
	["users", "pages", "components"].includes(table.value?.slug),
);

async function deleteTable() {
	Loading.value.deleteTable = true;
	const data = await $fetch<apiResponse>(
		`${appConfig.apiBase}inicontent/databases/${database.value.slug
		}/${route.params.table}`,
		{
			method: "DELETE",
		},
	);
	if (data?.result) {
		const tableIndex = database.value.tables?.findIndex(
			({ slug }) => slug === route.params.table,
		);
		if (tableIndex !== undefined && tableIndex !== -1)
			database.value.tables = database.value.tables?.toSpliced(tableIndex, 1);
		Loading.value.deleteTable = false;
		window.$message.success(data?.message ?? t("success"));
		setTimeout(
			async () =>
				await navigateTo(
					`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables`,
				),
			800,
		);
	} else window.$message.error(data?.message ?? t("error"));
	Loading.value.deleteTable = false;
}

const flattenCopySchema = computed<Schema>(() =>
	flattenSchema(tableCopy.value.schema),
);
tableCopy.value.localLabel = tableCopy.value.label
	?.split(/(@\w+)/g)
	.filter((value: string) => value != "")
	.map((label: string) => {
		if (label.startsWith("@"))
			return {
				label: flattenCopySchema.value.find(({ id }) => id === label.slice(1))
					?.key,
				value: label,
			};
		return {
			label,
			value: label,
		};
	});
function onAppendToLabel(label: string) {
	if (label.startsWith("@") && isValidID(label.slice(1)))
		return {
			label:
				flattenCopySchema.value.find(({ id }) => id === label.slice(1))?.key ??
				"undefined",
			value: label,
		};

	return {
		label: label,
		value: label,
	};
}
function renderSingleLabel(
	labelObject: { label: string; value: string },
	index: number,
) {
	return h(
		NTag,
		{
			type:
				labelObject.value.startsWith("@") &&
					isValidID(labelObject.value.slice(1))
					? "primary"
					: "default",
			closable: true,
			onClose: () => {
				tableCopy.value.localLabel.splice(index, 1);
			},
		},
		{
			default: () => labelObject.label,
		},
	);
}

// TO-DO: Make it reactive
const generateLabelOptions = computed(() => {
	let RETURN: {
		label: string;
		value: string | number;
	}[] = [];
	if (!flattenCopySchema.value) return RETURN;

	for (const field of flattenCopySchema.value) {
		if (field.id?.toString().startsWith("temp-")) continue;
		if (
			(Array.isArray(field.type) && field.subType !== "tags") ||
			(field.type === "array" &&
				field.children &&
				isArrayOfObjects(field.children)) ||
			field.type === "table"
		)
			continue;
		RETURN.push({
			label: field.key,
			value: `@${field.id}`,
		});
	}
	return RETURN;
});

const searchInSelectOptions = computed(() =>
	generateSearchInOptions(table.value?.schema?.slice(1, -2), undefined, true),
);

const generalSettingsSchema = reactive<Schema>([
	{
		key: "slug",
		type: "string",
		required: true,
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
	},
	{
		key: "icon",
		type: "string",
		subType: "icon",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
	},
	{
		key: "compression",
		type: "boolean",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
	},
	{
		key: "cache",
		type: "boolean",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
	},
	{
		key: "prepend",
		type: "boolean",
		description: "recentItemsAppearAtTheTop",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
				disabled: true,
			}
			: {},
	},
]);

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)} : ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>