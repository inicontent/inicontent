export default function (type: string) {
	switch (type) {
		case "textarea":
			return {
				type: "string",
				subType: "textarea",
			};
		case "role":
			return {
				type: "string",
				subType: "role",
			};
		case "upload":
			return {
				type: "table",
				table: "asset",
			};
		case "array-upload":
			return {
				type: "array",
				children: "table",
				table: "asset",
			};
		case "array-table":
			return {
				type: "array",
				children: "table",
				subType: "table",
			};
		case "tags":
			return {
				type: "array",
				subType: "tags",
			};
		case "select":
			return {
				type: ["string", "number"],
				subType: "select",
			};
		case "array-select":
			return {
				type: "array",
				children: ["string", "number"],
				subType: "select",
			};
		case "color":
			return {
				type: "string",
				subType: "color",
			};
		case "array":
		case "object":
			return {
				type: type,
				children: [],
			};
		default:
			return { type };
	}
}
