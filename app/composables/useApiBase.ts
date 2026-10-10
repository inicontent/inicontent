/**
 * The single seam for the API base URL. Today it is a build-time constant;
 * per-region routing (Phase D) delivers it at session bootstrap instead.
 * Every call site must read it through this composable so the switch is a
 * one-place change. Do not add new direct `config.public.apiBase` reads.
 */
export function useApiBase(): string {
	const config = useRuntimeConfig();
	return String(config.public?.apiBase ?? "");
}
