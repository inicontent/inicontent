import { FormatObjectCriteriaValue, isArrayOfObjects } from "inibase/utils"

function _generateSearchInOption(
	schema: Schema,
	{ id, key, type, children }: Field,
	useIDasValue?: boolean,
	path?: string,
): any {
	if ((type === "object" || type === "array") && isArrayOfObjects(children)) {
		const _children = (children as Schema).filter(({ type }) =>
			Array.isArray(type)
				? type.some((t) => !["table", "array", "object"].includes(t))
				: !["table", "array", "object"].includes(type),
		)
		if (!_children.length) return undefined
		return {
			label: t(key),
			value: useIDasValue ? id : (path ?? "") + key,
			children: _children.map((field) =>
				_generateSearchInOption(
					schema,
					field,
					useIDasValue,
					`${(path ?? "") + key}.`,
				),
			),
		}
	}

	return {
		label: t(key),
		value: useIDasValue ? id : (path ?? "") + key,
	}
}

export function generateSearchInOptions(
	schema?: Schema,
	excludedKeys?: string[],
	useIDasValue?: boolean,
) {
	if (!schema) return []
	const RETURN = schema
		.map((field) => _generateSearchInOption(schema, field, useIDasValue))
		.filter(Boolean)
		.flat(Number.POSITIVE_INFINITY)
	if (excludedKeys)
		return RETURN.filter(({ value }) => !excludedKeys.includes(value))
	return RETURN
}


// ==================== ENCODE/DECODE LOGIC ====================

type RelativeUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

const relativeUnitMap: Record<string, RelativeUnit> = {
	year: "year",
	years: "year",
	yr: "year",
	yrs: "year",
	month: "month",
	months: "month",
	mo: "month",
	mos: "month",
	week: "week",
	weeks: "week",
	wk: "week",
	wks: "week",
	day: "day",
	days: "day",
	d: "day",
	hour: "hour",
	hours: "hour",
	hr: "hour",
	hrs: "hour",
	minute: "minute",
	minutes: "minute",
	min: "minute",
	mins: "minute",
	second: "second",
	seconds: "second",
	sec: "second",
	secs: "second",
}

function resolveRelativeDate(rawValue: unknown): number | undefined {
	if (rawValue === null || rawValue === undefined) return undefined
	const text = String(rawValue).trim()
	if (!text) return undefined
	const lowered = text.toLowerCase()
	if (lowered === "now") return Date.now()
	if (lowered === "yesterday") return shiftDate(new Date(), -1, "day")
	if (lowered === "tomorrow") return shiftDate(new Date(), 1, "day")
	if (lowered === "last week") return shiftDate(new Date(), -1, "week")
	if (lowered === "last month") return shiftDate(new Date(), -1, "month")
	if (lowered === "last year") return shiftDate(new Date(), -1, "year")
	if (lowered === "next week") return shiftDate(new Date(), 1, "week")
	if (lowered === "next month") return shiftDate(new Date(), 1, "month")
	if (lowered === "next year") return shiftDate(new Date(), 1, "year")

	let expression = lowered.replace(/\s+/g, " ").trim()
	let implicitFuture = false
	if (expression.startsWith("in ")) {
		expression = expression.slice(3).trim()
		implicitFuture = true
	}

	const match = expression.match(
		/^([+-]?\d+)\s*([a-z]+)(?:\s+(ago|from now|later|after|before|ahead))?$/,
	)
	if (match) {
		const amountText = match[1]
		const unitToken = match[2]
		if (!amountText || !unitToken) return undefined
		let amount = Number.parseInt(amountText, 10)
		if (!Number.isFinite(amount)) return undefined
		const directionToken = match[3] ?? (implicitFuture ? "from now" : undefined)
		if (directionToken === "ago")
			amount = -Math.abs(amount)
		else if (directionToken)
			amount = Math.abs(amount)
		const mappedUnit = relativeUnitMap[unitToken]
		if (!mappedUnit) return undefined
		return shiftDate(new Date(), amount, mappedUnit)
	}

	const fallback = Date.parse(text)
	return Number.isNaN(fallback) ? undefined : fallback
}

function shiftDate(baseDate: Date, amount: number, unit: RelativeUnit) {
	const date = new Date(baseDate.getTime())
	switch (unit) {
		case "year":
			date.setFullYear(date.getFullYear() + amount)
			break
		case "month":
			date.setMonth(date.getMonth() + amount)
			break
		case "week":
			date.setDate(date.getDate() + amount * 7)
			break
		case "day":
			date.setDate(date.getDate() + amount)
			break
		case "hour":
			date.setHours(date.getHours() + amount)
			break
		case "minute":
			date.setMinutes(date.getMinutes() + amount)
			break
		case "second":
			date.setSeconds(date.getSeconds() + amount)
			break
	}
	return date.getTime()
}

function prepareCriterionForMode(
	operator: string | undefined,
	rawValue: any,
	mode: "display" | "fetch",
) {
	const normalizedOperator = typeof operator === "string" && operator ? operator : "="
	if (mode === "fetch" && normalizedOperator.startsWith("r")) {
		const absoluteValue = resolveRelativeDate(rawValue)
		if (absoluteValue === undefined)
			return { operator: normalizedOperator, value: undefined }
		const strippedOperator =
			normalizedOperator.length > 1 ? normalizedOperator.slice(1) : "="
		return { operator: strippedOperator, value: absoluteValue }
	}
	return { operator: normalizedOperator, value: rawValue }
}

export function generateSearchString(
	searchArray: any,
	mode: "display" | "fetch" = "display",
) {
	const RETURN: Record<string, any> = {}
	if (!searchArray) return undefined
	for (const condition in searchArray) {
		const items = searchArray[condition]
		if (!Array.isArray(items)) continue
		for (const item of items) {
			if (!Array.isArray(item)) continue
			const fieldKey = item[0]
			if (!fieldKey) continue
			if (!RETURN[condition]) RETURN[condition] = {}
			const { operator, value } = prepareCriterionForMode(
				typeof item[1] === "string" ? item[1] : "=",
				item[2],
				mode,
			)
			if (value === undefined) continue
			const finalValue = value === undefined ? "" : value
			RETURN[condition][fieldKey] = `${operator === "=" ? "" : operator}${finalValue}`
		}
	}
	function isDeepEmpty(obj: any): boolean {
		if (typeof obj !== "object" || obj === null) return false
		const keys = Object.keys(obj)
		if (keys.length === 0) return true
		return keys.every((k) => isDeepEmpty(obj[k]))
	}
	return !isDeepEmpty(RETURN) ? RETURN : undefined
}

function decodeStoredCriterion(value: any): [string, any] {
	const RELATIVE_OPERATORS = ["r>=", "r<=", "r!=", "r>", "r<", "r="] as const

	if (typeof value === "string" && value.startsWith("r")) {
		const matched = RELATIVE_OPERATORS.find((operator) =>
			value.startsWith(operator),
		)
		if (matched)
			return [matched, value.slice(matched.length)] as [string, any]
	}
	if (typeof value === "string") return FormatObjectCriteriaValue(value)
	return ["=", value]
}

export function generateSearchArray(searchQuery: any): searchType {
	const RETURN: searchType = {}
	for (const [condition, items] of Object.entries(searchQuery)) {
		if (!RETURN[condition as "and" | "or"])
			RETURN[condition as "and" | "or"] = []
		for (const [key, value] of Object.entries(items)) {
			if (["and", "or"].includes(key))
				RETURN[condition as "and" | "or"]?.push({
					[key]: generateSearchArray(value),
				})
			else
				RETURN[condition as "and" | "or"]?.push([
					key,
					...decodeStoredCriterion(value),
				])
		}
	}
	return RETURN
}