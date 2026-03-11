import { FormatObjectCriteriaValue, isArrayOfObjects } from "inibase/utils";

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
		);
		if (!_children.length) return undefined;
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
		};
	}

	return {
		label: t(key),
		value: useIDasValue ? id : (path ?? "") + key,
	};
}

export function generateSearchInOptions(
	schema?: Schema,
	excludedKeys?: string[],
	useIDasValue?: boolean,
) {
	if (!schema) return [];
	const RETURN = schema
		.map((field) => _generateSearchInOption(schema, field, useIDasValue))
		.filter(Boolean)
		.flat(Number.POSITIVE_INFINITY);
	if (excludedKeys)
		return RETURN.filter(({ value }) => !excludedKeys.includes(value));
	return RETURN;
}

// ==================== ENCODE/DECODE LOGIC ====================

type RelativeUnit =
	| "year"
	| "month"
	| "week"
	| "day"
	| "hour"
	| "minute"
	| "second";

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
};

function resolveRelativeDate(rawValue: unknown): number | undefined {
	if (rawValue === null || rawValue === undefined) return undefined;
	const text = String(rawValue).trim();
	if (!text) return undefined;
	const lowered = text.toLowerCase();
	if (lowered === "now") return Date.now();
	if (lowered === "yesterday") return shiftDate(new Date(), -1, "day");
	if (lowered === "tomorrow") return shiftDate(new Date(), 1, "day");
	if (lowered === "last week") return shiftDate(new Date(), -1, "week");
	if (lowered === "last month") return shiftDate(new Date(), -1, "month");
	if (lowered === "last year") return shiftDate(new Date(), -1, "year");
	if (lowered === "next week") return shiftDate(new Date(), 1, "week");
	if (lowered === "next month") return shiftDate(new Date(), 1, "month");
	if (lowered === "next year") return shiftDate(new Date(), 1, "year");

	let expression = lowered.replace(/\s+/g, " ").trim();
	let implicitFuture = false;
	if (expression.startsWith("in ")) {
		expression = expression.slice(3).trim();
		implicitFuture = true;
	}

	const match = expression.match(
		/^([+-]?\d+)\s*([a-z]+)(?:\s+(ago|from now|later|after|before|ahead))?$/,
	);
	if (match) {
		const amountText = match[1];
		const unitToken = match[2];
		if (!amountText || !unitToken) return undefined;
		let amount = Number.parseInt(amountText, 10);
		if (!Number.isFinite(amount)) return undefined;
		const directionToken =
			match[3] ?? (implicitFuture ? "from now" : undefined);
		if (directionToken === "ago") amount = -Math.abs(amount);
		else if (directionToken) amount = Math.abs(amount);
		const mappedUnit = relativeUnitMap[unitToken];
		if (!mappedUnit) return undefined;
		return shiftDate(new Date(), amount, mappedUnit);
	}

	const fallback = Date.parse(text);
	return Number.isNaN(fallback) ? undefined : fallback;
}

function shiftDate(baseDate: Date, amount: number, unit: RelativeUnit) {
	const date = new Date(baseDate.getTime());
	switch (unit) {
		case "year":
			date.setFullYear(date.getFullYear() + amount);
			break;
		case "month":
			date.setMonth(date.getMonth() + amount);
			break;
		case "week":
			date.setDate(date.getDate() + amount * 7);
			break;
		case "day":
			date.setDate(date.getDate() + amount);
			break;
		case "hour":
			date.setHours(date.getHours() + amount);
			break;
		case "minute":
			date.setMinutes(date.getMinutes() + amount);
			break;
		case "second":
			date.setSeconds(date.getSeconds() + amount);
			break;
	}
	return date.getTime();
}

function fieldHasType(field: unknown, expectedType: FieldType) {
	if (!field || typeof field !== "object") return false;
	const fieldType = (field as { type?: FieldType | FieldType[] }).type;
	if (!fieldType) return false;
	if (Array.isArray(fieldType)) return fieldType.includes(expectedType);
	return fieldType === expectedType;
}

function resolveRelativeNumber(rawValue: unknown): number | undefined {
	if (rawValue === null || rawValue === undefined) return undefined;
	if (typeof rawValue === "number")
		return Number.isFinite(rawValue) ? rawValue : undefined;

	if (typeof rawValue === "string") {
		const text = rawValue.trim();
		if (!text) return undefined;
		const normalized = text.replaceAll(",", "");
		const parsed = Number(normalized);
		return Number.isFinite(parsed) ? parsed : undefined;
	}

	return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function appendCriterionValue(
	conditionTarget: Record<string, unknown>,
	condition: "and" | "or",
	fieldKey: string,
	criterionValue: string,
) {
	const existingValue = conditionTarget[fieldKey];
	if (existingValue === undefined) {
		conditionTarget[fieldKey] = criterionValue;
		return;
	}

	if (isRecord(existingValue) && isRecord(existingValue[condition])) {
		const logicalGroup = existingValue[condition] as Record<string, unknown>;
		logicalGroup[Object.keys(logicalGroup).length.toString()] = criterionValue;
		return;
	}

	conditionTarget[fieldKey] = {
		[condition]: {
			"0": String(existingValue),
			"1": criterionValue,
		},
	};
}

function prepareCriterionForMode(
	operator: string | undefined,
	rawValue: any,
	field?: Field,
	mode: "display" | "fetch",
) {
	const normalizedOperator =
		typeof operator === "string" && operator ? operator : "=";
	if (mode === "fetch" && normalizedOperator.startsWith("r")) {
		const absoluteValue = fieldHasType(field, "number")
			? resolveRelativeNumber(rawValue)
			: resolveRelativeDate(rawValue);
		if (absoluteValue === undefined)
			return { operator: normalizedOperator, value: undefined };
		const strippedOperator =
			normalizedOperator.length > 1 ? normalizedOperator.slice(1) : "=";
		return { operator: strippedOperator, value: absoluteValue };
	}
	return { operator: normalizedOperator, value: rawValue };
}

export function generateSearchString(
	searchArray: any,
	mode: "display" | "fetch" = "display",
) {
	const RETURN: Record<string, Record<string, unknown>> = {};
	if (!searchArray) return undefined;
	for (const condition in searchArray) {
		const items = searchArray[condition];
		if (!["and", "or"].includes(condition)) continue;
		if (!Array.isArray(items)) continue;
		for (const item of items) {
			if (!Array.isArray(item)) continue;
			const fieldKey = item[0];
			if (!fieldKey) continue;
			const field = item[3] as Field | undefined;
			if (!RETURN[condition]) RETURN[condition] = {};
			const { operator, value } = prepareCriterionForMode(
				typeof item[1] === "string" ? item[1] : "=",
				item[2],
				field,
				mode,
			);
			if (value === undefined) continue;
			const finalValue = value === undefined ? "" : value;
			appendCriterionValue(
				RETURN[condition],
				condition as "and" | "or",
				fieldKey,
				`${operator === "=" ? "" : operator}${finalValue}`,
			);
		}
	}
	function isDeepEmpty(obj: unknown): boolean {
		if (typeof obj !== "object" || obj === null) return false;
		const keys = Object.keys(obj);
		if (keys.length === 0) return true;
		return keys.every((k) => isDeepEmpty((obj as Record<string, unknown>)[k]));
	}
	return !isDeepEmpty(RETURN) ? RETURN : undefined;
}

function decodeStoredCriterion(value: unknown): [string, unknown] {
	const RELATIVE_OPERATORS = ["r>=", "r<=", "r!=", "r>", "r<", "r="] as const;

	if (typeof value === "string" && value.startsWith("r")) {
		const matched = RELATIVE_OPERATORS.find((operator) =>
			value.startsWith(operator),
		);
		if (matched)
			return [matched, value.slice(matched.length)] as [string, unknown];
	}
	if (typeof value === "string") return FormatObjectCriteriaValue(value);
	return ["=", value];
}

function extractGroupedCriteriaValues(
	value: unknown,
	condition: "and" | "or",
): unknown[] | null {
	if (!value) return null;

	// Support payloads like: { and: { 0: ">10", 1: "<20" } }
	if (isRecord(value)) {
		const fromCondition = value[condition];
		if (Array.isArray(fromCondition)) return fromCondition;
		if (isRecord(fromCondition)) return Object.values(fromCondition);

		// Support payloads like: { 0: ">10", 1: "<20" }
		const objectValues = Object.values(value);
		if (
			objectValues.length &&
			objectValues.every((entry) => typeof entry === "string")
		)
			return objectValues;
	}

	// Support payloads like: [">10", "<20"]
	if (Array.isArray(value)) return value;

	return null;
}

export function generateSearchArray(searchQuery: any): searchType {
	const RETURN: searchType = {};
	for (const [condition, items] of Object.entries(searchQuery)) {
		if (!RETURN[condition as "and" | "or"])
			RETURN[condition as "and" | "or"] = [];
		for (const [key, value] of Object.entries(items)) {
			if (["and", "or"].includes(key))
				RETURN[condition as "and" | "or"]?.push({
					[key]: generateSearchArray(value),
				});
			else {
				const groupedValues = extractGroupedCriteriaValues(
					value,
					condition as "and" | "or",
				);
				if (groupedValues?.length) {
					for (const nestedValue of groupedValues)
						RETURN[condition as "and" | "or"]?.push([
							key,
							...decodeStoredCriterion(nestedValue),
						]);
					continue;
				}

				RETURN[condition as "and" | "or"]?.push([
					key,
					...decodeStoredCriterion(value),
				]);
			}
		}
	}
	return RETURN;
}
