<template>
	<NDrawer v-if="Drawer" :show="Drawer.show || false" @update:show="(show) => Drawer.show = show"
		:width="$device.isMobile ? '100%' : drawerWidth" resizable :placement="Language === 'ar' ? 'left' : 'right'"
		@update:width="width => (drawerWidth = width)" :trap-focus="false">
		<NDrawerContent closable>
			<template #header>
				<span v-if="Drawer.id">
					{{ t('edit') }}
					<NuxtLink
						:to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${Drawer.table}/${Drawer.id}/edit`">
						<NText type="primary">
							{{ itemLabel || t(Drawer.table) }}
							<NIcon size="small">
								<IconExternalLink />
							</NIcon>
						</NText>
					</NuxtLink>
				</span>
				<span v-else>
					{{ t('new') }} {{ t(Drawer.table) }}
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
						@click="Drawer.id ? formRef?.update() : formRef?.create()">
						<template #icon>
							<NIcon>
								<IconDeviceFloppy />
							</NIcon>
						</template>
						{{ Drawer.id ? t('update') : t('create') }}
					</NButton>
				</NFlex>
			</template>
			<NSpin :show="!!Loading.CREATE || !!Loading.UPDATE">
				<slot @after-create="onAfterUpdateCreate" @after-update="onAfterUpdateCreate">
					<Form ref="formRef" v-model="Drawer.data" :table="Drawer.table" @after-create="onAfterUpdateCreate"
						@after-update="onAfterUpdateCreate" v-model:schema="Drawer.schema"></Form>
				</slot>
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
	Drawer.value
		? database.value.tables?.find(({ slug }) => slug === Drawer.value.table)
		: undefined,
);

const Drawer = useState<DrawerRef>("drawer", () => ({}));

const formRef = ref<FormRef>();
const slots = defineSlots<{
	default(props: {
		onAfterCreate: () => Promise<void>;
		onAfterUpdate: () => Promise<void>;
	}): any;
}>();

const screenHalf = window.screen.width / 2;

async function loadDrawer() {
	Drawer.value.show = false;
	const key = `Drawer_${Drawer.value.table}_${Drawer.value.id}`;
	Loading.value[key] = true;
	Drawer.value.data = (
		await $fetch<apiResponse>(
			`${appConfig.apiBase}${database.value.slug}/${Drawer.value.table}/${Drawer.value.id}`,
		)
	).result;
	Loading.value[key] = false;
	Drawer.value.show = true;
}

async function onAfterUpdateCreate() {
	Object.assign(Drawer.value, {
		id: null,
		data: null,
		table: null,
		show: false,
	});
	await refreshNuxtData();
}

watch(Drawer, (value, originalValue) => {
	if (
		value?.show &&
		value.id &&
		((value.data && !Object.keys(value.data).length) ||
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
	if (table.value && Drawer.value)
		itemLabel.value = renderLabel(table.value, Drawer.value.data);
});
</script>