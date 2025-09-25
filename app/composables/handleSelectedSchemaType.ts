export default function (type: string) {
	switch (type) {
		case "textarea":
			return {
				type: "string",
				subType: "textarea",
			}
		case "role":
			return {
				type: "string",
				subType: "role",
			}
		case "asset":
			return {
				type: "table",
				table: "assets",
			}
		case "array-asset":
			return {
				type: "array",
				children: "table",
				table: "assets",
			}
		case "array-table":
			return {
				type: "array",
				children: "table",
				subType: "table",
			}
		case "tags":
			return {
				type: "array",
				subType: "tags",
			}
		case "select":
			return {
				type: ["string", "number"],
				subType: "select",
			}
		case "multiple":
			return {
				type: ["string"],
			}
		case "radio":
			return {
				type: ["string", "number"],
				subType: "radio",
			}
		case "checkbox":
			return {
				type: "array",
				children: ["string", "number"],
				subType: "checkbox",
			}
		case "array-select":
			return {
				type: "array",
				children: ["string", "number"],
				subType: "select",
			}
		case "color":
			return {
				type: "string",
				subType: "color",
			}
		case "array":
		case "object":
			return {
				type: type,
				children: [],
			}
		default:
			return { type }
	}
}
