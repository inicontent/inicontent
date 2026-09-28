import Inison from "inison";

// Shared, module-level state: the page builder and every rendered block resolve
// `PageLink` values through this single page map, so a page link is stored as
// an ID and rendered as the current locale's slug at render time.
const pages = ref<Page[]>([]);
const loading = ref(false);
const pagesCache = new Map<string, Page[]>();
const inFlight = new Map<string, Promise<void>>();

export function usePageLinks() {
	const database = useState<Database>("database");
	const config = useRuntimeConfig();
	const route = useRoute();
	const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);

	const cacheKey = computed(
		() => `${database.value?.slug ?? ""}:${Language.value ?? "en"}`,
	);
	const routeDatabasePrefix = computed(() => {
		const value = route.params.database;
		const slug = Array.isArray(value) ? value[0] : value;
		return typeof slug === "string" && slug
			? `/${slug.replace(/^\/+|\/+$/g, "")}`
			: "";
	});

	function withRouteDatabasePrefix(slug: string): string {
		const path = `/${String(slug).replace(/^\/+/, "")}`;
		const prefix = routeDatabasePrefix.value;
		if (!prefix) return path;
		if (path === "/") return prefix;
		if (path === prefix || path.startsWith(`${prefix}/`)) return path;
		return `${prefix}${path}`;
	}

	async function loadPages() {
		if (!database.value?.slug) return;
		const key = cacheKey.value;
		const cached = pagesCache.get(key);
		if (cached) {
			pages.value = cached;
			return cached;
		}
		const existing = inFlight.get(key);
		if (existing) return existing;

		const request = (async () => {
			loading.value = true;
			try {
				const res = await $fetch<apiResponse<Page[]>>(
					`${config.public.apiBase}${database.value.slug}/pages`,
					{
						params: {
							options: Inison.stringify({
								columns: ["id", "slug", "name"],
							}),
							locale: Language.value ?? "en",
							[`${database.value.slug}_sid`]: sessionID.value,
						},
						credentials: "include",
					},
				);
				const result = res.result ?? [];
				pagesCache.set(key, result);
				pages.value = result;
			} finally {
				loading.value = false;
				inFlight.delete(key);
			}
		})();
		inFlight.set(key, request);
		return request;
	}

	// Re-fetches the page list (e.g. when the picker opens after pages changed).
	function refresh() {
		pagesCache.delete(cacheKey.value);
		return loadPages();
	}

	watch([() => database.value?.slug, Language], loadPages, { immediate: true });

	const pagesMap = computed(
		() => new Map(pages.value.map((page) => [String(page.id), page])),
	);

	/** Resolve a builder link value to a renderable href. */
	function resolveLink(link?: string | PageLink): string {
		if (!link) return "#";
		if (typeof link === "string") return link || "#";
		if (link.type === "page") {
			const page = pagesMap.value.get(String(link.id));
			if (!page?.slug) return "#";
			// Normalize slugs ("/" hub page stays "/", "about" → "/about").
			return withRouteDatabasePrefix(String(page.slug));
		}
		return link.url || "#";
	}

	/** `href` + `target` for an `<a>` — external links open in a new tab. */
	function linkAttrs(link?: string | PageLink): {
		href: string;
		target: "_blank" | "_self";
	} {
		const href = resolveLink(link);
		return { href, target: /^https?:\/\//i.test(href) ? "_blank" : "_self" };
	}

	return { pages, pagesMap, loading, resolveLink, linkAttrs, refresh };
}
