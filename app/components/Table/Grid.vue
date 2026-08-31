<template>
	<NGrid :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
		<NGridItem v-for="table in filteredTables" :key="table.slug">
			<NCard hoverable>
				<template #header>
					<NuxtLink :to="getTableUrl(table.slug)">
						<NFlex align="center">
							<NIconWrapper :border-radius="50" style="font-style: normal">
								<LazyTableIcon :table="table" />
							</NIconWrapper>
							<NH4 style="margin: 0">{{ t(table.slug) }}</NH4>
						</NFlex>
					</NuxtLink>
				</template>
				<template #header-extra>
					<NDropdown :options="getDropdownOptions(table)" :renderLabel="renderDropdownLabel">
						<NButton circle size="small">
							<template #icon>
								<NIcon>
									<Icon name="tabler:dots" />
								</NIcon>
							</template>
						</NButton>
					</NDropdown>
				</template>
			</NCard>
		</NGridItem>

		<NGridItem v-if="user?.role === config.public.idOne">
			<NPopover placement="bottom">
				<template #trigger>
					<NPopover trigger="click" v-model:show="showPopover">
						<template #trigger>
							<NCard style="cursor: pointer" content-style="padding: 15px 0" hoverable
								@click="showPopover = !showPopover">
								<NFlex justify="center" align="center">
									<NIcon size="36">
										<Icon name="tabler:plus" />
									</NIcon>
								</NFlex>
							</NCard>
						</template>
						<NFlex vertical>
							<NInputGroup>
								<NInput v-model:value="newTableSlug" @keydown.enter.prevent="createTable"
									:placeholder="t('tableSlug')">
									<template #suffix>
										<NIcon>
											<Icon name="tabler:letter-case" />
										</NIcon>
									</template>
								</NInput>
								<NTooltip :delay="600">
									<template #trigger>
										<NButton :type="showQuickSettings ? 'primary' : 'default'"
											@click="toggleQuickSettings">
											<template #icon>
												<NIcon>
													<Icon v-if="showQuickSettings" name="tabler:settings-off" />
													<Icon v-else name="tabler:settings" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('quickSettings') }}
								</NTooltip>
								<NButton @click="createTable" :loading="Loading.Table">
									<template #icon>
										<NIcon>
											<Icon name="tabler:chevron-right" />
										</NIcon>
									</template>
								</NButton>
							</NInputGroup>
							<template v-if="showQuickSettings">
								<NDivider style="margin: 0" />
								<NCheckbox v-model:checked="quickSettingsPrivate">
									{{ t('makeItPrivate') }}
								</NCheckbox>
								<template v-if="!quickSettingsPrivate">
									<NFlex :reverse="Language === 'ar'" v-for="role of modelValue.roles" :key="role.id" align="center"
										justify="space-between" :wrap="false">
										<NText strong>{{ t(role.name) }} :</NText>
										<NCheckboxGroup v-model:value="rolePermissions[role.id]" :disabled="role.id === config.public.idOne">
											<NCheckbox value="c" :label="t('create')" />
											<NCheckbox value="r" :label="t('read')" />
											<NCheckbox value="u" :label="t('update')" />
											<NCheckbox value="d" :label="t('delete')" />
										</NCheckboxGroup>
									</NFlex>
								</template>
							</template>
						</NFlex>
					</NPopover>
				</template>
				{{ t('newTable') }}
			</NPopover>
		</NGridItem>
	</NGrid>
</template>

<script lang="ts" setup>
import { type DropdownOption, NIcon } from "naive-ui"
import { Icon, NuxtLink } from "#components"

const modelValue = defineModel<Database>({ required: true })

const showPopover = ref(false)

const config = useRuntimeConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const user = useState<User>("user")
const newTableSlug = ref()
const route = useRoute()

const database = useState<Database>("database")

function getTableUrl(slug: string) {
	return `/${route.params.database ? ((database.value?.slug === "inicontent" && route.path === "/admin") ? `${modelValue.value.slug}/` : `${route.params.database}/`) : ""}admin/tables/${slug}`
}

const Language = useLanguageCookie()

const sessionID = useSessionCookie()

type CrudPermission = "c" | "r" | "u" | "d"
const permissionMethods: Record<CrudPermission, string> = {
	c: "POST",
	r: "GET",
	u: "PUT",
	d: "DELETE",
}

const showQuickSettings = ref(false)
const quickSettingsPrivate = ref(false)
const rolePermissions = reactive<Record<string, CrudPermission[]>>({})

function toggleQuickSettings() {
	showQuickSettings.value = !showQuickSettings.value
	if (showQuickSettings.value){
		for (const { id } of modelValue.value.roles ?? [])
			rolePermissions[id] = ["c", "r", "u", "d"]
	} else resetQuickSettings()
}

function resetQuickSettings() {
	showQuickSettings.value = false
	quickSettingsPrivate.value = false
	for (const id of Object.keys(rolePermissions)) delete rolePermissions[id]
}

// "@user.4" is the user role field, role ids come from database.roles
function generateQuickSettingsFlows(): FlowType[] {
	if (quickSettingsPrivate.value) return [[["error", "accessDenied"]]]

	// if no change made to role permissions, no need to create flows
	if (Object.values(rolePermissions).filter(permissions => permissions.length === 4).length === modelValue.value.roles?.length)
		return []

	const flows: FlowType[] = []
	for (const { id } of modelValue.value.roles ?? []) {
		// skip flows for admin
		if (id === config.public.idOne) continue;

		const allowedPermissions = rolePermissions[id]
		if (!allowedPermissions || allowedPermissions.length === 4) continue
		const deniedMethods = (
			Object.keys(permissionMethods) as CrudPermission[]
		)
			.filter((permission) => !allowedPermissions.includes(permission))
			.map((permission) => permissionMethods[permission])
		if (!deniedMethods.length) continue
		const flow: FlowType = [["@user.4", "=", id]]
		if (deniedMethods.length < Object.keys(permissionMethods).length)
			flow.push(["@method", "[]", deniedMethods])
		flow.push(["error", "accessDenied"])
		flows.push(flow)
	}
	return flows
}

const createTable = async () => {
	if (newTableSlug.value) {
		Loading.value.Table = true
		
		const bodyContent: string = toRaw(newTableSlug.value)
		const quickSettingsFlows = generateQuickSettingsFlows()

		const data = await $fetch<apiResponse<Table>>(
			`${config.public.apiBase}inicontent/databases/${modelValue.value.slug}/${bodyContent}`,
			{
				method: "POST",
				body: quickSettingsFlows.length ? { onRequest: quickSettingsFlows } : undefined,
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		)

		if (data.result) {
			modelValue.value.tables?.push(data.result)
			window.$message.success(data.message)
			newTableSlug.value = null
			showPopover.value = false
		} else window.$message.error(data.message ?? t("error"))
	
		Loading.value.Table = false
	} else window.$message.error(t("inputsAreInvalid"))
}

const filteredTables = computed(() =>
	modelValue.value.tables
		?.filter(
			({ allowedMethods, show, slug }) =>
				allowedMethods?.includes("r") && show !== false && slug !== "dashboards",
		)
		.sort(
			(a, b) =>
				Number(
					["users", "sessions", "translations", "assets"].includes(b.slug),
				) -
				Number(
					["users", "sessions", "translations", "assets"].includes(a.slug),
				),
		),
)

const getDropdownOptions = (table: Table) => {
	const tableUrl = getTableUrl(table.slug)
	return [
		{
			key: tableUrl,
			label: t("showAll"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:eye" })),
		},
		{
			key: `${tableUrl}/new`,
			label: t("newItem"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:plus" })),
			show: table.slug !== "assets" && table.allowedMethods?.includes("c"),
		},
		{
			key: `${tableUrl}/settings`,
			label: t("settings"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:settings" })),
			show:
				!["sessions", "translations", "assets"].includes(table.slug) &&
				user.value?.role === config.public.idOne,
		},
		{
			key: `${tableUrl}/flows`,
			label: t("flows"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:webhook" })),
			show:
				!["sessions", "translations"].includes(table.slug) &&
				user.value?.role === config.public.idOne,
		},
		{
			key: `${tableUrl}/schedules`,
			label: t("schedules"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:clock-play" })),
			show:
				!["sessions", "translations", "assets"].includes(table.slug) &&
				table.allowedMethods?.includes("c") &&
				user.value?.role === config.public.idOne,
		},
	]
}

function renderDropdownLabel(option: DropdownOption) {
	return h(
		NuxtLink,
		{
			to: option.key as string,
		},
		() => option.label,
	)
}
</script>