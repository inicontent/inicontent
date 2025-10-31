<template>
	<div class="grid" :x-gap="12" :y-gap="12" cols="1 500:2 800:4">
		<div class="grid"Item v-for="table in filteredTables" :key="table.slug">
			<UCard hoverable>
				<template #header>
					<NuxtLink :to="getTableUrl(table.slug)">
						<div class="flex" align="center">
							<div class="inline-flex items-center justify-center" :border-radius="50" style="font-style: normal">
								<LazyTableIcon :table="table" />
							</div>
							<h3 class="font-semibold"4 style="margin: 0">{{ t(table.slug) }}</NH4>
						</div>
					</NuxtLink>
				</template>
				<template #header-extra>
					<UDropdown :options="getDropdownOptions(table)" :renderLabel="renderDropdownLabel">
						<UButton circle size="small">
							<template #icon>
								<div class="inline-block">
									<Icon name="tabler:dots" />
								</div>
							</template>
						</UButton>
					</UDropdown>
				</template>
			</UCard>
		</div>

		<div class="grid"Item v-if="user?.role === appConfig.idOne">
			<UPopover placement="bottom">
				<template #trigger>
					<UPopover trigger="click" v-model:show="showPopover">
						<template #trigger>
							<UCard style="cursor: pointer" content-style="padding: 15px 0" hoverable
								@click="showPopover = !showPopover">
								<div class="flex" justify="center" align="center">
									<span size="36">
										<Icon name="tabler:plus" />
									</div>
								</div>
							</UCard>
						</template>
						<UInputGroup>
							<UInput v-model:value="newTableSlug" @keydown.enter.prevent="createTable"
								:placeholder="t('tableSlug')">
								<template #suffix>
									<div class="inline-block">
										<Icon name="tabler:letter-case" />
									</div>
								</template>
							</UInput>
							<UButton @click="createTable" :loading="Loading.Table">
								<template #icon>
									<div class="inline-block">
										<Icon name="tabler:chevron-right" />
									</div>
								</template>
							</UButton>
						</div>
					</UPopover>
				</template>
				{{ t('newTable') }}
			</UPopover>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Icon, NuxtLink } from "#components"

const modelValue = defineModel<Database>({ required: true })

defineTranslation({
	ar: {
		newTable: "جدول جديد",
		newItem: "عنصر جديد",
		tableFlows: "تدفقات الجدول",
		tableSlug: "إسم الجدول",
	},
})

const showPopover = ref(false)

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const user = useState<User>("user")
const Hover = ref<Record<string, boolean>>({})
const newTableSlug = ref()
const route = useRoute()

const database = useState<Database>("database")

function getTableUrl(slug: string) {
	return `/${route.params.database || (database.value?.slug === "inicontent" && route.path === "/admin") ? `${modelValue.value.slug}/` : ""}admin/tables/${slug}`
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

const createTable = async () => {
	if (newTableSlug.value) {
		const bodyContent: string = toRaw(newTableSlug.value)
		Loading.value.Table = true

		const data = await $fetch<apiResponse<Table>>(
			`${appConfig.apiBase}inicontent/databases/${modelValue.value.slug}/${bodyContent}`,
			{
				method: "POST",
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
			({ allowedMethods, show }) =>
				allowedMethods?.includes("r") && show !== false,
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
			label: t("tableSettings"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:settings" })),
			show:
				!["sessions", "translations", "assets"].includes(table.slug) &&
				user.value?.role === appConfig.idOne,
		},
		{
			key: `${tableUrl}/flows`,
			label: t("tableFlows"),
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:webhook" })),
			show:
				!["sessions", "translations"].includes(table.slug) &&
				user.value?.role === appConfig.idOne,
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