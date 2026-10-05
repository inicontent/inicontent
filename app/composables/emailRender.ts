/**
 * Client-side MJML rendering for the Email Builder editor.
 *
 * Mirrors the API's `renderEmailTemplate` (api/utils/email.ts) so the editor
 * previews show exactly what recipients will receive: compile with
 * `validationLevel: "skip"` (which tolerates the embedded
 * `<!-- email-builder-model -->` marker inside <mj-head>), substitute
 * placeholder variables, and degrade to plain text when the content is not
 * valid MJML. `mjml` is loaded lazily via dynamic import so the editor adds
 * nothing to the initial bundle — the MJML chunk loads only when a template
 * is actually opened.
 */

export const EMAIL_PLACEHOLDER_REGEX = /\{\{([@\w][\w.-]*)\}\}/g;

export function replacePlaceholders(
	html: string,
	variables: Record<string, string>,
): string {
	return html.replace(
		EMAIL_PLACEHOLDER_REGEX,
		(_, key: string) => variables[key] ?? "",
	);
}

type MjmlResult = { html: string; errors?: Array<{ message?: string }> };
type MjmlRenderer = (
	content: string,
	options?: Record<string, unknown>,
) => MjmlResult;

let mjmlPromise: Promise<MjmlRenderer> | undefined;

/**
 * mjml 5.4 was written for Node and reads `process` directly in places that can
 * never be skipped client-side (e.g. `mjml-parser-xml` calls `process.cwd()`
 * unconditionally at the top of `parseMjml`). In a browser there is no
 * `process` global, so without this shim the lazily-loaded MJML chunk throws
 * `ReferenceError: process is not defined` and every preview falls back to the
 * empty state. This matches mjml's documented browser usage (set
 * `process.env.MJML_BROWSER`, plus a working `process.cwd()` for the parser).
 */
function ensureBrowserProcess(): void {
	const g = globalThis as {
		process?: {
			env?: Record<string, string>;
			cwd?: () => string;
			[extra: string]: unknown;
		};
	};
	// A `process` global may already exist (Nuxt/Vite inject a build-flag shim
	// with `client`/`dev`/`env` etc. but no mjml-needed methods). Always augment
	// the existing object rather than replacing or skipping it.
	if (!g.process || typeof g.process !== "object") {
		g.process = {};
	}
	const p = g.process as {
		env?: Record<string, string>;
		cwd?: () => string;
		[extra: string]: unknown;
	};
	p.argv ??= [];
	p.cwd ??= () => "/";
	if (typeof p.env !== "object" || !p.env) p.env = {};
	p.hrtime ??= () => [0, 0] as [number, number];
	p.nextTick ??= (cb: () => void) => Promise.resolve().then(cb);
	p.pid ??= 0;
	p.platform ??= "browser";
	p.stderr ??= { write: () => true };
	p.stdout ??= { write: () => true };
	p.versions ??= {};
	// mjml-core's mjmlconfig helper skips its fs/path/require code paths only
	// when process.env.MJML_BROWSER is truthy — mirror the API's environment.
	p.env.MJML_BROWSER = "true";
	p.env.NODE_ENV ??= "production";
}

async function loadMjml(): Promise<MjmlRenderer> {
	if (!mjmlPromise) {
		// The mjml chunk evaluates with browser globals only — it must see a
		// minimal `process` before any of its modules run.
		ensureBrowserProcess();
		mjmlPromise = import("mjml").then((module) => {
			const renderer = (module.default ?? module) as MjmlRenderer;
			return renderer;
		});
		mjmlPromise.catch(() => {
			mjmlPromise = undefined;
		});
	}
	return mjmlPromise;
}

export interface RenderedEmailTemplate {
	/** Compiled + substituted HTML body ("" when MJML fails or content is empty) */
	html: string;
	/** Subject with placeholders substituted ("" when none provided) */
	subject: string;
	/** Plain-text form of the raw content with placeholders substituted ("" when MJML compiles) */
	text: string;
}

export async function renderEmailTemplateClient(
	content: string,
	subject: string | undefined,
	variables: Record<string, string>,
): Promise<RenderedEmailTemplate> {
	const resolvedSubject = subject
		? replacePlaceholders(subject, variables)
		: "";
	let html = "";
	let text = "";

	if (content) {
		try {
			const mjml = await loadMjml();
			// mjml 5.4+ returns a Promise — await it like the API does.
			const { html: compiled, errors } = await mjml(content, {
				validationLevel: "skip",
			});
			if (!errors?.length) html = replacePlaceholders(compiled, variables);
			else text = replacePlaceholders(content, variables);
		} catch {
			text = replacePlaceholders(content, variables);
		}
	}

	return { html, subject: resolvedSubject, text };
}
