import {
	IconFileMusic,
	IconFileSpreadsheet,
	IconFileTypeDoc,
	IconFileTypeDocx,
	IconFileTypography,
	IconFileTypeJs,
	IconFileZip,
	IconFileText,
	IconFileTypeCss,
	IconFileTypeHtml,
	IconFileTypePdf,
	IconFileTypeZip,
	IconFolder,
	IconVideo,
} from "@tabler/icons-vue";

export default defineNuxtComponent({
	props: ["type"],
	setup: (props) => {
		const type = toRef(props, "type");

		if (!type.value) return () => h(IconFileText);

		if (type.value === "folder") return () => h(IconFolder);
		if (type.value.startsWith("video/")) return () => h(IconVideo);
		if (type.value.startsWith("audio/")) return () => h(IconFileMusic);
		if (type.value.startsWith("font/")) return () => h(IconFileTypography);
		if (type.value?.startsWith("application/")) {
			if (type.value === "application/pdf") return () => h(IconFileTypePdf);
			if (type.value === "application/zip") return () => h(IconFileTypeZip);
			if (type.value === "application/msword") return () => h(IconFileTypeDoc);
			if (
				type.value ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			)
				return () => h(IconFileTypeDocx);
			if (
				type.value ===
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
				type.value === "application/vnd.ms-excel"
			)
				return () => h(IconFileSpreadsheet);
			if (type.value === "application/x-7z-compressed")
				return () => h(IconFileZip);
		} else if (type.value.startsWith("text/")) {
			if (type.value === "text/html") return () => h(IconFileTypeHtml);
			if (type.value === "text/css") return () => h(IconFileTypeCss);
			if (type.value === "text/js") return () => h(IconFileTypeJs);
			if (type.value === "text/csv") return () => h(IconFileSpreadsheet);
			if (type.value === "text/plain") return () => h(IconFileText);
		}
		return () => h(IconFileText);
	},
});
