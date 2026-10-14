import { databaseHostname } from "./region.ts";

/**
 * Billing and other platform workspaces must run on a platform host, even when
 * the tenant has custom domains.
 *
 * The host encodes the region, so a secondary region's workspace is reached at
 * `<region>--<slug>.inicontent.com`; the main region keeps the bare
 * `<slug>.inicontent.com` (backward compatible).
 */
export function resolvePlatformFeatureHost(
	slug: string,
	region?: string | null,
): string {
	if (slug === "inicontent") return "https://inicontent.com";
	const host = databaseHostname(slug, region);
	if (!host) throw new Error("Invalid database slug");
	return `https://${host}`;
}
