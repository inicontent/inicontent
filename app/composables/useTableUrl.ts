/**
 * Build client-side URLs for table pages with slug segments percent-encoded
 * exactly like the browser would when navigating to a literal `<a href>`.
 *
 * unrouting registers statically-named page files — e.g. an app's customized
 * `admin/tables/منتجات/index.vue` — under the browser's encoded spelling
 * (`/admin/tables/%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA`). vue-router v4/v5
 * match static segments *literally* (the raw spelling never matches, which is
 * why customized Arabic/CJK pages were only reachable on direct load/refresh).
 *
 * This helper emits the encoded spelling for every navigation the layer builds
 * (`NuxtLink`, `navigateTo`, `router.push`), so customized pages resolve
 * without any app-side extra code.
 *
 * `encodeURI` (not `encodeURIComponent`) is used per segment: it percent-
 * encodes non-ASCII and spaces while keeping sub-delimiters (`: @ & = + $ , ;`)
 * raw — the same behaviour as the browser and the same spelling unrouting
 * registers for slugs that contain such characters (e.g. `خاص:جديد`).
 */
export function useTableUrl() {
	const route = useRoute();

	const encodeSegment = (segment: string) => encodeURI(segment);

	/**
	 * `/admin/tables/<encoded-slug>` with an optional database prefix, also
	 * encoded, and an optional suffix appended verbatim (e.g. `/new`,
	 * `/${id}/edit`, `?data=...`).
	 *
	 * @param slug     raw table slug (Arabic/CJK-safe)
	 * @param suffix   path/query appended after the slug, not re-encoded
	 * @param database explicit database slug; defaults to the current route's
	 *                 `:database?` param when present
	 */
	function tableUrl(slug: string, suffix = "", database?: string) {
		const db =
			database ??
			(route.params.database ? String(route.params.database) : undefined);
		const base = db ? `/${encodeSegment(db)}` : "";
		return `${base}/admin/tables/${encodeSegment(slug)}${suffix}`;
	}

	return { tableUrl };
}
