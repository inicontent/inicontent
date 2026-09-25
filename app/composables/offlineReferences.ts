import { isValidID } from "inibase/utils";
import Inison from "inison";

export const isTemporaryReference = (value: unknown): value is string =>
	typeof value === "string" && value.startsWith("pending__");

/** Walk only reference fields, including references nested inside objects/arrays. */
export async function mapOfflineReferences(
	body: any,
	schema: any[],
	resolve: (value: any, field: any) => Promise<any>,
): Promise<any> {
	if (!body || typeof body !== "object") return body;
	if (Array.isArray(body))
		return Promise.all(
			body.map((item) => mapOfflineReferences(item, schema, resolve)),
		);
	const result = { ...body };
	for (const field of schema ?? []) {
		const value = result[field.key];
		if (value === undefined || value === null || value === "") continue;
		const types = ([] as string[]).concat(field.type ?? []);
		if (
			types.includes("table") ||
			types.includes("array-table") ||
			(field.type === "array" &&
				([] as unknown[]).concat(field.children ?? []).includes("table"))
		) {
			result[field.key] = Array.isArray(value)
				? (
						await Promise.all(value.map((entry) => resolve(entry, field)))
					).flat()
				: await resolve(value, field);
		} else if (Array.isArray(field.children)) {
			result[field.key] = await mapOfflineReferences(
				value,
				field.children,
				resolve,
			);
		}
	}
	return result;
}

export function temporaryReferences(value: any): string[] {
	if (isTemporaryReference(value)) return [value];
	if (!value || typeof value !== "object") return [];
	return Object.values(value).flatMap(temporaryReferences);
}

export function replaceTemporaryReference(
	value: any,
	temp: string,
	id: string,
): any {
	if (value === temp) return id;
	if (Array.isArray(value))
		return value.map((entry) => replaceTemporaryReference(entry, temp, id));
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [
				key,
				replaceTemporaryReference(entry, temp, id),
			]),
		);
	return value;
}

export async function resolveOfflineReference(
	value: any,
	field: any,
	target: any,
	search: (where: string, page?: number) => Promise<any>,
	path: (schema: any[], id: string) => string,
): Promise<any> {
	if (value && typeof value === "object" && value.id != null) value = value.id;
	if (isTemporaryReference(value)) throw new Error("offlineMissingDependency");
	if (
		isValidID(value) ||
		typeof value === "number" ||
		/^\d+$/.test(String(value))
	)
		return value;
	if (typeof value !== "string") throw new Error("offlineInvalidReference");
	const columns =
		field.searchIn ??
		target?.defaultSearchableColumns?.map((id: string) =>
			path(target.schema ?? [], id),
		);
	if (!columns?.length || columns.some((column: string) => !column))
		throw new Error("offlineNoSearchColumns");
	const where = Inison.stringify({
		or: Object.fromEntries(
			columns.map((column: string) => [column, `*%${value}%`]),
		),
	});
	const response = await search(where, 1);
	if (!Array.isArray(response?.result))
		throw new Error("offlineInvalidReference");
	const matches = [...response.result];
	if (!matches.length) throw new Error("offlineReferenceNotFound");
	const multiple =
		field.isArray ||
		([] as string[]).concat(field.type).includes("array") ||
		field.type === "array-table";
	if (!multiple && (matches.length !== 1 || response.options?.totalPages > 1))
		throw new Error("offlinePickManually");
	if (multiple) {
		for (let page = 2; page <= (response.options?.totalPages ?? 1); page++) {
			const next = await search(where, page);
			if (!Array.isArray(next?.result))
				throw new Error("offlineInvalidReference");
			matches.push(...next.result);
		}
	}
	if (matches.some((item) => item?.id == null))
		throw new Error("offlineInvalidReference");
	return multiple
		? [...new Set(matches.map((item) => item.id))]
		: matches[0].id;
}
