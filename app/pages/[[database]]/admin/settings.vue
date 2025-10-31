<template>
	<div class="grid grid-cols-12 gap-3">
		<div class="col-span-12 lg:col-span-11">
			<UCard>
				<template #header>
					<div class="flex justify-between items-center">
						<h3 class="text-lg font-semibold">{{ t('settings') }}</h3>
						<div class="flex gap-2">
							<UTooltip :text="t('deleteDatabase')" :delay="1500">
								<UButton
									color="red"
									variant="ghost"
									icon="i-heroicons-trash"
									:loading="Loading.deleteDatabase"
									@click="confirmDelete"
								/>
							</UTooltip>
							<UButton
								color="primary"
								variant="soft"
								icon="i-heroicons-document-check"
								:loading="Loading.updateDatabase"
								@click="updateDatabase"
							>
								{{ t("save") }}
							</UButton>
						</div>
					</div>
				</template>
				<div class="flex flex-col gap-4">
					<UCard id="general">
						<template #header>
							<h4 class="font-semibold">{{ t('generalSettings') }}</h4>
						</template>
						<UForm ref="databaseRef" :state="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="databaseSchema" />
						</UForm>
					</UCard>
					<UCard id="translation">
						<template #header>
							<h4 class="font-semibold">{{ t('translationSettings') }}</h4>
						</template>
						<UForm ref="databaseRef" :state="databaseCopy">
							<FieldS v-model="databaseCopy" :schema="translationSchema" />
						</UForm>
					</UCard>
					<UCard id="email">
						<template #header>
							<h4 class="font-semibold">{{ t('emailSettings') }}</h4>
						</template>
						<div class="text-center text-gray-500 py-8">
							{{ t('soon') }}
						</div>
					</UCard>
				</div>
			</UCard>
		</div>
		<div v-if="!$device.isMobile" class="hidden lg:block lg:col-span-1">
			<div class="sticky top-24">
				<nav class="flex flex-col gap-2">
					<a href="#general" class="text-sm hover:text-primary">{{ t('generalSettings') }}</a>
					<a href="#translation" class="text-sm hover:text-primary">{{ t('translationSettings') }}</a>
					<a href="#email" class="text-sm hover:text-primary">{{ t('emailSettings') }}</a>
				</nav>
			</div>
		</div>
	</div>
	<UModal v-model="showDeleteModal">
		<UCard>
			<template #header>
				<h3 class="text-lg font-semibold">{{ t("deleteDatabase") }}</h3>
			</template>
			<p>{{ t("theFollowingActionIsIrreversible") }}</p>
			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton color="gray" variant="ghost" @click="showDeleteModal = false">
						{{ t("cancel") }}
					</UButton>
					<UButton color="red" @click="deleteDatabase">
						{{ t("delete") }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>

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
		cancel: "إلغاء",
		delete: "حذف",
	},
})
const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const route = useRoute()
const router = useRouter()
const database = useState<Database>("database")
const databaseRef = ref<any>()
const databaseCopy = ref(JSON.parse(JSON.stringify(database.value)))
const showDeleteModal = ref(false)

function confirmDelete() {
	showDeleteModal.value = true
}

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
	showDeleteModal.value = false
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
