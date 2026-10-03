<template>
	<NLayout position="absolute" sider-placement="right" has-sider>
		<NLayoutSider v-model:collapsed="isMenuCollapsed" collapse-mode="transform" class="EditorDrawer"
			:collapsed-width="0" :width="340" show-trigger="arrow-circle" bordered>
			<NCard style="height: 100%;" :bordered="false">
				<NFlex v-if="!isTranslationMode && modelValue.content && currentElementIndex !== undefined && !modelValue.content?.[currentElementIndex]?.name" vertical :size="8" class="blocks-panel">
					<NText strong>{{ t('blocks') }}</NText>
					<NText depth="3">{{ t('blocksHint') }}</NText>
					<NRadioGroup v-model:value="blockInsertMode" size="small">
						<NSpace>
							<NRadio value="reference">{{ t('blocksLinkLive') }}</NRadio>
							<NRadio value="copy">{{ t('blocksCopyStatic') }}</NRadio>
						</NSpace>
					</NRadioGroup>
					<NEmpty v-if="!blocks.length && !blocksLoading" size="small"
						:description="t('noBlocks')" />
					<div v-else class="blocks-list">
						<div v-for="block in blocks" :key="block.id"
							class="block-item previewBox" @click="insertBlock(block)">
							<LazyPreview class="previewBox">
								<div class="contents">
									<LazyBlock :model-value="block" />
								</div>
							</LazyPreview>
							<NText depth="3">{{ block.name }}</NText>
						</div>
					</div>
				</NFlex>
				<NDivider v-if="!isTranslationMode && modelValue.content && currentElementIndex !== undefined && !modelValue.content?.[currentElementIndex]?.name" class="blocks-divider" />
				<NFlex vertical v-if="modelValue.content && currentElementIndex !== undefined">
					<NAlert v-if="isTranslationMode && modelValue.content[currentElementIndex].id" type="info" :show-icon="true" class="shared-block-notice">
						{{ t('translation.sharedBlockNotice') }}
					</NAlert>
					<NCollapse v-model:expanded-names="expandedNames" accordion :trigger-areas="['main', 'arrow']"
						displayDirective="show">
						<template v-if="modelValue.content[currentElementIndex].name">
							<NCollapseItem v-if="!isTranslationMode" :title="t('style')" name="style">
								<template #header-extra>
									<PreviewDropdown />
								</template>
								<NGrid :x-gap="12" :y-gap="12" :cols="selectedDevice === 'desktop' ? 1 : 2">
									<NGridItem
										v-for="(_, index) in Array(blockTypes[modelValue.content[currentElementIndex].name.split('/')[0] as Blocks]?.total ?? 0)"
										:key="index"
										@click="updateBlock(modelValue.content[currentElementIndex].name, index + 1)">
										<LazyPreview class="previewBox"
											:style="getPreviewStyle(modelValue.content[currentElementIndex].name, index + 1)">
											<div class="contents">
												<LazyBlock
													:model-value="getRenderModel(modelValue.content[currentElementIndex].name, index + 1)" />
											</div>
										</LazyPreview>
									</NGridItem>
								</NGrid>
							</NCollapseItem>
							<NCollapseItem :title="t('config')" name="config">
								<template #header-extra>
									<NButton v-if="isTranslationMode" size="tiny" secondary
										@click.stop="resetSelectedBlockToCanonical">
										{{ t('translation.resetFields') }}
									</NButton>
									<NPopover v-else>
										<template #trigger>
											<NButton round type="primary" secondary
												@click="modelValue.content[currentElementIndex].config = {}">
												<template #icon>
													<NIcon>
														<Icon name="tabler:eraser" />
													</NIcon>
												</template>
											</NButton>
										</template>
										{{ t('clear') }}
									</NPopover>
								</template>
								<div class="collapseContentPadding">
									<NText v-if="isTranslationMode" depth="3" class="config-status">
										{{ translatedBlockPaths.length ? t('translation.translatedFields', { count: translatedBlockPaths.length }) : t('translation.noFieldTranslations') }}
									</NText>
									<LazyFieldS
										v-if="isTranslationMode"
										:schema="selectedBlockConfigSchema"
										v-model="modelValue.content[currentElementIndex].config" />
									<BlockLoopConfigEditor
										v-else-if="modelValue.content[currentElementIndex].name.split('/')[0] === 'Loop'"
										v-model="modelValue.content[currentElementIndex].config" />
									<BlockFormConfigEditor
										v-else-if="modelValue.content[currentElementIndex].name.split('/')[0] === 'Form'"
										:design="parseInt(modelValue.content[currentElementIndex].name.split('/')[1], 10)"
										v-model="modelValue.content[currentElementIndex].config" />
									<BlockProductConfigEditor
										v-else-if="modelValue.content[currentElementIndex].name.split('/')[0] === 'Product'"
										:default-table="modelValue.template?.table"
										v-model="modelValue.content[currentElementIndex].config" />
									<BlockTableConfigEditor
										v-else-if="modelValue.content[currentElementIndex].name.split('/')[0] === 'Table'"
										v-model="modelValue.content[currentElementIndex].config" />
									<LazyFieldS
										v-else
										:schema="[...(blockTypes[modelValue.content[currentElementIndex].name.split('/')[0] as Blocks]?.schema ?? []), { key: 'hideOn', type: 'array', options: ['mobile', 'tablet', 'desktop'] }]"
										v-model="modelValue.content[currentElementIndex].config" />
								</div>
							</NCollapseItem>
						</template>
						<NCollapseItem v-else-if="!isTranslationMode" :title="t('type')" name="type">
							<template #header-extra>
								<PreviewDropdown />
							</template>
							<NGrid :x-gap="12" :y-gap="12" :cols="selectedDevice === 'desktop' ? 1 : 2">
								<NGridItem v-for="key in (Object.keys(blockTypes) as Blocks[])"
									@click="(modelValue.content[currentElementIndex] = { name: `${key}/1`, config: {} }, expandedNames = 'style')">
									<LazyPreview class="previewBox">
										<div class="contents">
											<LazyBlock :model-value="getRenderModel(`${key}/1`, 1)" />
										</div>
									</LazyPreview>
								</NGridItem>
							</NGrid>
						</NCollapseItem>
					</NCollapse>
				</NFlex>
				<NForm v-show="currentElementIndex === undefined" :model="modelValue" ref="formRef">
					<LazyFieldS :schema="pageSettingSchema" v-model="modelValue" />
				</NForm>
				<template v-if="isTranslationMode && currentElementIndex === undefined">
					<NAlert type="info" :show-icon="true" class="page-status-alert">
						<NFlex justify="space-between" align="center" :size="8">
							<NText depth="3">
								{{ translatedPagePaths.length ? t('translation.translatedPageFields', { paths: translatedPagePaths.join(', ') }) : t('translation.noPageTranslations') }}
							</NText>
							<NButton size="tiny" secondary @click="resetPageToCanonical">
								{{ t('translation.resetFields') }}
							</NButton>
						</NFlex>
					</NAlert>
				</template>
				<template v-if="currentElementIndex === undefined">
					<NCard v-if="!isTranslationMode && slugSegments.length" size="small" :title="t('templateSegments.title')" :bordered="false"
						class="segments-card" content-style="padding-top: 0;">
						<NAlert v-if="!modelValue.template?.table" type="warning" :show-icon="true">
							{{ t('templateSegments.tableRequired') }}
						</NAlert>
						<template v-else>
							<NFormItem v-for="segment in slugSegments" :key="segment" :label="`[${segment}]`">
								<NSelect
									:value="modelValue.template.segments?.[segment]"
									@update:value="(column) => onSegmentColumnChange(segment, column)"
									:options="segmentColumnOptions"
									:placeholder="t('templateSegments.selectColumn')" clearable filterable
									:consistent-menu-width="false" />
							</NFormItem>
							<NAlert v-if="templateIssues.length"
								:type="templateIssues.some((issue) => issue.level === 'error') ? 'error' : 'warning'"
								:show-icon="true">
								<ul class="segments-issues">
									<li v-for="issue in templateIssues" :key="`${issue.segment}-${issue.code}`">
										{{ templateIssueText(issue) }}
									</li>
								</ul>
							</NAlert>
							<NText v-else depth="3" class="segments-hint">
								{{ t('templateSegments.hint') }}
							</NText>
							<NText v-if="!segmentColumnOptions.length" depth="3" type="warning" class="segments-hint">
								{{ t('templateSegments.noColumns') }}
							</NText>
						</template>
					</NCard>
					<NAlert v-else-if="!isTranslationMode && modelValue.template?.table" type="info" :show-icon="true">
						{{ t('templateSegments.uselessBinding') }}
					</NAlert>
				</template>
				<template #header>
					<NFlex vertical :size="6">
						<NButtonGroup style="width: 100%;justify-content: center;">
							<NPopselect 
							v-if="localeOptions.length > 1"
							:value="editorLocale"
							:options="localeOptions"
							size="small"
							:disabled="!modelValue.id"
							@update:value="onEditorLocaleChange">
								<NButton type="warning" round>
									<template #icon>
										<NIcon>
											<Icon name="tabler:world" />
										</NIcon>
									</template>
									{{ editorLocale?.toUpperCase() }}
								</NButton>
							</NPopselect>
							<template v-if="modelValue.content && currentElementIndex !== undefined">
								<NPopover :delay="1500">
									<template #trigger>
										<NButton type="info" secondary round @click="currentElementIndex = undefined">
											<template #icon>
												<NIcon>
													<Icon name="tabler:settings" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('pageConfig') }}
								</NPopover>

								<NButton type="primary" secondary round @click="SaveAdd" :loading="Loading.SaveAdd">
									<template #icon>
										<NIcon>
											<Icon v-if="modelValue.id" name="tabler:device-floppy" />
											<Icon v-else name="tabler:send" />
										</NIcon>
									</template>
								</NButton>
							</template>
							<template v-else>
								<NPopover v-if="modelValue.id && table.allowedMethods?.includes('c')" :delay="1500">
									<template #trigger>
										<NButton type="warning" secondary round @click="showCloneModal = true">
											<template #icon>
												<NIcon>
													<Icon name="tabler:copy" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('duplicate') }}
								</NPopover>

								<NPopover :delay="1500">
									<template #trigger>
										<NButton type="info" secondary round disabled>
											<template #icon>
												<NIcon>
													<Icon name="tabler:settings" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('pageConfig') }}
								</NPopover>

								<NPopover :delay="1500">
									<template #trigger>
										<NButton type="primary" secondary round @click="SaveAdd" :disabled="!!modelValue.content?.length"  :loading="Loading.SaveAdd">
											<template #icon>
												<NIcon>
													<Icon name="tabler:device-floppy" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('save') }}
								</NPopover>
							</template>
						</NButtonGroup>
					</NFlex>
				</template>
			</NCard>
		</NLayoutSider>
		<NLayoutContent class="Editor" position="absolute">
			<VueDraggable v-if="modelValue.content && modelValue.content.length" class="contents" :class="{ currentlyEditing: !isMenuCollapsed }"
				v-model="modelValue.content" group="content" :itemKey="'id'" :disabled="isTranslationMode" @end="onEnd">
				<template v-for="(element,index) in modelValue.content">
					<div class="parentElement" v-if="element.name"
						:class="{ currentElement: currentElementIndex === index }"
						@click="onClickEditButton(index, $event)">
						<NButtonGroup v-if="!isTranslationMode" class="groupButtons">
								<NButton v-if="$device.isMobile" type="primary" secondary @click="onClickEditButton(index)">
									<template #icon>
										<NIcon>
											<Icon name="tabler:pencil" />
										</NIcon>
									</template>
								</NButton>
								<NDropdown v-if="modelValue.content.length > 1" :options="moveElementDropdownOptions(index)"
									@select="(value) => orderDropdownOnSelect(value, index)">
									<NButton type="info" secondary>
										<template #icon>
											<NIcon>
												<Icon name="tabler:menu-order" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown :options="addNewElementDropdownOptions"
									@select="(value) => addNewElementDropdownOnSelect(value, index)">
									<NButton type="success" secondary>
										<template #icon>
											<NIcon>
												<Icon name="tabler:plus" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown v-if="!!element.id" :options="deleteBlockDropdownOptions"
									@select="(value) => deleteBlockDropdownOnSelect(value, index)">
									<NButton type="error" secondary @click="() => deleteBlock(index)">
										<template #icon>
											<NIcon>
												<Icon name="tabler:trash" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NButton v-else type="error" secondary @click="() => deleteBlock(index)">
									<template #icon>
										<NIcon>
											<Icon name="tabler:trash" />
										</NIcon>
									</template>
								</NButton>
							</NButtonGroup>
							<LazyBlock v-model="modelValue.content[index]" />
						</div>
					</template>
			</VueDraggable>
			<div v-else style="text-align: center">
				<NPopover v-if="!isTranslationMode" placement="bottom" :delay="1500">
					<template #trigger>
						<NButton round style="width: fit-content;margin: 15px auto;" type="primary" dashed
							@click="() => (modelValue.content = [({} as Content)], currentElementIndex = 0, isMenuCollapsed = false, expandedNames = 'type')">
							<template #icon>
								<NIcon>
									<Icon name="tabler:plus" />
								</NIcon>
							</template>
						</NButton>
					</template>
					{{ t('newBlock') }}
				</NPopover>
			</div>
		</NLayoutContent>
	</NLayout>
	<LazyClonePageModal v-if="modelValue.id" :show="showCloneModal" :page="modelValue"
		@update:show="showCloneModal = $event"
		@cloned="onCloneCloned" />
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils";
import Inison from "inison";
import type { FormInst } from "naive-ui";
import { type DraggableEvent, VueDraggable } from "vue-draggable-plus";
import { Icon, NIcon } from "#components";
import {
	getTemplateSegments,
	isTemplateSegmentField,
	type TemplateSegmentIssue,
	templateSegmentFieldTypes,
	validatePageTemplate,
} from "~/composables/pageTemplate";
import {
	applyConfigOverlay,
	collectTranslatablePaths,
	diffConfigsWithReset,
	diffPageFieldsWithReset,
	flattenOverlay,
	getConfigValue,
	PAGE_TRANSLATABLE_PATHS,
	setConfigValue,
	translatableSchema,
} from "~/composables/translationOverlay";
import { useTranslationOverlay } from "~/composables/useTranslationOverlay";

const modelValue = defineModel<Page>({
	default: () => reactive({}),
});
if (modelValue.value.content)
	modelValue.value.content = modelValue.value.content.map((item) => ({
		...item,
		config: item.config
			? Array.isArray(item.config)
				? convertArrayToObject(
						item.config,
						blockTypes[item.name.split("/")[0] as Blocks]?.schema,
					)
				: item.config
			: {},
	})) as Content[];

// Dynamic page binding ("Template" pseudo-block) — stored inside content for
// persistence, but surfaced on the page model as `page.template` and kept out
// of the block list while editing.
let templateBlockId: unknown;
/**
 * A block reference may be a scalar id (blocks POST with `columns: "id"`) or a
 * block row object — always normalize to the scalar id used in URL paths.
 */
function blockRowId(value: unknown): unknown {
	if (value && typeof value === "object" && !Array.isArray(value))
		return (value as { id?: unknown }).id ?? value;
	return value;
}
/**
 * Move the "Template" pseudo-block out of the content list (so the builder
 * never renders it) and onto the page model as `page.template`.
 */
function liftTemplateBlock() {
	const content = modelValue.value.content;
	if (!content) return;
	const templateBlockIndex = content.findIndex(
		(item) => item.name === "Template",
	);
	if (templateBlockIndex === -1) return;
	const templateBlock = content[templateBlockIndex];
	templateBlockId = blockRowId(templateBlock.id);
	modelValue.value.template = {
		...((templateBlock.config as PageTemplate) ?? {}),
	};
	content.splice(templateBlockIndex, 1);
}
liftTemplateBlock();
let originalModelValue: Page = JSON.parse(JSON.stringify(modelValue.value));

// ── Translation mode ─────────────────────────────────────────────────────────
// The builder self-normalizes: it always loads the canonical page (primary
// language) as the source of truth, then overlays the active locale's
// translations (page slug/SEO + block config text) for display. Saving in a
// non-primary locale writes translation records only — canonical page/block
// rows are never overwritten.
const siteLanguages = computed<LanguagesType[]>(() =>
	[
		database.value?.primaryLanguage,
		...(database.value?.secondaryLanguages ?? []),
	].filter((lang): lang is LanguagesType => Boolean(lang)),
);
const localeOptions = computed(() =>
	siteLanguages.value.map((lang) => ({
		label: t(`languages.${lang}`),
		value: lang,
	})),
);
const primaryLanguage = computed<LanguagesType>(
	() => database.value?.primaryLanguage ?? "en",
);
const editorLocale = ref<LanguagesType | null>(null);
const isTranslationMode = computed(
	() =>
		Boolean(modelValue.value.id) &&
		Boolean(editorLocale.value) &&
		editorLocale.value !== primaryLanguage.value,
);
/** Canonical (default-language) page row — the baseline for editing + diffs. */
const canonicalPage = ref<Page | null>(null);
/** Active-locale page overlays: path → { id, translation }. */
const pageOverlay = ref<
	Map<string, { id: string | number; translation: string }>
>(new Map());
/** Active-locale block overlays: block id → path → { id, translation }. */
const blockOverlayMaps = ref<
	Map<string, Map<string, { id: string | number; translation: string }>>
>(new Map());

const {
	loadPageOverlays,
	loadBlockOverlays,
	savePageOverlays,
	saveBlockOverlays,
} = useTranslationOverlay();

/** Convert a stored (array) block config to the object shape the editors use. */
function normalizeBlockConfig(block?: Content): Content["config"] {
	const config = block?.config;
	if (config === undefined || config === null) return {};
	if (!Array.isArray(config)) return config as Content["config"];
	const type = String(block?.name ?? "").split("/")[0] as Blocks;
	const schema = blockTypes[type]?.schema ?? [];
	return convertArrayToObject(config, schema) as Content["config"];
}

/** Re-register the live-reference snapshots on the freshly built model. */
function registerReferenceSnapshots() {
	for (const block of modelValue.value.content ?? [])
		if (block.id) referenceSnapshots.set(block, JSON.stringify(block));
}

/**
 * Rebuild the editing model from the canonical page + the active locale's
 * overlays. Re-running `liftTemplateBlock()` keeps the dynamic-page binding
 * out of the block list, and re-registering `referenceSnapshots` keeps the
 * shared-block overwrite guard intact after the model is replaced.
 */
async function rebuildEditingModel() {
	const canonical = canonicalPage.value;
	if (!canonical) {
		liftTemplateBlock();
		originalModelValue = JSON.parse(JSON.stringify(modelValue.value));
		registerReferenceSnapshots();
		return;
	}
	const locale = editorLocale.value ?? primaryLanguage.value;
	const canonicalId = canonical.id;
	if (!canonicalId) {
		liftTemplateBlock();
		originalModelValue = JSON.parse(JSON.stringify(modelValue.value));
		registerReferenceSnapshots();
		return;
	}

	const overlay = await loadPageOverlays(canonicalId, locale);
	pageOverlay.value = overlay;
	const flat = flattenOverlay(overlay);

	// Deep clone + normalize the canonical snapshot (never mutate it).
	const base = JSON.parse(JSON.stringify(canonical)) as Page;
	base.content = base.content?.map((block) => ({
		...block,
		config: normalizeBlockConfig(block),
	}));

	let edited: Page = applyConfigOverlay(
		base as unknown as Record<string, unknown>,
		flat,
	) as Page;

	// Block-config overlays (structural config structure stays canonical).
	const blockIds = (base.content ?? [])
		.map((block) => block.id)
		.filter((id): id is string | number => Boolean(id));
	const overlays = await loadBlockOverlays(blockIds, locale);
	blockOverlayMaps.value = overlays;
	for (const block of edited.content ?? []) {
		const blockOverlay = overlays.get(String(block.id));
		if (blockOverlay?.size)
			block.config = applyConfigOverlay(
				block.config as Record<string, unknown>,
				flattenOverlay(blockOverlay),
			) as Content["config"];
	}

	modelValue.value = edited;
	liftTemplateBlock();
	originalModelValue = JSON.parse(JSON.stringify(modelValue.value));
	registerReferenceSnapshots();
	currentElementIndex.value = undefined;
}

/**
 * Canonical (default language) page load + editing-model rebuild. Always
 * fetches the page with the primary locale so a previously-overlaid route
 * model can never be mistaken for the canonical record.
 */
async function loadCanonicalAndRebuild() {
	if (!modelValue.value.id) {
		editorLocale.value = primaryLanguage.value;
		return;
	}
	try {
		const res = await $fetch<apiResponse<Page>>(
			`${config.public.apiBase}${database.value.slug}/pages/${modelValue.value.id}`,
			{
				params: {
					locale: primaryLanguage.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		canonicalPage.value = res.result ?? null;
	} catch (error) {
		console.error("[Builder] canonical page load failed", error);
		canonicalPage.value = null;
	}
	await rebuildEditingModel();
}

async function onEditorLocaleChange(locale: LanguagesType | null) {
	if (!locale || locale === editorLocale.value) return;
	editorLocale.value = locale;
	// Keep page-link previews and the rest of the app on the same locale.
	Language.value = locale;
	if (!modelValue.value.id) return;
	await rebuildEditingModel();
}

onMounted(() => {
	editorLocale.value = Language.value ?? primaryLanguage.value;
	if (modelValue.value.id) loadCanonicalAndRebuild();
});

onMounted(() => {
	document.onkeydown = (e) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key.toLowerCase() === "b" || e.key === "ب") {
				e.preventDefault();
				isMenuCollapsed.value = !isMenuCollapsed.value;
			} else if (e.key.toLowerCase() === "s" || e.key === "س") {
				e.preventDefault();
				SaveAdd();
			}
		}
	};
});

const selectedDevice = usePreviewDevice();

const expandedNames = ref("config");

function moveElementDropdownOptions(index: number) {
	return [
		{
			label: t("moveUp"),
			key: "top",
			show: index > 0,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-narrow-up" })),
		},
		{
			label: t("moveDown"),
			key: "down",
			show: index !== (modelValue.value.content?.length ?? 0) - 1,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-narrow-down" })),
		},
	];
}

const addNewElementDropdownOptions = [
	{
		label: `${t("addAbove")}`,
		key: "above",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-bar-up" })),
	},
	{
		label: `${t("addBelow")}`,
		key: "below",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-bar-down" })),
	},
];

function addNewElementDropdownOnSelect(
	value: "above" | "below",
	index: number,
) {
	const content = modelValue.value?.content;
	if (!content) return;

	const newIndex = value === "below" ? index + 1 : index;
	content.splice(newIndex, 0, {} as Content);
	currentElementIndex.value = newIndex;
	isMenuCollapsed.value = false;
	expandedNames.value = "type";
}

function orderDropdownOnSelect(value: "top" | "down", index: number) {
	const content = modelValue.value?.content;
	if (!content) return;

	const isMovingUp = value === "top" && index > 0;
	const isMovingDown = value === "down" && index < content.length - 1;

	if (isMovingUp || isMovingDown) {
		const targetIndex = isMovingUp ? index - 1 : index + 1;
		[content[index], content[targetIndex]] = [
			content[targetIndex],
			content[index],
		];

		if (currentElementIndex.value === index)
			currentElementIndex.value = targetIndex;
	}
}

const isMenuCollapsed = ref(false);
const currentElementIndex = ref<number>();

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug);
const sessionID = useScopedCookie<string>("sid", database.value?.slug);

const route = useRoute();
const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const table = useState<Table>("table");

const showCloneModal = ref(false);

function onCloneCloned(page: Page) {
	const base = `${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/pages/${page.slug}`;
	window.open(base, "_blank");
}

// Page settings. Besides slug/SEO, a page whose slug contains `[segment]` slots
// (e.g. `articles/[articleSlug]`) can be bound to a data table — it then
// renders one item of that table ("dynamic" page template).
const pageSettingSchema = computed<Schema>(() => {
	if (isTranslationMode.value) {
		// Localized slug + SEO text only — `seo.image` and the dynamic-page
		// binding stay canonical (they are inherited, never localized).
		return [
			{
				key: "slug",
				type: "string",
				required: true,
			},
			{
				key: "seo",
				type: "object",
				expand: true,
				children: [
					{
						key: "title",
						type: "string",
					},
					{
						key: "description",
						type: "string",
						subType: "textarea",
					},
				],
			},
		];
	}
	const templateTableOptions = (database.value?.tables ?? [])
		.filter(
			({ slug, show }) =>
				show !== false &&
				!["sessions", "assets", "translations", "dashboards"].includes(slug),
		)
		.map((table) => ({ label: t(table.slug), value: table.slug }));
	return [
		{
			key: "slug",
			type: "string",
			required: true,
		},
		...(modelValue.value?.slug?.includes("[") &&
		modelValue.value?.slug?.includes("]")
			? [
					{
						key: "template",
						type: "object",
						expand: true,
						children: [
							{
								key: "table",
								type: "string",
								subType: "select",
								options: templateTableOptions,
							},
						],
					},
				]
			: []),
		{
			key: "seo",
			type: "object",
			expand: true,
			children: [
				{
					key: "title",
					type: "string",
				},
				{
					key: "description",
					type: "string",
					subType: "textarea",
				},
				{
					key: "image",
					type: "table",
					table: "assets",
					accept: ["image"],
				},
			],
		},
	];
});

// Dynamic-page segment mapping. Each `[segment]` in the slug must resolve to a
// URL-safe column of the bound table (string/number/email/url/ip/date/id) —
// the value is used as the `where` filter when the page renders an item
// (e.g. `articles/[slug]` fetches the article by its `slug` column).
const slugSegments = computed<string[]>(() =>
	getTemplateSegments(modelValue.value.slug ?? ""),
);

const templateTable = computed<Table | undefined>(() =>
	(database.value?.tables ?? []).find(
		(table) => table.slug === modelValue.value.template?.table,
	),
);

const segmentColumnOptions = computed(() =>
	templateTable.value?.schema
		? flattenSchema(templateTable.value.schema)
				// Top-level URL-safe columns only — nested object paths are poor
				// URL segment keys (they resolve differently for links vs lookups).
				.filter(
					(field) => !field.key.includes(".") && isTemplateSegmentField(field),
				)
				.map((field) => ({ label: t(field.key), value: field.key }))
		: [],
);

function onSegmentColumnChange(segment: string, column: string | null) {
	let template = modelValue.value.template;
	if (!template) {
		template = {};
		modelValue.value.template = template;
	}
	template.segments = template.segments ?? {};
	if (column === null || column === undefined || column === "")
		delete (template.segments as Record<string, string>)[segment];
	else (template.segments as Record<string, string>)[segment] = column;
}

/**
 * Auto-fill segment mappings from the slug/table so a fresh dynamic page works
 * out of the box: each segment defaults to a same-named column, then `slug`,
 * then `id`. Explicit choices are kept; keys for removed segments are dropped.
 */
function autoMapSegments() {
	const template = modelValue.value.template;
	const segments = slugSegments.value;
	if (!template?.table || !segments.length) return;
	template.segments = template.segments ?? {};
	const segmentsRecord = template.segments as Record<string, string>;
	const columns = templateTable.value?.schema
		? flattenSchema(templateTable.value.schema)
		: [];
	for (const segment of segments) {
		if (segmentsRecord[segment]) continue;
		for (const key of [segment, "slug", "id"]) {
			const field = columns.find((entry) => entry.key === key);
			if (!isTemplateSegmentField(field)) continue;
			segmentsRecord[segment] = key;
			break;
		}
	}
	for (const key of Object.keys(segmentsRecord))
		if (!segments.includes(key)) delete segmentsRecord[key];
}

watch(
	[() => modelValue.value.slug, () => modelValue.value.template?.table],
	autoMapSegments,
	{ immediate: true },
);

// Reusable blocks: rows of the `blocks` table that can be inserted
// into a page as a live reference (shared) or as a static copy.
const blockInsertMode = ref<"reference" | "copy">("reference");
const blocks = ref<Content[]>([]);
const blocksLoading = ref(false);
// JSON snapshot (keyed by the page's content item object) of blocks inserted
// as live references at insert time — a plain insert must never overwrite the
// shared block, only an actual edit should write it back. Keying by the
// item (not the block id) lets the same shared block be referenced several
// times on one page without their snapshots colliding.
const referenceSnapshots = new WeakMap<Content, string>();

async function loadBlocks() {
	if (blocksLoading.value) return;
	blocksLoading.value = true;
	try {
		const data = await $fetch<apiResponse<Content[]>>(
			`${config.public.apiBase}${database.value.slug}/blocks`,
			{
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
					options: Inison.stringify({
						perPage: 100,
						sort: { createdAt: -1 },
					}),
				},
				credentials: "include",
			},
		);
		blocks.value = (data.result ?? [])
			.filter((block) => {
				const blockType = String(block.name ?? "").split("/")[0] as Blocks;
				return Object.hasOwn(blockTypes, blockType);
			})
			.map((block) => ({
				...block,
				config: convertArrayToObject(
					block.config,
					blockTypes[String(block.name).split("/")[0] as Blocks]?.schema,
				),
			}))
			.sort((a, b) => {
				const priority = (name: string) => {
					const index = ["Header", "Footer", "Cta"].findIndex((prefix) =>
						name.startsWith(prefix),
					);
					return index === -1 ? 3 : index;
				};
				return priority(String(a.name)) - priority(String(b.name));
			});
	} catch {
		// Leave the list empty; the empty state explains the gap.
	} finally {
		blocksLoading.value = false;
	}
}

// The list is identical in both modes — a block can be reused several times
// on the same page whether linked (live) or copied (static).
function insertBlock(block: Content) {
	if (!modelValue.value.content) modelValue.value.content = [];
	const content = modelValue.value.content;
	const cloned = JSON.parse(JSON.stringify(block)) as Content;
	const item: Content =
		blockInsertMode.value === "reference"
			? cloned
			: ({ name: cloned.name, config: cloned.config ?? {} } as Content);

	if (currentElementIndex.value === undefined) {
		// No element selected (empty page / page-config view): append at the end.
		content.push(item);
		currentElementIndex.value = content.length - 1;
	} else {
		content[currentElementIndex.value] = item;
	}

	if (blockInsertMode.value === "reference" && cloned.id)
		referenceSnapshots.set(cloned, JSON.stringify(cloned));
	expandedNames.value = "style";
}

loadBlocks();

// Persist the page-template binding (dynamic pages). The config lives in a
// "Template" pseudo-block row of the `blocks` table referenced from page
// content, so it survives the strict pages-table schema on the API.
async function syncPageTemplate() {
	const template = modelValue.value.template;
	if (template?.table)
		modelValue.value.content = modelValue.value.content ?? [];
	const content = modelValue.value.content;
	if (!content) return;

	const existingIndex = content.findIndex((block) => block.name === "Template");

	if (template?.table) {
		const targetConfig: PageTemplate = {
			table: template.table,
			segments: typeof template.segments === "object" ? template.segments : {},
		};
		if (!templateBlockId) {
			const req = await $fetch<apiResponse<Content[]>>(
				`${config.public.apiBase}${database.value.slug}/blocks`,
				{
					method: "POST",
					body: [{ name: "Template", config: targetConfig }],
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
						options: Inison.stringify({ columns: "id" }),
					},
					credentials: "include",
				},
			);
			if (!req.result?.length) {
				window.$message.error(req.message);
				Loading.value.SaveAdd = false;
				return;
			}
			templateBlockId = blockRowId(req.result[0]);
		} else if (
			JSON.stringify(targetConfig) !==
			JSON.stringify(originalModelValue.template)
		) {
			await $fetch<apiResponse<Content[]>>(
				`${config.public.apiBase}${database.value.slug}/blocks/${String(templateBlockId)}`,
				{
					method: "PUT",
					body: { name: "Template", config: targetConfig },
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			);
		}
		const entry = {
			id: templateBlockId,
			name: "Template",
			config: targetConfig,
		};
		if (existingIndex === -1) content.push(entry as Content);
		else content[existingIndex] = entry as Content;
	} else {
		if (existingIndex !== -1) content.splice(existingIndex, 1);
		if (templateBlockId) {
			// Binding removed — clean up the stored row (best-effort).
			await $fetch<apiResponse<boolean>>(
				`${config.public.apiBase}${database.value.slug}/blocks/${String(templateBlockId)}`,
				{
					method: "DELETE",
					params: {
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			).catch(() => {});
			templateBlockId = undefined;
		}
	}
}

const formRef = ref<FormInst>();

// Validation of the dynamic-page binding before it is persisted: every
// `[segment]` in the slug must map to an existing, URL-safe column of the
// bound table. Error-level issues block publishing; warnings (e.g. a
// non-unique lookup column) are shown but do not block.
const templateIssues = computed<TemplateSegmentIssue[]>(() =>
	validatePageTemplate(
		modelValue.value.slug,
		modelValue.value.template,
		database.value?.tables ?? [],
	),
);

function templateIssueText(issue: TemplateSegmentIssue): string {
	switch (issue.code) {
		case "tableRequired":
			return t("templateSegments.tableRequired");
		case "uselessBinding":
			return t("templateSegments.uselessBinding");
		case "columnNotFound":
			return t("templateSegments.columnNotFound", {
				column: issue.column,
				table: modelValue.value.template?.table,
			});
		case "columnTypeUnsupported":
			return t("templateSegments.columnTypeUnsupported", {
				column: issue.column,
				type: issue.type,
			});
		case "columnNotUnique":
			return t("templateSegments.columnNotUnique", {
				column: issue.column,
			});
		default:
			return "";
	}
}

async function SaveAdd() {
	if (isTranslationMode.value) {
		await saveTranslationMode();
		return;
	}
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			Loading.value.SaveAdd = true;
			let saveSucceeded = false;
			modelValue.value.content = modelValue.value.content?.filter(
				(block) => block.name,
			);
			// Dynamic pages must resolve every [segment] to a valid URL-safe
			// column before they are persisted — e.g. `articles/[slug]` fetches
			// the article by its `slug` column when rendering.
			const segmentErrors = templateIssues.value.filter(
				(issue) => issue.level === "error",
			);
			if (segmentErrors.length) {
				window.$message.error(templateIssueText(segmentErrors[0]));
				Loading.value.SaveAdd = false;
				return;
			}
			// Persist the page-template binding (a "Template" pseudo-block in the
			// blocks table) before the generic block flow runs.
			await syncPageTemplate();
			const rawModelValue = toRaw<Page>(modelValue.value);

			if (rawModelValue.content?.length) {
				const existingChangedBlocks = rawModelValue.content.filter(
					(block, index) => {
						// The template binding is persisted by `syncPageTemplate`.
						if (block.name === "Template") return false;
						if (!block.id || !block.name) return false;
						// A block inserted as a live reference is only written back
						// when it was actually edited — an untouched reference must
						// never overwrite the shared block's content.
						const snapshot = referenceSnapshots.get(block);
						if (snapshot !== undefined)
							return snapshot !== JSON.stringify(block);

						const original = (
							originalModelValue.content as Content[] | undefined
						)?.[index];
						if (!original) return true;
						return JSON.stringify(block) !== JSON.stringify(original);
					},
				);
				if (existingChangedBlocks.length) {
					const existingChangedBlocksReq = await $fetch<apiResponse<Content[]>>(
						`${config.public.apiBase}${database.value.slug}/blocks`,
						{
							method: "PUT",
							body: existingChangedBlocks.map((block) => ({
								...block,
								config: convertObjectToArray(
									block.config,
									blockTypes[block.name.split("/")[0] as Blocks]?.schema,
								),
							})),
							params: {
								locale: Language.value,
								[`${database.value.slug}_sid`]: sessionID.value,
								options: Inison.stringify({ columns: "id" }),
							},
							credentials: "include",
						},
					);
					if (!existingChangedBlocksReq.result?.length) {
						window.$message.error(existingChangedBlocksReq.message);
						Loading.value.SaveAdd = false;
						return;
					}
					// The live references are now in sync with their shared source.
					for (const block of existingChangedBlocks)
						if (block.id) referenceSnapshots.set(block, JSON.stringify(block));
				}
				const newBlockIndexes = rawModelValue.content
					.map((block, idx) => (!block.id ? idx : ""))
					.filter(String) as number[];
				if (newBlockIndexes?.length) {
					const newBlockIdsReq = await $fetch<apiResponse<Content[]>>(
						`${config.public.apiBase}${database.value.slug}/blocks`,
						{
							method: "POST",
							body: rawModelValue?.content
								?.filter((block) => !block.id)
								.map((block) => ({
									...block,
									config: convertObjectToArray(
										block.config,
										blockTypes[block.name.split("/")[0] as Blocks]?.schema,
									),
								})),
							params: {
								locale: Language.value,
								[`${database.value.slug}_sid`]: sessionID.value,
								options: JSON.stringify({ columns: "id" }),
							},
							credentials: "include",
						},
					);
					if (newBlockIdsReq.result?.length)
						for (let index = 0; index < newBlockIndexes.length; index++) {
							const newBlockIndex = newBlockIndexes[index];
							rawModelValue.content[newBlockIndex] =
								newBlockIdsReq.result[index];
						}
					else {
						window.$message.error(newBlockIdsReq.message);
						Loading.value.SaveAdd = false;
						return;
					}
				}
			}
			if (
				JSON.stringify(rawModelValue.content?.map(({ id }) => id)) !==
					JSON.stringify(originalModelValue.content?.map(({ id }) => id)) ||
				rawModelValue.slug !== originalModelValue.slug ||
				JSON.stringify(rawModelValue.seo) !==
					JSON.stringify(originalModelValue.seo)
			) {
				const pageReq = await $fetch<apiResponse<Page>>(
					`${config.public.apiBase}${database.value.slug}/pages${rawModelValue.id ? `/${rawModelValue.id}` : ""}`,
					{
						method: rawModelValue.id ? "PUT" : "POST",
						body: {
							...rawModelValue,
							content: rawModelValue.content?.map((id) => id) ?? undefined,
						},
						params: {
							locale: Language.value,
							[`${database.value.slug}_sid`]: sessionID.value,
							options: rawModelValue.id
								? undefined
								: Inison.stringify({ columns: "id" }),
						},
						credentials: "include",
					},
				);
				if (!pageReq.result) {
					window.$message.error(pageReq.message);
					Loading.value.SaveAdd = false;
					return;
				}
				saveSucceeded = true;
				window.$message.success(pageReq.message || t("saveSuccess"));
				if (rawModelValue.id) {
					modelValue.value = pageReq.result;
					liftTemplateBlock();
					await loadBlocks();
					Loading.value.SaveAdd = false;
				} else {
					Loading.value.SaveAdd = false;
					return navigateTo(
						`${route.params.database ? `/${database.value.slug}` : ""}/admin/tables/pages/${rawModelValue.slug}`,
					);
				}
			}
			if (!saveSucceeded) window.$message.success(t("saveSuccess"));
			Loading.value.SaveAdd = false;
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

const deleteBlockDropdownOptions = [
	{
		label: t("deleteGlobally"),
		key: "delete",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:world-minus" })),
	},
	{
		label: t("removeFromPage"),
		key: "remove",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:trash" })),
	},
];

async function deleteBlockDropdownOnSelect(
	value: "delete" | "remove",
	index: number,
) {
	if (!modelValue.value?.content?.length) return;
	const block = modelValue.value.content[index];
	if (value === "delete") {
		if (!block.id) return;
		Loading.value.deleteBlock = true;
		const data = await $fetch<apiResponse<boolean>>(
			`${config.public.apiBase}${database.value.slug}/blocks/${block.id}`,
			{
				method: "DELETE",
				params: {
					locale: Language.value,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		if (!data.result) window.$message.error(data.message);
		else window.$message.success(data.message);
		Loading.value.deleteBlock = false;
	}
	deleteBlock(index);
}

function deleteBlock(index: number) {
	if (!modelValue.value?.content?.length) return;

	if (currentElementIndex.value !== undefined) {
		if (currentElementIndex.value === index)
			currentElementIndex.value = undefined;
		else currentElementIndex.value = currentElementIndex.value - 1;
	}
	modelValue.value.content.splice(index, 1);
}

function onClickEditButton(index: number, event?: MouseEvent) {
	if (
		event &&
		((
			event.target as HTMLElement
		).parentElement?.parentElement?.classList.contains("n-dropdown-option") ||
			(
				event.target as HTMLElement
			).parentElement?.parentElement?.classList.contains(
				"n-dropdown-option-body__prefix",
			))
	)
		return;
	if (
		modelValue.value.content?.[index] &&
		!modelValue.value.content[index].config
	)
		modelValue.value.content[index].config = {};
	currentElementIndex.value = index;
	isMenuCollapsed.value = false;
	expandedNames.value = "config";
}

const updateBlock = (name: string, style: number) => {
	if (currentElementIndex.value === undefined || !modelValue.value.content)
		return;
	modelValue.value.content[currentElementIndex.value].name =
		`${name.split("/")[0] as Blocks}/${style}`;
};

const getPreviewStyle = (name: string, style: number) => {
	if (currentElementIndex.value === undefined || !modelValue.value.content)
		return;

	const currentBlock = modelValue.value.content[currentElementIndex.value].name;
	return currentBlock === `${name.split("/")[0] as Blocks}/${style}`
		? `border-color: rgb(var(--primaryColor));`
		: "";
};

const getRenderModel = (name: string, style: number): Content => {
	if (currentElementIndex.value === undefined || !modelValue.value.content)
		return {
			name: `${name.split("/")[0] as Blocks}/${style}`,
		};

	const currentContent = modelValue.value.content[currentElementIndex.value];
	return {
		...currentContent,
		name: `${name.split("/")[0] as Blocks}/${style}`,
	};
};

// ── Translation-mode editing helpers ─────────────────────────────────────────

/** Schema used to edit the selected block's config. In translation mode only
 * visible-text leaves are editable — structural bindings (table/columns/etc.)
 * are inherited from the canonical config and only shown in previews. */
const selectedBlockConfigSchema = computed<Schema>(() => {
	const index = currentElementIndex.value;
	const block = modelValue.value.content?.[index];
	if (!block?.name) return [];
	const type = block.name.split("/")[0] as Blocks;
	const base = blockTypes[type]?.schema ?? [];
	return isTranslationMode.value
		? translatableSchema(base)
		: [
				...base,
				{
					key: "hideOn",
					type: "array",
					options: ["mobile", "tablet", "desktop"],
				},
			];
});

/** Page paths that currently have a non-empty translation in this locale. */
const translatedPagePaths = computed(() =>
	[...pageOverlay.value.entries()]
		.filter(([, entry]) => entry.translation)
		.map(([path]) => path),
);

/** Translatable paths of the selected block with a non-empty translation. */
const translatedBlockPaths = computed(() => {
	const block = modelValue.value.content?.[currentElementIndex.value ?? -1];
	if (!block?.id) return [];
	return [...(blockOverlayMaps.value.get(String(block.id))?.entries() ?? [])]
		.filter(([, entry]) => entry.translation)
		.map(([path]) => path);
});

/** Restore the page slug/SEO inputs to the canonical values so a save deletes
 * the redundant translation records (fall back to canonical). */
function resetPageToCanonical() {
	const canonical = canonicalPage.value;
	if (!canonical) return;
	for (const path of PAGE_TRANSLATABLE_PATHS)
		setConfigValue(modelValue.value, path, getConfigValue(canonical, path));
}

/** Restore the selected block's translatable text to the canonical config. */
function resetSelectedBlockToCanonical() {
	const index = currentElementIndex.value;
	const block = modelValue.value.content?.[index];
	if (!block || !canonicalPage.value) return;
	const canonicalBlock = canonicalPage.value.content?.find(
		(b) => String(b.id) === String(block.id),
	);
	const schema = translatableSchema(
		blockTypes[block.name.split("/")[0] as Blocks]?.schema,
	);
	const canonicalConfig = normalizeBlockConfig(canonicalBlock) ?? {};
	for (const path of collectTranslatablePaths(block.config, schema))
		setConfigValue(
			block.config as Record<string, unknown>,
			path,
			getConfigValue(canonicalConfig, path),
		);
}

/**
 * Persist the active locale's translation overlays only: page slug/SEO and
 * block-config text, diffed against the canonical record with field-by-field
 * fallback. Values equal to canonical (or emptied) delete the record; anything
 * else upserts a translation. The canonical page/block rows are never written.
 */
async function saveTranslationMode() {
	const locale = editorLocale.value;
	const canonical = canonicalPage.value;
	if (!locale || !modelValue.value.id || !canonical?.id) return;
	Loading.value.SaveAdd = true;
	try {
		const edited = toRaw(modelValue.value);

		const pageChanges = diffPageFieldsWithReset(
			canonical,
			edited,
			pageOverlay.value.keys(),
		);
		if (pageChanges.length) {
			// Localized slugs must stay unique within the target locale
			// (canonical slugs are already unique — only a new translated slug
			// that differs from the canonical one can collide).
			const slugChange = pageChanges.find((change) => change.path === "slug");
			if (
				slugChange?.to &&
				slugChange.to !== slugChange.from &&
				(await findSlugCollision(slugChange.to, locale, canonical.id))
			) {
				window.$message.error(
					t("translation.slugTaken", { slug: slugChange.to }),
				);
				return;
			}
			await savePageOverlays(
				canonical.id,
				locale,
				pageChanges,
				pageOverlay.value,
			);
		}

		const canonicalBlocks = new Map(
			(canonical.content ?? []).map((block) => [String(block.id), block]),
		);
		for (const block of edited.content ?? []) {
			if (!block.id) continue;
			const canonicalBlock = canonicalBlocks.get(String(block.id));
			const schema = blockTypes[block.name.split("/")[0] as Blocks]?.schema;
			const existing =
				blockOverlayMaps.value.get(String(block.id)) ?? new Map();
			// Block configs are stored as arrays; the editing model holds the
			// object form. Diff against the normalized canonical so untouched
			// fields compare equal (field-by-field fallback) instead of every
			// path looking like a new translation.
			const canonicalConfig = normalizeBlockConfig(canonicalBlock) ?? {};
			const changes = diffConfigsWithReset(
				canonicalConfig,
				block.config ?? {},
				schema,
				existing.keys(),
			);
			if (changes.length)
				await saveBlockOverlays(block.id, locale, changes, existing);
		}

		window.$message.success(t("saveSuccess"));
		// Rebuild so canonical edits made elsewhere appear + redundant records
		// (now deleted) can't linger in the editing model.
		await loadCanonicalAndRebuild();
	} finally {
		Loading.value.SaveAdd = false;
	}
}

/** Any other page whose canonical or localized slug matches, in this locale? */
async function findSlugCollision(
	slug: string,
	locale: string,
	ownPageId: string | number,
): Promise<boolean> {
	if (!database.value?.slug) return false;
	try {
		const res = await $fetch<apiResponse<Page[]>>(
			`${config.public.apiBase}${database.value.slug}/pages`,
			{
				params: {
					where: Inison.stringify({ slug }),
					locale,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		return (res.result ?? []).some(
			(page) => String(page.id) !== String(ownPageId),
		);
	} catch {
		return false;
	}
}

// `convertObjectToArray` is the auto-imported composable from
// `app/composables/`. It used to be duplicated verbatim here, which shadowed the
// import and left two copies of the positional-array serialization to keep in
// sync — the one part of this repo that silently corrupts stored data if it
// drifts.
function onEnd(evt: DraggableEvent) {
	if (
		currentElementIndex.value === undefined ||
		evt.oldIndex === undefined ||
		evt.newIndex === undefined ||
		evt.oldIndex === evt.newIndex
	)
		return;

	const { oldIndex, newIndex } = evt;
	const currentIndex = currentElementIndex.value;

	// The dragged item itself ends up at `newIndex`.
	if (oldIndex === currentIndex) {
		currentElementIndex.value = newIndex;
		return;
	}

	// Dragged item moved down: items between oldIndex+1…newIndex shift up (index--).
	if (oldIndex < newIndex) {
		if (currentIndex > oldIndex && currentIndex <= newIndex)
			currentElementIndex.value = currentIndex - 1;
	} else {
		// Dragged item moved up: items between newIndex…oldIndex-1 shift down (index++).
		if (currentIndex >= newIndex && currentIndex < oldIndex)
			currentElementIndex.value = currentIndex + 1;
	}
}
</script>

<style>
.ltr .n-layout-sider.n-layout-sider--right-placement.n-layout-sider--bordered .n-layout-toggle-button {
	left: -16px;
}

.rtl .n-layout-sider.n-layout-sider--right-placement.n-layout-sider--bordered .n-layout-toggle-button {
	right: -30px;
	transform: scaleX(-1)
}

.dark .n-layout-sider .n-layout-toggle-bar .n-layout-toggle-bar__top,
.dark .n-layout-sider .n-layout-toggle-bar .n-layout-toggle-bar__bottom {
	background: #fff;
}
</style>

<style scoped>
.rtl .Editor {
	padding-right: 64px;
}

.ltr .Editor {
	padding-left: 64px;
}

.segments-card {
	margin-top: 12px;
}

.segments-hint {
	display: block;
	font-size: 0.8125rem;
	margin-top: 4px;
}

.segments-issues {
	margin: 0;
	padding-inline-start: 1.25rem;
}

.EditorDrawer {
	z-index: 999;
	position: absolute;
	height: 100%
}

.rtl .EditorDrawer {
	left: 0;
}

.ltr .EditorDrawer {
	right: 0
}

.EditorBox {
	opacity: .8;
}

.previewBox {
	cursor: pointer;
}

.previewBox:hover {
	opacity: .6;
}

.blocks-panel {
	margin-bottom: 4px;
}

.blocks-divider {
	margin-top: 0;
	margin-bottom: 12px;
}

.blocks-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
	max-height: 320px;
	overflow-y: auto;
	min-width: 0;
}

.block-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
}

.block-item :deep(.n-text) {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.parentElement {
	cursor: pointer;
	position: relative;
}

.currentlyEditing .parentElement:hover,
.currentlyEditing .parentElement.currentElement {
	outline: 2px solid rgb(var(--primaryColor));
	outline-offset: -2px;
}

.currentlyEditing .parentElement:not(.currentElement)> :nth-child(2) * {
	opacity: .8;
}

.parentElement :deep(.n-button-group) {
	display: none;
	border-radius: 0 0 20px 20px;
	position: absolute;
	top: 2px;
	left: 50%;
	transform: translate(-50%);
	z-index: 999;
	overflow: hidden;
	box-shadow: 0 5px 5px #0000001a;

}

.parentElement :deep(.n-button-group>.n-button) {
	border-radius: 0;
}

.parentElement> :nth-child(2) *:focus {
	pointer-events: none;
}

.currentlyEditing .parentElement:hover :deep(.n-button-group) {
	display: inline-flex;
}

.groupButtons {
	background-color: #fff;
}

.dark .groupButtons {
	background-color: #404040;
}

@media only screen and (max-width: 767px) {
	.parentElement:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: rgb(var(--primaryColor));
	}

	.parentElement :deep(.n-button-group) {
		display: inline-flex;
	}
}
</style>