/** A3: database metadata is network-only, including reads of legacy copies. */
export function saveDatabaseConfigLocally(
	_slug: string,
	_database?: Database,
) {}
export function loadDatabaseConfigLocally(_slug: string): Database | undefined {
	return undefined;
}
export function clearDatabaseConfigLocally(slug: string) {
	if (typeof localStorage !== "undefined")
		localStorage.removeItem(`inicontent:db-config:${slug}`);
}
