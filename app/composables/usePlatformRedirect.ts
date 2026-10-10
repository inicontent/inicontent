import { resolvePlatformFeatureHost } from "./platformFeatureHost.ts";

export type PlatformFeature = "billing";

const platformFeaturePaths: Record<PlatformFeature, string> = {
	billing: "/admin/billing",
};

async function mintHandoffCode(
	apiBase: string,
	slug: string,
	sid: string | null | undefined,
	destination?: string,
): Promise<string | null> {
	if (!sid) return null;
	const target = `${apiBase}${encodeURIComponent(slug)}/auth/handoff`;
	try {
		const response = await $fetch<{ code?: string }>(target, {
			method: "POST",
			body: destination ? { destination } : {},
			headers: { Authorization: `Bearer ${sid}` },
		});
		return response?.code ?? null;
	} catch {
		return null;
	}
}

/**
 * Resolves where a platform-level workspace (billing) actually lives for the
 * current database: the tenant's own
 * `https://<slug>.inicontent.com` subdomain. Custom domains are excluded
 * because platform billing only trusts platform hosts. The platform
 * database itself lives at the bare `https://inicontent.com` host.
 *
 * Sessions cross origins as short-lived, single-use handoff codes
 * (`?{db}_handoff=...`) minted against the API — the target exhales them
 * through the sid-ingest middleware. The long-lived SID never appears in
 * the URL, browser history, or Referer headers. If minting fails the URL
 * is returned without credentials: the user lands signed-out, never
 * exposed.
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

	const platformHost = computed(() =>
		resolvePlatformFeatureHost(databaseSlug.value),
	);

	async function platformUrl(feature: PlatformFeature): Promise<string> {
		const url = new URL(platformFeaturePaths[feature], platformHost.value);
		// Bind every minted code to the exact origin it will be redeemed on, so
		// a code can never be replayed against another deployment.
		const destination = url.origin;
		const apiBase = useApiBase();

		const jobs: Array<Promise<[string, string | null]>> = [];
		if (databaseSlug.value !== "inicontent") {
			jobs.push(
				mintHandoffCode(
					apiBase,
					databaseSlug.value,
					databaseSessionID.value,
					destination,
				).then(
					(code) =>
						[`${databaseSlug.value}_handoff`, code] as [string, string | null],
				),
			);
		}
		jobs.push(
			mintHandoffCode(
				apiBase,
				"inicontent",
				platformSessionID.value,
				destination,
			).then(
				(code) => ["inicontent_handoff", code] as [string, string | null],
			),
		);

		for (const [key, code] of await Promise.all(jobs)) {
			if (code) url.searchParams.set(key, code);
		}
		return url.toString();
	}

	return {
		databaseSlug,
		platformHost,
		platformUrl,
	};
}
