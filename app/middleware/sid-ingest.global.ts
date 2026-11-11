// Global middleware that runs the destination-initiated handoff and restores
// the sessions it delivers.
//
// A handoff moves a session from a source platform origin (say
// `inicontent.com`) to a destination platform origin (`alpha.inicontent.com`,
// where billing lives). Cookies cannot travel cross-origin, so the flow is a
// redirect round-trip bound by a PKCE verifier the DESTINATION generates and
// keeps in its own origin-scoped storage:
//
//   source ──(init, no secret)──────▶ destination       [this middleware: initiate]
//   destination ──(challenge,state)─▶ source            [this middleware: mint]
//   source ──(code, state)──────────▶ destination       [this middleware: redeem]
//
// Only the challenge (a public hash) and the short-lived, single-use code
// travel in URLs; the verifier never leaves the destination origin, so a
// compromised sibling host cannot read a verifier for a handoff it is not part
// of. Long-lived SIDs never appear in URLs: `?{db}_sid=` is neither emitted nor
// accepted. The route-level `database`/`user` middlewares run after this one,
// so a redirect here means the destination page never renders mid-handshake.
import {
	clearHandoffVerifier,
	createHandoffPkce,
	HANDOFF_CHALLENGE_PARAM,
	HANDOFF_STATE_PARAM,
	HANDOFF_TO_PARAM,
	handoffDestinationReturnUrl,
	newHandoffState,
	planHandoff,
	REGION_STATE_KEY,
	type RegionSelection,
	readHandoffVerifier,
	resolvePlatformFeatureHost,
	storeHandoffVerifier,
	stripHandoffParams,
} from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
	const config = useRuntimeConfig();
	const databaseSlug = String(
		config.public.database === "inicontent"
			? to.params.database ||
					(!isPlatformApex(useRequestURL().hostname) &&
						useState<Database>("database").value?.slug) ||
					config.public.database
			: config.public.database || to.params.database,
	);

	const strip = () => {
		const query = stripHandoffParams(to.query, databaseSlug);
		const changed = Object.keys(to.query).some((key) => !(key in query));
		if (!changed) return;
		return navigateTo({ ...to, query }, { replace: true });
	};

	const currentOrigin = typeof location === "undefined" ? "" : location.origin;
	// The destination for a tenant lives on its region's platform host; the
	// platform database itself always lives on the main host.
	const region = useState<RegionSelection | null>(REGION_STATE_KEY, () => null);
	const destinationOrigin = resolveDestinationOrigin(
		databaseSlug,
		databaseSlug === "inicontent" ? null : region.value?.code,
	);
	// Only the initiate branch consults this; it avoids a pointless round-trip
	// when the destination already holds the scoped sessions.
	const destinationSignedIn =
		Boolean(platformCookie().value) &&
		(databaseSlug === "inicontent" ||
			Boolean(scopedCookie(databaseSlug).value));

	const plan = planHandoff(to.query as Record<string, unknown>, {
		databaseSlug,
		destinationOrigin,
		currentOrigin,
		destinationSignedIn,
	});

	if (plan.kind === "none") return;

	if (plan.kind === "redeem") {
		const verifier = plan.state
			? (readHandoffVerifier(plan.state)?.verifier ?? undefined)
			: undefined;
		let handoffError = false;

		for (const { code, slug } of plan.codes) {
			try {
				const response = await $fetch<{ sessionID?: string }>(
					`${useApiBase()}${slug}/auth/handoff/redeem`,
					{ method: "POST", body: { code, verifier } },
				);
				const sid = response?.sessionID;
				if (!sid) {
					handoffError = true;
					continue;
				}
				const cookie = scopedCookie(slug);
				if (!cookie.value) cookie.value = sid;
			} catch {
				handoffError = true;
			}
		}

		// Single-use: drop the verifier whether redemption succeeded or not.
		if (plan.state) clearHandoffVerifier(plan.state);
		if (handoffError) {
			// The code was already used, expired, or belongs to another tenant —
			// land signed-out rather than guessing.
			console.warn("Session handoff failed; continuing without a new session");
		}
		return strip();
	}

	if (plan.kind === "mint") {
		const apiBase = useApiBase();
		const jobs = plan.codes.map(async ({ key, slug }) => {
			const sid = scopedCookie(slug).value;
			const code = sid
				? await mintCode(apiBase, slug, sid, plan.destination, plan.challenge)
				: null;
			return [key, code] as [string, string | null];
		});

		let target: URL;
		try {
			target = new URL(plan.to);
		} catch {
			return strip();
		}
		for (const [key, code] of await Promise.all(jobs)) {
			if (code) target.searchParams.set(key, code);
		}
		if (plan.state) target.searchParams.set(HANDOFF_STATE_PARAM, plan.state);
		return navigateTo(target.toString(), { external: true });
	}

	if (plan.kind === "initiate") {
		const destination = handoffDestinationReturnUrl();
		if (!destination) return;
		const { verifier, challenge } = await createHandoffPkce();
		const state = newHandoffState();
		storeHandoffVerifier(state, {
			verifier,
			destination: currentOrigin,
			to: destination,
		});
		const source = new URL(plan.source);
		source.searchParams.set(HANDOFF_CHALLENGE_PARAM, challenge);
		source.searchParams.set(HANDOFF_STATE_PARAM, state);
		source.searchParams.set(HANDOFF_TO_PARAM, destination);
		return navigateTo(source.toString(), { external: true });
	}

	// plan.kind === "strip"
	return strip();
});

function resolveDestinationOrigin(
	databaseSlug: string,
	region?: string | null,
): string | null {
	try {
		return resolvePlatformFeatureHost(databaseSlug, region);
	} catch {
		return null;
	}
}

function scopedCookie(slug: string) {
	return useScopedCookie<string | null>("sid", slug);
}

function platformCookie() {
	return scopedCookie("inicontent");
}

async function mintCode(
	apiBase: string,
	slug: string,
	sid: string,
	destination: string,
	challenge: string,
): Promise<string | null> {
	try {
		const response = await $fetch<{ code?: string }>(
			`${apiBase}${slug}/auth/handoff`,
			{
				method: "POST",
				body: { destination, challenge },
				headers: { Authorization: `Bearer ${sid}` },
			},
		);
		return response?.code ?? null;
	} catch {
		return null;
	}
}
