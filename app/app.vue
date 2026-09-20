<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui";
import { debounce, loadCoreTranslations } from "./composables";
import { saveDatabaseConfigLocally } from "./composables/useLocalDatabaseConfig";

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);

// Load core translations with the initial language
loadCoreTranslations(Language.value);

// Watch for language changes and load translations dynamically
watch(Language, async (newLang, oldLang) => {
	if (newLang) await loadCoreTranslations(newLang, oldLang);
});

const Theme = useCookie<"light" | "dark">("theme", { sameSite: true });
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const osThemeRef = useOsTheme();
const isManual = ref(false);
if (!Theme.value) {
	Theme.value = osThemeRef.value ?? "light";
} else {
	isManual.value = true;
}

watch(Theme, () => {
	setThemeConfig();
	if (Theme.value !== osThemeRef.value) {
		isManual.value = true;
	}
});

watch(osThemeRef, (newOsTheme) => {
	if (!isManual.value && newOsTheme) {
		Theme.value = newOsTheme;
	}
});

// Persist the database config locally so the app stays reachable offline from
// local storage even when the service worker cache is missing. The middleware
// saves the initial fetch; this debounced deep watcher also catches config
// updates made later (e.g. schema changes from the Settings page).
const persistDatabaseConfigDebounced = debounce(() => {
	const db = database.value;
	if (db?.slug) saveDatabaseConfigLocally(db.slug, db);
}, 2000);
watch(
	() => database.value,
	() => {
		persistDatabaseConfigDebounced();
	},
	{ deep: true },
);

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
});

useHead({
	bodyAttrs: {
		class: computed(() =>
			[
				Language.value === "ar" ? "rtl" : "ltr",
				Theme.value === "dark" ? "dark" : "light",
			].join(" "),
		),
	},
});
</script>