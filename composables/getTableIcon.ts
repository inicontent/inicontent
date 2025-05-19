export default function (table: Table) {
	if (table.icon) return `tabler:${table.icon}`
	switch (table.slug) {
		case "assets":
			return "tabler:folder"
		case "translations":
			return "tabler:language"
		case "users":
			return "tabler:users"
		case "sessions":
			return "tabler:fingerprint"
		case "pages":
			return "tabler:app-window"
		case "blocks":
			return "tabler:tournament"
		default:
			return t(table.slug).charAt(0).toUpperCase()
	}
}
