<template>
    <NDrawer v-if="drawer" v-model:show="drawer.show" :width="$device.isMobile ? '100%' : drawerWidth" resizable
        :placement="Language === 'ar' ? 'left' : 'right'" @update:width="val => (drawerWidth = val)">
        <NDrawerContent closable>
            <template #header>
                <span v-if="drawer.id">
                    {{ t('edit') }}
                    <NuxtLink
                        :to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${drawer.table}/${drawer.id}/edit`">
                        <NText type="primary">
                            {{ t(drawer.table) }}
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

                    <NButton round secondary type="primary" :loading="Loading.drawer"
                        @click="drawer.id ? updateDrawer() : createDrawer()">
                        <template #icon>
                            <NIcon>
                                <IconDeviceFloppy />
                            </NIcon>
                        </template>
                        {{ drawer.id ? t('update') : t('create') }}
                    </NButton>
                </NFlex>
            </template>

            <NForm ref="drawerFormRef" :model="drawer.data">
                <FieldS v-model="drawer.data" :schema="filteredSchema" />
            </NForm>
        </NdrawerContent>
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
	NForm,
	NIcon,
	NFlex,
	NText,
	type FormInst,
} from "naive-ui";

const appConfig = useAppConfig();
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const drawerWidth = useCookie<number | string>("drawerWidth", {
	sameSite: true,
});
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const drawerFormRef = ref<FormInst>();
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

const screenHalf = window.screen.width / 2;

onMounted(() => {
	document.onkeydown = (e) => {
		if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
		e.preventDefault();
		drawer.value.id ? updateDrawer() : createDrawer();
	};
});

const loadDrawer = async () => {
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
};

const updateDrawer = async () => {
	drawerFormRef.value?.validate(async (errors: any) => {
		if (!errors) {
			const bodyContent = JSON.parse(JSON.stringify(drawer.value));
			Loading.value.drawer = true;
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}${database.value.slug}/${bodyContent.table}/${bodyContent.id}`,
				{
					method: "PUT",
					body: bodyContent.data,
				},
			);
			if (!data) return window.$message.error(t("error"));
			if (data.result?.id) {
				window.$message.success(data.message);
				Loading.value.drawer = false;
				Object.assign(drawer.value, {
					id: null,
					data: {},
					table: null,
					show: false,
				});
				await refreshNuxtData();
			} else window.$message.error(data.message);
			Loading.value.drawer = false;
		} else window.$message.error(t("inputsAreInvalid"));
	});
};

const createDrawer = async () => {
	drawerFormRef.value?.validate(async (errors: any) => {
		if (!errors) {
			const bodyContent = JSON.parse(JSON.stringify(drawer.value));
			Loading.value.drawer = true;
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}${database.value.slug}/${bodyContent.table}`,
				{
					method: "POST",
					body: bodyContent.data,
				},
			);
			if (!data) return window.$message.error(t("error"));
			if (data.result?.id) {
				window.$message.success(data.message);
				Loading.value.drawer = false;
				Object.assign(drawer.value, {
					id: null,
					data: {},
					table: null,
					show: false,
				});
				await refreshNuxtData();
			} else window.$message.error(data.message);
			Loading.value.drawer = false;
		} else window.$message.error(t("inputsAreInvalid"));
	});
};

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

const filteredSchema = computed(
	() =>
		database.value.tables
			?.find(({ slug }) => slug === drawer.value.table)
			?.schema?.filter(
				({ key }) =>
					!["id", "createdAt", "createdBy", "updatedAt"].includes(key),
			) ?? [],
);
</script>