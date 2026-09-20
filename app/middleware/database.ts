import {
	loadDatabaseConfigLocally,
	saveDatabaseConfigLocally,
} from "~/composables/useLocalDatabaseConfig";
import { isJunkResponse, isNetworkError } from "~/composables/useOfflineFetch";

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const currentDatabaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);

	const sessionID = useScopedCookie<string>("sid", currentDatabaseSlug);
	const query: Record<string, string> = {};

	if (sessionID.value) query[`${currentDatabaseSlug}_sid`] = sessionID.value;

	if (!database.value) {
		try {
			database.value = (
				await $fetch<apiResponse<Database>>(
					`${config.public.apiBase}inicontent/databases/${currentDatabaseSlug}`,
					{
						credentials: "include",
						query,
					},
				)
			).result;
			// Persist a local copy of the database config so the app can still
			// boot offline from local storage even when the service worker's
			// config cache is missing or evicted.
			saveDatabaseConfigLocally(currentDatabaseSlug, database.value);
		} catch (error) {
			// Offline (or a hung network). Prefer the locally-persisted copy of
			// the database config — with it the app boots normally with the real
			// metadata. In production the service worker also serves this request
			// from its config cache, so this local copy is a second, independent
			// fallback that survives cache eviction.
			//
			// Never THROW from here: an error thrown during the *initial*
			// navigation rejects nuxt's `app:created` hook, which skips
			// `vueApp.mount()` entirely in entry.js — the app never renders
			// and the user just sees a blank page (NUXT_E1005). Instead,
			// register the error via `showError()` so `payload.error` is set
			// *before* mount (NuxtRoot then swaps in error.vue), and return
			// `true` so the navigation itself completes and mounting proceeds.
			const localConfig = loadDatabaseConfigLocally(currentDatabaseSlug);
			if (localConfig) {
				database.value = localConfig;
			} else {
				showError(
					isNetworkError(error) || isJunkResponse(error)
						? createError({
								statusCode: 503,
								statusMessage: "offline",
							})
						: (error as Error),
				);
				return true;
			}
		}
	}

	if (!database.value) {
		showError(createError({ statusCode: 404, statusMessage: "database" }));
		return true;
	}

	formatDatabase();
	syncCookiesFromDatabase(database.value.slug);

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}));

	setThemeConfig();
});
