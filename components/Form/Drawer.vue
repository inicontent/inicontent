<template>
	<template v-for="(drawer, index) in Drawers" :key="index">
		<NDrawer @esc="drawer.show = false" :show="drawer.show || false"
			@update:show="(show) => onUpdateShow(index, show)" :width="drawer.width" @update:width="(width) => {
				if (index === 0) defaultWidth = width
				drawer.width = width
			}" resizable :placement="Language === 'ar' ? 'left' : 'right'">
			<NDrawerContent closable>
				<template #header>
					<span v-if="drawer.id">
						{{ t('edit') }}
						<NuxtLink
							:to="`${$route.params.database ? `/${$route.params.database}` : ''}/admin/tables/${drawer.table}/${drawer.id}/edit`">
							<NText type="primary">
								{{ itemsLabels[index] }}
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
						<NButton v-if="!$device.isMobile" round secondary type="info" @click="toggleDrawerWidth(index)">
							<template #icon>
								<NIcon>
									<IconChevronRight
										v-if="drawer.width && (typeof drawer.width === 'string' || drawer.width >= screenHalf)" />
									<IconChevronLeft v-else />
								</NIcon>
							</template>
						</NButton>

						<NButton round secondary type="primary"
							:disabled="!drawer.schema?.length || Loading.UPDATE || Loading.CREATE || Loading.SCHEMA"
							:loading="Loading.UPDATE || Loading.CREATE || Loading.SCHEMA"
							@click="drawer.id ? formRefs[index]?.update() : formRefs[index]?.create()">
							<template #icon>
								<NIcon>
									<IconDeviceFloppy />
								</NIcon>
							</template>
							{{ drawer.id ? t('update') : t('create') }}
						</NButton>
					</NFlex>
				</template>
				<div class="drawerSpin" v-if="!drawer.schema?.length || !!Loading.CREATE || !!Loading.UPDATE">
					<NSpin />
				</div>

				<slot @after-create="() => onAfterUpdateCreate(index)" @after-update="() => onAfterUpdateCreate(index)">
					<Form :ref="(el: any) => formRefs[index] = el" v-model="drawer.data" :table="drawer.table"
						@after-create="() => onAfterUpdateCreate(index)"
						@after-update="() => onAfterUpdateCreate(index)" v-model:schema="drawer.schema"></Form>
				</slot>
			</NDrawerContent>
		</NDrawer>
	</template>
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

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");

defineSlots<{
	default({
		onAfterCreate,
		onAfterUpdate,
	}: { onAfterCreate: () => any; onAfterUpdate: () => any }): {
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

function onUpdateShow(index: number, show: boolean) {
	Drawers.value[index].show = show;
	if (!show) setTimeout(() => Drawers.value.splice(index, 1), 200);
}

async function onAfterUpdateCreate(index: number) {
	Drawers.value[index].show = false;
	setTimeout(() => Drawers.value.splice(index, 1), 100);
	await refreshNuxtData();
	return Drawers.value[index];
}

const toggleDrawerWidth = (index: number) => {
	const drawer = Drawers.value[index];
	if (typeof drawer.width === "string") drawer.width = 251;
	else
		drawer.width = !drawer.width || drawer.width >= screenHalf ? 251 : "100%";
};

const itemsLabels = ref<string[]>([]);
watchEffect(() => {
	for (let index = 0; index < Drawers.value.length; index++) {
		const drawer = Drawers.value[index];
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
</script>