import { isArrayOfObjects } from "inibase/utils"
import Inison from "inison"

function applyRegex(field: Field, value?: string | (string | number)[]) {
	if (field.regex && value) {
		try {
			const regex = new RegExp(field.regex)
			const isValid = (() => {
				let result = false
				const timeout = setTimeout(() => {
					throw new Error("Regex evaluation timeout")
				}, 1000) // 1-second timeout
				if (Array.isArray(value))
					result = value.every((v) => regex.test(String(v)))
				else result = regex.test(String(value))
				clearTimeout(timeout)
				return result
			})()
			if (!isValid) {
				return new Error(`${t(field.key)} ${t("isInvalidFormat")}`)
			}
		} catch (error) {
			return new Error(`${t(field.key)} ${t("isInvalidFormat")}`)
		}
	}
	return true
}

export default function (
	field: Field,
	value: any,
	extraValidator?: CallableFunction,
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (field.isArray || Array.isArray(value)) {
			if (!value || (Array.isArray(value) && value.length === 0))
				if (field.required)
					reject(new Error(`${t(field.key)} ${t("isRequired")}`))
				else resolve()

			if (Array.isArray(value) && field.min && value.length < field.min)
				reject(new Error(`${t(field.key)} ${t("isNotValid")}`))

			if (Array.isArray(value) && field.max && value.length > field.max)
				reject(new Error(`${t(field.key)} ${t("isNotValid")}`))

			const regex = applyRegex(
				field,
				isArrayOfObjects(value) ? Inison.stringify(value) : value,
			)
			if (regex instanceof Error) reject(regex)
		} else {
			if (
				value === undefined ||
				value === null ||
				(typeof value === "string" && value.trim().length === 0)
			)
				if (field.required)
					reject(new Error(`${t(field.key)} ${t("isRequired")}`))
				else resolve()

			const regex = applyRegex(field, value)
			if (regex instanceof Error) reject(regex)
		}

		if (extraValidator)
			if (!extraValidator(value, field))
				reject(new Error(`${t(field.key)} ${t("isNotValid")}`))

		resolve()
	})
}
