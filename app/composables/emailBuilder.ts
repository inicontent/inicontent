/**
 * Email template visual builder — block model + MJML (de)serialization.
 *
 * The email templates table stores ONE MJML document per template. The visual
 * builder edits a lightweight block tree and serializes it back to MJML, which
 * the API compiles to HTML on preview/test/send (mjml2html server-side).
 *
 * Round-trip guarantees
 *   - Builder-authored documents embed the exact block tree in a marked
 *     comment (`email-builder-model:`) as the first child of `<mj-head>`.
 *     `extractModel` restores it losslessly; the marker is invisible in the
 *     compiled email (it lands in the output `<head>` as a plain comment).
 *   - `parseMJML(buildMJML(blocks))` reconstructs an equivalent tree. Anything
 *     the builder does not understand (mj-hero, custom elements, malformed
 *     documents) is preserved verbatim in a `raw` block so a save never loses
 *     content typed or pasted in the code view.
 */

export type EmailBlockCategory = "basic" | "layout" | "sections";

export interface EmailBlock {
	id: string;
	/** `${type}/${variant}` — e.g. "emailHero/2". Variant picks the design. */
	name: string;
	config: Record<string, unknown>;
	/** Only present on `columns` — one child array per column. */
	children?: EmailBlock[][];
}

export interface EmailBlockDefinition {
	type: EmailBlockType;
	icon: string;
	category: EmailBlockCategory;
	/** Locale suffix under `mjmlBuilder.blocks`. */
	labelKey: string;
	/** Number of design variants (1 = single design, no picker in the panel). */
	total: number;
	/** Drawer thumbnail height cap (px) for the auto-measured previews. */
	previewMaxHeight?: number;
	/** Field schema rendered by the shared `LazyFieldS` config panel. */
	schema: Schema;
	/** Default config applied when a new block is created. */
	defaults: Record<string, unknown>;
	/** Kit blocks render their own complete `<mj-section>` fragment. */
	ownSection?: boolean;
	/** Layout containers — first-level child arrays for each column. */
	columns?: number;
	/** Offered in the palette (false for `raw`, which parsing only produces). */
	palette?: boolean;
	/** Return the block's MJML fragment (content) for the given variant. */
	render: (config: Record<string, unknown>, variant: number) => string;
}

export type EmailBlockType =
	| "text"
	| "heading"
	| "image"
	| "video"
	| "button"
	| "divider"
	| "spacer"
	| "columns"
	| "emailHeader"
	| "emailHero"
	| "emailFeatures"
	| "emailCta"
	| "emailTable"
	| "emailInvoice"
	| "emailSocial"
	| "emailFooter"
	| "emailLogos"
	| "emailQuote"
	| "emailTicket"
	| "raw";

export const EMAIL_BLOCK_TYPES: readonly EmailBlockType[] = [
	"text",
	"heading",
	"image",
	"video",
	"button",
	"divider",
	"spacer",
	"columns",
	"emailHeader",
	"emailHero",
	"emailFeatures",
	"emailCta",
	"emailTable",
	"emailInvoice",
	"emailSocial",
	"emailFooter",
	"emailLogos",
	"emailQuote",
	"emailTicket",
	"raw",
];

/** Palette order + grouping. Categories with no insertable blocks are pruned
 *  after population, so hidden back-compat blocks never leave empty headers. */
export const PALETTE_GROUPS: Array<{
	category: EmailBlockCategory;
	blocks: EmailBlockDefinition[];
}> = [
	{ category: "basic", blocks: [] },
	{ category: "layout", blocks: [] },
	{ category: "sections", blocks: [] },
];

let blockIdCounter = 0;
function createId(): string {
	blockIdCounter += 1;
	return `eb_${Date.now().toString(36)}_${blockIdCounter}_${Math.random()
		.toString(36)
		.slice(2, 8)}`;
}

// ── Shared schema pieces (labels render via the t() fallback formatter) ────────

/** Email-appropriate button link (plain URL string, unlike page links). */
const EmailButtonSchema: Schema = [
	{ key: "label", type: "string" },
	{ key: "href", type: "string" },
];

// ── Rendering helpers ───────────────────────────────────────────────────────────

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
	return escapeHtml(value).replace(/"/g, "&quot;");
}

const str = (value: unknown): string => String(value ?? "");
const txt = (value: unknown): string => escapeHtml(str(value));
const atr = (value: unknown): string => escapeAttr(str(value));

/** Escape HTML for text content while preserving user line breaks (textarea). */
const multi = (value: unknown): string =>
	txt(value).replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>");

/** Resolve a media config value (asset row or plain URL string) to a URL. */
function mediaUrl(value: unknown): string {
	if (typeof value === "string") return value;
	const media = (value ?? {}) as { publicURL?: string; url?: string };
	return media.publicURL ?? media.url ?? "";
}

/** Best-effort MIME from a video URL's extension (used for `<source>`). */
function videoMime(url: string): string {
	const clean = (url.split("?")[0] ?? "").toLowerCase();
	if (clean.endsWith(".webm")) return "video/webm";
	if (clean.endsWith(".ogg") || clean.endsWith(".ogv")) return "video/ogg";
	if (clean.endsWith(".mov")) return "video/quicktime";
	if (clean.endsWith(".m4v")) return "video/x-m4v";
	if (clean.endsWith(".avi")) return "video/x-msvideo";
	return "video/mp4";
}

function px(value: unknown, fallback: number): string {
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 ? `${n}px` : `${fallback}px`;
}

interface EmailTheme {
	bg: string;
	text: string;
	sub: string;
	card: string;
	border: string;
}

const THEMES: Record<string, EmailTheme> = {
	light: {
		bg: "#ffffff",
		text: "#0f172a",
		sub: "#64748b",
		card: "#ffffff",
		border: "#e2e8f0",
	},
	dark: {
		bg: "#0f172a",
		text: "#f8fafc",
		sub: "#94a3b8",
		card: "#1e293b",
		border: "#334155",
	},
	accent: {
		bg: "#eff6ff",
		text: "#1e3a8a",
		sub: "#475569",
		card: "#ffffff",
		border: "#bfdbfe",
	},
};

const DEFAULT_THEME: EmailTheme = {
	bg: "#ffffff",
	text: "#0f172a",
	sub: "#64748b",
	card: "#ffffff",
	border: "#e2e8f0",
};

function theme(config: Record<string, unknown>, fallback: string): EmailTheme {
	return THEMES[str(config.theme)] ?? THEMES[fallback] ?? DEFAULT_THEME;
}

/** Primary action color for a block (buttons, accents, numbers). */
function accent(config: Record<string, unknown>): string {
	return str(config.accent) || "#2563eb";
}

/** Small uppercase pill rendered via mj-raw so it hugs its text. */
function badgePill(badge: unknown, color: string, bg: string): string {
	if (!badge) return "";
	return `<mj-raw><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${atr(
		bg,
	)};color:${atr(color)};border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;line-height:18px">${txt(
		badge,
	)}</td></tr></table></mj-raw>`;
}

function renderButtons(
	buttons: unknown,
	opts: {
		align?: string;
		background?: string;
		color?: string;
		radius?: number;
		outline?: boolean;
	} = {},
): string {
	if (!Array.isArray(buttons)) return "";
	return buttons
		.map((button) => {
			const item = (button ?? {}) as Record<string, unknown>;
			const background = str(
				item.backgroundColor ?? opts.background ?? "#2563eb",
			);
			const color = str(item.color ?? opts.color ?? "#ffffff");
			const radius = px(opts.radius ?? item.borderRadius ?? 8, 8);
			const align = atr(opts.align ?? "left");
			if (opts.outline) {
				return `<mj-button align="${align}" href="${atr(
					item.href,
				)}" background-color="transparent" color="${atr(
					background,
				)}" border="2px solid ${atr(
					background,
				)}" border-radius="${radius}" padding="10px 24px">${txt(
					item.label,
				)}</mj-button>`;
			}
			return `<mj-button align="${align}" href="${atr(
				item.href,
			)}" background-color="${atr(background)}" color="${atr(
				color,
			)}" border="none" border-radius="${radius}" font-weight="600" letter-spacing="0.3px" padding="10px 24px">${txt(
				item.label,
			)}</mj-button>`;
		})
		.join("");
}

/** Editorial serif stack (web-safe, no webfont download). */
const SERIF = "Georgia, 'Times New Roman', serif";

/** Primary sans stack — matches the mj-all default set in buildMJML. */
const FONT =
	"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Render an `<mj-social>` row for the given network items — shared by the
 * social block and the footer. Variants: 1 = plain, 2 = brand circles,
 * 3 = labeled chips.
 */
function renderSocial(
	items: unknown,
	opts: { align?: string; variant?: number; padding?: string } = {},
): string {
	if (!Array.isArray(items)) return "";
	const brandColors: Record<string, string> = {
		facebook: "#1877f2",
		twitter: "#1da1f2",
		instagram: "#e1306c",
		linkedin: "#0a66c2",
		github: "#24292f",
		youtube: "#ff0000",
		web: "#64748b",
	};
	const variant = opts.variant ?? 1;
	const elements = items
		.map((item) => {
			const it = (item ?? {}) as Record<string, unknown>;
			const network = str(it.network || "web");
			let style = "";
			if (variant === 2)
				style = ` background-color="${atr(
					brandColors[network] ?? "#64748b",
				)}" border-radius="999px" color="#ffffff" icon-padding="10px"`;
			if (variant === 3)
				style = ` background-color="#ffffff" border="1px solid #e2e8f0" border-radius="8px" icon-padding="8px" font-size="13px" color="#334155"`;
			return `<mj-social-element name="${atr(network)}" href="${atr(
				it.href,
			)}"${style} />`;
		})
		.join("");
	if (!elements) return "";
	return `<mj-social icon-size="20px" font-size="12px" align="${atr(
		opts.align ?? "center",
	)}" padding="${atr(opts.padding ?? "0")}">${elements}</mj-social>`;
}

// ── Block definitions ───────────────────────────────────────────────────────────

export const EMAIL_BLOCKS: Record<EmailBlockType, EmailBlockDefinition> = {
	text: {
		type: "text",
		icon: "tabler:quote",
		category: "basic",
		labelKey: "text",
		total: 4,
		previewMaxHeight: 150,
		// Sections own all their copy now — text stays renderable for old emails.
		palette: false,
		defaults: {
			text: "",
			align: "left",
		},
		schema: [
			{ key: "text", type: "string", subType: "textarea" },
			{
				key: "align",
				type: "string",
				subType: "select",
				options: ["left", "center", "right"],
			},
		],
		render: (config, variant) => {
			const align = atr(config.align ?? "left");
			// Lead / intro paragraph.
			if (variant === 2)
				return `<mj-text align="${align}" font-size="17px" color="#475569" line-height="1.7" padding="8px 0">${multi(
					config.text,
				)}</mj-text>`;
			// Eyebrow caption (Card-style overline).
			if (variant === 3)
				return `<mj-text align="${align}" font-size="11px" color="#94a3b8" font-weight="700" letter-spacing="2px" text-transform="uppercase" line-height="1.5" padding="8px 0">${multi(
					config.text,
				)}</mj-text>`;
			// Editorial serif body (Black-Friday / Card vibe).
			if (variant === 4)
				return `<mj-text align="${align}" font-size="15px" color="#3f3f46" font-family="${SERIF}" line-height="1.7" padding="8px 0">${multi(
					config.text,
				)}</mj-text>`;
			return `<mj-text align="${align}" font-size="15px" color="#334155" line-height="1.6" padding="8px 0">${multi(
				config.text,
			)}</mj-text>`;
		},
	},
	heading: {
		type: "heading",
		icon: "tabler:heading",
		category: "basic",
		labelKey: "heading",
		total: 3,
		previewMaxHeight: 130,
		// Sections own their headings; block kept for old templates only.
		palette: false,
		defaults: {
			text: "",
			size: "24px",
			weight: "700",
			color: "#111827",
		},
		schema: [
			{ key: "text", type: "string", subType: "textarea" },
			{
				key: "size",
				type: "string",
				subType: "select",
				options: ["20px", "24px", "28px", "32px", "36px"],
			},
			{
				key: "weight",
				type: "string",
				subType: "select",
				options: ["400", "600", "700", "800"],
			},
			{ key: "color", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const color = atr(config.color ?? "#111827");
			// Editorial serif heading (Black-Friday / Card vibe).
			if (variant === 3)
				return `<mj-text align="left" font-size="${atr(
					config.size ?? "28px",
				)}" font-weight="600" color="${color}" font-family="${SERIF}" letter-spacing="-0.2px" padding="8px 0" line-height="1.3">${multi(
					config.text,
				)}</mj-text>`;
			const align = variant === 2 ? "left" : "center";
			return `<mj-text align="${align}" font-size="${atr(
				config.size ?? "24px",
			)}" font-weight="${atr(config.weight ?? "700")}" color="${color}" letter-spacing="-0.5px" padding="8px 0" line-height="1.35">${multi(
				config.text,
			)}</mj-text>`;
		},
	},
	image: {
		type: "image",
		icon: "tabler:photo",
		category: "basic",
		labelKey: "image",
		total: 3,
		previewMaxHeight: 240,
		palette: false,
		defaults: { src: "https://picsum.photos/600/400", alt: "", width: "100%" },
		schema: [
			// "assets" table → the page-builder Asset field (upload + picker).
			{ key: "src", type: "table", table: "assets", accept: ["image"] },
			{ key: "alt", type: "string" },
			{ key: "width", type: "string" },
		],
		render: (config, variant) => {
			const src = mediaUrl(config.src);
			if (!src) return "";
			// Full-bleed hero image (Black-Friday style).
			if (variant === 3)
				return `<mj-image src="${atr(src)}" alt="${atr(
					config.alt,
				)}" width="100%" padding="0" />`;
			const rounded =
				variant === 2 ? ` border-radius="12px" border="1px solid #e2e8f0"` : "";
			return `<mj-image src="${atr(src)}" alt="${atr(
				config.alt,
			)}" width="${atr(config.width ?? "100%")}"${rounded} />`;
		},
	},
	video: {
		type: "video",
		icon: "tabler:video",
		category: "basic",
		labelKey: "video",
		total: 3,
		previewMaxHeight: 380,
		palette: false,
		defaults: {
			src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			poster: "https://picsum.photos/600/340",
			title: "How it works",
			description: "A quick two-minute walkthrough — no sign-up needed.",
			link: "",
			linkText: "Watch the full video",
			meta: "Feb 14, 2026 · 4:32 · 12K views",
			accent: "#2563eb",
		},
		// Email clients can't play inline video, so these variants are gallery-
		// style clickable posters: a styled thumbnail with a play overlay that
		// links to the actual video.
		schema: [
			{ key: "src", type: "table", table: "assets", accept: ["video"] },
			{ key: "poster", type: "table", table: "assets", accept: ["image"] },
			{ key: "title", type: "string" },
			{ key: "description", type: "string", subType: "textarea" },
			{ key: "link", type: "string" },
			{ key: "linkText", type: "string" },
			{ key: "meta", type: "string" },
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const src = mediaUrl(config.src);
			const posterSrc = mediaUrl(config.poster) || src;
			const href = atr(str(config.link || src || "#"));
			const accentColor = accent(config);
			const title = (size = "16px", color = "#0f172a", align = "left") =>
				`<mj-text align="${atr(align)}" font-size="${size}" font-weight="700" color="${atr(
					color,
				)}" line-height="1.35" padding="0">${txt(config.title)}</mj-text>`;
			const description = (align: string) =>
				config.description
					? `<mj-text align="${atr(align)}" font-size="13px" color="#64748b" line-height="1.55" padding="4px 0 10px">${multi(
							config.description,
						)}</mj-text>`
					: "";
			const linkLine = (align: string) =>
				`<mj-text align="${atr(align)}" font-size="13px" font-weight="700" color="${atr(
					accentColor,
				)}" padding="0"><a href="${href}" style="color:${atr(
					accentColor,
				)};text-decoration:none;">${txt(config.linkText)} →</a></mj-text>`;
			// Poster backdrop as a background table cell (rounded, play overlay),
			// reusable inside columns and rounded sections alike.
			const backdrop = (radius: string, padV: string) =>
				`<mj-raw><table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="${
					posterSrc
						? `background-image:url('${atr(posterSrc)}');background-size:cover;background-position:center;`
						: "background-color:#0f172a;"
				}border-radius:${radius};"><a href="${href}" style="display:block;text-align:center;padding:${padV} 0;"><span style="display:inline-block;width:54px;height:54px;border-radius:50%;background:rgba(15,23,42,0.55);color:#ffffff;font-size:18px;line-height:54px;text-align:center;">▶</span></a></td></tr></table></mj-raw>`;
			const playCta = () =>
				`<mj-button align="center" href="${href}" background-color="rgba(15,23,42,0.55)" color="#ffffff" border="none" border-radius="999px" font-size="13px" padding="13px 17px">▶</mj-button>`;

			// Split feature: poster with play overlay on the left, copy on the right.
			if (variant === 2)
				return `<mj-section background-color="#ffffff" border-radius="16px" padding="18px"><mj-column width="46%">${backdrop(
					"12px",
					"80px",
				)}</mj-column><mj-column width="54%">${title()}${description("left")}${linkLine("left")}</mj-column></mj-section>`;

			// Cinematic dark: full poster, then a dark band with centered title,
			// meta line and solid pill button.
			if (variant === 3) {
				const meta = config.meta
					? `<mj-text align="center" font-size="11px" color="#94a3b8" padding="4px 0 12px">${txt(
							config.meta,
						)}</mj-text>`
					: "";
				const watch = `<mj-button align="center" href="${href}" background-color="${atr(
					accentColor,
				)}" color="#ffffff" border="none" border-radius="8px" font-size="13px" font-weight="700" padding="11px 22px">${txt(
					config.linkText,
				)}</mj-button>`;
				return `<mj-section background-color="#0b0f19" border-radius="16px" padding="0 0 26px"><mj-column padding="0">${backdrop(
					"16px 16px 0 0",
					"88px",
				)}</mj-column><mj-column padding="20px 24px 0">${title(
					"17px",
					"#f8fafc",
					"center",
				)}${meta}${watch}</mj-column></mj-section>`;
			}

			// Poster card: full-width poster with centered play, caption below.
			const posterBand = `<mj-section ${
				posterSrc
					? `background-url="${atr(posterSrc)}" background-size="cover" background-position="center"`
					: 'background-color="#0f172a"'
			} border-radius="16px" padding="84px 0">${playCta()}</mj-section>`;
			const captionCard = `<mj-section background-color="#ffffff" border-radius="16px" padding="22px 24px"><mj-column>${title(
				"17px",
				"#0f172a",
				"center",
			)}${description("center")}${linkLine("center")}</mj-column></mj-section>`;
			return `${posterBand}${captionCard}`;
		},
	},
	button: {
		type: "button",
		icon: "tabler:click",
		category: "basic",
		labelKey: "button",
		total: 4,
		previewMaxHeight: 120,
		// CTAs live inside sections (hero/cta/table); kept for old templates only.
		palette: false,
		defaults: {
			text: "Click me",
			href: "https://example.com",
			backgroundColor: "#2563eb",
			color: "#ffffff",
			borderRadius: 6,
		},
		schema: [
			{ key: "text", type: "string" },
			{ key: "href", type: "string" },
			{ key: "backgroundColor", type: "string", subType: "color" },
			{ key: "color", type: "string", subType: "color" },
			{ key: "borderRadius", type: "number" },
		],
		render: (config, variant) => {
			const href = atr(config.href);
			const background = atr(config.backgroundColor ?? "#2563eb");
			const defaultColor = atr(config.color ?? "#ffffff");
			if (variant === 4)
				return `<mj-button href="${href}" background-color="${background}" color="${defaultColor}" border="none" border-radius="3px" font-size="13px" font-weight="700" letter-spacing="1px" text-transform="uppercase" padding="14px 28px">${txt(
					config.text,
				)}</mj-button>`;
			if (variant === 2)
				return `<mj-button href="${href}" background-color="transparent" color="${background}" border="2px solid ${background}" border-radius="${px(
					config.borderRadius,
					6,
				)}" padding="8px 16px">${txt(config.text)}</mj-button>`;
			if (variant === 3)
				return `<mj-button href="${href}" background-color="${background}" color="${defaultColor}" border="none" border-radius="999px" font-weight="700" letter-spacing="0.5px" inner-padding="14px 28px">${txt(
					config.text,
				)}</mj-button>`;
			return `<mj-button href="${href}" background-color="${background}" color="${defaultColor}" border="none" border-radius="${px(
				config.borderRadius,
				6,
			)}" font-weight="600" letter-spacing="0.3px" padding="8px 16px">${txt(
				config.text,
			)}</mj-button>`;
		},
	},
	divider: {
		type: "divider",
		icon: "tabler:minus",
		category: "basic",
		labelKey: "divider",
		total: 4,
		previewMaxHeight: 90,
		palette: false,
		defaults: { borderColor: "#e2e8f0", borderWidth: 1 },
		schema: [
			{ key: "borderColor", type: "string", subType: "color" },
			{ key: "borderWidth", type: "number" },
		],
		render: (config, variant) => {
			const color = atr(config.borderColor ?? "#e2e8f0");
			// Short centered rule (Card-style accent divider).
			if (variant === 4)
				return `<mj-divider border-color="${color}" border-width="3px" border-style="solid" width="64px" />`;
			if (variant === 2)
				return `<mj-divider border-color="${color}" border-width="2px" border-style="solid" />`;
			if (variant === 3)
				return `<mj-divider border-color="${color}" border-width="1px" border-style="dashed" />`;
			return `<mj-divider border-color="${color}" border-width="${px(
				config.borderWidth,
				1,
			)}" border-style="solid" />`;
		},
	},
	spacer: {
		type: "spacer",
		icon: "tabler:arrows-vertical",
		category: "basic",
		labelKey: "spacer",
		total: 1,
		previewMaxHeight: 80,
		palette: false,
		defaults: { height: 20 },
		schema: [{ key: "height", type: "number" }],
		render: (config) => `<mj-spacer height="${px(config.height, 20)}" />`,
	},
	columns: {
		type: "columns",
		icon: "tabler:layout-columns",
		category: "layout",
		labelKey: "columns",
		total: 1,
		previewMaxHeight: 160,
		palette: false,
		columns: 2,
		defaults: {},
		schema: [],
		render: () => "",
	},
	emailHeader: {
		type: "emailHeader",
		icon: "tabler:layout-navbar",
		category: "sections",
		labelKey: "emailHeader",
		total: 4,
		previewMaxHeight: 220,
		ownSection: true,
		defaults: {
			logo: "https://picsum.photos/seed/logo/200/80",
			logoWidth: "140px",
			logoHref: "https://example.com",
			links: [
				{ label: "Home", href: "https://example.com" },
				{ label: "Program", href: "https://example.com/program" },
				{ label: "Tickets", href: "https://example.com/tickets" },
			],
			preheader: "",
			preheaderHref: "",
			align: "center",
			backgroundColor: "#ffffff",
			textColor: "#334155",
			borderColor: "#e2e8f0",
		},
		schema: [
			{ key: "logo", type: "table", table: "assets", accept: ["image"] },
			{ key: "logoWidth", type: "string" },
			{ key: "logoHref", type: "string" },
			{
				key: "links",
				type: "array",
				isTable: false,
				expand: true,
				children: EmailButtonSchema,
			},
			{ key: "preheader", type: "string" },
			{ key: "preheaderHref", type: "string" },
			{
				key: "align",
				type: "string",
				subType: "select",
				options: ["left", "center", "right"],
			},
			{ key: "backgroundColor", type: "string", subType: "color" },
			{ key: "textColor", type: "string", subType: "color" },
			{ key: "borderColor", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const align = str(config.align ?? "center");
			const bg = atr(config.backgroundColor ?? "#ffffff");
			const text = atr(config.textColor ?? "#334155");
			const border = atr(config.borderColor ?? "#e2e8f0");
			const logoSrc = mediaUrl(config.logo);
			const logoLink = atr(str(config.logoHref));
			const logo = logoSrc
				? `<a href="${logoLink}"><mj-image src="${atr(
						logoSrc,
					)}" alt="" width="${atr(
						config.logoWidth ?? "140px",
					)}" align="${atr(align)}" padding="0" /></a>`
				: "";
			const linkItems = Array.isArray(config.links) ? config.links : [];
			const separator =
				align === "center"
					? `<span style="color:${border};margin:0 10px;">|</span>`
					: `<span style="color:${border};margin:0 10px;">·</span>`;
			const nav = linkItems
				.map((item) => {
					const it = (item ?? {}) as Record<string, unknown>;
					if (!it.label && !it.href) return "";
					return `<a href="${atr(
						it.href,
					)}" style="color:${text};text-decoration:none;font-size:13px;font-weight:600;">${txt(
						it.label,
					)}</a>`;
				})
				.filter(Boolean)
				.join(separator);
			const navLine = nav
				? `<mj-text align="${atr(align)}" padding="10px 0 0">${nav}</mj-text>`
				: "";
			const preheader = config.preheader
				? `<mj-text align="${atr(align)}" font-size="12px" color="${text}" padding="0 0 10px"><a href="${
						config.preheaderHref ? atr(str(config.preheaderHref)) : logoLink
					}" style="color:${text};text-decoration:underline;">${txt(
						config.preheader,
					)}</a></mj-text>`
				: "";

			// Minimal top bar: logo left, links right.
			if (variant === 2) {
				return `<mj-section background-color="${bg}" padding="16px 20px" border-bottom="1px solid ${border}"><mj-column width="40%" vertical-align="middle">${
					logo
						? `<a href="${logoLink}"><mj-image src="${atr(
								logoSrc ?? "",
							)}" alt="" width="${atr(
								config.logoWidth ?? "130px",
							)}" align="left" padding="0" /></a>`
						: ""
				}</mj-column><mj-column width="60%" vertical-align="middle"><mj-text align="right" padding="0">${nav}</mj-text></mj-column></mj-section>`;
			}
			// Preheader bar above logo + nav.
			if (variant === 3 && config.preheader) {
				const topBar = `<mj-section background-color="#0f172a" padding="8px 20px"><mj-column>${preheader.replace(
					/color="[^"]*"/,
					'color="#94a3b8"',
				)}</mj-column></mj-section>`;
				return `${topBar}<mj-section background-color="${bg}" padding="18px 20px" border-bottom="1px solid ${border}"><mj-column>${logo}${navLine}</mj-column></mj-section>`;
			}
			// Preheader-only thin strip.
			if (variant === 4) {
				return `<mj-section background-color="${bg}" padding="12px 20px" border-bottom="1px solid ${border}"><mj-column>${preheader || navLine}</mj-column></mj-section>`;
			}
			return `<mj-section background-color="${bg}" padding="18px 20px" border-bottom="1px solid ${border}"><mj-column>${logo}${navLine}</mj-column></mj-section>`;
		},
	},
	emailHero: {
		type: "emailHero",
		icon: "tabler:rocket",
		category: "sections",
		labelKey: "emailHero",
		total: 5,
		previewMaxHeight: 620,
		ownSection: true,
		defaults: {
			badge: "New",
			heading: "Welcome aboard {{@user.username}}",
			description:
				"A short friendly intro goes here.\nTell your readers what to expect and why this email matters.",
			buttons: [{ label: "Get started", href: "https://example.com" }],
			image: "https://picsum.photos/600/400",
			theme: "light",
			accent: "#2563eb",
		},
		schema: [
			{ key: "badge", type: "string" },
			{ key: "heading", type: "string" },
			{ key: "description", type: "string", subType: "textarea" },
			{
				key: "buttons",
				type: "array",
				isTable: false,
				expand: true,
				children: EmailButtonSchema,
			},
			{ key: "image", type: "table", table: "assets", accept: ["image"] },
			{
				key: "theme",
				type: "string",
				subType: "select",
				options: ["light", "dark", "accent"],
			},
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const t = theme(config, "light");
			const accentColor = accent(config);
			const imageSrc = mediaUrl(config.image);
			const badge = badgePill(config.badge, "#1e40af", "#dbeafe");
			const heading = (color = t.text, align = "center") =>
				`<mj-text align="${align}" font-size="30px" font-weight="800" color="${atr(
					color,
				)}" letter-spacing="-0.5px" line-height="1.3" padding="8px 0">${txt(
					config.heading,
				)}</mj-text>`;
			const description = (color = t.sub, align = "center") =>
				config.description
					? `<mj-text align="${align}" font-size="16px" color="${atr(
							color,
						)}" line-height="1.6" padding="4px 0 10px">${multi(
							config.description,
						)}</mj-text>`
					: "";
			const image = (rounded = true, padding = "0") =>
				imageSrc
					? `<mj-image src="${atr(imageSrc)}" alt="" width="100%"${
							rounded ? ` border-radius="12px"` : ""
						} padding="${padding}" />`
					: "";

			// Dark promo (Black Friday style): near-black band, serif headline,
			// optional full-bleed image above, white CTA.
			if (variant === 5) {
				const overline = config.badge
					? `<mj-text align="center" font-size="12px" font-weight="700" color="${atr(
							accentColor,
						)}" letter-spacing="3px" text-transform="uppercase" padding="0 0 8px">${txt(
							config.badge,
						)}</mj-text>`
					: "";
				const headline = `<mj-text align="center" font-size="38px" font-weight="600" color="#f8fafc" font-family="${SERIF}" line-height="1.15" letter-spacing="-0.4px" padding="6px 24px">${txt(
					config.heading,
				)}</mj-text>`;
				const sub = config.description
					? `<mj-text align="center" font-size="15px" color="#94a3b8" line-height="1.6" padding="4px 24px 18px">${multi(
							config.description,
						)}</mj-text>`
					: "";
				const imageBand = imageSrc
					? `<mj-section background-color="#0b0f19" padding="0"><mj-column padding="0"><mj-image src="${atr(
							imageSrc,
						)}" alt="" width="100%" padding="0" /></mj-column></mj-section>`
					: "";
				const copyBand = `<mj-section background-color="#0b0f19" border-radius="16px" padding="40px 20px 38px"><mj-column>${overline}${headline}${sub}${renderButtons(
					config.buttons,
					{
						align: "center",
						background: "#ffffff",
						color: "#0b0f19",
						radius: 4,
					},
				)}</mj-column></mj-section>`;
				return `${imageBand}${copyBand}`;
			}

			// Split: copy left, image right.
			if (variant === 2 && imageSrc) {
				return `<mj-section background-color="${atr(
					t.bg,
				)}" border-radius="16px" padding="32px 24px"><mj-column padding="0 16px 0 0" vertical-align="middle">${badge}${heading(
					t.text,
					"left",
				)}${description(t.sub, "left")}${renderButtons(config.buttons, {
					align: "left",
					background: accentColor,
					radius: 8,
				})}</mj-column><mj-column padding="0 0 0 16px" vertical-align="middle">${image(
					true,
					"0",
				)}</mj-column></mj-section>`;
			}
			// Full-bleed image on top, content below.
			if (variant === 3 && imageSrc) {
				return `<mj-section background-color="${atr(
					t.bg,
				)}" padding="24px 24px 0"><mj-column>${image(
					true,
					"0 0 16px",
				)}</mj-column></mj-section><mj-section background-color="${atr(
					t.bg,
				)}" border-radius="16px" padding="30px 24px"><mj-column>${badge}${heading()}${description()}${renderButtons(
					config.buttons,
					{ align: "center", background: accentColor, radius: 999 },
				)}</mj-column></mj-section>`;
			}
			// Accent panel: copy on a colored card, image beside it.
			if (variant === 4 && imageSrc) {
				return `<mj-section background-color="${atr(
					t.bg,
				)}" padding="24px 20px"><mj-column background-color="${atr(
					accentColor,
				)}" border-radius="16px" padding="30px 28px" vertical-align="middle">${badgePill(
					config.badge,
					atr(accentColor),
					"#ffffff",
				)}${heading("#ffffff", "left")}${description(
					"#dbeafe",
					"left",
				)}${renderButtons(config.buttons, {
					align: "left",
					background: "#ffffff",
					color: accentColor,
					radius: 8,
				})}</mj-column><mj-column padding="0 0 0 14px" vertical-align="middle">${image(
					true,
					"0",
				)}</mj-column></mj-section>`;
			}
			// Centered classic: badge, copy, buttons, image below.
			return `<mj-section background-color="${atr(
				t.bg,
			)}" border-radius="16px" padding="36px 24px"><mj-column>${badge}${heading()}${description()}${renderButtons(
				config.buttons,
				{ align: "center", background: accentColor, radius: 999 },
			)}${image(true, "12px 0 0")}</mj-column></mj-section>`;
		},
	},
	emailFeatures: {
		type: "emailFeatures",
		icon: "tabler:layout-grid",
		category: "sections",
		labelKey: "emailFeatures",
		total: 5,
		previewMaxHeight: 680,
		ownSection: true,
		defaults: {
			heading: "Everything you need",
			description: "Here's what's included.",
			items: [
				{
					image: "https://picsum.photos/seed/feature1/600/400",
					title: "Lightning fast",
					description: "Built for speed from the ground up.",
				},
				{
					image: "https://picsum.photos/seed/feature2/600/400",
					title: "Secure by default",
					description: "Your data stays private and protected.",
				},
				{
					image: "https://picsum.photos/seed/feature3/600/400",
					title: "Loved by teams",
					description: "Join thousands of happy customers.",
				},
				{
					image: "https://picsum.photos/seed/feature4/600/400",
					title: "Always available",
					description: "Reliable, global, 24/7.",
				},
			],
			theme: "light",
			accent: "#2563eb",
		},
		schema: [
			{ key: "heading", type: "string" },
			{ key: "description", type: "string", subType: "textarea" },
			{
				key: "items",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{
						key: "image",
						type: "table",
						table: "assets",
						accept: ["image"],
					},
					{ key: "title", type: "string", required: true },
					{ key: "description", type: "string", subType: "textarea" },
				],
			},
			{
				key: "theme",
				type: "string",
				subType: "select",
				options: ["light", "dark", "accent"],
			},
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const t = theme(config, "light");
			const accentColor = accent(config);
			const heading = `<mj-text align="center" font-size="24px" font-weight="800" color="${atr(
				t.text,
			)}" letter-spacing="-0.5px" padding="4px 0">${txt(
				config.heading,
			)}</mj-text>`;
			const description = config.description
				? `<mj-text align="center" font-size="15px" color="${atr(
						t.sub,
					)}" padding="2px 0 12px">${multi(config.description)}</mj-text>`
				: "";
			const items = Array.isArray(config.items) ? config.items : [];
			const itemBody = (item: unknown, align: string) => {
				const it = (item ?? {}) as Record<string, unknown>;
				const imageSrc = mediaUrl(it.image);
				const image = imageSrc
					? `<mj-image src="${atr(imageSrc)}" alt="" width="100%" border-radius="12px" padding="0 0 10px" />`
					: "";
				const title = `<mj-text align="${atr(align)}" font-size="17px" font-weight="700" color="${atr(
					t.text,
				)}" padding="2px 0">${txt(it.title)}</mj-text>`;
				const body = it.description
					? `<mj-text align="${atr(align)}" font-size="14px" color="${atr(
							t.sub,
						)}" line-height="1.5" padding="2px 0">${multi(
							it.description,
						)}</mj-text>`
					: "";
				return `${image}${title}${body}`;
			};
			const header = `<mj-section background-color="${atr(
				t.bg,
			)}" border-radius="16px" padding="32px 24px 4px"><mj-column>${heading}${description}</mj-column></mj-section>`;
			const emptyColumn = () =>
				`<mj-column><mj-spacer height="1" /></mj-column>`;

			// Perks / trust bar (Racoon-style): up to 4 compact icon columns on
			// a dark band — small image, bold caps title, tiny one-liner.
			if (variant === 5) {
				const perk = (item: unknown) => {
					const it = (item ?? {}) as Record<string, unknown>;
					const perkImage = mediaUrl(it.image);
					const icon = perkImage
						? `<mj-image src="${atr(perkImage)}" alt="" width="44px" align="center" padding="0 0 8px" />`
						: "";
					const title = `<mj-text align="center" font-size="13px" font-weight="700" color="#f8fafc" letter-spacing="1px" text-transform="uppercase" padding="2px 0">${txt(
						it.title,
					)}</mj-text>`;
					const body = it.description
						? `<mj-text align="center" font-size="11px" color="#94a3b8" line-height="1.5" padding="2px 12px">${multi(
								it.description,
							)}</mj-text>`
						: "";
					return `${icon}${title}${body}`;
				};
				const cols = items.filter(Boolean);
				if (!cols.length) return "";
				let out = header;
				for (let i = 0; i < cols.length; i += 4) {
					const chunk = cols.slice(i, i + 4);
					out += `<mj-section background-color="#0b0f19" padding="22px 16px"><mj-column>${chunk
						.map(perk)
						.join("</mj-column><mj-column>")}</mj-column></mj-section>`;
				}
				return out;
			}

			// Centered cards: one per row.
			if (variant === 1)
				return `${header}${items
					.map(
						(item) =>
							`<mj-section background-color="${atr(
								t.bg,
							)}" padding="10px 20px"><mj-column background-color="${atr(
								t.card,
							)}" border="1px solid ${atr(
								t.border,
							)}" border-radius="14px" padding="22px 20px">${itemBody(
								item,
								"center",
							)}</mj-column></mj-section>`,
					)
					.join("")}`;

			// Numbered steps: accent number, divider between rows.
			if (variant === 3) {
				let out = header;
				items.forEach((item, index) => {
					const number = `<mj-text align="left" font-size="26px" font-weight="800" color="${atr(
						accentColor,
					)}" letter-spacing="1px" padding="0">${String(index + 1).padStart(
						2,
						"0",
					)}</mj-text>`;
					out += `<mj-section background-color="${atr(
						t.bg,
					)}" padding="12px 24px"><mj-column width="15%">${number}</mj-column><mj-column width="85%" padding="0 0 0 18px">${itemBody(
						item,
						"left",
					)}</mj-column></mj-section>`;
					if (index < items.length - 1)
						out += `<mj-section background-color="${atr(
							t.bg,
						)}" padding="0 24px"><mj-column><mj-divider border-color="${atr(
							t.border,
						)}" border-width="1px" /></mj-column></mj-section>`;
				});
				return out;
			}

			// Checklist: two-column rows with an accent rule above each item.
			if (variant === 4) {
				let out = header;
				for (let i = 0; i < items.length; i += 2) {
					const one = (item: unknown) =>
						`<mj-column border-top="3px solid ${atr(
							accentColor,
						)}" padding="12px 10px 0 0">${itemBody(item, "left")}</mj-column>`;
					out += `<mj-section background-color="${atr(
						t.bg,
					)}" padding="10px 24px">${one(items[i])}${
						i + 1 < items.length
							? one(items[i + 1])
							: `<mj-column>&nbsp;</mj-column>`
					}</mj-section>`;
				}
				return out;
			}

			// Two-column card grid.
			const rows: string[] = [];
			for (let i = 0; i < items.length; i += 2) {
				const one = (item: unknown) =>
					`<mj-column background-color="${atr(
						t.card,
					)}" border="1px solid ${atr(t.border)}" border-radius="14px" padding="20px 18px">${itemBody(
						item,
						"left",
					)}</mj-column>`;
				rows.push(
					`<mj-section background-color="${atr(
						t.bg,
					)}" padding="10px 20px">${one(items[i])}${
						i + 1 < items.length ? one(items[i + 1]) : emptyColumn()
					}</mj-section>`,
				);
			}
			return `${header}${rows.join("")}`;
		},
	},
	emailCta: {
		type: "emailCta",
		icon: "tabler:megaphone",
		category: "sections",
		labelKey: "emailCta",
		total: 4,
		previewMaxHeight: 320,
		ownSection: true,
		defaults: {
			heading: "Ready to get started?",
			description: "",
			buttons: [{ label: "Get started", href: "https://example.com" }],
			theme: "dark",
			accent: "#4f8cff",
		},
		schema: [
			{ key: "heading", type: "string" },
			{ key: "description", type: "string", subType: "textarea" },
			{
				key: "buttons",
				type: "array",
				isTable: false,
				expand: true,
				children: EmailButtonSchema,
			},
			{
				key: "theme",
				type: "string",
				subType: "select",
				options: ["light", "dark", "accent"],
			},
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const t = theme(config, "dark");
			const accentColor = accent(config);
			const heading = `<mj-text align="center" font-size="24px" font-weight="800" color="${atr(
				t.text,
			)}" letter-spacing="-0.5px" padding="2px 0">${txt(
				config.heading,
			)}</mj-text>`;
			const description = config.description
				? `<mj-text align="center" font-size="15px" color="${atr(
						t.sub,
					)}" padding="2px 0 8px">${multi(config.description)}</mj-text>`
				: "";
			// Big action panel: headline, accent rule, description, pill button.
			if (variant === 4) {
				const panel = theme(config, "light");
				const headline = `<mj-text align="center" font-size="30px" font-weight="800" color="${atr(
					panel.text,
				)}" letter-spacing="-0.5px" line-height="1.2" padding="2px 0">${txt(
					config.heading,
				)}</mj-text>`;
				const rule = `<mj-divider border-color="${atr(
					accentColor,
				)}" border-width="3px" width="48px" />`;
				const body = config.description
					? `<mj-text align="center" font-size="15px" color="${atr(
							panel.sub,
						)}" line-height="1.6" padding="10px 8px 4px">${multi(
							config.description,
						)}</mj-text>`
					: "";
				return `<mj-section background-color="${atr(
					panel.bg,
				)}" border="1px solid ${atr(panel.border)}" border-radius="18px" padding="44px 28px"><mj-column>${headline}${rule}${body}${renderButtons(
					config.buttons,
					{ align: "center", background: accentColor, radius: 999 },
				)}</mj-column></mj-section>`;
			}
			// Full-width band with rules above and below.
			if (variant === 3) {
				const rule = (top: boolean) =>
					`<mj-section background-color="${atr(
						t.bg,
					)}" padding="${top ? "0" : "8px"} 24px"><mj-column><mj-divider border-color="${atr(
						t.border,
					)}" border-width="1px" /></mj-column></mj-section>`;
				return `${rule(true)}<mj-section background-color="${atr(
					t.bg,
				)}" padding="10px 24px"><mj-column>${heading}${description}${renderButtons(
					config.buttons,
					{ align: "center", background: accentColor, radius: 999 },
				)}</mj-column></mj-section>${rule(false)}`;
			}
			// Split: copy left, buttons right.
			if (
				variant === 2 &&
				Array.isArray(config.buttons) &&
				config.buttons.length
			) {
				return `<mj-section background-color="${atr(
					t.bg,
				)}" border-radius="16px" padding="30px 24px"><mj-column padding="0 16px 0 0">${heading}${description}</mj-column><mj-column padding="0 0 0 16px" vertical-align="middle">${renderButtons(
					config.buttons,
					{ align: "right", background: accentColor, radius: 8 },
				)}</mj-column></mj-section>`;
			}
			// Centered card.
			return `<mj-section background-color="${atr(
				t.bg,
			)}" border-radius="16px" padding="36px 24px"><mj-column>${heading}${description}${renderButtons(
				config.buttons,
				{ align: "center", background: accentColor, radius: 999 },
			)}</mj-column></mj-section>`;
		},
	},
	emailTable: {
		type: "emailTable",
		icon: "tabler:table",
		category: "sections",
		labelKey: "emailTable",
		total: 3,
		previewMaxHeight: 520,
		ownSection: true,
		defaults: {
			title: "",
			description: "",
			columns: 3,
			headers: [{ text: "Feature" }, { text: "Starter" }, { text: "Pro" }],
			rows: [
				{ cell1: "Monthly sends", cell2: "1,000", cell3: "50,000", cell4: "" },
				{ cell1: "Templates", cell2: "1", cell3: "Unlimited", cell4: "" },
				{ cell1: "Support", cell2: "Email", cell3: "Priority", cell4: "" },
			],
			accent: "#2563eb",
		},
		schema: [
			{ key: "title", type: "string" },
			{ key: "description", type: "string", subType: "textarea" },
			{
				key: "columns",
				type: "number",
				subType: "select",
				options: [2, 3, 4],
			},
			{
				key: "headers",
				type: "array",
				isTable: false,
				expand: true,
				children: [{ key: "text", type: "string" }],
			},
			{
				key: "rows",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{ key: "cell1", type: "string" },
					{ key: "cell2", type: "string" },
					{ key: "cell3", type: "string" },
					{ key: "cell4", type: "string" },
				],
			},
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const accentColor = accent(config);
			const n = Number(config.columns) || 3;
			const headers = Array.isArray(config.headers) ? config.headers : [];
			const rows = Array.isArray(config.rows) ? config.rows : [];
			const colWidth = Math.floor(100 / n);
			const headerRow = headers
				.slice(0, n)
				.map(
					(h, i) =>
						`<th style="padding:10px 12px;text-align:${
							i === 0 ? "left" : i === n - 1 ? "right" : "center"
						};font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;border-bottom:2px solid ${
							variant === 2 ? accentColor : "#e2e8f0"
						};">${txt((h as Record<string, unknown>)?.text)}</th>`,
				)
				.join("");
			const cell = (value: unknown, i: number, bg: string) =>
				`<td style="padding:10px 12px;text-align:${
					i === 0 ? "left" : i === n - 1 ? "right" : "center"
				};font-size:13px;color:#334155;background-color:${bg};">${txt(
					value,
				)}</td>`;
			const rowHtml = rows
				.map((row, idx) => {
					const it = (row ?? {}) as Record<string, unknown>;
					const zebra = variant === 1 && idx % 2 === 1 ? "#f8fafc" : "#ffffff";
					const cells = [it.cell1, it.cell2, it.cell3, it.cell4]
						.slice(0, n)
						.map((v, i) => cell(v, i, zebra))
						.join("");
					const bottom =
						variant === 2 ? `border-bottom:1px solid #e2e8f0;` : "";
					return `<tr style="${bottom}">${cells}</tr>`;
				})
				.join("");
			const table = `<mj-table width="100%" cellpadding="0" cellspacing="0" font-size="13px" line-height="22px" color="#334155">${headerRow}${rowHtml}</mj-table>`;
			const cardHeader = `<mj-text align="center" font-size="22px" font-weight="800" color="#0f172a" line-height="1.3" padding="0">${txt(
				config.title,
			)}</mj-text>${
				config.description
					? `<mj-text align="center" font-size="14px" color="#64748b" line-height="1.55" padding="6px 0 14px">${multi(
							config.description,
						)}</mj-text>`
					: ""
			}`;
			const head = config.title
				? `<mj-section background-color="#ffffff" border-radius="16px" padding="28px 24px 10px"><mj-column>${cardHeader}</mj-column></mj-section>`
				: "";
			if (variant === 3) {
				// Compact stats: no header row, large numbers, labels.
				const statRows = rows
					.slice(0, 4)
					.map((row) => {
						const it = (row ?? {}) as Record<string, unknown>;
						return `<tr><td style="padding:12px 0;font-size:13px;color:#64748b;border-bottom:1px solid #e2e8f0;">${txt(
							it.cell1,
						)}</td><td style="padding:12px 0;text-align:right;font-size:18px;font-weight:800;color:#0f172a;border-bottom:1px solid #e2e8f0;">${txt(
							it.cell2,
						)}</td></tr>`;
					})
					.join("");
				const statTable = `<mj-table width="100%" cellpadding="0" cellspacing="0">${statRows}</mj-table>`;
				return `${head}<mj-section background-color="#ffffff" border-radius="16px" padding="10px 24px 24px"><mj-column>${statTable}</mj-column></mj-section>`;
			}
			return `${head}<mj-section background-color="#ffffff" border-radius="16px" padding="10px 24px 24px"><mj-column>${table}</mj-column></mj-section>`;
		},
	},
	emailInvoice: {
		type: "emailInvoice",
		icon: "tabler:file-invoice",
		category: "sections",
		labelKey: "emailInvoice",
		total: 3,
		previewMaxHeight: 620,
		ownSection: true,
		defaults: {
			title: "Invoice",
			invoiceNumber: "INV-0001",
			date: "",
			dueDate: "",
			billFrom: "Your Company Inc.\n123 Market St, San Francisco, CA",
			billTo: "Client Co.\n456 Commerce Ave, New York, NY",
			items: [
				{
					name: "Design services",
					qty: 1,
					price: 1200,
					image: "https://picsum.photos/seed/invoice1/200/200",
				},
				{
					name: "Development",
					qty: 2,
					price: 2500,
					image: "https://picsum.photos/seed/invoice2/200/200",
				},
				{ name: "Hosting (yearly)", qty: 1, price: 240 },
			],
			notes: "Payment due within 14 days. Thanks for your business.",
			accent: "#2563eb",
			buttonLabel: "Pay invoice",
			buttonHref: "https://example.com/pay",
		},
		schema: [
			{ key: "title", type: "string" },
			{ key: "invoiceNumber", type: "string" },
			{ key: "date", type: "string" },
			{ key: "dueDate", type: "string" },
			{ key: "billFrom", type: "string", subType: "textarea" },
			{ key: "billTo", type: "string", subType: "textarea" },
			{
				key: "items",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{ key: "name", type: "string" },
					{ key: "description", type: "string", subType: "textarea" },
					{ key: "image", type: "table", table: "assets", accept: ["image"] },
					{ key: "qty", type: "number" },
					{ key: "price", type: "number" },
				],
			},
			{ key: "notes", type: "string", subType: "textarea" },
			{ key: "accent", type: "string", subType: "color" },
			{ key: "buttonLabel", type: "string" },
			{ key: "buttonHref", type: "string" },
		],
		render: (config, variant) => {
			const accentColor = accent(config);
			const items = Array.isArray(config.items) ? config.items : [];
			const total = items.reduce((sum, item) => {
				const it = (item ?? {}) as Record<string, unknown>;
				return sum + Number(it.qty ?? 0) * Number(it.price ?? 0);
			}, 0);
			const totalLine = `<tr><td colspan="3" style="padding:12px;text-align:right;font-size:13px;color:#64748b;background-color:#f8fafc;border-top:2px solid #e2e8f0;">Total</td><td style="padding:12px;text-align:right;font-size:15px;font-weight:800;color:#0f172a;background-color:#f8fafc;border-top:2px solid #e2e8f0;">$${total.toLocaleString()}</td></tr>`;
			const headerMeta = `<mj-section background-color="#ffffff" border-radius="16px" padding="28px 24px 8px"><mj-column><mj-text align="center" font-size="11px" font-weight="700" color="${atr(
				accentColor,
			)}" letter-spacing="2px" text-transform="uppercase">${txt(
				config.title,
			)}</mj-text>${
				config.invoiceNumber
					? `<mj-text align="center" font-size="22px" font-weight="800" color="#0f172a" padding="4px 0 0">${txt(
							config.invoiceNumber,
						)}</mj-text>`
					: ""
			}</mj-column></mj-section>`;
			const addressBlock = `<mj-section background-color="#ffffff" padding="6px 24px"><mj-column width="50%"><mj-text align="left" font-size="11px" font-weight="700" color="#94a3b8" letter-spacing="1px" text-transform="uppercase" padding="0">From</mj-text><mj-text align="left" font-size="13px" color="#334155" line-height="1.55" padding="4px 0 0">${multi(
				config.billFrom,
			)}</mj-text></mj-column><mj-column width="50%"><mj-text align="left" font-size="11px" font-weight="700" color="#94a3b8" letter-spacing="1px" text-transform="uppercase" padding="0">To</mj-text><mj-text align="left" font-size="13px" color="#334155" line-height="1.55" padding="4px 0 0">${multi(
				config.billTo,
			)}</mj-text></mj-column></mj-section>`;
			const metaRow = `<mj-section background-color="#ffffff" padding="4px 24px 14px"><mj-column>${
				config.date || config.dueDate
					? `<mj-text align="center" font-size="12px" color="#64748b">${
							config.date ? `Issued ${txt(config.date)}` : ""
						}${config.date && config.dueDate ? " · " : ""}${
							config.dueDate ? `Due ${txt(config.dueDate)}` : ""
						}</mj-text>`
					: ""
			}</mj-column></mj-section>`;
			const lineRows = items
				.map((item, _idx) => {
					const it = (item ?? {}) as Record<string, unknown>;
					const imageSrc = mediaUrl(it.image);
					const thumb = imageSrc
						? `<img src="${atr(imageSrc)}" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" />`
						: "";
					const desc = it.description
						? `<br/><span style="font-size:12px;color:#94a3b8;">${txt(it.description)}</span>`
						: "";
					const qty = Number(it.qty ?? 0);
					const price = Number(it.price ?? 0);
					return `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px;">${
						variant === 3 && thumb
							? thumb
							: `<span style="font-weight:700;color:#0f172a;">${txt(
									it.name,
								)}</span>`
					}${variant === 3 && desc ? desc : ""}</td><td style="padding:12px;text-align:center;font-size:13px;color:#64748b;">${qty}</td><td style="padding:12px;text-align:right;font-size:13px;color:#64748b;">$${price.toLocaleString()}</td><td style="padding:12px;text-align:right;font-size:14px;font-weight:700;color:#0f172a;">$${(
						qty * price
					).toLocaleString()}</td></tr>`;
				})
				.join("");
			const table = `<mj-table width="100%" cellpadding="0" cellspacing="0"><tr><th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Item</th><th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Qty</th><th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Price</th><th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Total</th></tr>${lineRows}${totalLine}</mj-table>`;
			const footerNote = `<mj-section background-color="#f8fafc" border-radius="0 0 16px 16px" padding="18px 24px"><mj-column><mj-text align="center" font-size="13px" color="#64748b" line-height="1.55">${multi(
				config.notes,
			)}</mj-text>${
				config.buttonLabel && config.buttonHref
					? `<mj-button align="center" href="${atr(
							config.buttonHref,
						)}" background-color="${atr(
							accentColor,
						)}" color="#ffffff" border="none" border-radius="8px" font-size="13px" font-weight="700" padding="12px 24px">${txt(
							config.buttonLabel,
						)}</mj-button>`
					: ""
			}</mj-column></mj-section>`;
			if (variant === 2) {
				// Accent-top card.
				const accentBar = `<mj-section background-color="${atr(
					accentColor,
				)}" border-radius="16px 16px 0 0" padding="10px 0"></mj-section>`;
				return `${accentBar}${headerMeta}${addressBlock}${metaRow}<mj-section background-color="#ffffff" padding="6px 24px 20px"><mj-column>${table}</mj-column></mj-section>${footerNote}`;
			}
			if (variant === 3) {
				// Product-image list style: one column of item rows with thumbnails.
				const cards = items
					.map((item) => {
						const it = (item ?? {}) as Record<string, unknown>;
						const imageSrc2 = mediaUrl(it.image);
						const thumb2 = imageSrc2
							? `<mj-image src="${atr(
									imageSrc2,
								)}" alt="" width="80px" border-radius="10px" padding="0" />`
							: "";
						const qty2 = Number(it.qty ?? 0);
						const price2 = Number(it.price ?? 0);
						return `<mj-section background-color="#ffffff" padding="12px 20px" border-bottom="1px solid #f1f5f9"><mj-column width="22%">${thumb2}</mj-column><mj-column width="78%"><mj-text align="left" font-size="14px" font-weight="700" color="#0f172a" padding="0 0 2px">${txt(
							it.name,
						)}</mj-text>${
							it.description
								? `<mj-text align="left" font-size="12px" color="#94a3b8" padding="2px 0" line-height="1.45">${multi(
										it.description,
									)}</mj-text>`
								: ""
						}<mj-text align="left" font-size="13px" color="#64748b" padding="4px 0 0">Qty ${qty2} · $${price2.toLocaleString()} each · <span style="font-weight:700;color:#0f172a;">$${(
							qty2 * price2
						).toLocaleString()}</span></mj-text></mj-column></mj-section>`;
					})
					.join("");
				return `${headerMeta}<mj-section background-color="#ffffff" border-radius="16px 16px 0 0" padding="6px 24px 0"><mj-column>${table}</mj-column></mj-section>${cards}<mj-section background-color="#ffffff" padding="14px 24px"><mj-column><mj-text align="right" font-size="14px" font-weight="700" color="#0f172a">Total: <span style="font-size:18px;color:${atr(
					accentColor,
				)};">$${total.toLocaleString()}</span></mj-text></mj-column></mj-section>${footerNote}`;
			}
			// Default clean card.
			return `${headerMeta}${addressBlock}${metaRow}<mj-section background-color="#ffffff" padding="6px 24px 20px"><mj-column>${table}</mj-column></mj-section>${footerNote}`;
		},
	},
	emailSocial: {
		type: "emailSocial",
		icon: "tabler:share",
		category: "sections",
		labelKey: "emailSocial",
		total: 3,
		previewMaxHeight: 180,
		ownSection: true,
		// Social icons live inside the footer now; keep the standalone block only
		// so older saved templates still parse and render.
		palette: false,
		defaults: {
			items: [
				{ network: "facebook", href: "https://facebook.com" },
				{ network: "twitter", href: "https://twitter.com" },
				{ network: "instagram", href: "https://instagram.com" },
			],
			align: "center",
		},
		schema: [
			{
				key: "items",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{
						key: "network",
						type: "string",
						subType: "select",
						options: [
							"facebook",
							"twitter",
							"instagram",
							"linkedin",
							"github",
							"youtube",
							"web",
						],
					},
					{ key: "href", type: "string" },
				],
			},
			{
				key: "align",
				type: "string",
				subType: "select",
				options: ["left", "center", "right"],
			},
		],
		render: (config, variant) =>
			`<mj-section background-color="#ffffff" border-radius="16px" padding="18px 20px"><mj-column>${renderSocial(
				config.items,
				{ align: str(config.align ?? "center"), variant },
			)}</mj-column></mj-section>`,
	},
	emailFooter: {
		type: "emailFooter",
		icon: "tabler:copyright",
		category: "sections",
		labelKey: "emailFooter",
		total: 3,
		previewMaxHeight: 300,
		ownSection: true,
		defaults: {
			links: [
				{ label: "Home", href: "https://example.com" },
				{ label: "About", href: "https://example.com/about" },
				{ label: "Unsubscribe", href: "https://example.com/unsubscribe" },
			],
			address: "123 Main Street, City",
			copyright: "Your Company. All rights reserved.",
			social: [
				{ network: "facebook", href: "https://facebook.com" },
				{ network: "twitter", href: "https://twitter.com" },
				{ network: "instagram", href: "https://instagram.com" },
			],
			align: "center",
		},
		schema: [
			{
				key: "links",
				type: "array",
				isTable: false,
				expand: true,
				children: EmailButtonSchema,
			},
			{
				key: "social",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{
						key: "network",
						type: "string",
						subType: "select",
						options: [
							"facebook",
							"twitter",
							"instagram",
							"linkedin",
							"github",
							"youtube",
							"web",
						],
					},
					{ key: "href", type: "string" },
				],
			},
			{ key: "address", type: "string", subType: "textarea" },
			{ key: "copyright", type: "string" },
			{
				key: "align",
				type: "string",
				subType: "select",
				options: ["left", "center", "right"],
			},
		],
		render: (config, variant) => {
			const align = str(config.align ?? "center");
			const dark = variant === 3;
			const links = Array.isArray(config.links)
				? config.links
						.map((item) => {
							const it = (item ?? {}) as Record<string, unknown>;
							if (!it.label && !it.href) return "";
							return `<a href="${atr(it.href)}" style="color:${
								dark ? "#cbd5e1" : "#64748b"
							};text-decoration:underline;">${txt(it.label)}</a>`;
						})
						.filter(Boolean)
				: [];
			const sep = dark
				? '<span style="color:#334155"> · </span>'
				: '<span style="color:#cbd5e1"> · </span>';
			const linkLine = links.length
				? `<mj-text align="${atr(align)}" font-size="13px" color="${
						dark ? "#cbd5e1" : "#64748b"
					}" padding="2px 0">${links.join(sep)}</mj-text>`
				: "";
			const address = config.address
				? `<mj-text align="${atr(align)}" font-size="12px" color="#94a3b8" padding="2px 0">${multi(
						config.address,
					)}</mj-text>`
				: "";
			const copyright = config.copyright
				? `<mj-text align="${atr(align)}" font-size="12px" color="${
						dark ? "#64748b" : "#94a3b8"
					}" padding="2px 0">${txt(config.copyright)}</mj-text>`
				: "";
			const social = renderSocial(config.social, {
				align,
				variant: dark ? 3 : 2,
				padding: "14px 0 6px",
			});
			const rule = dark
				? `<mj-divider border-color="#263449" border-width="1px" />`
				: variant === 2
					? `<mj-divider border-color="#e2e8f0" border-width="1px" />`
					: "";
			const finePrint =
				variant === 2
					? `<mj-text align="${atr(align)}" font-size="11px" color="#cbd5e1" line-height="1.5" padding="6px 0 0">You're receiving this email because you signed up on our website. If you no longer wish to hear from us, update your preferences — we'd hate to lose you.</mj-text>`
					: "";
			return `<mj-section background-color="${
				dark ? "#0f172a" : "#f8fafc"
			}" border-radius="16px" padding="22px 24px"><mj-column>${rule}${linkLine}${social}${address}${copyright}${finePrint}</mj-column></mj-section>`;
		},
	},
	emailLogos: {
		type: "emailLogos",
		icon: "tabler:news",
		category: "sections",
		labelKey: "emailLogos",
		total: 3,
		previewMaxHeight: 220,
		ownSection: true,
		defaults: {
			heading: "In partnership with",
			logos: [
				{
					src: "https://picsum.photos/seed/partner1/200/120",
					href: "",
					alt: "",
				},
				{
					src: "https://picsum.photos/seed/partner2/200/120",
					href: "",
					alt: "",
				},
				{
					src: "https://picsum.photos/seed/partner3/200/120",
					href: "",
					alt: "",
				},
			],
			logoHeight: 48,
			backgroundColor: "#ffffff",
			borderColor: "#e2e8f0",
		},
		schema: [
			{ key: "heading", type: "string" },
			{
				key: "logos",
				type: "array",
				isTable: false,
				expand: true,
				children: [
					{ key: "src", type: "table", table: "assets", accept: ["image"] },
					{ key: "href", type: "string" },
					{ key: "alt", type: "string" },
				],
			},
			{ key: "logoHeight", type: "number" },
			{ key: "backgroundColor", type: "string", subType: "color" },
			{ key: "borderColor", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const bg = atr(config.backgroundColor ?? "#ffffff");
			const border = atr(config.borderColor ?? "#e2e8f0");
			const logos = Array.isArray(config.logos) ? config.logos : [];
			const heading = config.heading
				? `<mj-text align="center" font-size="12px" font-weight="700" color="#94a3b8" letter-spacing="1px" text-transform="uppercase" padding="0 0 14px">${txt(
						config.heading,
					)}</mj-text>`
				: "";
			const logoHeight = px(config.logoHeight, 48);
			// Compact 5-up strip.
			if (variant === 2) {
				const cells = logos
					.map((item) => {
						const it = (item ?? {}) as Record<string, unknown>;
						const src = mediaUrl(it.src);
						if (!src) return "";
						const img = `<mj-image src="${atr(src)}" alt="${atr(
							it.alt,
						)}" width="90px" align="center" padding="8px" />`;
						return it.href
							? `<a href="${atr(
									it.href,
								)}" style="text-decoration:none;">${img}</a>`
							: img;
					})
					.filter(Boolean);
				if (!cells.length) return "";
				const width = Math.floor(100 / Math.min(cells.length, 5));
				return `<mj-section background-color="${bg}" border-top="1px solid ${border}" border-bottom="1px solid ${border}" padding="14px 8px"><mj-column>${heading}</mj-column></mj-section><mj-section background-color="${bg}" padding="0 12px 18px">${cells
					.map(
						(cell) =>
							`<mj-column width="${width}%" vertical-align="middle">${cell}</mj-column>`,
					)
					.join("")}</mj-section>`;
			}
			// Two large sponsor logos.
			if (variant === 3) {
				const cells = logos
					.slice(0, 2)
					.map((item) => {
						const it = (item ?? {}) as Record<string, unknown>;
						const src = mediaUrl(it.src);
						if (!src) return "";
						const img = `<mj-image src="${atr(
							src,
						)}" alt="${atr(it.alt)}" width="180px" align="center" padding="0" />`;
						return it.href
							? `<a href="${atr(
									it.href,
								)}" style="text-decoration:none;">${img}</a>`
							: img;
					})
					.filter(Boolean);
				if (!cells.length) return "";
				return `<mj-section background-color="#f8fafc" border-radius="16px" padding="28px 24px"><mj-column>${heading}</mj-column><mj-column width="50%" vertical-align="middle">${cells[0] ?? ""}</mj-column><mj-column width="50%" vertical-align="middle">${cells[1] ?? ""}</mj-column></mj-section>`;
			}
			// Default 4-up grid.
			const rows: string[] = [];
			for (let i = 0; i < logos.length; i += 4) {
				const chunk = logos.slice(i, i + 4);
				const cells = chunk
					.map((item) => {
						const it = (item ?? {}) as Record<string, unknown>;
						const src = mediaUrl(it.src);
						if (!src) return `<mj-spacer height="${logoHeight}" />`;
						const img = `<mj-image src="${atr(src)}" alt="${atr(
							it.alt,
						)}" height="${logoHeight}" align="center" padding="8px" />`;
						return it.href
							? `<a href="${atr(
									it.href,
								)}" style="text-decoration:none;">${img}</a>`
							: img;
					})
					.map((cell) => `<mj-column>${cell}</mj-column>`)
					.join("");
				rows.push(
					`<mj-section background-color="${bg}" padding="8px 12px">${chunk
						.map(
							(_, idx) =>
								`<mj-column width="${Math.floor(100 / chunk.length)}%">${
									cells.split("</mj-column>").filter(Boolean)[idx] ?? ""
								}</mj-column>`,
						)
						.join("")}</mj-section>`,
				);
			}
			return `${heading ? `<mj-section background-color="${bg}" padding="22px 20px 0"><mj-column>${heading}</mj-column></mj-section>` : ""}${rows.join(
				"",
			)}`;
		},
	},
	emailQuote: {
		type: "emailQuote",
		icon: "tabler:quote",
		category: "sections",
		labelKey: "emailQuote",
		total: 3,
		previewMaxHeight: 340,
		ownSection: true,
		defaults: {
			quote:
				'"This event completely changed how I think about our work. The speakers, the crowd, the energy — everything was perfect."',
			author: "Jordan Lee",
			role: "Creative Director, Studio Co",
			avatar: "https://picsum.photos/seed/avatar/120/120",
			theme: "light",
			accent: "#2563eb",
		},
		schema: [
			{ key: "quote", type: "string", subType: "textarea" },
			{ key: "author", type: "string" },
			{ key: "role", type: "string" },
			{ key: "avatar", type: "table", table: "assets", accept: ["image"] },
			{
				key: "theme",
				type: "string",
				subType: "select",
				options: ["light", "dark", "accent"],
			},
			{ key: "accent", type: "string", subType: "color" },
		],
		render: (config, variant) => {
			const t = theme(config, "light");
			const accentColor = accent(config);
			const avatarSrc = mediaUrl(config.avatar);
			const quote = `<mj-text align="left" font-size="22px" font-weight="600" color="${atr(
				t.text,
			)}" line-height="1.45" padding="0">${multi(config.quote)}</mj-text>`;
			const author = `<mj-text align="left" font-size="15px" font-weight="700" color="${atr(
				t.text,
			)}" padding="8px 0 0">${txt(config.author)}</mj-text>`;
			const role = `<mj-text align="left" font-size="13px" color="${atr(
				t.sub,
			)}" padding="2px 0 0">${txt(config.role)}</mj-text>`;
			const avatar = avatarSrc
				? `<mj-image src="${atr(
						avatarSrc,
					)}" alt="" width="56px" align="left" border-radius="999px" padding="0" />`
				: "";
			// Left-aligned with accent bar.
			if (variant === 3) {
				return `<mj-section background-color="${atr(
					t.bg,
				)}" border-radius="16px" padding="28px 24px"><mj-column width="6%" vertical-align="top"><mj-divider border-color="${atr(
					accentColor,
				)}" border-width="4px" padding="6px 0 0" /></mj-column><mj-column width="94%" padding="0 0 0 12px">${quote}${author}${role}</mj-column></mj-section>`;
			}
			// Centered on accent background.
			if (variant === 2) {
				return `<mj-section background-color="${atr(
					accentColor,
				)}" border-radius="16px" padding="36px 28px"><mj-column><mj-text align="center" font-size="42px" color="#ffffff" line-height="1" padding="0 0 10px">“</mj-text><mj-text align="center" font-size="20px" font-weight="600" color="#ffffff" line-height="1.5" padding="0">${multi(
					config.quote,
				)}</mj-text><mj-text align="center" font-size="14px" font-weight="700" color="#dbeafe" padding="14px 0 0">${txt(
					config.author,
				)}</mj-text><mj-text align="center" font-size="12px" color="#bfdbfe" padding="2px 0 0">${txt(
					config.role,
				)}</mj-text></mj-column></mj-section>`;
			}
			return `<mj-section background-color="${atr(
				t.bg,
			)}" border-radius="16px" padding="28px 24px"><mj-column>${quote}<mj-spacer height="14px" />${avatar}${author}${role}</mj-column></mj-section>`;
		},
	},
	emailTicket: {
		type: "emailTicket",
		icon: "tabler:ticket",
		category: "sections",
		labelKey: "emailTicket",
		total: 3,
		previewMaxHeight: 420,
		ownSection: true,
		defaults: {
			title: "Street Art Expo",
			subtitle: "Underground · Panama City",
			date: "October 14, 2026",
			time: "7:00 PM",
			location: "Urban Canvas Gallery, Graffiti Street",
			price: "$45",
			buttonLabel: "Buy tickets",
			buttonHref: "https://example.com/tickets",
			backgroundColor: "#e9e6d7",
			accent: "#E34500",
			image: "https://picsum.photos/seed/event/600/300",
		},
		schema: [
			{ key: "title", type: "string" },
			{ key: "subtitle", type: "string" },
			{ key: "date", type: "string" },
			{ key: "time", type: "string" },
			{ key: "location", type: "string" },
			{ key: "price", type: "string" },
			{ key: "buttonLabel", type: "string" },
			{ key: "buttonHref", type: "string" },
			{ key: "backgroundColor", type: "string", subType: "color" },
			{ key: "accent", type: "string", subType: "color" },
			{ key: "image", type: "table", table: "assets", accept: ["image"] },
		],
		render: (config, variant) => {
			const bg = atr(config.backgroundColor ?? "#e9e6d7");
			const accentColor = accent(config);
			const imageSrc = mediaUrl(config.image);
			const meta = [config.date, config.time, config.location]
				.filter(Boolean)
				.map((line) => txt(line))
				.join(" · ");
			const title = `<mj-text align="left" font-size="32px" font-weight="800" color="${atr(
				accentColor,
			)}" letter-spacing="-0.5px" line-height="1.1" padding="0">${txt(
				config.title,
			)}</mj-text>`;
			const subtitle = config.subtitle
				? `<mj-text align="left" font-size="15px" color="#0E0E0E" padding="4px 0 0">${txt(
						config.subtitle,
					)}</mj-text>`
				: "";
			const metaLine = meta
				? `<mj-text align="left" font-size="13px" color="#475569" line-height="1.6" padding="12px 0 0">${meta}</mj-text>`
				: "";
			const button = `<mj-button align="left" href="${atr(
				config.buttonHref,
			)}" background-color="${atr(
				accentColor,
			)}" color="#ffffff" border="none" border-radius="0px" font-size="14px" font-weight="700" letter-spacing="0.5px" padding="14px 28px" inner-padding="10px 28px">${txt(
				config.buttonLabel,
			)}</mj-button>`;
			// Dark banner.
			if (variant === 3) {
				return `<mj-section background-color="#0E0E0E" border-bottom="4px solid ${atr(
					accentColor,
				)}" padding="40px 30px"><mj-column>${title}${subtitle}${metaLine}${button}</mj-column></mj-section>`;
			}
			// Split: image left, details right.
			if (variant === 2 && imageSrc) {
				return `<mj-section background-color="${bg}" border-radius="16px" padding="0"><mj-column width="45%" padding="0"><mj-image src="${atr(
					imageSrc,
				)}" alt="" width="100%" padding="0" border-radius="16px 0 0 16px" /></mj-column><mj-column width="55%" padding="28px 24px" vertical-align="middle">${title}<mj-spacer height="8px" />${subtitle}${metaLine}<mj-spacer height="16px" />${button}</mj-column></mj-section>`;
			}
			return `<mj-section background-color="${bg}" border-radius="16px" padding="0 0 28px"><mj-column padding="0">${
				imageSrc
					? `<mj-image src="${atr(
							imageSrc,
						)}" alt="" width="100%" padding="0" border-radius="16px 16px 0 0" />`
					: ""
			}</mj-column><mj-column padding="24px 24px 0">${title}${subtitle}${metaLine}<mj-spacer height="16px" />${button}</mj-column></mj-section>`;
		},
	},
	raw: {
		type: "raw",
		icon: "tabler:code",
		category: "basic",
		labelKey: "raw",
		total: 1,
		previewMaxHeight: 120,
		defaults: { mjml: "" },
		schema: [{ key: "mjml", type: "string", subType: "textarea" }],
		palette: false,
		render: (config) => str(config.mjml),
	},
};

// Populate the palette groups in palette order.
for (const type of EMAIL_BLOCK_TYPES) {
	const def = EMAIL_BLOCKS[type];
	if (!def || def.palette === false) continue;
	const group = PALETTE_GROUPS.find((g) => g.category === def.category);
	if (group) group.blocks.push(def);
}

// Prune categories with no insertable blocks (layout once columns is hidden)
// so the drawer never renders an empty group header.
for (let i = PALETTE_GROUPS.length - 1; i >= 0; i--) {
	if (!PALETTE_GROUPS[i]?.blocks.length) PALETTE_GROUPS.splice(i, 1);
}

export function blockDefByType(type: string): EmailBlockDefinition | undefined {
	return EMAIL_BLOCKS[type as EmailBlockType];
}

export function blockType(name: string): string {
	return str(name).split("/")[0] ?? "";
}

export function blockVariant(name: string): number {
	const variant = Number(str(name).split("/")[1]);
	return Number.isInteger(variant) && variant >= 1 ? variant : 1;
}

export function blockDefByName(name: string): EmailBlockDefinition | undefined {
	return blockDefByType(blockType(name));
}

export function createBlock(type: EmailBlockType): EmailBlock {
	const def = blockDefByType(type);
	const block: EmailBlock = {
		id: createId(),
		name: `${type}/1`,
		// New blocks keep an empty config — definition defaults are merged at
		// render time only (props-with-defaults style), never written into the
		// stored config. The config panel therefore starts blank while every
		// preview still renders the block with its defaults.
		config: {},
	};
	if (def?.columns)
		block.children = Array.from({ length: def.columns }, () => []);
	return block;
}

export function createTextBlock(text: string): EmailBlock {
	const block = createBlock("text");
	block.config.text = text;
	return block;
}

export function createRawBlock(mjml: string): EmailBlock {
	const block = createBlock("raw");
	block.config.mjml = mjml;
	return block;
}

/** Deep-clone a block (new ids) while preserving its content and children. */
export function cloneBlock(block: EmailBlock): EmailBlock {
	const clone: EmailBlock = {
		id: createId(),
		name: block.name,
		config: JSON.parse(JSON.stringify(block.config)),
	};
	if (Array.isArray(block.children)) {
		clone.children = block.children.map((column) =>
			column.map((child) => cloneBlock(child)),
		);
	}
	return clone;
}

/** Blocks whose primary prop is user-visible text (variable chips target it). */
export function supportsTextProp(block: EmailBlock): boolean {
	const type = blockType(block.name);
	return type === "text" || type === "heading" || type === "button";
}

// ── Serialization (blocks → MJML) ───────────────────────────────────────────────

function modelComment(blocks: EmailBlock[]): string {
	// `--` is forbidden inside XML comments; swapping it for a JSON escape keeps
	// the marker self-terminating while staying exact through JSON.parse.
	const json = JSON.stringify({ v: 1, blocks }).replace(
		/--/g,
		"\\u002d\\u002d",
	);
	return `<!-- email-builder-model:${json} -->`;
}

export const MODEL_MARKER_TAG = "email-builder-model:";

function renderElement(block: EmailBlock): string {
	const def = blockDefByName(block.name);
	if (!def) return "";
	// Merge defaults at render time so empty-config blocks (new blocks start
	// with `config: {}`, page-builder style) still emit meaningful MJML —
	// matching what the sheet preview shows via the same merge.
	const config = { ...def.defaults, ...(block.config ?? {}) };
	return def.render(config, blockVariant(block.name));
}

/**
 * Serialize one block to MJML. Content blocks are wrapped in
 * `mj-section > mj-column` (required inside mj-body); nested blocks (inside a
 * `columns` container) are emitted as bare elements.
 */
export function serializeBlock(
	block: EmailBlock,
	opts: { nested?: boolean } = {},
): string {
	if (!block) return "";
	if (opts.nested) return renderElement(block);

	const def = blockDefByName(block.name);
	if (def?.columns) {
		const columns =
			Array.isArray(block.children) && block.children.length
				? block.children
				: Array.from({ length: def.columns }, () => []);
		const inner = columns
			.map(
				(column) =>
					`<mj-column>${column
						.map((child) => serializeBlock(child, { nested: true }))
						.join("\n")}</mj-column>`,
			)
			.join("\n");
		return `<mj-section background-color="#ffffff" padding="8px 0">${inner}</mj-section>`;
	}

	const fragment = renderElement(block);
	if (!fragment) return "";
	if (def?.ownSection) return fragment;
	// Raw fragments that already carry their own section stay untouched;
	// anything else is wrapped so it renders predictably inside mj-body.
	if (
		blockType(block.name) === "raw" &&
		/^\s*<mj-(section|wrapper|hero|raw)\b/i.test(fragment)
	)
		return fragment;

	return `<mj-section background-color="#ffffff" padding="8px 0"><mj-column>${fragment}</mj-column></mj-section>`;
}

export function buildMJML(blocks: EmailBlock[]): string {
	if (!blocks.length) return "";
	return [
		"<mjml>",
		"  <mj-head>",
		`    ${modelComment(blocks)}`,
		"    <mj-attributes>",
		`      <mj-all font-family="${FONT}" />`,
		"    </mj-attributes>",
		"  </mj-head>",
		'  <mj-body background-color="#f1f5f9">',
		...blocks.map((block) => serializeBlock(block)).filter(Boolean),
		"  </mj-body>",
		"</mjml>",
	].join("\n");
}

// ── Model extraction (marked comments → exact block tree) ──────────────────────

const MODEL_RE = /<!--\s*email-builder-model:([\s\S]*?)-->/;

/**
 * Restore the exact block tree embedded in the document, or null when the
 * document carries no (valid) model marker.
 */
export function extractModel(
	content: string | null | undefined,
): EmailBlock[] | null {
	const match = String(content ?? "").match(MODEL_RE);
	if (!match) return null;
	try {
		const payload = JSON.parse(match[1] ?? "") as {
			v?: number;
			blocks?: unknown;
		};
		if (payload?.v !== 1 || !Array.isArray(payload.blocks)) return null;
		if (
			!payload.blocks.every(
				(block) =>
					typeof block === "object" &&
					block !== null &&
					typeof (block as EmailBlock).id === "string" &&
					typeof (block as EmailBlock).name === "string",
			)
		)
			return null;
		return payload.blocks as EmailBlock[];
	} catch {
		return null;
	}
}

/** Remove the model marker (for code-view editing / search). */
export function stripModelMarker(content: string | null | undefined): string {
	return String(content ?? "").replace(MODEL_RE, "");
}

/**
 * Preferred entry point: exact block tree when the document is untouched, or a
 * best-effort parse (with raw preservation) for foreign/hand-edited documents.
 */
export function blocksFromMJML(
	content: string | null | undefined,
): EmailBlock[] {
	const source = String(content ?? "");
	let blocks = extractModel(source);
	if (blocks) {
		// The document is untouched when it differs from a rebuild (marker
		// stripped on both sides, whitespace-insensitive) only by the model
		// comment — the stripped marker leaves an empty indent line behind.
		const stripped = stripModelMarker(source).replace(/\s+/g, "");
		const rebuilt = stripModelMarker(buildMJML(blocks)).replace(/\s+/g, "");
		if (stripped !== rebuilt) blocks = null;
	}
	if (!blocks) blocks = parseMJML(stripModelMarker(source));
	normalizeTree(blocks);
	return blocks;
}

/** Ensure layout blocks always carry their column child arrays. */
function normalizeTree(blocks: EmailBlock[]): void {
	for (const block of blocks) {
		const def = blockDefByName(block.name);
		if (def?.columns && !Array.isArray(block.children)) {
			block.children = Array.from({ length: def.columns }, () => []);
		}
		if (Array.isArray(block.children)) {
			for (const column of block.children) normalizeTree(column);
		}
	}
}

// ── Parsing (MJML → blocks, best-effort fallback) ───────────────────────────────

interface XmlElement {
	name: string;
	attrs: Record<string, string>;
	children: XmlElement[];
	text: string;
}

type XmlToken =
	| { type: "open"; name: string; attrs: Record<string, string> }
	| { type: "close"; name: string }
	| { type: "selfclose"; name: string; attrs: Record<string, string> }
	| { type: "text"; value: string };

function parseAttrs(raw: string): Record<string, string> {
	const attrs: Record<string, string> = {};
	const regex = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
	for (const match of raw.matchAll(regex)) {
		const key = match[1];
		if (key) attrs[key] = match[2] ?? match[3] ?? match[4] ?? "";
	}
	return attrs;
}

function tokenizeXml(src: string): XmlToken[] {
	const regex =
		/<\s*(\/?)\s*([a-zA-Z][\w-]*)((?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))*)\s*(\/?)>/g;
	const tokens: XmlToken[] = [];
	let index = 0;
	for (const match of src.matchAll(regex)) {
		const text = src.slice(index, match.index);
		if (text) tokens.push({ type: "text", value: text });
		const closing = match[1];
		const name = match[2] ?? "";
		const attrs = parseAttrs(match[3] ?? "");
		const selfClose = match[4] ?? "";
		if (closing) tokens.push({ type: "close", name });
		else if (selfClose) tokens.push({ type: "selfclose", name, attrs });
		else tokens.push({ type: "open", name, attrs });
		index = match.index + match[0].length;
	}
	if (index < src.length)
		tokens.push({ type: "text", value: src.slice(index) });
	return tokens;
}

function buildXmlTree(tokens: XmlToken[]): XmlElement[] {
	const root: XmlElement[] = [];
	const stack: XmlElement[] = [];
	for (const token of tokens) {
		if (token.type === "open") {
			const el: XmlElement = {
				name: token.name,
				attrs: token.attrs,
				children: [],
				text: "",
			};
			const parent = stack[stack.length - 1];
			(parent ? parent.children : root).push(el);
			stack.push(el);
		} else if (token.type === "selfclose") {
			const el: XmlElement = {
				name: token.name,
				attrs: token.attrs,
				children: [],
				text: "",
			};
			const parent = stack[stack.length - 1];
			(parent ? parent.children : root).push(el);
		} else if (token.type === "close") {
			stack.pop();
		} else {
			const parent = stack[stack.length - 1];
			if (parent) parent.text += token.value;
		}
	}
	return root;
}

function serializeXmlElement(el: XmlElement): string {
	const attrs = Object.entries(el.attrs)
		.map(([key, value]) => ` ${key}="${value.replace(/"/g, "&quot;")}"`)
		.join("");
	if (!el.children.length && !el.text) return `<${el.name}${attrs} />`;
	const inner =
		el.text + el.children.map((c) => serializeXmlElement(c)).join("");
	return `<${el.name}${attrs}>${inner}</${el.name}>`;
}

function findElement(nodes: XmlElement[], name: string): XmlElement | null {
	for (const node of nodes) {
		if (node.name.toLowerCase() === name) return node;
		const found = findElement(node.children, name);
		if (found) return found;
	}
	return null;
}

function parsePx(value: string | undefined, fallback: number): number {
	if (!value) return fallback;
	const match = String(value).match(/^([\d.]+)px?$/);
	return match ? Number(match[1]) : fallback;
}

const CONTENT_TYPES: Record<string, EmailBlockType> = {
	"mj-text": "text",
	"mj-image": "image",
	"mj-video": "video",
	"mj-button": "button",
	"mj-divider": "divider",
	"mj-spacer": "spacer",
};

function contentBlockFrom(el: XmlElement): EmailBlock | null {
	const name = el.name.toLowerCase();
	if (!(name in CONTENT_TYPES)) return null;

	const id = createId();
	switch (name) {
		case "mj-text": {
			const isHeading =
				Boolean(el.attrs["font-size"]) ||
				Boolean(el.attrs["font-weight"]) ||
				Boolean(el.attrs.color);
			if (isHeading) {
				return {
					id,
					name: "heading/1",
					config: {
						text: el.text,
						size: el.attrs["font-size"] ?? "24px",
						weight: el.attrs["font-weight"] ?? "700",
						color: el.attrs.color ?? "#111827",
					},
				};
			}
			const config: Record<string, unknown> = { text: el.text };
			if (el.attrs.align) config.align = el.attrs.align;
			return { id, name: "text/1", config };
		}
		case "mj-image":
			return {
				id,
				name: "image/1",
				config: {
					src: el.attrs.src ?? "",
					alt: el.attrs.alt ?? "",
					width: el.attrs.width ?? "100%",
				},
			};
		case "mj-video":
			return {
				id,
				name: "video/1",
				config: {
					src: el.attrs.src ?? "",
					poster: el.attrs.poster ?? "",
					...(el.attrs.width ? { width: el.attrs.width } : {}),
					...(el.attrs.align ? { align: el.attrs.align } : {}),
				},
			};
		case "mj-button":
			return {
				id,
				name: "button/1",
				config: {
					text: el.text,
					href: el.attrs.href ?? "",
					backgroundColor: el.attrs["background-color"] ?? "#2563eb",
					color: el.attrs.color ?? "#ffffff",
					borderRadius: parsePx(el.attrs["border-radius"], 6),
				},
			};
		case "mj-divider":
			return {
				id,
				name: "divider/1",
				config: {
					borderColor: el.attrs["border-color"] ?? "#e2e8f0",
					borderWidth: parsePx(el.attrs["border-width"], 1),
				},
			};
		case "mj-spacer":
			return {
				id,
				name: "spacer/1",
				config: { height: parsePx(el.attrs.height, 20) },
			};
		default:
			return null;
	}
}

function mapContainer(nodes: XmlElement[]): EmailBlock[] {
	const blocks: EmailBlock[] = [];
	const rawBuffer: string[] = [];
	const flushRaw = () => {
		if (!rawBuffer.length) return;
		const raw = rawBuffer.join("\n\n").trim();
		rawBuffer.length = 0;
		if (raw) blocks.push(createRawBlock(raw));
	};

	for (const node of nodes) {
		const name = node.name.toLowerCase();
		if (name === "mj-section" || name === "mj-wrapper") {
			flushRaw();
			blocks.push(...sectionToBlocks(node));
		} else {
			const block = contentBlockFrom(node);
			if (block) {
				flushRaw();
				blocks.push(block);
			} else {
				rawBuffer.push(serializeXmlElement(node));
			}
		}
	}
	flushRaw();
	return blocks;
}

function sectionToBlocks(el: XmlElement): EmailBlock[] {
	const columns = el.children.filter(
		(child) => child.name.toLowerCase() === "mj-column",
	);
	if (columns.length > 1) {
		return [
			{
				id: createId(),
				name: "columns/1",
				config: {},
				children: columns.map((column) => mapContainer(column.children)),
			},
		];
	}
	const firstColumn = columns[0];
	if (columns.length === 1 && firstColumn)
		return mapContainer(firstColumn.children);
	return mapContainer(el.children);
}

/**
 * Convert an MJML document into a block tree. Unrecognized or malformed
 * content is retained verbatim as `raw` blocks so saving never loses data.
 */
export function parseMJML(content: string | null | undefined): EmailBlock[] {
	const source = String(content ?? "").trim();
	if (!source) return [];

	const tokens = tokenizeXml(source);
	const tree = buildXmlTree(tokens);
	const body = findElement(tree, "mj-body");
	if (body) {
		// A document with an explicit (possibly empty) body maps to blocks;
		// an intentionally empty email should stay empty, not become raw.
		return mapContainer(body.children);
	}
	const blocks = mapContainer(tree);
	if (blocks.length) return blocks;

	// Nothing recognized (plain text, broken markup, …) — keep it as-is.
	return [createRawBlock(source)];
}

// ── Placeholder helpers (shared with the layer's Field/EmailTemplate) ──────────

export const BUILTIN_VARIABLES = [
	"@user.id",
	"@user.username",
	"@user.email",
	"@user.role",
];

/** Placeholder syntax: {{name}}, {{@data.field}}, {{@user.field.name}}, … */
export const PLACEHOLDER_PATTERN = /\{\{([@\w][\w.-]*)\}\}/g;

/** Sample values used only for the preview and test emails — never sent. */
export const SAMPLE_VALUES: Record<string, string> = {
	"@user.id": "e7b4c2f8a1d9",
	"@user.username": "karim",
	"@user.email": "karim@example.com",
	"@user.role": "1",
};

/** Legacy storage key, retained for migration/reference only; editors no longer persist it. */
export const CUSTOM_VARIABLES_KEY = "emailTemplates.customVariables";

/** Unique placeholder keys found across the given sources. */
export function collectPlaceholders(
	...sources: (string | null | undefined)[]
): string[] {
	const keys = new Set<string>();
	for (const sourceStr of sources) {
		const value = String(sourceStr ?? "");
		for (const match of value.matchAll(PLACEHOLDER_PATTERN)) {
			const key = match[1];
			if (key) keys.add(key);
		}
	}
	return [...keys];
}
