export default function (types: string[]): string {
	const RETURN: string[] = [];
	for (const type of types) {
		switch (type) {
			case "image":
				RETURN.push("image/*");
				break;
			case "video":
				RETURN.push("video/*");
				break;
			case "audio":
				RETURN.push("audio/*");
				break;
			case "document":
				RETURN.push(".doc, .docx, .pdf, .txt, .rtf, .odt");
				break;
			case "archive":
				RETURN.push(".zip, .rar, .7z, .tar, .gz");
				break;
		}
	}
	return RETURN.join(",");
}
