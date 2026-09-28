<template>
	<NModal
		v-model:show="visible"
		preset="card"
		:title="t('clonePage')"
		style="max-width: 520px"
		@after-leave="reset"
	>
		<NFlex vertical :size="16">
			<NText>{{ t('clonePageHint') }}</NText>
			<NEmpty v-if="!options.length" size="small" />
			<NFlex v-else vertical :size="8">
				<NFlex
					v-for="option in options"
					:key="option.index"
					justify="space-between"
					align="center"
					:size="8"
				>
					<NCheckbox v-model:checked="option.include">
						{{ option.name }}
					</NCheckbox>
					<NSelect
						v-model:value="option.mode"
						:options="modeOptions"
						:disabled="!option.include"
						size="small"
						style="width: 170px;"
					/>
				</NFlex>
			</NFlex>
			<NFlex justify="end" :size="8">
				<NButton @click="visible = false" :disabled="saving">
					{{ t('cancel') }}
				</NButton>
				<NButton
					type="primary"
					@click="onConfirm"
					:loading="saving"
					:disabled="saving"
				>
					{{ t('duplicate') }}
				</NButton>
			</NFlex>
		</NFlex>
	</NModal>
</template>

<script setup lang="ts">
import {
	NButton,
	NCheckbox,
	NEmpty,
	NFlex,
	NModal,
	NSelect,
	NText,
} from "#components";

const props = defineProps<{
	page: Page;
}>();

const emit = defineEmits<{
	cloned: [page: Page & { slug: string }];
}>();

const visible = defineModel<boolean>("show", { default: false });

const config = useRuntimeConfig();
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const saving = ref(false);

type CloneMode = "static" | "live";

interface ComponentOption {
	/** Index of the block inside `props.page.content`. */
	index: number;
	name: string;
	include: boolean;
	mode: CloneMode;
}

/** Only the components present on the current page — nothing else. */
const options = ref<ComponentOption[]>([]);

const modeOptions = computed(() => [
	{ label: t("blocksCopyStatic"), value: "static" },
	{ label: t("blocksLinkLive"), value: "live" },
]);

function buildOptions() {
	const source = props.page.content ?? [];
	options.value = source
		.map((block, index) => ({ index, block }))
		.filter(({ block }) => block.name && block.name !== "Template")
		.map(({ index, block }) => ({
			index,
			name: String(block.name),
			// Clone the component by default; static copy by default.
			include: true,
			mode: block.name.startsWith("Header") || block.name.startsWith("Footer") || block.name.startsWith("Cta") ? "live" as CloneMode : "static" as CloneMode,
		}));
}

watch(
	visible,
	(open) => {
		if (open) buildOptions();
	},
	{ immediate: true },
);

function reset() {
	options.value = [];
}

/**
 * The `blocks` table stores configs in serialized array form. A block row can
 * arrive with either representation: array form straight from the API, or
 * object form after the Builder/renderers normalized it. Normalize to array
 * form before persisting a fresh copy, exactly like the Builder's SaveAdd.
 */
function serializeConfig(block: Content): Content["config"] {
	const config = block.config;
	if (!config || Array.isArray(config)) return config;
	const schema = blockTypes[String(block.name).split("/")[0] as Blocks]?.schema;
	return convertObjectToArray(config, schema) as Content["config"];
}

/** Insert a fully independent copy of `block` and return the fresh row. */
async function postBlockCopy(block: Content): Promise<Content | null> {
	if (!database.value?.slug) return null;
	const dbSlug = database.value.slug;
	const { id: _id, ...rest } = block;
	const req = await $fetch<apiResponse<Content[]>>(
		`${config.public.apiBase}${dbSlug}/blocks`,
		{
			method: "POST",
			body: [{ ...rest, config: serializeConfig(block) }],
			params: {
				locale: Language.value,
				[`${dbSlug}_sid`]: sessionID.value,
				options: JSON.stringify({ columns: "id" }),
			},
			credentials: "include",
		},
	);
	return req.result?.[0] ?? null;
}

async function onConfirm() {
	if (!database.value?.slug || !props.page?.slug) return;
	saving.value = true;
	const dbSlug = database.value.slug;
	const locale = Language.value;
	const sid = sessionID.value;

	try {
		const optionByIndex = new Map(options.value.map((o) => [o.index, o]));
		const content = props.page.content ?? [];
		const newContent: Content[] = [];

		for (const [index, block] of content.entries()) {
			const blockName = String(block.name ?? "");

			// The template binding must stay intact on the clone, but it must
			// never be shared with the source page — always copy the
			// "Template" pseudo-block into its own independent row.
			if (blockName === "Template") {
				const fresh = await postBlockCopy(block);
				if (fresh) newContent.push(fresh);
				continue;
			}

			const option = optionByIndex.get(index);

			// Excluded by the user — drop the component from the clone.
			if (!option || !option.include) continue;

			if (option.mode === "live" && block.id) {
				// Live reference — keep the original block row id so the clone
				// shares the component with the source page.
				newContent.push({ ...block } as Content);
			} else {
				// Static copy — POST a fresh row.
				const fresh = await postBlockCopy(block);
				if (!fresh) {
					throw new Error(t("cloneFailed"));
				}
				newContent.push(fresh);
			}
		}

		// Resolve a unique slug.
		const existingPages = await $fetch<apiResponse<Page[]>>(
			`${config.public.apiBase}${dbSlug}/pages`,
			{
				params: {
					locale,
					[`${dbSlug}_sid`]: sid,
					options: JSON.stringify({ columns: "slug" }),
				},
				credentials: "include",
			},
		);
		const taken = new Set(
			(existingPages.result ?? []).map((p) => String(p.slug)),
		);
		let slug = `${props.page.slug}-copy`;
		let n = 2;
		while (taken.has(slug)) {
			slug = `${props.page.slug}-copy-${n++}`;
		}

		// Create the new page referencing the cloned blocks.
		const pageReq = await $fetch<apiResponse<Page>>(
			`${config.public.apiBase}${dbSlug}/pages`,
			{
				method: "POST",
				body: {
					slug,
					seo: props.page.seo ?? {},
					template: props.page.template,
					content: newContent,
				},
				params: {
					locale,
					[`${dbSlug}_sid`]: sid,
					options: JSON.stringify({ columns: "id" }),
				},
				credentials: "include",
			},
		);
		if (!pageReq.result) {
			throw new Error(pageReq.message ?? t("cloneFailed"));
		}

		window.$message.success(t("saveSuccess"));
		emit("cloned", { ...pageReq.result, slug } as Page & { slug: string });
		visible.value = false;
	} catch (err: unknown) {
		window.$message.error(
			err instanceof Error ? err.message : t("cloneFailed"),
		);
	} finally {
		saving.value = false;
	}
}
</script>