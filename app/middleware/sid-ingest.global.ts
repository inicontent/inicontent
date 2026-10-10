// Global middleware that restores sessions passed across deployments.
// When the tenant app redirects to the platform app (pages, blocks, billing),
// cookies cannot travel cross-origin, so the redirect carries one-time
// handoff codes (`?{db}_handoff=...&inicontent_handoff=...`, minted by
// usePlatformRedirect). This middleware redeems each code against the API
// and writes the returned SIDs into the scoped cookies, so the target boots
// already signed in. It runs before the route-level `database` / `user`
// middlewares and is a no-op when no handoff params are present.
//
// Long-lived SIDs never appear in URLs. The only cross-app path is a one-time
// handoff code, and `?{db}_sid=` is neither emitted nor accepted: old sessions
// were revoked, so a stale value is treated as no session at all.
export default defineNuxtRouteMiddleware(async (to) => {
	const config = useRuntimeConfig();
	const databaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database || config.public.database
			: config.public.database || to.params.database,
	);
	let handoffError = false;

	const consume = async (key: string, slug: string) => {
		const code = to.query[key];
		if (typeof code !== "string" || !code.trim()) return;
		try {
			const response = await $fetch<{ sessionID?: string }>(
				`${useApiBase()}${slug === "inicontent" ? "inicontent" : slug}/auth/handoff/redeem`,
				{ method: "POST", body: { code } },
			);
			const sid = response?.sessionID;
			if (sid) {
				const cookie = useCookie<string | null>(`${slug}_sid`, {
					sameSite: true,
				});
				if (!cookie.value) cookie.value = sid;
			} else {
				handoffError = true;
			}
		} catch {
			handoffError = true;
		}
	};

	await consume(`${databaseSlug}_handoff`, databaseSlug);
	if (databaseSlug !== "inicontent") {
		await consume("inicontent_handoff", "inicontent");
	}

	const handoffKeys = [
		`${databaseSlug}_handoff`,
		...(databaseSlug !== "inicontent" ? ["inicontent_handoff"] : []),
	];
	const strippedKeys = [...handoffKeys].filter(
		(key) => typeof to.query[key] === "string",
	);

	if (handoffError) {
		// The code was already used, expired, or belongs to another tenant —
		// land signed-out rather than guessing.
		console.warn("Session handoff failed; continuing without a new session");
	}

	if (strippedKeys.length) {
		const query = { ...to.query };
		for (const key of strippedKeys) delete query[key];
		return navigateTo({ ...to, query }, { replace: true });
	}
});
