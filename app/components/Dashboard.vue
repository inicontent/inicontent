<template>
	<NCard :title="t('databases')" style="background: none" :bordered="false">
		<template #header-extra>
			<NFlex justify="center" align="center">
				<NSelect v-if="!isPinned && !isSingleRegion && regionOptions.length"
					:value="selection?.code ?? null" :options="regionOptions" :placeholder="t('selectRegion')"
					size="small" style="width: 180px; margin-inline-end: 8px;" @update:value="onRegionChange" />
				<NPagination v-if="pagination.itemCount && pagination.pageCount > 1"
				:simple="!!$device.isMobile" :page="pagination.page" :page-count="pagination.pageCount"
				@update:page="pagination.onUpdatePage" />
				<NTooltip :delay="1500" :disabled="canCreateDatabase">
					<template #trigger>
						<span>
							<NButton :circle="$device.isMobile" :round="!$device.isMobile"
								:disabled="!canCreateDatabase" @click="startDatabaseCreation">
								<template #icon>
									<NIcon>
										<Icon name="tabler:plus" />
									</NIcon>
								</template>
								<template v-if="!$device.isMobile">
									{{ t('createDatabase') }}
								</template>
							</NButton>
						</span>
					</template>
					{{ t("regionNotAcceptingDatabases") }}
				</NTooltip>
			</NFlex>
		</template>

		<NCard v-if="showDatabaseCreation" :title="t('createDatabase')" closable
			@close="showDatabaseCreation = false" style="margin-bottom: 20px;">
			<NForm ref="DatabaseRef" :model="DatabaseModal" style="margin-top: 20px;">
				<LazyFieldS v-model="DatabaseModal" :schema="databaseSchema" />
			</NForm>

			<template #action>
				<NFlex justify="end">
					<NButtonGroup>
						<NButton round secondary type="error" @click="showDatabaseCreation = false">
							{{ t("cancel") }}
							<template #icon>
								<NIcon>
									<Icon name="tabler:x" />
								</NIcon>
							</template>
						</NButton>
						<NButton round secondary type="primary" :loading="Loading.Database" @click="createDatabase">
							<template #icon>
								<NIcon>
									<Icon name="tabler:device-floppy" />
								</NIcon>
							</template>
							{{ t("create") }}
						</NButton>
					</NButtonGroup>
				</NFlex>
			</template>
		</NCard>
		<NCard v-if="createdDatabase" :title="t('databaseCreatedTitle')" closable
			@close="createdDatabase = null" style="margin-bottom: 20px;">
			<NAlert type="success" :show-icon="false" style="margin-bottom: 12px;">
				{{ t("databaseCreatedHint") }}
			</NAlert>
			<NFlex vertical :size="12">
				<NDescriptions :column="1" label-placement="left" size="small" bordered>
					<NDescriptionsItem :label="t('adminUsername')">
						{{ createdDatabase.adminUsername }}
					</NDescriptionsItem>
					<NDescriptionsItem :label="t('databaseLoginUrlLabel')">
						<NText code>{{ databaseLoginUrl }}</NText>
					</NDescriptionsItem>
				</NDescriptions>
				<NFlex justify="end">
					<NButton tag="a" type="primary" :href="databaseLoginUrl" target="_blank"
						rel="noopener noreferrer">
						<template #icon>
							<NIcon>
								<Icon name="tabler:external-link" />
							</NIcon>
						</template>
						{{ t("openDatabaseLogin") }}
					</NButton>
				</NFlex>
			</NFlex>
		</NCard>
		<NSpin v-if="!showDatabaseCreation && !createdDatabase && databases?.result?.length" size="small" :show="status === 'idle' || status === 'pending'">
			<NCollapse v-model:expanded-names="expandedNames"
				:triggerAreas="['main', 'arrow']" accordion>
				<NCollapseItem v-for="(database, index) in databases?.result" :title="t(database.slug)"
					:name="database.slug">
					<template #header-extra>
						<NButtonGroup round>
							<NButton round>
								<template #icon>
									<NuxtLink :to="`/${database.slug}/admin/settings`" external>
										<NIcon>
											<Icon name="tabler:settings" />
										</NIcon>
									</NuxtLink>
								</template>
							</NButton>
							<NButton round>
								<template #icon>
									<NuxtLink :to="`/${database.slug}/admin/tables`" external>
										<NIcon>
											<Icon name="tabler:arrow-right" />
										</NIcon>
									</NuxtLink>
								</template>
							</NButton>
						</NButtonGroup>
					</template>
					<LazyTableGrid v-model="(databases.result[index] as Database)" />
				</NCollapseItem>
			</NCollapse>
		</NSpin>
	</NCard>
</template>

<script setup lang="ts">
import type { FormInst } from "naive-ui";
import { normalizeRegionApiUrl } from "~/composables/region";

onBeforeRouteLeave((route) => {
	if (route.params.database) clearNuxtState(["database", "table", "user"]);
});

const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

// Explicit region selection. The platform admin lists databases per region;
// switching region retargets `useApiBase()` and the reactive fetch below.
const {
	catalog: regionCatalog,
	selectableCatalog,
	creatableCatalog,
	isSingleRegion,
	selection,
	pinned,
	isPinned,
	select: selectRegion,
	loadRegions,
} = useRegion();
const regionOptions = computed(() =>
	selectableCatalog.value.map((region) => ({
		label: region.name,
		value: region.code,
	})),
);

/**
 * Whether the active region accepts new databases. The create request targets
 * `useApiBase()`, so the answer is whether that base is one of the catalog's
 * creatable regions. When no catalog entry vouches for it (the catalog has not
 * loaded, or the region is closed to new databases) creation fails closed —
 * the action stays visible but disabled — instead of surfacing an error only
 * after submit.
 */
const canCreateDatabase = computed(() => {
	const base = normalizeRegionApiUrl(useApiBase());
	return (
		!!base &&
		creatableCatalog.value.some(
			(region) => normalizeRegionApiUrl(region.apiUrl) === base,
		)
	);
});

function onRegionChange(code: string) {
	// Switching region rotates the regional session (clear the old, establish
	// the new) before the list refetches, so the request never carries the
	// previous region's credential.
	selectRegion(
		regionCatalog.value.find((region) => region.code === code) ?? null,
	).finally(() => {
		pagination.page = 1;
		refresh();
	});
}

const pagination = reactive({
	page: 1,
	pageCount: 1,
	perPage: 10,
	itemCount: 0,
	onUpdatePage(currentPage: number) {
		pagination.page = currentPage;
		refresh();
	},
});

const queryOptions = computed(() =>
	JSON.stringify({
		page: pagination.page,
		perPage: pagination.perPage,
	}),
);

const {
	data: databases,
	status,
	refresh,
} = await useLazyFetch<apiResponse<Database[]>>(
	computed(() => `${useApiBase()}inicontent/databases`),
	{
		key: "databases",
		onResponse({ response }: { response: { _data: apiResponse<Database[]> } }) {
			if (response._data.result?.length)
				expandedNames.value = [response._data.result.at(-1)?.slug as string];
			pagination.pageCount = response._data.options?.totalPages ?? 1;
			pagination.itemCount = response._data.options?.total ?? 0;
		},
		transform: (response: apiResponse<Database[]>) => {
			response.result.map(formatDatabase);
			return response;
		},
		params: {
			options: queryOptions,
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		credentials: "include",
	},
);

// Multi-region only: load the catalog once so the selector can offer regions.
// Best-effort — a failure leaves the deployment's default region in place.
if (!pinned) {
	try {
		await loadRegions();
	} catch {
		// The dashboard still lists the default region's databases.
	}
}
const expandedNames = ref<string[]>();
const showDatabaseCreation = ref(false);

/**
 * The database whose administrator was just created. Shown as a follow-up card
 * so the owner has a clear action to open the database's own sign-in page —
 * where the browser can offer to save the new credentials for its hostname.
 */
const createdDatabase = ref<{ slug: string; adminUsername: string } | null>(
	null,
);

/**
 * `https://<region>--<slug>.inicontent.com/login` (or the bare
 * `https://<slug>.inicontent.com/login` on the main region), carrying the active
 * region as an explicit, catalog-validated `?region=` parameter.
 *
 * The URL is built by `resolveDatabaseLoginUrl` (unit-tested). What matters here
 * is the **host**: the sign-in form runs on the database's own origin, so a
 * password manager scopes the new credentials to it rather than to this
 * administration host.
 */
const databaseLoginUrl = computed(() => {
	const slug = createdDatabase.value?.slug;
	if (!slug) return "";
	return resolveDatabaseLoginUrl(slug, selection.value?.code) ?? "";
});

const DatabaseRef = ref<FormInst>();
const DatabaseModal = ref<Database>({});
const databaseSchema = computed<Schema>(() => [
	{
		key: "slug",
		type: "string",
		required: true,
		// A double hyphen separates the region code from the slug in a database
		// hostname (`sa-1--clinic.inicontent.com`), so it cannot appear in the
		// slug itself.
		regex: "^(?!.*--)[a-zA-Z0-9\u0621-\u064A\u0660-\u0669-_]+$",
		width: 2,
		description: "databaseSlugHint",
	},
	// The database's *own* first administrator. It is a separate identity from
	// the global owner: the owner chooses it here, and it is created inside the
	// new database. The global user's credentials are never copied.
	{
		key: "adminUsername",
		type: "string",
		required: true,
		regex: "^.{3,64}$",
		width: 2,
		// `field.inputProps` are NInput props; the nested `inputProps` is what
		// NInput puts on the inner `<input>`.
		inputProps: {
			inputProps: {
				name: "admin-username",
				autocomplete: "off",
				autocapitalize: "none",
				spellcheck: "false",
			},
		},
		description: "databaseAdminUsernameHint",
	},
	{
		key: "adminPassword",
		type: "password",
		required: true,
		regex: "^.{8,200}$",
		width: 2,
		// `new-password` tells a password manager this is a value to generate or
		// save, not an existing credential to autofill.
		inputProps: { inputProps: { autocomplete: "new-password" } },
		description: "databaseAdminPasswordHint",
	},
	{
		key: "adminPasswordConfirm",
		type: "password",
		required: true,
		width: 2,
		inputProps: { inputProps: { autocomplete: "new-password" } },
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
		width: 2,
	},
	{
		key: "primaryLanguage",
		type: "string",
		subType: "select",
		options: translationLanguages.map((language) => ({
			label: t(`languages.${language}`),
			value: language,
		})),
		required: true,
		width: 2,
	},
	{
		key: "secondaryLanguages",
		type: "array",
		subType: "select",
		options: translationLanguages
			.filter((l) => l !== DatabaseModal.value.primaryLanguage)
			.map((language) => ({
				label: t(`languages.${language}`),
				value: language,
			})),
		required: false,
		width: 2,
	},
	{
		key: "icon",
		type: "table",
		table: "assets",
		accept: ["image"],
		params: "format=avif&fit=94",
	},
]);

function startDatabaseCreation() {
	DatabaseModal.value = {}; // Reset/initialize model
	showDatabaseCreation.value = true;
}

async function createDatabase() {
	// A region switch can close the active region to new databases while the
	// creation card is still open; refuse the submit with the same message the
	// disabled action shows rather than letting it fail at the API.
	if (!canCreateDatabase.value)
		return window.$message.error(t("regionNotAcceptingDatabases"));
	DatabaseRef.value?.validate(async (errors: any) => {
		if (errors) return window.$message.error(t("inputsAreInvalid"));
		const bodyContent = toRaw(DatabaseModal.value) as Database & {
			adminUsername?: string;
			adminPassword?: string;
			adminPasswordConfirm?: string;
		};
		// The confirmation is a client-side guard only; the server never sees it.
		if (bodyContent.adminPassword !== bodyContent.adminPasswordConfirm)
			return window.$message.error(t("passwordsDoNotMatch"));
		Loading.value.Database = true;
		try {
			const data = await $fetch<apiResponse>(
				`${useApiBase()}inicontent/databases/${bodyContent.slug}`,
				{
					method: "POST",
					body: bodyContent,
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);
			if (!data.result) {
				window.$message.error(data.message);
				return;
			}
			DatabaseModal.value = data.result;
			if (databases.value) {
				if (databases.value.result) databases.value.result.push(data.result);
				else databases.value.result = [data.result];
				expandedNames.value = [data.result.slug];
			}
			// Surface a clear action to sign in at the database's own hostname,
			// where the browser can offer to save the new credentials.
			createdDatabase.value = {
				slug: data.result.slug as string,
				adminUsername: bodyContent.adminUsername ?? "",
			};
			window.$message.success(data.message);
			showDatabaseCreation.value = false;
		} catch (error: any) {
			window.$message.error(error?.data?.message ?? t("error"));
		} finally {
			Loading.value.Database = false;
		}
	});
}
</script>