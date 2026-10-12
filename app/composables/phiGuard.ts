/**
 * Whether the database currently in view must be treated as PHI (protected
 * health information).
 *
 * Browser persistence — the IndexedDB mutation queue, the thumbnail cache and
 * the localStorage database-config copy — is disabled while this is true, and
 * the service worker refuses to runtime-cache its responses.
 *
 * The default is conservative (C1): a database enables offline persistence
 * **only when the server has explicitly classified it as non-PHI**
 * (`phi === false`). A missing, legacy or `true` value is treated as PHI, so an
 * unclassified database never persists anything to the browser.
 *
 * This is a plain module flag rather than `useState` because the storage
 * helpers read it from IndexedDB callbacks and other contexts that no longer
 * hold a Nuxt instance. `browser-containment.client.ts` keeps it in sync with
 * the `database` state.
 *
 * It starts `true`: until a database is positively loaded as non-PHI we assume
 * the worst, so nothing is persisted during boot. The plugin flips it off once
 * it knows the active database is explicitly non-PHI.
 */
let phiDatabase = true;

/** Called by the containment plugin whenever the active database changes. */
export function setPhiDatabase(value: boolean): void {
	phiDatabase = value === true;
}

export function isPhiDatabase(): boolean {
	return phiDatabase;
}

/**
 * Classify a loaded database record. Conservative by design: only an explicit
 * `phi: false` is non-PHI. Missing, legacy and invalid values stay PHI, so
 * offline persistence is opt-in (the C1 "conservatively defaults to disabled"
 * requirement). Pure, so it can be unit-tested without a Nuxt runtime.
 */
export function resolvePhiDatabase(
	database: { phi?: boolean } | undefined | null,
): boolean {
	return database?.phi !== false;
}
