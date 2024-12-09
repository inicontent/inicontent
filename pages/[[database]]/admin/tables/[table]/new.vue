<template>
	<NSpin :show="!!Loading.CREATE">
		<NCard style="height: fit-content">
			<template #header>
				<NPerformantEllipsis>{{ t('new') }} {{ t(table.slug) }}</NPerformantEllipsis>
			</template>
			<template v-if="schema && schema.length > 4" #header-extra>
				<NFlex>
					<NTooltip :delay="500">
						<template #trigger>
							<NButton secondary round type="primary" @click="CREATE" :loading="Loading.CREATE">
								<template #icon>
									<NIcon>
										<IconSend />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t('publish') }}
					</NTooltip>
				</NFlex>
			</template>
			<template #action>
				<NFlex justify="end">
					<NButton secondary round type="primary" @click="CREATE" :loading="Loading.CREATE">
						<template #icon>
							<NIcon>
								<IconSend />
							</NIcon>
						</template>
						{{ t('publish') }}
					</NButton>
				</NFlex>
			</template>
			<NForm :model="newItemObject" ref="formRef">
				<FieldS v-model="newItemObject" :schema />
			</NForm>
		</NCard>
	</NSpin>
</template>

<script lang="ts" setup>
import { IconSend } from "@tabler/icons-vue";
import {
	NButton,
	NCard,
	NPerformantEllipsis,
	NForm,
	NIcon,
	NFlex,
	NTooltip,
	type FormInst,
	NSpin,
} from "naive-ui";

definePageMeta({
	middleware: ["database", "user", "dashboard", "table"],
	layout: "table",
});

onMounted(() => {
	document.onkeydown = (e) => {
		if (!(e.key === "s" && (e.ctrlKey || e.metaKey))) return;
		e.preventDefault();
		CREATE();
	};
});
const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const route = useRoute();
const database = useState<Database>("database");
const table = useState<Table>("table");
const schema = table.value.schema?.filter(
	(field) =>
		!["id", "createdAt", "createdBy", "updatedAt", "updatedBy"].includes(
			field.key,
		),
);
const newItemObject = ref({});
const formRef = ref<FormInst>();
async function CREATE() {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(newItemObject.value);
			Loading.value.CREATE = true;
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}${database.value.slug}/${route.params.table}`,
				{
					method: "POST",
					body: bodyContent,
				},
			);
			Loading.value.CREATE = false;

			if (!data.result || !data.result.id)
				return window.$message.error(data.message);

			window.$message.success(data.message);
			refreshNuxtData(`${database.value.slug}-${table.value.slug}`);
			return navigateTo(
				`${route.params.database ? `/${route.params.database}` : ""}/admin/tables/${route.params.table}/${data.result.id}/edit`,
			);
		}
		window.$message.error(t("inputsAreInvalid"));
	});
}

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${t("new")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
});
</script>
