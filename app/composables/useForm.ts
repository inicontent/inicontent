import { flattenSchema } from "inibase/utils";

export type FormField = {
	/** column id in the linked table schema */
	field: string | number;
	/** column key used as the payload key on submit */
	key: string;
	label: string;
	required: boolean;
	/** the CMS field descriptor handed to <Field> — the column schema with the
	 * form overrides (label / required / options) merged in, so each input is
	 * rendered with its convenient type by the CMS field components. */
	renderField: Field;
};

/** Columns that should never be rendered as public form inputs. */
const UNSUBMITTABLE = new Set([
	"id",
	"createdAt",
	"createdBy",
	"updatedAt",
	"updatedBy",
]);

/** Resolve the effective field type of a CMS/DB column (same logic as Field). */
export function fieldType(field: Field): string {
	if (field.table === "assets") return "asset";
	const type = field.subType ?? field.type;
	return Array.isArray(type) ? (type[0] ?? "string") : (type as string);
}

/**
 * Whether a table column can be surfaced as a public form input.
 * Asset/password/json/html/object/role columns are excluded: they either need
 * authenticated uploads or heavy admin editors that don't suit public forms.
 */
export function isFormColumn(field: Field): boolean {
	if (UNSUBMITTABLE.has(field.key)) return false;
	if (field.key.includes(".")) return false;
	const type = fieldType(field);
	return !["asset", "password", "json", "html", "custom", "role"].includes(
		type,
	);
}

/** Detect whether a stored asset should render as a <video> instead of <img>. */
export function isVideoMedia(
	media?: { publicURL?: string } | Asset | null,
): boolean {
	const url = media?.publicURL;
	if (!url) return false;
	if ("type" in (media as Asset))
		return (media as Asset).type.startsWith("video");
	return /\.(mp4|webm|ogg|mov|m4v|ogv|avi)$/i.test(url.split("?")[0]);
}

/**
 * Detect whether a media *value* resolves to video: a single asset, a plain
 * `{ publicURL }`, a URL string, or a nested array of any of those. Used by
 * every block that renders assets (Hero, Features, Testimonials, Loop, Form,
 * Product) so an uploaded video renders as a <video> instead of an <img>.
 */
export function isVideoMediaValue(value?: unknown): boolean {
	if (Array.isArray(value)) return value.some((v) => isVideoMediaValue(v));
	if (typeof value === "string") return isVideoMedia({ publicURL: value });
	if (value && typeof value === "object") {
		const media = value as Record<string, unknown>;
		if (typeof media.publicURL === "string")
			return isVideoMedia({ publicURL: media.publicURL });
		if (typeof media.url === "string")
			return isVideoMedia({ publicURL: media.url });
	}
	return false;
}

/**
 * Composable backing the Form builder block.
 *
 * A Form links to a data table (like Loop). `config.fields` maps which columns
 * are surfaced as inputs; the CMS <Field> renderer draws each input with the
 * convenient widget for its type. `submit()` posts the collected values as a
 * new record in that table using the same endpoint/pattern as the admin Form.
 */
export function useForm(modelValue: Ref<Form>) {
	const database = useState<Database>("database");
	const runtimeConfig = useRuntimeConfig();
	const sessionID = useScopedCookie<string>("sid", database.value?.slug);
	const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);

	const tableSlug = computed(() => modelValue.value?.table);

	const selectedTable = computed(() =>
		database.value?.tables?.find((table) => table.slug === tableSlug.value),
	);

	const flatSchema = computed(() =>
		selectedTable.value?.schema
			? flattenSchema(selectedTable.value.schema)
			: [],
	);

	/** All columns eligible to be shown as inputs (for the ConfigEditor list). */
	const mentionedColumns = computed(() =>
		flatSchema.value.filter(isFormColumn),
	);

	/**
	 * Sample inputs shown in Builder previews until a data table is mapped.
	 * Each one is a CMS-friendly descriptor so the convenient per-type widget
	 * renders just like in the admin.
	 */
	const demoFields = computed<FormField[]>(() => [
		{
			field: "demo-name",
			key: "name",
			label: t("form.demoName"),
			required: true,
			renderField: {
				id: "demo-name",
				key: "name",
				label: t("form.demoName"),
				type: "text",
				required: true,
			},
		},
		{
			field: "demo-email",
			key: "email",
			label: t("form.demoEmail"),
			required: true,
			renderField: {
				id: "demo-email",
				key: "email",
				label: t("form.demoEmail"),
				type: "email",
				required: true,
			},
		},
		{
			field: "demo-subject",
			key: "subject",
			label: t("form.demoSubject"),
			required: true,
			renderField: {
				id: "demo-subject",
				key: "subject",
				label: t("form.demoSubject"),
				type: "select",
				required: true,
				options: [
					{ label: t("form.demoSubjectGeneral"), value: "general" },
					{ label: t("form.demoSubjectSupport"), value: "support" },
					{ label: t("form.demoSubjectSales"), value: "sales" },
				],
			},
		},
		{
			field: "demo-message",
			key: "message",
			label: t("form.demoMessage"),
			required: true,
			renderField: {
				id: "demo-message",
				key: "message",
				label: t("form.demoMessage"),
				type: "textarea",
				required: true,
			},
		},
		{
			field: "demo-consent",
			key: "consent",
			label: t("form.demoConsent"),
			required: true,
			renderField: {
				id: "demo-consent",
				key: "consent",
				label: t("form.demoConsent"),
				type: "boolean",
				required: true,
			},
		},
	]);

	/** Preview mode: no data table is mapped yet (demo inputs take over). */
	const demo = computed(() => !tableSlug.value);

	const formFields = computed<FormField[]>(() => {
		if (!tableSlug.value) return demoFields.value;
		return (modelValue.value?.fields ?? [])
			.map((config) => {
				if (
					config.field === undefined ||
					config.field === null ||
					config.field === ""
				)
					return undefined;
				const column = flatSchema.value.find(
					(column) => String(column.id) === String(config.field),
				);
				if (!column) return undefined;
				const label = config.label?.trim() || column.label || undefined;
				const required = !!config.required || !!column.required;
				return {
					field: column.id,
					key: column.key,
					label: label || t(column.key),
					required,
					renderField: {
						...column,
						label,
						required,
						options: config.options?.length ? config.options : column.options,
					},
				};
			})
			.filter((field): field is FormField => !!field);
	});

	const stepSize = computed(() => Math.max(1, modelValue.value?.stepSize ?? 2));
	const stepTitles = computed(() => modelValue.value?.stepTitles ?? []);
	const fieldsByStep = computed<FormField[][]>(() => {
		const steps: FormField[][] = [];
		for (
			let index = 0;
			index < formFields.value.length;
			index += stepSize.value
		)
			steps.push(formFields.value.slice(index, index + stepSize.value));
		return steps;
	});
	const stepCount = computed(() => fieldsByStep.value.length);

	const submitting = ref(false);

	/** Build the submit payload from raw values, only including mapped fields. */
	function payload(values: Record<string, any>): Record<string, unknown> {
		const result: Record<string, unknown> = {};
		for (const field of formFields.value) {
			const value = values[field.key];
			if (
				value === undefined ||
				value === null ||
				value === "" ||
				(Array.isArray(value) && !value.length)
			)
				continue;
			result[field.key] = value;
		}
		return result;
	}

	async function submit(
		values: Record<string, any>,
	): Promise<{ ok: boolean; message?: string }> {
		if (!tableSlug.value) return { ok: false };
		submitting.value = true;
		try {
			const response = await $fetch<apiResponse<Item>>(
				`${runtimeConfig.public.apiBase}${database.value.slug}/${tableSlug.value}`,
				{
					method: "POST",
					body: payload(values),
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);
			if (!response?.result?.id)
				return { ok: false, message: response?.message };
			return { ok: true, message: response.message };
		} catch (error) {
			// A flow `error` rule (or any server-side failure) returns
			// { result: null, message } with a non-2xx status, so ofetch
			// rejects with the API message tucked in `data.message` —
			// prefer it over the transport error so form validation
			// feedback surfaces to the visitor.
			const apiMessage = (error as { data?: { message?: string } })?.data
				?.message;
			return {
				ok: false,
				message:
					apiMessage || (error as Error)?.message || t("form.submitFailed"),
			};
		} finally {
			submitting.value = false;
		}
	}

	return {
		tableSlug,
		selectedTable,
		flatSchema,
		mentionedColumns,
		demo,
		formFields,
		fieldsByStep,
		stepCount,
		stepTitles,
		submitting,
		payload,
		submit,
	};
}
