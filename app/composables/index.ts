import { default as t } from "./Translation/translate"
import { default as defineTranslation } from "./Translation/define"

// Type definition for tag colors (replacement for naive-ui TagColor)
type TagColor = {
	color?: string
	borderColor?: string
	textColor?: string
}

export { default as translationLanguages } from "./Translation/languages"
export { default as defineTranslation } from "./Translation/define"
export { default as fetchTranslation } from "./Translation/fetch"
export { default as t } from "./Translation/translate"

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
	defineTranslation({
		ar: {
			ComparisonOperator: {
				equalTo: "يساوي",
				notEqualTo: "لا يساوي",
				greaterThan: "أكبر من",
				greaterOrEqualTo: "أكبر من او يساوي",
				lessThan: "أصغر من",
				lessOrEqualTo: "أصغر من او يساوي",
				contains: "يحتوي",
				doesNotContain: "لا يحتوي",
				isOneOf: "يضم",
				isNotOneOf: "لا يضم",
			},
		},
	})
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
