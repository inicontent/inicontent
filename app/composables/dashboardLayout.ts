/**
 * Explicit 24-column layout for the dashboard grid.
 *
 * A tall widget (chart/table) and the short widgets that fit in its
 * remaining width form one block: the tall spans one row per stacked short,
 * and the shorts stack one-per-row on the free side — regardless of whether
 * they come before or after the tall in the list, and direction-safe
 * (RTL/LTR use logical columns). Talls with no shorts to host flow on the
 * same line, left to right, wrapping at 24 columns — three smalls
 * (8 + 8 + 8) share one line instead of taking one each.
 *
 * Pure logic on purpose: `tests/dashboard-layout.test.ts` imports it
 * directly under `node --test`.
 */

export type WidgetPlacement = {
	colStart: number;
	rowStart: number;
	colSpan: number;
	rowSpan: number;
};

export const MAX_STACKED_SHORTS = 4;

export function getSpan(widget: Widget): number {
	switch (widget.size) {
		case "large":
			return 24;
		case "medium":
			return 16;
		default:
			return 8;
	}
}

/** Charts and tables are tall enough to host stacked short widgets. */
export function isTall(widget: Widget): boolean {
	return widget.type !== "counter";
}

export function computePlacements(
	widgets: Widget[],
): Record<string, WidgetPlacement> {
	const result: Record<string, WidgetPlacement> = {};
	const n = widgets.length;

	// Place a run of widgets on successive flow lines, left to right
	// (logical), starting from `startCol` and wrapping when a line overflows
	// 24 columns. Returns the row after the last used one — the cursor lands
	// on a fresh line at column 1.
	const placeFlow = (
		items: Widget[],
		startRow: number,
		startCol = 1,
	): number => {
		let row = startRow;
		let col = startCol;
		for (const item of items) {
			const span = getSpan(item);
			if (col + span - 1 > 24) {
				row += 1;
				col = 1;
			}
			result[item.id] = {
				colStart: col,
				rowStart: row,
				colSpan: span,
				rowSpan: 1,
			};
			col += span;
		}
		return row + 1;
	};

	let cursorRow = 1;
	// Column cursor on the current line. The stacked-short blocks are
	// anchored at column 1, so they only take over a line that starts clean;
	// everything else flows from wherever the cursor is.
	let cursorCol = 1;
	let i = 0;
	while (i < n) {
		const widget = widgets[i];

		if (!isTall(widget)) {
			// Collect a contiguous run of shorts that fit on one flow line.
			const run = [widget];
			let runWidth = getSpan(widget);
			let j = i + 1;
			while (
				j < n &&
				!isTall(widgets[j]) &&
				runWidth + getSpan(widgets[j]) <= 24
			) {
				run.push(widgets[j]);
				runWidth += getSpan(widgets[j]);
				j += 1;
			}

			// A tall widget right after the run can host it: stack the run
			// in its own column and let the tall span the hosting rows.
			// Only on a clean line — the block's columns start at 1.
			if (cursorCol === 1 && j < n && isTall(widgets[j])) {
				const tall = widgets[j];
				const remaining = 24 - getSpan(tall);
				if (remaining > 0 && run.every((s) => getSpan(s) <= remaining)) {
					const rowSpan = Math.max(2, Math.min(run.length, MAX_STACKED_SHORTS));
					const assignCount = Math.min(run.length, rowSpan);
					const maxShortSpan = Math.max(
						...run.slice(0, assignCount).map(getSpan),
					);
					run.slice(0, assignCount).forEach((s, t) => {
						result[s.id] = {
							colStart: 1,
							rowStart: cursorRow + t,
							colSpan: getSpan(s),
							rowSpan: 1,
						};
					});
					result[tall.id] = {
						colStart: 1 + maxShortSpan,
						rowStart: cursorRow,
						colSpan: getSpan(tall),
						rowSpan,
					};
					cursorRow += rowSpan;
					const leftover = run.slice(assignCount);
					if (leftover.length) cursorRow = placeFlow(leftover, cursorRow);
					i = j + 1;
					continue;
				}
			}

			// Unhosted shorts: flow normally from the current column.
			cursorRow = placeFlow(run, cursorRow, cursorCol);
			cursorCol = 1;
			i = j;
			continue;
		}

		// Tall widget, possibly followed by shorts that fit beside it. The
		// block is anchored at column 1, so it needs a clean line — a
		// mid-line tall simply flows and leaves the shorts to the run
		// branch above.
		if (cursorCol === 1) {
			const remaining = 24 - getSpan(widget);
			const shorts: Widget[] = [];
			let j = i + 1;
			while (
				j < n &&
				!isTall(widgets[j]) &&
				remaining > 0 &&
				getSpan(widgets[j]) <= remaining
			) {
				shorts.push(widgets[j]);
				j += 1;
			}

			if (shorts.length) {
				const rowSpan = Math.max(
					2,
					Math.min(shorts.length, MAX_STACKED_SHORTS),
				);
				const assignCount = Math.min(shorts.length, rowSpan);
				shorts.slice(0, assignCount).forEach((s, t) => {
					result[s.id] = {
						colStart: 1 + getSpan(widget),
						rowStart: cursorRow + t,
						colSpan: getSpan(s),
						rowSpan: 1,
					};
				});
				result[widget.id] = {
					colStart: 1,
					rowStart: cursorRow,
					colSpan: getSpan(widget),
					rowSpan,
				};
				cursorRow += rowSpan;
				const leftover = shorts.slice(assignCount);
				if (leftover.length) cursorRow = placeFlow(leftover, cursorRow);
				i = j;
				continue;
			}
		}

		// A tall with no shorts beside it flows on the current line, so
		// consecutive talls share a row instead of taking one each.
		const span = getSpan(widget);
		if (cursorCol + span - 1 > 24) {
			cursorRow += 1;
			cursorCol = 1;
		}
		result[widget.id] = {
			colStart: cursorCol,
			rowStart: cursorRow,
			colSpan: span,
			rowSpan: 1,
		};
		cursorCol += span;
		if (cursorCol > 24) {
			cursorRow += 1;
			cursorCol = 1;
		}
		i += 1;
	}

	return result;
}
