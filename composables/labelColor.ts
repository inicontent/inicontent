import { isArrayOfArrays } from "inibase/utils";
import type { TagColor } from "naive-ui/es/tag/src/common-props";

export function getColorObj(
	value: string | number,
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

function getContrastColor(hex: string) {
    // Remove '#' if present
    hex = hex.replace(/^#/, "");

    // Parse short hex (e.g., #abc) into full hex (e.g., #aabbcc)
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
}
