import { isArrayOfArrays } from "inibase/utils";
import type { TagColor } from "naive-ui/es/tag/src/common-props";

export function getColorObj(
	value: string,
	fieldOptions?: (
		| string
		| number
		| {
				label: string;
				value: string | number;
		  }
		| [string | number, string]
	)[],
): TagColor {
	if (fieldOptions && isArrayOfArrays(fieldOptions)) {
		const option = (
			fieldOptions as undefined | [string | number, string][]
		)?.find(([label]) => label === value);
		if (option) {
			return {
				color: option[1],
				borderColor: option[1],
				textColor: getContrastColor(option[1]),
			};
		}
	}
	return {};
}

function getComputedBgColor(element: HTMLElement) {
	return window.getComputedStyle(element).backgroundColor;
}

function getContrastColor(rgb: string) {
	const result = rgb.match(/\d+/g)?.map(Number);
	if (!result) return "black";
	const [r, g, b] = result;
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 128 ? "black" : "white";
}

export function getDynamicStyle(value: string) {
	return (node: HTMLElement) => {
		const bgColor = getComputedBgColor(node);
		const textColor = getContrastColor(bgColor);
		return { color: textColor, backgroundColor: value };
	};
}
