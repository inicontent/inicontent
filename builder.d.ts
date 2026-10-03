// Global types for the page builder: the block config schema (`BlocksMap`),
// the per-block config shapes, and the `Page` / `Content` records they are
// stored as. Kept in its own root-level `.d.ts` (rather than in `index.d.ts`)
// so the builder's vocabulary stays separable from the CMS's.
//
// NOTE: this file must stay at the repo root — the generated tsconfig includes
// `../*.d.ts`, but NOT `../types/**`, so a file under `types/` would silently
// fall out of the program and every global below would become `any`.

declare global {
	// Mapping of blocks to their config types
	type BlocksMap = {
		Header: Header;
		Hero: Hero;
		Footer: Footer;
		Pricing: Pricing;
		Testimonials: Testimonials;
		FAQs: FAQs;
		Features: Features;
		Loop: Loop;
		Table: DataTableBlock;
		Form: Form;
		Product: Product;
		Cta: Cta;
	};

	// Extract the block type (Header, Hero) from the block string (e.g., "Header/1")
	type ExtractBlock<T extends string> = T extends `${infer C}/${number}`
		? C
		: never;

	// Block names are `keyof BlocksMap` for the built-ins, but custom blocks are
	// declared at runtime in `app/components/Block/customBlocks.ts`, so the union
	// keeps the built-in names as autocomplete suggestions while still accepting
	// any string. The `string & {}` arm is what preserves the suggestions; a bare
	// `| string` would collapse the union to `string`.
	type Blocks = keyof BlocksMap | (string & {});

	// A user- or AI-declared block type, authored in
	// `app/components/Block/customBlocks.ts` and merged into `blockTypes` at
	// build time. Unlike a built-in block there is no `.vue` component per
	// design: the design is selected by index into `templates`, and the markup is
	// a Liquid template rendered to a string.
	//
	// `schema` is the same `Schema` vocabulary the built-ins use, which is what
	// lets custom blocks reuse the generic config editor and the positional
	// array storage in the `blocks` table for free. Because that storage is
	// positional, new keys must be APPENDED to the end of the schema.
	//
	// Templates are Liquid (see `app/composables/blockTemplate.ts`). They come
	// from a repo file and are therefore trusted like a Vue component; the values
	// interpolated into them are not — those are escaped unless piped through
	// `| raw`.
	type CustomBlock = {
		/**
		 * Block name. Stored as `"<type>/<design>"`, so it must not contain `/`
		 * and must not shadow a built-in block type (the registry throws on a
		 * collision).
		 */
		type: string;
		/** Number of designs/variants. Defaults to 1. */
		total?: number;
		/** Config fields, edited with the generic schema-driven editor. */
		schema: Schema;
		/** Inline Liquid template, used when `templates` has no entry for a design. */
		template?: string;
		/** One template per design; index 0 is design 1. Takes precedence over `template`. */
		templates?: string[];
		/** Liquid template loaded via a `?raw` import by `customBlocks.ts`. */
		file?: string;
		/** CSS injected once and scoped to this block type via `data-block="<type>"`. */
		style?: string;
	};

	// A builder link value. Pages selected from the page list are stored by
	// their ID so links stay locale-independent and can be resolved to the
	// current locale's slug at render time. Custom URLs are kept as-is.
	type PageLink =
		| { type: "page"; id: string | number }
		| { type: "custom"; url: string };

	// Config stored on "dynamic" pages whose slug contains `[segment]` slots
	// (e.g. `articles/[slug]` or `articles/[category]/[slug]`). `table` is the
	// data table the page renders one item from; `segments` maps each slug
	// segment name to the table column whose value it holds. A mapped column
	// must exist in the table schema and be of a URL-safe type (string, number,
	// email, url, ip, date or id); when unmapped, a segment falls back to a
	// same-named column, then `slug`, then `id`. The builder validates these
	// before the page is created (`validatePageTemplate`).
	type PageTemplate = {
		table?: string;
		segments?: Record<string, string>;
	};

	type Button = {
		label?: string;
		link?: string | PageLink;
		design?: number;
	};

	type Heading = {
		preHeadingLink?: Button;
		preHeading?: string;
		heading?: string;
		description?: string;
		tag?: number;
		align?: "left" | "center" | "right";
	};

	type HeaderAnnouncement = {
		text?: string;
		button?: Button;
		design?: number;
	};

	type Header = {
		announcement?: HeaderAnnouncement;
		icon?: { publicURL: string } | Asset;
		logo?: { publicURL: string } | Asset;
		logoType?: string;
		menu?: (Button & { children?: Button[] })[];
		buttons?: Button[];
		account?: Button;
	};

	type Footer = Header & {
		buttons?: never;
		description?: string;
		copyright?: string;
		social?: Button[];
		newsletter?: {
			title: string;
			description?: string;
			button: string;
			placeholder: string;
		};
	};

	type Hero = Heading & {
		buttons?: Button[];
		images?: ({ publicURL: string } | Asset)[];
	};

	type Pricing = Heading & {
		currency?: string;
		items?: {
			name: string;
			price: number;
			description?: string;
			yearlyPrice?: number;
			features: string[];
			isFeatured?: boolean;
			button?: Button;
		}[];
	};

	type Testimonials = Heading & {
		items?: {
			avatar?: { publicURL: string } | Asset;
			quote: string;
			name: string;
			position?: string;
		}[];
	};

	type Features = Heading & {
		items?: {
			image?: { publicURL: string } | Asset;
			icon?: string;
			title: string;
			description?: string;
			link?: string | PageLink;
		}[];
	};

	type FAQs = Heading & {
		items?: {
			question: string;
			answer: string;
		}[];
	};

	type Loop = Heading & {
		/** Data source mode: "table" fetches from a data table, "manual" uses the demo array. */
		dataSourceMode?: "table" | "manual";
		/** slug of the linked data table */
		table?: string;
		/** field id in the linked table schema */
		imageField?: string | number;
		titleField?: string | number;
		/** small text under the title (e.g. price) */
		subtitleField?: string | number;
		descriptionField?: string | number;
		linkField?: string | number;
		/** static button label */
		label?: string;
		/**
		 * Optional page-template link: when set, every card's button points at
		 * this page and each `[segment]` in its slug is filled from the item
		 * (matching column → `slug` → `id`) instead of `linkField`.
		 */
		link?: string | PageLink;
		/** Optional per-segment column overrides for the template link. */
		linkSegments?: Record<string, string | number>;
		/** max items to fetch */
		limit?: number;
		/** Optional column shown as a small badge on each card (e.g. category/type). */
		tagsField?: string | number;
		/** Optional column shown as a secondary meta line (e.g. price, client · year). */
		metaField?: string | number;
		/**
		 * Template for an extra header line above each card's tag/title.
		 * Supports `{{columnName}}` placeholders resolved per row/item.
		 * Example: `{{price}} $` → "199 $"
		 */
		cardHeaderTemplate?: string;
		/** Show a tag filter bar between heading and cards when tags exist. */
		showTagFilter?: boolean;
		/** Logo-strip (design 4) tuning. */
		/** Color treatment applied to every logo image: none | grayscale | sepia | brand. */
		logosFilter?: string;
		/** scroll the logo strip in a marquee instead of a wrapping grid. */
		logosMarquee?: boolean;
		/** Sample cards shown in Builder previews until a data table is mapped. */
		demo?: {
			id?: string;
			image?: string;
			title?: string;
			subtitle?: string;
			tag?: string;
			meta?: string;
			description?: string;
			link?: string;
			/** Static card header for manual mode. */
			cardHeader?: string;
		}[];
		/** Runtime-only configs produced from `{{item.array[].field}}` placeholders. */
		repeatItems?: unknown[];
	};

	type TableColumnType = "text" | "textarea" | "image" | "toggle" | "tags";

	type DataTableBlock = Heading & {
		columns?: {
			/** Ascending column id — item values are keyed by it. */
			id?: number;
			label?: string;
			type?: TableColumnType;
		}[];
		/** Manual rows — one object per row with values keyed by column id. */
		items?: Record<number, unknown>[];
		emptyMessage?: string;
		/** Runtime-only configs produced from `{{item.array[].field}}` placeholders. */
		repeatItems?: unknown[];
	};

	type Form = Heading & {
		/** image or video shown as part of the section */
		media?: { publicURL: string } | Asset;
		/** slug of the data table the form submits to */
		table?: string;
		/** mapping of table columns surfaced as form inputs */
		fields?: {
			/** column id in the linked table schema */
			field?: string | number;
			/** override for the input label (defaults to the column key) */
			label?: string;
			required?: boolean;
			placeholder?: string;
			/** options for select/radio/checkbox columns */
			options?: string[];
		}[];
		submitLabel?: string;
		successMessage?: string;
		/** fields per step in the steps design */
		stepSize?: number;
		/** optional titles for each step in the steps design */
		stepTitles?: string[];
	};

	type AggregateSource = {
		/** slug of the table to aggregate rows from (e.g. a reviews table) */
		table?: string;
		/** column that references the current product — rows are filtered to it */
		productColumn?: string | number;
		/** numeric column fed into the math (unused by "count") */
		valueColumn?: string | number;
		/** math applied over the matching rows */
		aggregation?: "avg" | "sum" | "count" | "min" | "max";
	};

	type Product = Heading & {
		/** currency symbol shown before prices */
		currency?: string;
		/** slug of the product data table (defaults to the page template table) */
		table?: string;
		/** Column ids (Inison field ids) mapped to product details. */
		galleryField?: string | number;
		titleField?: string | number;
		taglineField?: string | number;
		priceField?: string | number;
		oldPriceField?: string | number;
		descriptionField?: string | number;
		ratingField?: string | number;
		reviewsField?: string | number;
		badgeField?: string | number;
		/** rating aggregated from a linked table (overrides ratingField) */
		ratingSource?: AggregateSource;
		/** review count aggregated from a linked table (overrides reviewsField) */
		reviewsSource?: AggregateSource;
		/** add-to-cart / buy button label */
		buttonLabel?: string;
		/** optional destination for the buy button */
		link?: string | PageLink;
		/** show the quantity stepper on supported designs */
		showQuantity?: boolean;
		/** static spec rows (label + value) shown on the detail layout */
		specs?: { label: string; value: string }[];
		/** sample product shown in Builder previews until a table is mapped */
		demo?: {
			/** primary + secondary images — the first image is the primary */
			gallery?: ({ publicURL: string } | Asset | string)[];
			title?: string;
			tagline?: string;
			price?: number;
			oldPrice?: number;
			description?: string;
			rating?: number;
			reviews?: number;
			badge?: string;
		};
	};

	type Cta = Heading & {
		/** up to two action buttons */
		buttons?: Button[];
		/** band background — dark (default) or light */
		theme?: "dark" | "light";
	};

	// Content type for individual blocks. The `Record` arm covers custom block
	// types, whose config shape is only known at runtime.
	type Content = Item & {
		name: string;
		config?:
			| BlocksMap[ExtractBlock<Content["block"]>]
			| Record<string, unknown>;
		hideOn?: Exclude<Devices, "none">[];
	};
	type Page = Item & {
		slug?: string;
		content?: Content[];
		seo?: {
			title: string;
			description: string;
			image: { publicURL: string } | Asset;
		};
		/** Dynamic-page binding (stored inside content as a "Template" block). */
		template?: PageTemplate;
	};
	type Devices = "desktop" | "mobile" | "tablet" | "none";
}

export type {
	AggregateSource,
	Blocks,
	BlocksMap,
	Button,
	Content,
	Cta,
	CustomBlock,
	DataTableBlock,
	Devices,
	ExtractBlock,
	FAQs,
	Features,
	Footer,
	Form,
	Header,
	HeaderAnnouncement,
	Heading,
	Hero,
	Loop,
	Page,
	PageLink,
	PageTemplate,
	Pricing,
	Product,
	TableColumnType,
	Testimonials,
};
