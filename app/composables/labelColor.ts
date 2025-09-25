import type { TagColor } from "naive-ui/es/tag/src/common-props"

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

	const brightness = (r * 299 + g * 587 + b * 114) / 1000
	return brightness > 128 ? "black" : "white"
}
