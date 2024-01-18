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
  setup: ({ type }) => {
    if (!type) return () => h(IconFileText);

    if (type === "folder") return () => h(IconFolder);
    else if (type.startsWith("video/")) return () => h(IconVideo);
    else if (type.startsWith("audio/")) return () => h(IconFileMusic);
    else if (type.startsWith("font/")) return () => h(IconFileTypography);
    else if (type?.startsWith("application/")) {
      if (type === "application/pdf") return () => h(IconFileTypePdf);
      else if (type === "application/zip") return () => h(IconFileTypeZip);
      else if (type === "application/msword") return () => h(IconFileTypeDoc);
      else if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return () => h(IconFileTypeDocx);
      else if (
        type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        type === "application/vnd.ms-excel"
      )
        return () => h(IconFileSpreadsheet);
      else if (type === "application/x-7z-compressed")
        return () => h(IconFileZip);
    } else if (type.startsWith("text/")) {
      if (type === "text/html") return () => h(IconFileTypeHtml);
      else if (type === "text/css") return () => h(IconFileTypeCss);
      else if (type === "text/js") return () => h(IconFileTypeJs);
      else if (type === "text/csv") return () => h(IconFileSpreadsheet);
      else if (type === "text/plain") return () => h(IconFileText);
    }
    return () => h(IconFileText);
  },
});
