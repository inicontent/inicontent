import { DataIcon } from "#components";
import {
	IconFolders,
	IconLanguage,
	IconUsers,
	IconFingerprint,
	IconAppWindow,
	IconTournament,
} from "@tabler/icons-vue";

export default function (table: Table) {
	if (table.icon) return h(DataIcon, { value: table.icon });
	switch (table.slug) {
		case "assets":
			return h(IconFolders);
		case "translations":
			return h(IconLanguage);
		case "users":
			return h(IconUsers);
		case "sessions":
			return h(IconFingerprint);
		case "pages":
			return h(IconAppWindow);
		case "components":
			return h(IconTournament);
		default:
			return h("span", t(table.slug).charAt(0).toUpperCase());
	}
}
