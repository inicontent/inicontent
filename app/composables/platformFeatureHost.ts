/** Billing must run on a platform host, even when the tenant has custom domains. */
export function resolvePlatformFeatureHost(slug: string): string {
	if (slug === "inicontent") return "https://inicontent.com";
	const url = new URL(`https://${slug}.inicontent.com`);
	const label = url.hostname.slice(0, -".inicontent.com".length);
	if (
		!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label) ||
		url.origin !== `https://${url.hostname}` ||
		url.pathname !== "/" ||
		url.username ||
		url.password ||
		url.search ||
		url.hash
	) {
		throw new Error("Invalid database slug");
	}
	return url.origin;
}
