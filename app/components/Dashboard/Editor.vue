<template>
	<NFlex vertical :size="24">
		<NCard :title="t('dashboardSettings')">
			<NForm label-placement="left" label-width="120">
				<NFormItem :label="t('name')">
					<NInput v-model:value="model.name" :placeholder="t('dashboardName')" />
				</NFormItem>
				<NFormItem :label="t('description')">
					<NInput
						v-model:value="model.description"
						type="textarea"
						:placeholder="t('description')"
						:rows="2"
					/>
				</NFormItem>
				<LazyFieldIcon v-model="model.icon" :field="{ key: 'icon', type: 'string', subType: 'icon' }" />
			</NForm>
		</NCard>

		<NCard :title="t('widgets')">
			<template #header-extra>
				<NButton size="small" @click="addWidget" type="primary" secondary>
					<template #icon>
						<NIcon>
							<Icon name="tabler:plus" />
						</NIcon>
					</template>
					{{ t("addWidget") }}
				</NButton>
			</template>

			<draggable
				:list="model.widgets"
				item-key="id"
				handle=".drag-handle"
				:animation="200"
			>
				<template #item="{ element: widget, index }">
					<NCard
						size="small"
						:style="{ marginBottom: '12px' }"
						:title="widget.title || t('untitledWidget')"
					>
						<template #header-extra>
							<NFlex :size="4">
								<span
									class="drag-handle"
									style="cursor: grab; display: inline-flex; align-items: center; padding: 4px"
								>
									<NIcon :size="16">
										<Icon name="tabler:grip-vertical" />
									</NIcon>
								</span>
								<NButton
									size="tiny"
									quaternary
									@click="editingWidgetIndex = index"
								>
									<template #icon>
										<NIcon>
											<Icon name="tabler:edit" />
										</NIcon>
									</template>
								</NButton>
								<NButton
									size="tiny"
									quaternary
									type="error"
									@click="removeWidget(index)"
								>
									<template #icon>
										<NIcon>
											<Icon name="tabler:trash" />
										</NIcon>
									</template>
								</NButton>
							</NFlex>
						</template>
						<NFlex :size="8">
							<NTag size="small" :bordered="false" type="info">{{
								t(widget.type)
							}}</NTag>
							<NTag size="small" :bordered="false">{{ widget.table || "—" }}</NTag>
							<NTag v-if="widget.size" size="small" :bordered="false" type="warning">{{
								t(widget.size)
							}}</NTag>
						</NFlex>
					</NCard>
				</template>
			</draggable>

			<NEmpty v-if="!model.widgets?.length" :description="t('noWidgets')" />
		</NCard>

		<NFlex justify="end">
			<NButton @click="$router.back()">{{ t("cancel") }}</NButton>
			<NButton type="primary" :loading="saving" @click="save">
				{{ t("save") }}
			</NButton>
		</NFlex>

		<NDrawer
			v-model:show="showWidgetDrawer"
			:width="420"
			placement="right"
		>
			<NDrawerContent :title="t('editWidget')" closable>
				<DashboardWidgetEditor
					v-if="editingWidget"
					v-model="editingWidget"
				/>
				<template #footer>
					<NButton type="primary" @click="showWidgetDrawer = false">
						{{ t("confirm") }}
					</NButton>
				</template>
			</NDrawerContent>
		</NDrawer>
	</NFlex>
</template>

<script lang="ts" setup>
import draggable from "vuedraggable";

const props = defineProps<{
	dashboard: Dashboard;
	databaseSlug: string;
}>();

const emit = defineEmits<{
	saved: [dashboard: Dashboard];
}>();

const config = useRuntimeConfig();
const database = useState<Database>("database");
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useSessionCookie();

const model = ref<Dashboard>({ ...props.dashboard, widgets: [...(props.dashboard.widgets ?? [])] });
const saving = ref(false);
const editingWidgetIndex = ref<number | null>(null);
const showWidgetDrawer = ref(false);

const editingWidget = computed({
	get: () =>
		editingWidgetIndex.value !== null
			? model.value.widgets?.[editingWidgetIndex.value] ?? null
			: null,
	set: (v) => {
		if (editingWidgetIndex.value !== null && v && model.value.widgets) {
			model.value.widgets[editingWidgetIndex.value] = v;
		}
	},
});

watch(editingWidgetIndex, (v) => {
	showWidgetDrawer.value = v !== null;
});

watch(showWidgetDrawer, (v) => {
	if (!v) editingWidgetIndex.value = null;
});

function addWidget() {
	if (!model.value.widgets) model.value.widgets = [];
	const newWidget: Widget = {
		id: `w_${Date.now()}`,
		type: "counter",
		title: "",
		table: "",
		operation: "count",
		size: "small",
		dateRange: "all",
	};
	model.value.widgets.push(newWidget);
	editingWidgetIndex.value = model.value.widgets.length - 1;
}

function removeWidget(index: number) {
	model.value.widgets?.splice(index, 1);
}

async function save() {
	if (!model.value.name) {
		window.$message.error(t("inputsAreInvalid"));
		return;
	}
	saving.value = true;
	try {
		const slug =
			props.databaseSlug ? `${props.databaseSlug}/` : "";
		const isUpdate = !!props.dashboard.id;
		const url = isUpdate
			? `${config.public.apiBase}${slug}dashboards/${props.dashboard.id}`
			: `${config.public.apiBase}${slug}dashboards`;

		const res = await $fetch<apiResponse<Dashboard>>(url, {
			method: isUpdate ? "PUT" : "POST",
			body: {
				name: model.value.name,
				description: model.value.description,
				icon: model.value.icon,
				widgets: model.value.widgets,
			},
			params: {
				locale: Language.value,
				[`${props.databaseSlug}_sid`]: sessionID.value,
			},
			credentials: "include",
		});

		if (res.result) {
			window.$message.success(res.message);
			emit("saved", res.result);
		} else {
			window.$message.error(res.message ?? t("error"));
		}
	} catch {
		window.$message.error(t("error"));
	}
	saving.value = false;
}
</script>
