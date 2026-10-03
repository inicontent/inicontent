// Custom blocks are declared in `app/components/Block/customBlocks.ts` (default:
// an empty array) and merged into the registry at the bottom of this file, so
// every consumer of `blockTypes` — the builder's type picker, design picker and
// config editor, the admin blocks list, the reuse panel, `ClonePageModal`,
// `useTranslationOverlay`, and the renderer — picks them up without knowing they
// exist.
//
// The import goes through `#inicontent/custom-blocks` rather than a relative path
// so `modules/custom-blocks.ts` can redirect it to a layer consumer's own copy;
// a relative import would always resolve to this layer's file.
import customBlocks from "#inicontent/custom-blocks";
import { mergeCustomBlocks } from "./customBlockRegistry";

// Builder-only link field kind rendered by `Field/PageLink` (see
// `app/components/Field/index.vue`). Deliberately not part of the shared CMS
// `Field` type union so this stays page-builder-only — cast locally.
// Exported for the Loop config editor, which embeds the same picker.
export const pageLinkField = (key: string): Schema[number] =>
	({ key, type: "string", subType: "page" }) as unknown as Schema[number];

const ButtonSchema: Schema = [
	{
		key: "label",
		type: "string",
		required: true,
	},
	pageLinkField("link"),
];

/** Data-source block for a metric computed from a linked table's rows. */
const AggregateSourceSchema: Schema = [
	{ key: "table", type: "string" },
	{ key: "productColumn", type: "string" },
	{ key: "valueColumn", type: "string" },
	{
		key: "aggregation",
		type: "string",
		subType: "select",
		options: ["avg", "sum", "count", "min", "max"],
	},
];

type BlockObject = { total: number; schema: Schema; custom?: CustomBlock };
const HeadingSchema: Schema = [
	{
		key: "preHeadingLink",
		type: "object",
		children: [
			{ key: "design", type: "number", subType: "select", options: [1, 2] },
			...ButtonSchema,
		],
	},
	{
		key: "preHeading",
		type: "string",
	},
	{
		key: "heading",
		type: "string",
	},
	{
		key: "description",
		type: "string",
		subType: "textarea",
	},
	{
		key: "tag",
		type: "string",
		subType: "select",
		options: [
			{
				label: "h1",
				value: 1,
			},
			{
				label: "h2",
				value: 2,
			},
			{
				label: "h3",
				value: 3,
			},
			{
				label: "h4",
				value: 4,
			},
			{
				label: "h5",
				value: 5,
			},
			{
				label: "h6",
				value: 6,
			},
		],
	},
	// {
	// 	key: "align",
	// 	type: "string",
	// 	subType: "select",
	// 	options: [
	// 		{
	// 			label: "left",
	// 			value: "left",
	// 		},
	// 		{
	// 			label: "center",
	// 			value: "center",
	// 		},
	// 		{
	// 			label: "right",
	// 			value: "right",
	// 		},
	// 	],
	// },
];

const Header: BlockObject = {
	total: 1,
	schema: [
		{
			key: "announcement",
			type: "object",
			expand: true,
			children: [
				{
					key: "design",
					type: "number",
					subType: "select",
					options: [1, 2, 3],
				},
				{
					key: "text",
					type: "string",
				},
				{
					key: "button",
					type: "object",
					expand: true,
					children: ButtonSchema,
				},
			],
		},
		{
			key: "icon",
			type: "table",
			table: "assets",
			accept: ["image"],
		},
		{
			key: "logo",
			type: "table",
			table: "assets",
			accept: ["image"],
		},
		{
			key: "logoType",
			type: "string",
		},
		{
			key: "menu",
			type: "array",
			isTable: false,
			expand: true,
			children: ButtonSchema,
		},
		{
			key: "buttons",
			type: "array",
			isTable: false,
			expand: true,
			children: ButtonSchema,
		},
		{
			key: "account",
			type: "object",
			expand: true,
			children: ButtonSchema,
		},
	],
};
const Footer: BlockObject = {
	total: 1,
	schema: [
		{
			key: "icon",
			type: "table",
			table: "assets",
			accept: ["image"],
		},
		{
			key: "logo",
			type: "table",
			table: "assets",
			accept: ["image"],
		},
		{
			key: "logoType",
			type: "string",
		},
		{
			key: "description",
			type: "string",
			subType: "textarea",
		},
		{
			key: "menu",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				...ButtonSchema,
				{
					key: "children",
					type: "array",
					isTable: false,
					expand: true,
					children: ButtonSchema,
				},
			],
		},
		{
			key: "newsletter",
			type: "object",
			children: [
				{
					key: "title",
					type: "string",
					required: true,
				},
				{
					key: "description",
					type: "string",
				},
				{
					key: "button",
					type: "string",
					required: true,
				},
				{
					key: "placeholder",
					type: "string",
					required: true,
				},
			],
		},
		{
			key: "copyright",
			type: "string",
		},
		{
			key: "social",
			type: "array",
			isTable: false,
			expand: true,
			children: ButtonSchema,
		},
	],
};
const Hero: BlockObject = {
	total: 4,
	schema: [
		...HeadingSchema,
		{
			key: "buttons",
			type: "array",
			isTable: false,
			expand: true,
			children: ButtonSchema,
		},
		{
			key: "images",
			type: "array",
			children: "table",
			table: "assets",
			accept: ["image", "video"],
		},
	],
};
const Pricing: BlockObject = {
	total: 1,
	schema: [
		...HeadingSchema,
		{
			key: "currency",
			type: "string",
		},
		{
			key: "items",
			// `items` collides with the CMS pluralization namespace
			// (`t("items", { count })`) — label via a dedicated key.
			labelKey: "itemsLabel",
			type: "array",
			required: true,
			isTable: false,
			expand: true,
			children: [
				{
					key: "name",
					type: "string",
					required: true,
				},
				{
					key: "description",
					type: "string",
					subType: "textarea",
				},
				{
					key: "price",
					type: "number",
					required: true,
				},
				{
					key: "yearlyPrice",
					type: "number",
				},
				{
					key: "features",
					type: "array",
					children: "string",
				},
				{
					key: "isFeatured",
					type: "boolean",
				},
				{
					key: "button",
					type: "object",
					expand: true,
					children: ButtonSchema,
				},
			],
		},
	],
};
const Testimonials: BlockObject = {
	total: 2,
	schema: [
		...HeadingSchema,
		{
			key: "items",
			// `items` collides with the CMS pluralization namespace
			// (`t("items", { count })`) — label via a dedicated key.
			labelKey: "itemsLabel",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{
					key: "logo",
					type: "table",
					table: "assets",
					accept: ["image", "video"],
				},
				{
					key: "quote",
					type: "string",
					subType: "textarea",
					required: true,
				},
				{
					key: "name",
					type: "string",
					required: true,
				},
				{
					key: "position",
					type: "string",
				},
			],
		},
	],
};
const FAQs: BlockObject = {
	total: 3,
	schema: [
		...HeadingSchema,
		{
			key: "items",
			// `items` collides with the CMS pluralization namespace
			// (`t("items", { count })`) — label via a dedicated key.
			labelKey: "itemsLabel",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{
					key: "question",
					type: "string",
					required: true,
				},
				{
					key: "answer",
					type: "string",
					subType: "textarea",
					required: true,
				},
			],
		},
	],
};
const Features: BlockObject = {
	total: 5,
	schema: [
		...HeadingSchema,
		{
			key: "items",
			// `items` collides with the CMS pluralization namespace
			// (`t("items", { count })`) — label via a dedicated key.
			labelKey: "itemsLabel",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{
					key: "image",
					type: "table",
					table: "assets",
					accept: ["image", "video"],
				},
				{
					key: "icon",
					type: "string",
					subType: "icon",
				},
				{
					key: "title",
					type: "string",
					required: true,
				},
				{
					key: "description",
					type: "string",
					subType: "textarea",
				},
				pageLinkField("link"),
			],
		},
	],
};
const Loop: BlockObject = {
	total: 3,
	schema: [
		...HeadingSchema,
		{ key: "table", type: "string" },
		// Field ids can be numeric or string (Inison ids) — "string" keeps the
		// scalar intact through the array round-trip in both directions.
		{ key: "imageField", type: "string" },
		{ key: "titleField", type: "string" },
		{ key: "subtitleField", type: "string" },
		{ key: "descriptionField", type: "string" },
		{ key: "linkField", type: "string" },
		{ key: "label", type: "string" },
		// Appended at the end so older stored configs (positional arrays) stay
		// aligned; new fields read back as unset safely.
		{ key: "limit", type: "number" },
		pageLinkField("link"),
		// Optional per-segment column overrides for the template link; kept in
		// the schema so it survives the array round-trip, edited via the Loop
		// config editor (defaults: matching column → slug → id).
		{ key: "linkSegments", type: "json" },
		// Optional card metadata — a badge line (category/type) and a secondary
		// meta line (price, client · year, capacity…). Appended last so stored
		// positional configs stay aligned.
		{ key: "tagsField", type: "string" },
		{ key: "metaField", type: "string" },
		// Logo-strip design (4) options — a color treatment applied to every
		// logo and an optional marquee scroll. Appended last so stored
		// positional configs stay aligned.
		{
			key: "logosFilter",
			type: "string",
			subType: "select",
			options: ["none", "grayscale", "sepia", "brand"],
		},
		{ key: "logosMarquee", type: "boolean" },
		// Data-source mode toggle (table vs manual) and card header template.
		// Appended last so stored positional configs stay aligned.
		{
			key: "dataSourceMode",
			type: "string",
			subType: "select",
			options: ["table", "manual"],
		},
		{ key: "cardHeaderTemplate", type: "string" },
		{ key: "demo", type: "json" },
		{ key: "showTagFilter", type: "boolean" },
	],
};
const Table: BlockObject = {
	total: 1,
	schema: [
		...HeadingSchema,
		{
			key: "columns",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{ key: "id", type: "number" },
				{ key: "label", type: "string" },
				{
					key: "type",
					type: "string",
					subType: "select",
					options: ["text", "textarea", "image", "toggle", "tags"],
				},
			],
		},
		// Rows are keyed by column id and edited with per-type widgets — keep
		// the whole list as one JSON value so it survives the array round-trip.
		{
			key: "items",
			// `items` collides with the CMS pluralization namespace
			// (`t("items", { count })`) — label via a dedicated key.
			labelKey: "itemsLabel",
			type: "json",
		},
		{ key: "emptyMessage", type: "string" },
	],
};
const Form: BlockObject = {
	total: 3,
	schema: [
		...HeadingSchema,
		{
			key: "media",
			type: "table",
			table: "assets",
			accept: ["image", "video"],
		},
		{ key: "table", type: "string" },
		{
			key: "fields",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{ key: "field", type: "string" },
				{ key: "label", type: "string" },
				{ key: "required", type: "boolean" },
				{ key: "placeholder", type: "string" },
				{ key: "options", type: "array", children: "string" },
			],
		},
		{ key: "submitLabel", type: "string" },
		{ key: "successMessage", type: "string", subType: "textarea" },
		{ key: "stepSize", type: "number" },
		{ key: "stepTitles", type: "array", children: "string" },
	],
};
const Product: BlockObject = {
	total: 3,
	schema: [
		...HeadingSchema,
		{
			key: "currency",
			type: "string",
		},
		{
			key: "table",
			type: "string",
		},
		// Field ids can be numeric or string (Inison ids) — "string" keeps the
		// scalar intact through the array round-trip in both directions.
		{ key: "galleryField", type: "string" },
		{ key: "titleField", type: "string" },
		{ key: "taglineField", type: "string" },
		{ key: "priceField", type: "string" },
		{ key: "oldPriceField", type: "string" },
		{ key: "descriptionField", type: "string" },
		{ key: "ratingField", type: "string" },
		{ key: "reviewsField", type: "string" },
		{
			key: "ratingSource",
			type: "object",
			expand: true,
			children: AggregateSourceSchema,
		},
		{
			key: "reviewsSource",
			type: "object",
			expand: true,
			children: AggregateSourceSchema,
		},
		{ key: "badgeField", type: "string" },
		{
			key: "buttonLabel",
			type: "string",
		},
		pageLinkField("link"),
		{
			key: "showQuantity",
			type: "boolean",
		},
		{
			key: "specs",
			type: "array",
			isTable: false,
			expand: true,
			children: [
				{
					key: "label",
					type: "string",
					required: true,
				},
				{
					key: "value",
					type: "string",
					required: true,
				},
			],
		},
		// Sample product shown in Builder previews until a table is mapped.
		{
			key: "demo",
			type: "object",
			expand: true,
			children: [
				{
					key: "gallery",
					type: "array",
					table: "assets",
					accept: ["image", "video"],
				},
				{ key: "title", type: "string" },
				{ key: "tagline", type: "string" },
				{ key: "price", type: "number" },
				{ key: "oldPrice", type: "number" },
				{ key: "description", type: "string", subType: "textarea" },
				{ key: "rating", type: "number" },
				{ key: "reviews", type: "number" },
				{ key: "badge", type: "string" },
			],
		},
	],
};
const Cta: BlockObject = {
	total: 2,
	schema: [
		...HeadingSchema,
		{
			key: "buttons",
			type: "array",
			isTable: false,
			expand: true,
			children: ButtonSchema,
		},
		{
			key: "theme",
			type: "string",
			subType: "select",
			options: ["dark", "light"],
		},
	],
};
// `Record<string, BlockObject>` rather than `Record<Blocks, …>`: a custom block
// type is a plain string chosen by the author, so it can't be a key of the
// compile-time `BlocksMap`. Widening `Blocks` keeps autocomplete for the
// built-ins, but a `satisfies` check against it can no longer prove this object
// has an entry per known block — so the built-in set is asserted separately.
export default mergeCustomBlocks(
	{
		Header,
		Footer,
		Hero,
		Pricing,
		Testimonials,
		FAQs,
		Features,
		Loop,
		Table,
		Form,
		Product,
		Cta,
	} satisfies Record<string, BlockObject>,
	customBlocks,
);
