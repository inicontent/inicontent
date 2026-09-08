<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui"
import { loadCoreTranslations } from "./composables"

const database = useState<Database>("database")
const Language = useLanguageCookie()

// Load core translations with the initial language
loadCoreTranslations(Language.value)

// Watch for language changes and load translations dynamically
watch(Language, async (newLang, oldLang) => {
	if (newLang)
		await loadCoreTranslations(newLang, oldLang)
})

const Theme = useCookie<"dark" | "light">("theme")
const sessionID = useSessionCookie()
const osThemeRef = useOsTheme()
const isManual = ref(false)
if (!Theme.value) {
	Theme.value = osThemeRef.value ?? "light"
} else {
	isManual.value = true
}

watch(Theme, () => {
	setThemeConfig()
	if (Theme.value !== osThemeRef.value) {
		isManual.value = true
	}
	if (Theme.value) syncThemeToAllDatabases(Theme.value)
})

watch(osThemeRef, (newOsTheme) => {
	if (!isManual.value && newOsTheme) {
		Theme.value = newOsTheme
	}
})

watch(
	() => database.value?.slug,
	(slug) => {
		syncCookiesFromDatabase(slug)
	},
	{ immediate: true },
)

watch(
	[Language, Theme, sessionID, () => database.value?.slug],
	() => {
		syncCookiesToDatabase(database.value?.slug)
	},
	{ immediate: true },
)

// Initialize the offline queue tracker on boot so pending counts start
// loading even before the Header (which hosts the SyncStatus badge) mounts.
// Deferred to an idle callback so opening IndexedDB can never compete with
// the first page's route-middleware fetch or initial render.
onMounted(() => {
	const runInit = () => useOfflineSync().initSync();
	if ("requestIdleCallback" in window) {
		// @ts-expect-error requestIdleCallback types not present
		window.requestIdleCallback(runInit, { timeout: 3000 });
	} else {
		setTimeout(runInit, 500);
	}
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