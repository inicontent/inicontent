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
										<template #trigger>
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
								<NFormItem path="defaultTableColumns" :label="t('defaultTableColumns')">
									<NCascader multiple clearable filterable expand-trigger="hover"
										check-strategy="child" :cascard="false"
										v-model:value="tableCopy.defaultTableColumns"
										:options="searchInSelectOptions" />
								</NFormItem>
								<NFormItem path="localLabel" :label="t('label')">
									<NDynamicTags v-model:value="tableCopy.localLabel" :onCreate="onAppendToLabel"
										:render-tag="renderSingleLabel">
										<template #input="{ submit, deactivate }">
											<NSelect ref="singleLabelSelect" size="small" clearable filterable show tag
												:options="searchInSelectOptions" @update:value="submit($event)"
												@update:show="(value) => value ? '' : deactivate()" />
										</template>
										<template #trigger="{ activate, disabled }">
											<NButton size="small" tertiary round
												@click="activate(), focusSingleLabelSelect()" :disabled>
												<template #icon>
													<NIcon>
														<IconPlus />
													</NIcon>
												</template>
											</NButton>
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
import { flattenSchema, isValidID } from "inibase/utils";
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
	NTag,
	NButtonGroup,
	NCascader,
	NSelect,
} from "naive-ui";

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return;
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
		disableIdEncryption: "إلغاء تشفير المعرف, وإعتماد الأرقام",
		decodeID: "إلغاء تشفير المعرف",
		prepend: "إضافة مقدمة",
		recentItemsAppearAtTheTop: "العناصر الحديثة تظهر في الأعلى",
		cache: "التخزين المؤقت",
		log: "سجل التتبع",
		enableActivityLog: "تفعيل سجل عمليات الجدول",
		defaultTableColumns: "الأعمدة الإفتراضية للجدول",
	},
});

const expandedNames = ref<string[]>();
function pushToSchema(type: string) {
	tableCopy.value.schema?.splice(-2, 0, {
		id: `temp-${randomID()}`,
		key: "",
		required: false,
		...(handleSelectedSchemaType(type) as any),
	});
	const newElementId = tableCopy.value.schema?.at(-3)?.id as string | undefined;
	if (newElementId) expandedNames.value = [newElementId];
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
const tableCopy = ref<
	Table & {
		localLabel?: { value: string; label: string }[];
	}
>(toRaw(table.value));

async function updateTable() {
	settingsFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = (({ onRequest, onResponse, ...rest }) => ({
				...rest,
			}))(tableCopy.value);
			Loading.value.updateTable = true;
			// TO-DO: Fix
			const oldAllowedMethods = bodyContent.allowedMethods;
			if (bodyContent.localLabel)
				bodyContent.label = bodyContent.localLabel
					.map(({ value }: { value: string }) => value)
					.join(" ");

			const data = await $fetch<
				apiResponse<Table & { localLabel?: { value: string; label: string }[] }>
			>(
				`${appConfig.apiBase}inicontent/databases/${
					database.value.slug
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
				data.result.allowedMethods = oldAllowedMethods;
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
		`${appConfig.apiBase}inicontent/databases/${
			database.value.slug
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
	tableCopy.value.schema ? flattenSchema(tableCopy.value.schema as any) : [],
);
const singleLabelSelect = ref();
function focusSingleLabelSelect() {
	setTimeout(() => singleLabelSelect.value?.focusInput(), 200);
}
tableCopy.value.localLabel = tableCopy.value.label
	?.split(/(@\w+)/g)
	.filter((value: string) => value.trim() != "")
	.map((label: string) => {
		if (label.startsWith("@"))
			return {
				label:
					flattenCopySchema.value.find(({ id }) => id === label.slice(1))
						?.key ?? "",
				value: label,
			};
		return {
			label,
			value: label,
		};
	});
watch(
	() => tableCopy.value?.localLabel,
	(newValue) => {
		if (newValue?.length) {
			const localLabelWithNoEmptys = newValue.filter(
				({ label }) => label.trim() !== "",
			);
			if (localLabelWithNoEmptys.length !== newValue.length)
				tableCopy.value.localLabel = localLabelWithNoEmptys;
		}
	},
);
function onAppendToLabel(label: string) {
	if (!label.startsWith("@") && isValidID(label)) label = `@${label}`;
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
			round: true,
			bordered: false,
			onClose: () => {
				tableCopy.value.localLabel?.splice(index, 1);
			},
		},
		{
			default: () => labelObject.label,
		},
	);
}

const searchInSelectOptions = computed(() =>
	generateSearchInOptions(table.value?.schema, undefined, true),
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
		width: 2,
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
		width: 2,
	},
	{
		key: "compression",
		type: "boolean",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
					disabled: true,
				}
			: {},
		width: 5,
	},
	{
		key: "cache",
		type: "boolean",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
					disabled: true,
				}
			: {},
		width: 5,
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
		width: 5,
	},
	{
		key: "decodeID",
		type: "boolean",
		description: "disableIdEncryption",
		inputProps: ["users", "pages", "components"].includes(table.value?.slug)
			? {
					disabled: true,
				}
			: {},
		width: 5,
	},
	{
		key: "log",
		type: "boolean",
		description: "enableActivityLog",
		width: 5,
	},
]);

useHead({
	title: `${t(database.value.slug)} | ${t(table.value?.slug)} : ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>