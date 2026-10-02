import { isArrayOfObjects } from "inibase/utils";

/**
 * Client-side evaluation of computed-field expressions.
 *
 * The engine (inibase) owns computed values: it recompiles every expression on
 * schema change into an id-based AST and recomputes the value on every row
 * write. This module re-implements the *evaluation* half so the edit form can
 * show a live value while the user types — without a write and without the
 * round-trip of `return: true`.
 *
 * Ported from `inibase@3.3.0` (MIT):
 *   - `dist/expression.js` → buildFieldIndex, resolveFramePath,
 *     collectFieldDeps, topoSortComputedFields
 *   - `dist/index.js` → LinkedRowReader, evaluateNode, evaluatePath,
 *     coerceNumber, applyBinaryOp, aggregate, buildComputedPlan, evaluateRow
 *
 * Two deliberate differences from the engine:
 *
 *  1. **The row is never mutated.** The engine owns its rows and writes each
 *     computed result back so dependent fields observe it. Here the input row
 *     belongs to the form: writing to it would (a) risk leaking a computed key
 *     into a create/update body and (b) trip the deep watcher in
 *     `components/Form/index.vue`, firing a `/schema` request per keystroke.
 *     Results are layered onto a shallow overlay instead, so dependency
 *     ordering still works while the caller's object stays clean.
 *
 *  2. **No parsing.** The API persists `computed: { expr, ast }`, so only the
 *     compiled form is ever evaluated. A raw string (an expression typed into
 *     the schema editor but not yet saved) has no AST and is skipped, letting
 *     the caller fall back to the stored value.
 *
 * The evaluator is framework-free and dependency-injected so it can be unit
 * tested under `node --test` and reused by any view.
 */

export type ComputedFunctionName = "sum" | "count" | "avg" | "min" | "max";
export type BinaryOp = "add" | "sub" | "mul" | "div" | "mod";

/** Compiled AST as persisted on `field.computed.ast` by the engine. */
export type CompiledExpressionNode =
	| { kind: "num"; value: number }
	| {
			kind: "path";
			ids: number[];
			/** Id of the array ancestor a helper iterates (helpers only). */
			arrayFieldId: number | null;
	  }
	| {
			kind: "bin";
			op: BinaryOp;
			left: CompiledExpressionNode;
			right: CompiledExpressionNode;
	  }
	| {
			kind: "fn";
			name: ComputedFunctionName;
			/** Id of the array ancestor every path in `arg` lives in. */
			arrayFieldId: number;
			arg: CompiledExpressionNode;
	  };

/** Engine error codes this evaluator can raise. */
export type ComputedEvalErrorCode =
	| "COMPUTED_FIELD_UNKNOWN_FIELD"
	| "COMPUTED_FIELD_INVALID_LINK"
	| "COMPUTED_FIELD_DANGLING_LINK"
	| "COMPUTED_FIELD_ARITHMETIC"
	| "COMPUTED_FIELD_CYCLE";

/**
 * A failed evaluation. Carries the engine's own code so callers can decide
 * whether to fall back to the stored value (always, in the UI) or surface it.
 */
export class ComputedEvalError extends Error {
	readonly code: ComputedEvalErrorCode;
	constructor(code: ComputedEvalErrorCode, message: string) {
		super(message);
		this.name = "ComputedEvalError";
		this.code = code;
	}
}

/** Id index entry: where a field id lives, and the array that scopes it. */
export interface ComputedFieldRef {
	/** Dotted key path from the table root, e.g. `items.lineTotal`. */
	key: string;
	field: Field;
	/** Nearest array-of-objects ancestor, or null for a top-level column. */
	arrayAncestor: { id: number; key: string } | null;
}

type ComputedPlanField = {
	id: number;
	/** Dotted column key, e.g. `total` or `items.lineTotal`. */
	key: string;
	ast: CompiledExpressionNode;
	deps: Set<number>;
	/** Set when this is a computed child of an array-of-objects column. */
	elementRoot: { id: number; key: string } | null;
};

type ComputedPlan = {
	fields: ComputedPlanField[];
	index: Map<number, ComputedFieldRef>;
	hasHops: boolean;
};

/** Read one column of a linked row; null when the row is gone (dangling). */
export type ResolveLinkedRow = (
	table: string,
	column: string,
	id: string | number,
) => Promise<any>;

export type EvaluateOptions = {
	/** Table the row belongs to (root table for a nested frame). */
	table: string;
	/** Resolves `3.4` hops — required only when the plan has hops. */
	resolveLinkedRow?: ResolveLinkedRow;
	/** Field index of a linked table, so hop ids resolve against its schema. */
	getTableIndex?: (
		table: string,
	) => Promise<Map<number, ComputedFieldRef> | undefined>;
};

const isContainer = (field: Field): boolean =>
	Array.isArray(field.children) && isArrayOfObjects(field.children);

/**
 * Build the field-id → reference index of a schema, nested children included
 * (using dotted key paths). Containers are indexed too so unknown ids are
 * detected, but an expression cannot reference one.
 */
export function buildFieldIndex(schema: Schema): Map<number, ComputedFieldRef> {
	const index = new Map<number, ComputedFieldRef>();
	// Ancestors carry their already-resolved dotted key, so a nested array
	// ancestor is named by its full path (`outer.items`), not a re-prefixed one.
	const walk = (
		fields: Schema,
		prefix: string,
		ancestors: { field: Field; key: string }[],
	) => {
		for (const field of fields) {
			const key = prefix ? `${prefix}.${field.key}` : field.key;
			if (field.id !== undefined) {
				let arrayAncestor: { id: number; key: string } | null = null;
				for (let i = ancestors.length - 1; i >= 0; i--) {
					const ancestor = ancestors[i];
					if (ancestor.field.type === "array" && isContainer(ancestor.field)) {
						arrayAncestor = {
							id: ancestor.field.id as number,
							key: ancestor.key,
						};
						break;
					}
				}
				index.set(field.id as number, { key, field, arrayAncestor });
			}
			if (isContainer(field))
				walk(field.children as Schema, key, [...ancestors, { field, key }]);
		}
	};
	walk(schema, "", []);
	return index;
}

/**
 * Resolve a dotted key path against a structured frame in place. Returns
 * `undefined` as soon as an intermediate is null, undefined, a non-object, or
 * an array (arrays resolve numerically only, so they never match a dotted
 * segment).
 */
export function resolveFramePath(obj: any, dottedKey: string): any {
	if (dottedKey.length === 0) return obj;
	let cur = obj;
	for (const segment of dottedKey.split(".")) {
		if (cur === null || cur === undefined || typeof cur !== "object")
			return undefined;
		if (Array.isArray(cur)) return undefined;
		cur = cur[segment];
	}
	return cur;
}

/** Every field id a compiled expression reads from the current table. */
export function collectFieldDeps(node: CompiledExpressionNode): Set<number> {
	const deps = new Set<number>();
	const visit = (n: CompiledExpressionNode) => {
		switch (n.kind) {
			case "num":
				return;
			case "path":
				deps.add(n.ids[0]);
				return;
			case "bin":
				visit(n.left);
				visit(n.right);
				return;
			case "fn":
				visit(n.arg);
				return;
		}
	};
	visit(node);
	return deps;
}

/**
 * Order computed fields so every dependency is evaluated before its dependents.
 * Raises `COMPUTED_FIELD_CYCLE` on a loop (the engine rejects such schemas, so
 * this only guards a hand-built or corrupted schema).
 */
export function topoSortComputedFields(
	fields: ComputedPlanField[],
): ComputedPlanField[] {
	const byId = new Map(fields.map((field) => [field.id, field]));
	const remaining = new Set(fields.map((field) => field.id));
	const ordered: ComputedPlanField[] = [];
	// dependent id → dependency ids that are themselves computed fields
	const blocked = new Map<number, number[]>();
	const indegree = new Map<number, number>();
	for (const field of fields) {
		const deps: number[] = [];
		for (const depId of field.deps) if (byId.has(depId)) deps.push(depId);
		blocked.set(field.id, deps);
	}
	const ready: number[] = [];
	for (const [id, deps] of blocked) {
		indegree.set(id, deps.length);
		if (deps.length === 0) ready.push(id);
	}
	while (ready.length) {
		const id = ready.shift() as number;
		const field = byId.get(id);
		if (!field) continue;
		ordered.push(field);
		remaining.delete(id);
		for (const [otherId, deps] of blocked) {
			if (!remaining.has(otherId)) continue;
			if (deps.includes(id)) {
				const next = (indegree.get(otherId) ?? 1) - 1;
				indegree.set(otherId, next);
				if (next === 0) ready.push(otherId);
			}
		}
	}
	if (remaining.size)
		throw new ComputedEvalError(
			"COMPUTED_FIELD_CYCLE",
			`cycle between computed fields: ${fields
				.filter((field) => remaining.has(field.id))
				.map((field) => field.key)
				.join(", ")}`,
		);
	return ordered;
}

/** True when an expression tree contains a link hop (multi-segment path). */
export function astHasHops(node: CompiledExpressionNode): boolean {
	switch (node.kind) {
		case "num":
			return false;
		case "path":
			return node.ids.length > 1;
		case "bin":
			return astHasHops(node.left) || astHasHops(node.right);
		case "fn":
			return astHasHops(node.arg);
	}
}

/**
 * Batch-scoped link-hop reader. A dry pass records every (table, column, id)
 * triple the expressions need, then `resolveAll` warms a per-(table, column)
 * cache so each distinct triple is fetched exactly once.
 */
class LinkedRowReader {
	#readRow: ResolveLinkedRow;
	#pending = new Map<string, Set<string | number>>();
	#cache = new Map<string, Map<string | number, any>>();

	constructor(readRow: ResolveLinkedRow) {
		this.#readRow = readRow;
	}

	record(table: string, column: string, id: string | number) {
		const key = `${table}\u0000${column}`;
		let ids = this.#pending.get(key);
		if (!ids) {
			ids = new Set();
			this.#pending.set(key, ids);
		}
		ids.add(id);
	}

	async read(table: string, column: string, id: string | number) {
		const key = `${table}\u0000${column}`;
		let map = this.#cache.get(key);
		if (!map) {
			map = await this.#resolve(
				table,
				column,
				this.#pending.get(key) ?? new Set(),
			);
			this.#pending.delete(key);
			this.#cache.set(key, map);
		}
		return map.get(id) ?? null;
	}

	async resolveAll() {
		for (const [key, ids] of this.#pending) {
			const separator = key.indexOf("\u0000");
			const table = key.slice(0, separator);
			const column = key.slice(separator + 1);
			this.#cache.set(key, await this.#resolve(table, column, ids));
		}
		this.#pending.clear();
	}

	async #resolve(table: string, column: string, ids: Set<string | number>) {
		const map = new Map<string | number, any>();
		// A missing row caches as null so a dangling hop fails once, exactly
		// like a direct per-hop read would.
		await Promise.all(
			[...ids].map(async (id) => {
				try {
					map.set(id, (await this.#readRow(table, column, id)) ?? null);
				} catch {
					map.set(id, null);
				}
			}),
		);
		return map;
	}
}

type EvalEnv = {
	table: string;
	index: Map<number, ComputedFieldRef>;
	/** The whole row, kept separate from `frame` so a helper can iterate the
	 *  real array while an element frame is active. */
	row: any;
	/** Current read frame: the row, or one array element. */
	frame: any;
	/** Dot-prefix of the array an element frame belongs to (`items.`). */
	strip: string;
	ownKey: string;
	indexCache: Map<string, Map<number, ComputedFieldRef>>;
	/** Id index of a linked table, so hop ids resolve against its schema. */
	getTableIndex?: EvaluateOptions["getTableIndex"];
	links: LinkedRowReader | null;
	/** Dry pass: record hops instead of reading them. */
	collect: boolean;
	/** A missing operand reads as 0 instead of failing (element children). */
	nullAsZero: boolean;
};

function coerceNumber(value: any, ownKey: string): number {
	const num = Number(value);
	if (!Number.isFinite(num))
		throw new ComputedEvalError(
			"COMPUTED_FIELD_ARITHMETIC",
			`computed field "${ownKey}": non-numeric value '${String(value)}'`,
		);
	return num;
}

function applyBinaryOp(
	op: BinaryOp,
	a: any,
	b: any,
	ownKey: string,
	collect: boolean,
	nullAsZero: boolean,
): number {
	if (a === null || a === undefined || b === null || b === undefined) {
		// The dry pass must tolerate unresolved hops: it only discovers which
		// links are needed, so a neutral result is fine.
		if (collect) return 0;
		// Element children treat a missing operand as 0, so one absent child
		// never blanks the whole row.
		if (nullAsZero) {
			if (a === null || a === undefined) a = 0;
			if (b === null || b === undefined) b = 0;
		}
	}
	if (a === null || a === undefined || b === null || b === undefined)
		throw new ComputedEvalError(
			"COMPUTED_FIELD_ARITHMETIC",
			`computed field "${ownKey}": missing or null operand`,
		);
	const an = coerceNumber(a, ownKey);
	const bn = coerceNumber(b, ownKey);
	switch (op) {
		case "add":
			return an + bn;
		case "sub":
			return an - bn;
		case "mul":
			return an * bn;
		case "div":
			if (bn === 0)
				throw new ComputedEvalError(
					"COMPUTED_FIELD_ARITHMETIC",
					`computed field "${ownKey}": division by zero`,
				);
			return an / bn;
		case "mod":
			if (bn === 0)
				throw new ComputedEvalError(
					"COMPUTED_FIELD_ARITHMETIC",
					`computed field "${ownKey}": modulo by zero`,
				);
			return an % bn;
	}
}

function aggregate(
	name: ComputedFunctionName,
	values: number[],
	elementCount: number,
	ownKey: string,
	collect: boolean,
): number {
	switch (name) {
		case "count":
			// Aggregates iterate the row's actual array, so count is the
			// element count regardless of value presence.
			return elementCount;
		case "sum":
			return values.reduce((acc, v) => acc + v, 0);
		case "avg":
			if (!values.length) {
				if (collect) return 0;
				throw new ComputedEvalError(
					"COMPUTED_FIELD_ARITHMETIC",
					`computed field "${ownKey}": average over no values`,
				);
			}
			return values.reduce((acc, v) => acc + v, 0) / values.length;
		case "min":
			if (!values.length) {
				if (collect) return 0;
				throw new ComputedEvalError(
					"COMPUTED_FIELD_ARITHMETIC",
					`computed field "${ownKey}": min over no values`,
				);
			}
			return Math.min(...values);
		case "max":
			if (!values.length) {
				if (collect) return 0;
				throw new ComputedEvalError(
					"COMPUTED_FIELD_ARITHMETIC",
					`computed field "${ownKey}": max over no values`,
				);
			}
			return Math.max(...values);
	}
}

async function evaluateNode(
	node: CompiledExpressionNode,
	env: EvalEnv,
): Promise<any> {
	switch (node.kind) {
		case "num":
			return node.value;
		case "path":
			return evaluatePath(node, env);
		case "bin": {
			const a = await evaluateNode(node.left, env);
			const b = await evaluateNode(node.right, env);
			return applyBinaryOp(
				node.op,
				a,
				b,
				env.ownKey,
				env.collect,
				env.nullAsZero,
			);
		}
		case "fn": {
			const arrayRef = env.index.get(node.arrayFieldId);
			const arrayKey = arrayRef?.key;
			const raw = arrayKey ? env.row[arrayKey] : undefined;
			// A missing/empty array-of-objects reads as no elements.
			const elements = Array.isArray(raw) ? raw : [];
			const values: number[] = [];
			const savedFrame = env.frame;
			const savedStrip = env.strip;
			const stripPrefix = arrayKey ? `${arrayKey}.` : "";
			for (const element of elements) {
				if (element === null || typeof element !== "object") continue;
				env.frame = element;
				env.strip = stripPrefix;
				const value = await evaluateNode(node.arg, env);
				if (value === null || value === undefined) continue;
				values.push(coerceNumber(value, env.ownKey));
			}
			env.frame = savedFrame;
			env.strip = savedStrip;
			return aggregate(
				node.name,
				values,
				elements.length,
				env.ownKey,
				env.collect,
			);
		}
	}
}

async function evaluatePath(node: { ids: number[] }, env: EvalEnv) {
	const ids = node.ids;
	let table = env.table;
	let index = env.index;
	let frame = env.frame;
	let strip = env.strip;
	let value: any;
	let ref: ComputedFieldRef | undefined;
	for (let i = 0; i < ids.length; i++) {
		ref = index.get(ids[i]);
		if (!ref)
			throw new ComputedEvalError(
				"COMPUTED_FIELD_UNKNOWN_FIELD",
				`computed field "${env.ownKey}": unknown field id ${ids[i]}`,
			);
		const key =
			strip && ref.key.startsWith(strip)
				? ref.key.slice(strip.length)
				: ref.key;
		if (i === 0) {
			// Direct key-path read against the current frame.
			value = resolveFramePath(frame, key);
			strip = "";
		} else {
			// `value` is the id of the row this hop lives in. Rows read off disk
			// arrive with table children already linked (objects, not ids).
			// When the whole linked row is already present, the hop is answered
			// from it and no read is issued at all.
			const embedded =
				typeof value === "object" && value !== null ? value : undefined;
			const id = embedded ? embedded.id : value;
			if (
				id === undefined ||
				id === null ||
				id === "" ||
				typeof id === "object"
			)
				return null;
			const column = ref.key;
			const row = embedded
				? embedded
				: env.links
					? env.collect
						? (env.links.record(table, column, id), null)
						: await env.links.read(table, column, id)
					: null;
			if (!env.collect && (row === undefined || row === null))
				throw new ComputedEvalError(
					"COMPUTED_FIELD_DANGLING_LINK",
					`computed field "${env.ownKey}": dangling link into "${table}"`,
				);
			frame = row;
			// The engine reads only the requested column off the linked row, so
			// a row fetched for one hop can satisfy the next hop too.
			value = row ? resolveFramePath(frame, column) : null;
			index = env.getTableIndex
				? ((await indexFor(table, env.getTableIndex, env.indexCache)) ?? index)
				: index;
		}
		if (i < ids.length - 1) {
			if (ref.field.type !== "table" || typeof ref.field.table !== "string")
				throw new ComputedEvalError(
					"COMPUTED_FIELD_INVALID_LINK",
					`computed field "${env.ownKey}": field ${ids[i + 1]} is not a link`,
				);
			table = ref.field.table;
			index = env.getTableIndex
				? ((await indexFor(table, env.getTableIndex, env.indexCache)) ?? index)
				: index;
		}
	}
	return value === undefined ? null : value;
}

/** Id index lookup with a shared per-evaluation cache. */
async function indexFor(
	table: string,
	getTableIndex: (
		table: string,
	) => Promise<Map<number, ComputedFieldRef> | undefined>,
	cache: Map<string, Map<number, ComputedFieldRef>>,
) {
	const cached = cache.get(table);
	if (cached) return cached;
	const index = await getTableIndex(table);
	if (index) cache.set(table, index);
	return index;
}

/**
 * Collect the compiled computed fields of a schema, in dependency order.
 *
 * Raw-string expressions (typed into the schema editor, not yet saved) have no
 * AST and are skipped — the caller falls back to the stored value.
 */
export function buildComputedPlan(schema: Schema): ComputedPlan | null {
	if (!schema?.length) return null;
	const index = buildFieldIndex(schema);
	const fields: ComputedPlanField[] = [];
	const walk = (fieldsSchema: Schema, prefix: string) => {
		for (const field of fieldsSchema) {
			const key = prefix ? `${prefix}.${field.key}` : field.key;
			const computed = field.computed;
			if (typeof computed !== "undefined" && typeof computed !== "string") {
				const ast = (computed as { ast?: CompiledExpressionNode }).ast;
				// A spec with no usable AST is treated as "not yet compiled".
				if (ast && typeof ast === "object")
					fields.push({
						id: field.id as number,
						key,
						ast,
						deps: collectFieldDeps(ast),
						elementRoot: index.get(field.id as number)?.arrayAncestor ?? null,
					});
			}
			if (field.children && isArrayOfObjects(field.children))
				walk(field.children as Schema, key);
		}
	};
	walk(schema, "");
	if (!fields.length) return null;
	const ordered = topoSortComputedFields(fields);
	return {
		fields: ordered,
		index,
		hasHops: ordered.some((field) => astHasHops(field.ast)),
	};
}

/**
 * Evaluate every computed column of one row.
 *
 * Returns values keyed by the dotted column key (`total`, `items.lineTotal`);
 * element results are arrays, one entry per element of the array column.
 * `row` is never mutated. Throws `ComputedEvalError` on any failure — callers
 * should fall back to the stored value rather than surface it mid-form.
 */
export async function evaluateComputedRow(
	schema: Schema,
	row: Record<string, any>,
	options: EvaluateOptions,
): Promise<Record<string, number | number[]>> {
	const plan = buildComputedPlan(schema);
	if (!plan) return {};

	// Overlay holding computed results so dependents observe them through the
	// same key-path reads. Never handed back to the caller.
	const overlay: Record<string, any> = { ...row };

	const reader =
		plan.hasHops && options.resolveLinkedRow
			? new LinkedRowReader(options.resolveLinkedRow)
			: null;

	const env: EvalEnv = {
		table: options.table,
		index: plan.index,
		indexCache: new Map([[options.table, plan.index]]),
		getTableIndex: options.getTableIndex,
		frame: overlay,
		row: overlay,
		strip: "",
		ownKey: "",
		links: reader,
		collect: false,
		nullAsZero: false,
	};

	const out: Record<string, number | number[]> = {};

	const evaluateOne = async (field: ComputedPlanField) => {
		if (field.elementRoot) {
			// Computed child of an array-of-objects column: evaluated once per
			// element. Elements are shallow-copied into the overlay so the
			// caller's array objects stay untouched while sibling computations
			// (e.g. a top-level `sum(5)`) still see fresh child values.
			const rootKey = field.elementRoot.key;
			const childKey = field.key.slice(rootKey.length + 1);
			const source = overlay[rootKey];
			const elements: any[] = Array.isArray(source) ? source : [];
			const copies = elements.map((element) =>
				element !== null && typeof element === "object"
					? { ...element }
					: element,
			);
			overlay[rootKey] = copies;

			const savedFrame = env.frame;
			const savedStrip = env.strip;
			const savedNullAsZero = env.nullAsZero;
			env.strip = `${rootKey}.`;
			env.ownKey = field.key;
			env.nullAsZero = true;

			const values: number[] = [];
			for (const element of copies) {
				if (element === null || typeof element !== "object") {
					values.push(0);
					continue;
				}
				env.frame = element;
				const value = await evaluateNode(field.ast, env);
				const written =
					value === null || value === undefined ? 0 : (value as number);
				element[childKey] = written;
				values.push(written);
			}
			env.frame = savedFrame;
			env.strip = savedStrip;
			env.nullAsZero = savedNullAsZero;
			out[field.key] = values;
			return;
		}
		env.strip = "";
		env.ownKey = field.key;
		const value = await evaluateNode(field.ast, env);
		out[field.key] = value as number;
		overlay[field.key] = value;
	};

	if (reader) {
		// Dry pass: discover the hops this row needs, warm them once, then run
		// the real pass from cache.
		env.collect = true;
		for (const field of plan.fields) await evaluateOne(field);
		env.collect = false;
		await reader.resolveAll();
	}
	for (const field of plan.fields) await evaluateOne(field);

	return out;
}
