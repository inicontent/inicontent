<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NSelect v-model:value="selectedValue" :options="options" :loading="loading"
			:placeholder="t(field.key)" filterable tag clearable :consistent-menu-width="false"
			@update:show="(show) => show && refresh()" v-bind="field.inputProps
				? typeof field.inputProps === 'function'
					? field.inputProps(modelValue) ?? {}
					: field.inputProps
				: {}" />
		<p v-if="selectedTemplateExample" class="page-link-template-hint">
			{{ t("pageLink.dynamicHint") }}
			<code>{{ selectedTemplateExample }}</code>
		</p>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui";

const { field } = defineProps<{ field: Field }>();
const modelValue = defineModel<string | PageLink>();

const { pages, loading, refresh } = usePageLinks();

// Every page of the current database becomes a selectable option; free-typing
// (tag) lets the user enter a custom URL instead. Dynamic template pages are
// labelled so their `[segment]` slots are recognisable.
const options = computed(() =>
	pages.value.map((page) => {
		const slug = String(page.slug ?? "");
		const isTemplate = slug.includes("[");
		return {
			label: isTemplate
				? `${page.name || slug || String(page.id)} · ${slug}`
				: page.name || slug || String(page.id),
			value: String(page.id),
		};
	}),
);

// Display a picked page by its label (id → label via options), and custom
// URLs/legacy strings as the raw value.
const selectedValue = computed<string | null>({
	get() {
		const value = modelValue.value;
		if (value === undefined || value === null) return null;
		if (typeof value === "string") return value;
		return value.type === "page" ? String(value.id) : (value.url ?? null);
	},
	set(value: string | null) {
		if (value === null || value === undefined || value === "") {
			modelValue.value = undefined;
			return;
		}
		const page = pages.value.find((p) => String(p.id) === value);
		modelValue.value = page
			? { type: "page", id: page.id as string | number }
			: { type: "custom", url: value };
	},
});

// When a dynamic template page was picked, surface which `[segment]` slots it
// has — they are filled from the item's data when rendering.
const selectedTemplateExample = computed<string | undefined>(() => {
	const value = modelValue.value;
	if (!value || typeof value === "string" || value.type !== "page")
		return undefined;
	const slug = pages.value.find((p) => String(p.id) === String(value.id))?.slug;
	const segments = String(slug ?? "").match(/\[[^\]]+\]/g);
	return segments?.length ? segments.join(" ") : undefined;
});

const rule: FormItemRule = {
	trigger: "change",
	type: "any",
	required: field.required,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};
</script>

<style scoped>
.page-link-template-hint {
	margin: 0.25rem 0 0;
	font-size: 0.75rem;
	color: rgba(128, 128, 128, 0.9);
}
.page-link-template-hint code {
	background: rgba(128, 128, 128, 0.15);
	border-radius: 0.25rem;
	padding: 0 0.25rem;
}
</style>