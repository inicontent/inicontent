export type PlatformFeature = "pages" | "blocks" | "templates" | "billing";

const platformFeaturePaths: Record<PlatformFeature, string> = {
	pages: "/admin/tables/pages",
	// Blocks are managed inside the page builder on the platform (the builder
	// writes/reads the `/blocks` API) — there is no dedicated blocks admin
	// surface yet, so point there until one exists.
	blocks: "/admin/tables/pages",
	templates: "/admin/tables/templates",
	billing: "/admin/billing",
};

/**
 * Resolves where a platform-level workspace (pages, blocks, templates,
 * billing) actually lives for the current database: the tenant's own
 * `https://<slug>.inicontent.com` subdomain, or the custom domain attached to
 * the database when one is pointed (`database.domains`). The platform
 * database itself lives at the bare `https://inicontent.com` host.
 *
 * The current sessions are appended as query params (`?{db}_sid=...` and
 * `?inicontent_sid=...`) because cookies are domain-scoped and cannot be
 * copied cross-origin by JavaScript — the `sid-ingest` global middleware
 * writes them back into cookies on the target.
 */
export function usePlatformRedirect() {
	const config = useRuntimeConfig();
	const database = useState<Database>("database");

	const databaseSlug = computed(() => {
		const slug = database.value?.slug ?? config.public.database;
		return slug && slug !== "inicontent" ? String(slug) : "inicontent";
	});

	const databaseSessionID = useScopedCookie<string>("sid", databaseSlug.value);
	const platformSessionID = useScopedCookie<string>("sid", "inicontent");

	const platformHost = computed(() => {
		const customDomain = database.value?.domains
			?.map((domain) =>
				String(domain)
					.replace(/^https?:\/\//, "")
					.replace(/\/+$/, ""),
			)
			.find(Boolean);
		if (customDomain) return `https://${customDomain}`;
		return databaseSlug.value === "inicontent"
			? "https://inicontent.com"
			: `https://${databaseSlug.value}.inicontent.com`;
	});

	function platformUrl(feature: PlatformFeature) {
		const url = new URL(platformFeaturePaths[feature], platformHost.value);
		// On the platform database the database session IS the platform
		// session, so the database key would duplicate the platform key.
		if (databaseSlug.value !== "inicontent" && databaseSessionID.value) {
			url.searchParams.set(
				`${databaseSlug.value}_sid`,
				databaseSessionID.value,
			);
		}
		if (platformSessionID.value) {
			url.searchParams.set("inicontent_sid", platformSessionID.value);
		}
		return url.toString();
	}

	return {
		databaseSlug,
		platformHost,
		platformUrl,
	};
}
