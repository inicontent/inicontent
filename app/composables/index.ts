import type { TagColor } from "naive-ui/es/tag/src/common-props"
import { default as t } from "./Translation/translate"
import { isArrayOfObjects } from "inibase/utils"

export { default as translationLanguages } from "./Translation/languages"
export { default as defineTranslation } from "./Translation/define"
export { default as fetchTranslation } from "./Translation/fetch"
export { default as t } from "./Translation/translate"
export { default as loadCoreTranslations } from "./Translation/loadCoreTranslations"

// Add a small deepClone helper
export function deepClone<T>(v: T): T | undefined {
	if (v === undefined) return undefined
	try {
		// Use structuredClone if available (preserves more types)
		if (typeof (globalThis as any).structuredClone === "function")
			return (globalThis as any).structuredClone(v)
	} catch (e) {
		// ignore and fallback
	}
	// Fallback
	return JSON.parse(JSON.stringify(v)) as T
}

export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>
	return (...args: Parameters<T>): void => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), wait)
	}
}

export function humanFileSize(bytes?: number) {
	if (!bytes) bytes = 0
	const thresh = 1000

	if (Math.abs(bytes) < thresh) {
		return `${bytes} B`
	}

	const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
	let u = -1
	const r = 10 ** 2

	do {
		bytes /= thresh
		++u
	} while (
		Math.round(Math.abs(bytes) * r) / r >= thresh &&
		u < units.length - 1
	)

	return `${bytes.toFixed(2)} ${t(`units.${units[u]}`)}`
}

export function hexToRGB(hex: string): number[] {
	const r = Number.parseInt(hex.slice(1, 3), 16)
	const g = Number.parseInt(hex.slice(3, 5), 16)
	const b = Number.parseInt(hex.slice(5, 7), 16)
	return [r, g, b]
}

export const randomID = (): string => Math.random().toString(36).substring(2)

export function getColorObj(
	value: string | number,
	fieldOptions: [string | number, string][],
): TagColor {
	const option = fieldOptions.find(([label]) => label === value)
	if (option) {
		return {
			color: option[1],
			borderColor: option[1],
			textColor: getContrastColor(option[1]),
		}
	}
	return {}
}

function getContrastColor(hex: string) {
	const [r, g, b] = hexToRGB(hex)

	if (r === undefined || g === undefined || b === undefined) return "black"

	const brightness = (r * 299 + g * 587 + b * 114) / 1000
	return brightness > 128 ? "black" : "white"
}

export function handleSelectedSchemaType(type: string) {
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

export async function copyToClipboard(textToCopy: string | number) {
	// Navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(String(textToCopy))
	} else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement("textarea")
		textArea.value = String(textToCopy)

		// Move textarea out of the viewport so it's not visible
		textArea.style.position = "absolute"
		textArea.style.left = "-999999px"

		document.body.prepend(textArea)
		textArea.select()

		try {
			document.execCommand("copy")
		} catch (error) {
			console.error(error)
		} finally {
			textArea.remove()
		}
	}
}

export function comparisonOperatorOptions() {
	return [
		{
			label: t("ComparisonOperator.equalTo"),
			value: "=",
		},
		{
			label: t("ComparisonOperator.notEqualTo"),
			value: "!=",
		},
		{
			label: t("ComparisonOperator.contains"),
			value: "*",
		},
		{
			label: t("ComparisonOperator.doesNotContain"),
			value: "!*",
		},
		{
			label: t("ComparisonOperator.isOneOf"),
			value: "[]",
		},
		{
			label: t("ComparisonOperator.isNotOneOf"),
			value: "![]",
		},
		{
			label: t("ComparisonOperator.greaterThan"),
			value: ">",
		},
		{
			label: t("ComparisonOperator.greaterOrEqualTo"),
			value: ">=",
		},
		{
			label: t("ComparisonOperator.lessThan"),
			value: "<",
		},
		{
			label: t("ComparisonOperator.lessOrEqualTo"),
			value: "<=",
		},
	]
}

export function checkFieldType(
	fieldType: string | string[],
	compareAtType: string | string[],
) {
	if (Array.isArray(fieldType))
		return fieldType.some((type) =>
			Array.isArray(compareAtType)
				? compareAtType.includes(type)
				: compareAtType === type,
		)

	return Array.isArray(compareAtType)
		? compareAtType.includes(fieldType)
		: compareAtType === fieldType
}

export function getTableIcon(table: Table) {
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

export function getCollapseItemTitle(
	field: Field,
	item: Item,
	index: number,
): string {
	const firstStringField = (field.children as Schema).find(({ type }) =>
		typeof type === "string" ? type === "string" : type.includes("string"),
	)
	if (firstStringField && item[firstStringField.key])
		return item[firstStringField.key]

	return `${t(field.key)} ${index + 1}`
}

export function getPath(
	schema: Schema,
	id: string | number | undefined,
	supportWildcard = false,
	listNumbers?: number | number[],
	currentPath?: string,
): string {
	if (!id) return ""

	for (const item of schema) {
		const newPath = currentPath ? `${currentPath}.${item.key}` : item.key

		if (item.id === id) return newPath

		if (
			item.type === "array" &&
			item.children &&
			isArrayOfObjects(item.children)
		) {
			let nestedPath = ""
			if (listNumbers) {
				if (!Array.isArray(listNumbers)) listNumbers = [listNumbers]
				const firstItem = listNumbers.shift()
				nestedPath = getPath(
					item.children,
					id,
					supportWildcard,
					listNumbers,
					newPath + (supportWildcard ? ".*" : ".") + firstItem,
				)
			} else
				nestedPath = getPath(
					item.children,
					id,
					supportWildcard,
					undefined,
					newPath + (supportWildcard ? ".*" : "."),
				)
			if (nestedPath) return nestedPath
		} else if (item.children && isArrayOfObjects(item.children)) {
			const nestedPath = getPath(
				item.children,
				id,
				supportWildcard,
				undefined,
				newPath,
			)
			if (nestedPath) return nestedPath
		}
	}

	return ""
}

export const imageExtensions = [
	"png",
	"jpg",
	"jpeg",
	"webp",
	"avif",
	"svg",
];

export const videoExtensions = [
	"mp4",
	"webm",
	"ogg",
	"mov",
	"avi",
	"mkv",
];

// ToDo: in app preview support for other document types like docx, xlsx, pptx
export const documentExtensions = [
	"pdf",
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
];

/**
 * Extracts the file name and extension from a file path or file name string.
 * Works in browsers (no Node.js dependencies).
 */
export function getFileNameAndExtension(path: string): { name: string; extension: string } {
	// Extract just the file name (handles both "/" and "\" separators)
	const fullName = path.split(/[/\\]/).pop() || path;

	// Handle files without any dots
	if (!fullName.includes('.')) {
		return { name: fullName, extension: '' };
	}

	// Find the last dot to split name and extension
	const lastDotIndex = fullName.lastIndexOf('.');
	const name = fullName.substring(0, lastDotIndex);
	const extension = fullName.substring(lastDotIndex + 1); // excludes the "."

	return { name, extension };
}