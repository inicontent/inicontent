<template>
	<n-grid cols="12" :x-gap="12" item-responsive responsive="screen">
		<n-grid-item span="12 l:11">
			<n-card :title="t('settings')" hoverable>
				<template #header-extra>
					<n-flex>
						<n-tooltip :delay="1500">
							<template #trigger>
								<n-popconfirm :show-icon="false" @positive-click="deleteDatabase">
									<template #trigger>
										<n-button type="error" tertiary round :loading="Loading.deleteDatabase">
											<template #icon>
												<NIcon>
													<Icon name="tabler:trash" />
												</NIcon>
											</template>
										</n-button>
									</template>
									{{ t("theFollowingActionIsIrreversible") }}
								</n-popconfirm>
							</template>
							{{ t("deleteDatabase") }}
						</n-tooltip>
						<n-button @click="updateDatabase" type="primary" secondary round
							:loading="Loading.updateDatabase">
							<template #icon>
								<NIcon>
									<Icon name="tabler:device-floppy" />
								</NIcon>
							</template>
							{{ t("save") }}
						</n-button>
					</n-flex>
				</template>
				<n-flex vertical>
					<n-card id="general" :title="t('generalSettings')" hoverable>
						<n-form ref="databaseRef" :model="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="databaseSchema" />
						</n-form>
					</n-card>
					<n-card id="translation" :title="t('translationSettings')" hoverable>
						<n-form ref="databaseRef" :model="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="translationSchema" />
						</n-form>
					</n-card>
					<n-card id="email" :title="t('emailSettings')" hoverable>
						<n-empty :description="t('soon')" />
					</n-card>
				</n-flex>
			</n-card>
		</n-grid-item>
		<n-grid-item v-if="!$device.isMobile" span="0 l:1">
			<n-anchor affix listen-to="#container" :top="88" :bound="90" style="z-index: 1;">
				<n-anchor-link :title="t('generalSettings')" href="#general" />
				<n-anchor-link :title="t('translationSettings')" href="#translation" />
				<n-anchor-link :title="t('emailSettings')" href="#email" />
			</n-anchor>
		</n-grid-item>
	</n-grid>
</template>

<script lang="ts" setup>
import type { FormInst } from "naive-ui"

definePageMeta({
	middleware: ["database", "user", "dashboard", "global"],
	layout: "table",
})

onMounted(() => {
	document.onkeydown = (e) => {
		if (
			!(
				(e.ctrlKey || e.metaKey) &&
				(e.key.toLowerCase() === "s" || e.key === "س")
			)
		)
			return
		e.preventDefault()
		updateDatabase()
	}
})

defineTranslation({
	ar: {
		save: "حِفظ",
		generalSettings: "إعدادات عامة",
		translationSettings: "إعدادات الترجمة",
		emailSettings: "إعدادات البريد",
		deleteDatabase: "حذف قاعدة البيانات",
		soon: "قريباً",
	},
})
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const route = useRoute()
const router = useRouter()
const database = useState<Database>("database")
const databaseRef = ref<FormInst>()
const databaseCopy = ref(JSON.parse(JSON.stringify(database.value)))

const databaseSchema: Schema = [
	{
		key: "slug",
		type: "string",
		required: true,
	},
	{
		key: "icon",
		type: "table",
		table: "assets",
		accept: ["image"],
		params: "format=avif&fit=94",
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
	},
	{
		key: "primaryDarkColor",
		type: "string",
		subType: "color",
	},
	{
		key: "roles",
		type: "array",
		children: [
			{
				key: "id",
				type: "id",
				inputProps: {
					disabled: true,
				},
			},
			{
				key: "name",
				type: "string",
			},
		],
		onCreate: { id: `temp-${randomID()}` },
		inputProps: (index: number) =>
			[0, 1, 2].includes(index) ? { disabled: true } : {},
		required: false,
	},
]

const translationSchema: Schema = [
	{
		key: "primaryLanguage",
		type: "string",
		subType: "locale",
		required: true,
	},
	{
		key: "secondaryLanguages",
		type: "array",
		children: "string",
		subType: "locale",
	},
]

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function updateDatabase() {
	databaseRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = JSON.parse(JSON.stringify(databaseCopy.value))
			Loading.value.updateDatabase = true
			const data = await $fetch<apiResponse>(
				`${appConfig.apiBase}inicontent/databases/${database.value.slug}`,
				{
					method: "PUT",
					body: bodyContent,
					credentials: "include",
					query: {
						[`${database.value.slug}_sid`]: sessionID.value,
					},
				},
			)
			if (data.result) {
				database.value = { ...database.value, ...data.result }
				if (route.params.database !== database.value.slug)
					router.replace({
						params: { database: database.value.slug },
					})
				setThemeConfig()
				Loading.value.updateDatabase = false
				window.$message.success(data.message)
			} else window.$message.error(data.message)
			Loading.value.updateDatabase = false
		} else window.$message.error(t("inputsAreInvalid"))
	})
}
async function deleteDatabase() {
	Loading.value.deleteDatabase = true
	const data = await $fetch<apiResponse>(
		`${appConfig.apiBase}inicontent/databases/${database.value.slug}`,
		{
			method: "DELETE",
			credentials: "include",
			query: {
				[`${database.value.slug}_sid`]: sessionID.value,
			},
		},
	)
	if (data.result) {
		Loading.value.deleteDatabase = false
		window.$message.success(data.message)
		setTimeout(async () => {
			clearNuxtState("database")
			await navigateTo("/admin")
		}, 800)
	} else window.$message.error(data.message)
	Loading.value.deleteDatabase = false
}

useHead({
	title: `${t(database.value.slug)} | ${t("settings")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>
