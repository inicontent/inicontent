<template>
	<NDrawer v-if="drawer" v-model:show="drawer.show" :width="$device.isMobile ? '100%' : drawerWidth" resizable
		:placement="Language === 'ar' ? 'left' : 'right'" @update:width="width => (drawerWidth = width)">
		<NDrawerContent closable>
			<template #header>
				<span v-if="drawer.id">
					{{ t('edit') }}
					<NuxtLink
						:to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${drawer.table}/${drawer.id}/edit`">
						<NText type="primary">
							{{ itemLabel || t(drawer.table) }}
							<NIcon size="small">
								<IconExternalLink />
							</NIcon>
						</NText>
					</NuxtLink>
				</span>
				<span v-else>
					{{ t('new') }} {{ t(drawer.table) }}
				</span>
			</template>

			<template #footer>
				<NFlex :style="{ width: '100%' }" :justify="!$device.isMobile ? 'space-between' : 'end'">
					<NButton v-if="!$device.isMobile" round secondary type="info" @click="toggleDrawerWidth()">
						<template #icon>
							<NIcon>
								<IconChevronRight v-if="typeof drawerWidth === 'string' || drawerWidth >= screenHalf" />
								<IconChevronLeft v-else />
							</NIcon>
						</template>
					</NButton>

					<NButton round secondary type="primary"
						:loading="Loading.UPDATE || Loading.CREATE || Loading.SCHEMA"
						@click="drawer.id ? formRef?.update() : formRef?.create()">
						<template #icon>
							<NIcon>
								<IconDeviceFloppy />
							</NIcon>
						</template>
						{{ drawer.id ? t('update') : t('create') }}
					</NButton>
				</NFlex>
			</template>
			<NSpin :show="!!Loading.CREATE || !!Loading.UPDATE">
				<FieldForm ref="formRef" v-model="drawer.data" @after-create="onAfterUpdateCreate"
					@after-update="onAfterUpdateCreate" v-bind="$props">
					<slot></slot>
				</FieldForm>
			</NSpin>
		</NDrawerContent>
	</NDrawer>
</template>

<script setup lang="ts">
import {
	IconChevronLeft,
	IconChevronRight,
	IconDeviceFloppy,
	IconExternalLink,
} from "@tabler/icons-vue";
import {
	NButton,
	NDrawer,
	NDrawerContent,
	NIcon,
	NFlex,
	NText,
	NSpin,
} from "naive-ui";

const appConfig = useAppConfig();
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const drawerWidth = useCookie<number | string>("drawerWidth", {
	sameSite: true,
});
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const table = computed<Table | undefined>(() =>
	drawer.value
		? database.value.tables?.find(({ slug }) => slug === drawer.value.table)
		: undefined,
);

const drawer = useState<{
	show: boolean;
	id: null | string;
	table: null | string;
	data: any;
}>("Drawer", () => ({
	show: false,
	id: null,
	table: null,
	data: {},
}));

const formRef = ref<FormRef>();

const screenHalf = window.screen.width / 2;

async function loadDrawer() {
	drawer.value.show = false;
	const key = `Drawer_${drawer.value.table}_${drawer.value.id}`;
	Loading.value[key] = true;
	drawer.value.data = (
		await $fetch<apiResponse>(
			`${appConfig.apiBase}${database.value.slug}/${drawer.value.table}/${drawer.value.id}`,
		)
	).result;
	Loading.value[key] = false;
	drawer.value.show = true;
}

async function onAfterUpdateCreate() {
	Object.assign(drawer.value, {
		id: null,
		data: {},
		table: null,
		show: false,
	});
	await refreshNuxtData();
}

watch(drawer, (value, originalValue) => {
	if (
		value?.show &&
		value.id &&
		(!Object.keys(value.data).length ||
			value.table !== originalValue.table ||
			value.id !== originalValue.id)
	)
		loadDrawer();
});

const toggleDrawerWidth = () => {
	if (typeof drawerWidth.value === "string") drawerWidth.value = 251;
	else drawerWidth.value = drawerWidth.value >= screenHalf ? 251 : "100%";
};

const itemLabel = useState("itemLabel");
watchEffect(() => {
	if (table.value && drawer.value)
		itemLabel.value = renderLabel(
			table.value.label,
			table.value.schema,
			drawer.value.data,
		);
});
</script>