<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />

		<NModal v-model:show="showAuthModal" :mask-closable="false" :close-on-esc="false">
			<Auth modal @logged-in="onLoggedIn" />
		</NModal>
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui"

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const osThemeRef = useOsTheme()
const isManual = ref(false)
if (!Theme.value) {
	Theme.value = osThemeRef.value ?? "light"
} else {
	isManual.value = true
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })

watch(Theme, () => {
	setThemeConfig()
	if (Theme.value !== osThemeRef.value) {
		isManual.value = true
	}
})

watch(osThemeRef, (newOsTheme) => {
	if (!isManual.value && newOsTheme) {
		Theme.value = newOsTheme
	}
})

const showAuthModal = ref(false)

const database = useState<Database>("database")
const appConfig = useAppConfig()
const sessionID = useCookie<string | null>("sessionID", { sameSite: true })

async function checkAuth() {
	if (showAuthModal.value) return;
	try {
		const data = await $fetch<{ result: boolean }>(
			`${appConfig.apiBase}${database.value.slug}/auth/current`,
			{
				credentials: "include",
				query: { isSignedIn: true, [`${database.value.slug}_sid`]: sessionID.value },
			},
		)
		if (!data.result) {
			showAuthModal.value = true
		}
	} catch (error) {
		showAuthModal.value = true
	}
}

function onLoggedIn() {
	showAuthModal.value = false
	// User and sessionID are already updated in Auth component
}

onMounted(() => {
	checkAuth()
	const interval = setInterval(checkAuth, 60000) // Check every 1 minute
	onUnmounted(() => clearInterval(interval))
})

useHead({
	bodyAttrs: {
		class: computed(() =>
			[
				Language.value === "ar" ? "rtl" : "ltr",
				Theme.value === "dark" ? "dark" : "light",
			].join(" "),
		),
	},
})
</script>