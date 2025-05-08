import { DataIcon } from "#components"
import {
	IconFolders,
	IconLanguage,
	IconUsers,
	IconFingerprint,
	IconAppWindow,
	IconTournament,
} from "@tabler/icons-vue"
import { NIcon } from "naive-ui"

export default function (table: Table) {
	if (table.icon) return h(DataIcon, { value: table.icon })
	switch (table.slug) {
		case "assets":
			return h(NIcon, () => h(IconFolders))
		case "translations":
			return h(NIcon, () => h(IconLanguage))
		case "users":
			return h(NIcon, () => h(IconUsers))
		case "sessions":
			return h(NIcon, () => h(IconFingerprint))
		case "pages":
			return h(NIcon, () => h(IconAppWindow))
		case "blocks":
			return h(NIcon, () => h(IconTournament))
		default:
			return h("span", t(table.slug).charAt(0).toUpperCase())
	}
}
