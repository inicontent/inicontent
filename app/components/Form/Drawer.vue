<template><template v-for="(drawer, index) in Drawers" :key="index">
		<NDrawer :onEsc :show="drawer.show || false" @update:show="(show) => onUpdateShow(index, show)"
			:width="$device.isMobile ? '100%' : drawer.width" @update:width="(width) => {
				if (index === 0) defaultWidth = width
				drawer.width = width
			}" resizable :placement="Language === 'ar' ? 'left' : 'right'" :class="`${drawer.table.replaceAll(' ','_')}-drawer`"
			:id="index === (Drawers.length - 1) ? 'activeDrawer' : undefined" :close-on-esc="false">
			<NDrawerContent closable :native-scrollbar="false">
				<template #header>
					<span v-if="drawer.id">
						{{ t(drawer.mode === 'view' ? 'view' : 'edit') }}
						<NuxtLink
							:to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${drawer.table}/${drawer.id}${drawer.mode === 'view' ? '' : '/edit'}`">
							<NText type="primary">
								{{ itemsLabels[index] }}
								<NIcon size="small">
									<Icon :name="drawer.mode === 'view' ? 'tabler:eye' : 'tabler:external-link'" />
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
						<NButton v-if="!$device.isMobile" round secondary type="info" @click="toggleDrawerWidth(index)">
							<template #icon>
								<NIcon>
									<Icon name="tabler:chevron-right"
										v-if="drawer.width && (typeof drawer.width === 'string' || drawer.width >= screenHalf)" />
									<Icon name="tabler:chevron-left" v-else />
								</NIcon>
							</template>
						</NButton>

						<NButton v-if="drawer.mode === 'view' && canEditDrawer(drawer)" round secondary type="info"
							@click="switchDrawerToEdit(index)">
							<template #icon>
								<NIcon>
									<Icon name="tabler:pencil" />
								</NIcon>
							</template>
							{{ t('edit') }}
						</NButton>

						<NButton v-else round secondary type="primary"
							:disabled="!drawer.schema?.length || Loading.UPDATE || Loading.CREATE || Loading.SCHEMA"
							:loading="Loading.UPDATE || Loading.CREATE || Loading.SCHEMA"
							@click="drawer.id ? formRefs[index]?.update() : formRefs[index]?.create()">
							<template #icon>
								<NIcon>
									<Icon name="tabler:device-floppy" />
								</NIcon>
							</template>
							{{ drawer.id ? t('update') : t('create') }}
						</NButton>
					</NFlex>
				</template>
				<div class="drawerSpin" v-if="isDrawerFormMode(drawer) && (!drawer.schema?.length || Loading.UPDATE || Loading.CREATE)">
					<NSpin />
				</div>

				<slot v-if="isDrawerFormMode(drawer)" @after-create="() => onAfterUpdateCreate(index)" @after-update="() => onAfterUpdateCreate(index)">
					<Form :ref="(el: any) => formRefs[index] = el" v-model="drawer.data" :table="drawer.table"
						@after-create="() => onAfterUpdateCreate(index)"
						@after-update="() => onAfterUpdateCreate(index)" v-model:schema="drawer.schema"></Form>
				</slot>

				<NSpin v-else :show="!!(drawer.id && Loading[`Drawer_${drawer.table}_${drawer.id}`])">
					<LazyDataS v-if="drawer.data && getDrawerTable(drawer)?.schema"
						:value="drawer.data"
						:schema="(getDrawerTable(drawer)?.schema ?? [])" />
				</NSpin>
			</NDrawerContent>
		</NDrawer>
	</template>
</template>

<script setup lang="ts">
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");

defineSlots<{
	default({
		onAfterCreate,
		onAfterUpdate,
	}: {
		onAfterCreate: () => any;
		onAfterUpdate: () => any;
	}): {
		onAfterCreate: () => any;
		onAfterUpdate: () => any;
	};
}>();

const Drawers = useState<DrawerRef>("drawers", () => []);
const defaultWidth = useCookie<number | string>("width", {
	sameSite: true,
});
const formRefs = ref<FormRef[]>([]);

const screenHalf = window.screen.width / 2;

function getDrawerTable(drawer?: DrawerRef[number]) {
	if (!drawer?.table) return undefined;
	return database.value.tables?.find(({ slug }) => slug === drawer.table);
}

function isDrawerFormMode(drawer?: DrawerRef[number]) {
	return drawer?.mode !== "view" || !drawer?.id;
}

function canEditDrawer(drawer?: DrawerRef[number]) {
	return !!(drawer?.id && getDrawerTable(drawer)?.allowedMethods?.includes("u"));
}

function switchDrawerToEdit(index: number) {
	const drawer = Drawers.value[index];
	if (!drawer?.id) return;
	drawer.mode = "edit";
}

function onUpdateShow(index: number, show: boolean) {
	if (!Drawers.value[index]) return;
	Drawers.value[index].show = show;
	if (!show) {
		for (let i = 0; i < index; i++) {
			const drawer = Drawers.value[i];
			if (!drawer || typeof drawer.width !== "number") continue;
			const lastIncrement = drawer.nestedWidthIncrements?.pop();
			if (!lastIncrement) continue;
			drawer.width = Math.max(251, drawer.width - lastIncrement);
		}
		setTimeout(() => Drawers.value.splice(index, 1), 100);
	}
}

async function onAfterUpdateCreate(index: number) {
	onUpdateShow(index, false);
	const drawer = Drawers.value[index];
	if (!drawer) return;
	await refreshNuxtData(`${database.value.slug}/${drawer.table}`);
}

const toggleDrawerWidth = (index: number) => {
	const drawer = Drawers.value[index];
	if (!drawer) return;
	if (typeof drawer.width === "string") drawer.width = 251;
	else
		drawer.width = !drawer.width || drawer.width >= screenHalf ? 251 : "100%";
	nextTick(() => {
		if (drawer.width) defaultWidth.value = drawer.width;
	});
};
function onEsc() {
	const openDrawerIndex = Drawers.value.findLastIndex((drawer) => drawer.show);
	if (openDrawerIndex !== -1) {
		const previewModal = document.querySelector(".assetLightbox");
		if (!previewModal) onUpdateShow(openDrawerIndex, false);
	}
}
const itemsLabels = ref<string[]>([]);
watchEffect(() => {
	for (let index = 0; index < Drawers.value.length; index++) {
		const drawer = Drawers.value[index];
		if (!drawer) continue;
		const table = drawer.table
			? database.value.tables?.find(({ slug }) => slug === drawer.table)
			: undefined;

		if (table) {
			itemsLabels.value[index] = renderLabel(table, drawer.data);
			continue;
		}
		itemsLabels.value[index] = "--";
	}
});

onBeforeRouteLeave(() => {
	Drawers.value = [];
});

onBeforeRouteUpdate((_to, _from, next) => {
	const openDrawerIndex = Drawers.value.findLastIndex((drawer) => drawer.show);
	if (openDrawerIndex !== -1) {
		onUpdateShow(openDrawerIndex, false);
		next(false); // Prevent navigation until all drawers are closed
	} else next(); // Allow navigation without altering the query in the URL
});
</script>