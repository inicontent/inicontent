<template>
	<NLayout position="absolute" sider-placement="right" has-sider>
		<NLayoutSider
			v-model:collapsed="isMenuCollapsed"
			collapse-mode="transform"
			class="EditorDrawer"
			:collapsed-width="0"
			:width="340"
			show-trigger="arrow-circle"
			bordered
		>
			<NCard style="height: 100%" :bordered="false">
				<!-- Element selected: type picker (placeholder) or design + settings -->
				<template v-if="selectedBlock">
					<NCollapse
						v-model:expanded-names="expandedNames"
						accordion
						:trigger-areas="['main', 'arrow']"
						displayDirective="show"
					>
						<template v-if="selectedBlock.name">
							<NCollapseItem :title="t('style')" name="style">
								<template #header-extra>
									<PreviewDropdown showHide />
								</template>
								<div v-if="(selectedDef?.total ?? 0) > 1" class="collapseContentPadding">
									<NGrid
										:x-gap="8"
										:y-gap="8"
										:cols="1"
									>
										<NGridItem
											v-for="variant in selectedDef?.total"
											:key="variant"
											class="previewBox"
											@click="setVariant(selectedBlock, variant)"
										>
											<EmailTemplatesThumbnail
												:name="`${blockType(selectedBlock.name)}/${variant}`"
												:config="selectedBlock.config"
												:max-height="selectedDef?.previewMaxHeight"
												:selected="variant === blockVariant(selectedBlock.name)"
											/>
										</NGridItem>
									</NGrid>
								</div>
							</NCollapseItem>
							<NCollapseItem :title="t('config')" name="config">
								<template #header-extra>
									<NPopover :delay="1500">
										<template #trigger>
											<NButton
												round
												type="primary"
												secondary
												@click="selectedBlock.config = {}"
											>
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
									<LazyFieldS
										v-if="selectedDef && selectedDef.schema.length"
										:schema="selectedDef.schema"
										v-model="selectedBlock.config"
									/>
									<NText
										v-else-if="blockType(selectedBlock.name) === 'columns'"
										depth="3"
										style="font-size: 12px"
									>
										{{ t('mjmlBuilder.columnHint') }}
									</NText>
								</div>
							</NCollapseItem>
						</template>
						<!-- Adding a new block: pick the component type first -->
						<NCollapseItem v-else :title="t('type')" name="type">
							<div class="collapseContentPadding">
								<NFlex
									v-for="group in PALETTE_GROUPS"
									:key="group.category"
									vertical
									:size="8"
									class="mjml-palette-group"
								>
									<NText depth="4" class="mjml-pane-group-title">
										{{ t(`mjmlBuilder.categories.${group.category}`) }}
									</NText>
									<NGrid
										:x-gap="8"
										:y-gap="8"
										:cols="1"
									>
										<NGridItem
											v-for="def in group.blocks"
											:key="def.type"
											class="previewBox"
											@click="onTypeSelect(def.type)"
										>
											<EmailTemplatesThumbnail
												:name="`${def.type}/1`"
												:config="{}"
												:max-height="def.previewMaxHeight"
											/>
											<NText
												depth="3"
												style="display: block; font-size: 11px; text-align: center; margin-top: 4px"
											>
												{{ t(`mjmlBuilder.blocks.${def.labelKey}`) }}
											</NText>
										</NGridItem>
									</NGrid>
								</NFlex>
							</div>
						</NCollapseItem>
					</NCollapse>
				</template>

				<!-- General settings (selected by default): template name + subject -->
				<template v-else>
					<NForm label-placement="top" :show-require-mark="false">
						<NFormItem :label="t('emailTemplatesUi.name')" path="name">
							<NInput
								v-model:value="name"
								:placeholder="t('emailTemplatesUi.namePlaceholder')"
								:disabled="existing"
							/>
						</NFormItem>
						<NFormItem :label="t('emailTemplatesUi.subject')" path="subject">
							<NInput
								v-model:value="subject"
								:placeholder="t('emailTemplatesUi.subjectPlaceholder')"
							/>
						</NFormItem>
					</NForm>
					<NDivider style="margin: 12px 0" />
					<NText depth="3" style="font-size: 12px">
						{{ t('emailTemplates.recordFieldsHint') }}
					</NText>
				</template>

				<template #header>
					<NButtonGroup style="width: 100%; justify-content: center">
						<template v-if="selectedBlock">
							<NPopover :delay="1500">
								<template #trigger>
									<NButton type="info" secondary round @click="clearSelection">
										<template #icon>
											<NIcon>
												<Icon name="tabler:settings" />
											</NIcon>
										</template>
									</NButton>
								</template>
								{{ t('emailTemplatesUi.settings') }}
							</NPopover>

							<NButton type="primary" secondary round @click="save" :loading="saving">
								<template #icon>
									<NIcon>
										<Icon name="tabler:device-floppy" />
									</NIcon>
								</template>
								{{ t(existing ? 'save' : 'publish') }}
							</NButton>
						</template>
						<template v-else>
							<NButton type="info" secondary round disabled>
								<template #icon>
									<NIcon>
										<Icon name="tabler:settings" />
									</NIcon>
								</template>
								{{ t('emailTemplatesUi.settings') }}
							</NButton>

							<NPopover :delay="1500">
								<template #trigger>
									<NButton
										type="primary"
										secondary
										round
										@click="save"
										:disabled="!blocks.length"
										:loading="saving"
									>
										<template #icon>
											<NIcon>
												<Icon name="tabler:device-floppy" />
											</NIcon>
										</template>
									</NButton>
								</template>
								{{ t(existing ? 'save' : 'publish') }}
							</NPopover>
						</template>

						<NPopover
							trigger="click"
							placement="bottom-end"
							:show="showTestPopover"
							@update:show="(value: boolean) => (showTestPopover = value)"
						>
							<template #trigger>
								<NTooltip :delay="1500">
									<template #trigger>
										<NButton
											secondary
											round
											:loading="Loading.testEmail"
											@click="showTestPopover = !showTestPopover"
										>
											<template #icon>
												<NIcon>
													<Icon name="tabler:send" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('emailTemplates.sendTest') }}
								</NTooltip>
							</template>
							<NFlex vertical :size="8" style="width: 300px">
								<NText depth="3" style="font-size: 12px">
									{{ t('emailTemplates.sendTestHint') }}
								</NText>
								<NInput
									v-model:value="testRecipient"
									size="small"
									:placeholder="t('emailTemplates.testRecipient')"
								/>
								<NButton
									size="small"
									type="primary"
									:loading="Loading.testEmail"
									:disabled="!isEmail(testRecipient)"
									@click="sendTest"
								>
									{{ t('sendTestEmail') }}
								</NButton>
							</NFlex>
						</NPopover>
					</NButtonGroup>
				</template>
			</NCard>
		</NLayoutSider>

		<NLayoutContent class="Editor" position="absolute" :style="!$device.isMobile && !isMenuCollapsed ? 'width: calc(100% - 340px);' : ''">
			<!-- Canvas toolbar: variable chips + device + view + send test -->
			<NFlex
				class="email-canvas-toolbar"
				justify="space-between"
				align="center"
				:size="8"
				wrap
			>
				<NText depth="3" style="font-size: 12px; white-space: nowrap">
					{{ t('emailTemplates.variables') }}
				</NText>

				<NTag
					v-for="variable in allVariables"
					:key="variable"
					size="small"
					round
					:bordered="false"
					:type="BUILTIN_VARIABLES.includes(variable) ? 'info' : 'warning'"
					:closable="!BUILTIN_VARIABLES.includes(variable)"
					style="cursor: pointer"
					@click="insertVariable(variable)"
					@close="removeCustomVariable(variable)"
				>
					{{ variableTag(variable) }}
				</NTag>

				<NPopover
					trigger="click"
					placement="bottom"
					:show="showAddVariable"
					@update:show="(value: boolean) => (showAddVariable = value)"
				>
					<template #trigger>
						<NButton
							size="tiny"
							quaternary
							type="primary"
							@click="showAddVariable = !showAddVariable"
						>
							<template #icon>
								<NIcon>
									<Icon name="tabler:plus" />
								</NIcon>
							</template>
						</NButton>
					</template>
					<NFlex vertical :size="8" style="width: 260px">
						<NInput
							v-model:value="newVariable"
							size="small"
							:placeholder="t('emailTemplates.variableName')"
							@keydown.enter.prevent="addCustomVariable"
						/>
						<NButton
							size="small"
							type="primary"
							:disabled="!newVariable.trim()"
							@click="addCustomVariable"
						>
							{{ t('emailTemplates.add') }}
						</NButton>
					</NFlex>
				</NPopover>

				<NFlex :size="8" align="center" style="margin-inline-start: auto">
					<PreviewDropdown showHide />
					<NTooltip :delay="1500">
						<template #trigger>
							<NButton
								round
								quaternary
								:type="view === 'visual' ? 'primary' : 'default'"
								@click="setView('visual')"
							>
								<template #icon>
									<NIcon>
										<Icon name="tabler:photo" />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t('mjmlBuilder.visual') }}
					</NTooltip>
					<NTooltip :delay="1500">
						<template #trigger>
							<NButton
								round
								quaternary
								:type="view === 'code' ? 'primary' : 'default'"
								@click="setView('code')"
							>
								<template #icon>
									<NIcon>
										<Icon name="tabler:file-code" />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t('mjmlBuilder.code') }}
					</NTooltip>
					<NTooltip :delay="1500">
						<template #trigger>
							<NButton
								round
								quaternary
								:type="previewMode ? 'primary' : 'default'"
								:loading="previewLoading"
								@click="togglePreview"
							>
								<template #icon>
									<NIcon>
										<Icon name="tabler:eye" v-if="!previewMode" />
										<Icon name="tabler:eye-off" v-else />
									</NIcon>
								</template>
							</NButton>
						</template>
						{{ t('mjmlBuilder.fullPreview') }}
					</NTooltip>
				</NFlex>
			</NFlex>

			<!-- Visual workspace: one continuous email sheet (preview mode = faithful iframe) -->
			<template v-if="view === 'visual'">
				<template v-if="previewMode">
					<div class="email-canvas-frame email-preview" :class="selectedDevice">
						<div class="email-preview-client">
							<NFlex justify="space-between" align="center" :size="8" wrap>
								<NFlex :size="8" align="center" style="min-width: 0">
									<NIcon size="16"><Icon name="tabler:mail" /></NIcon>
									<NText strong style="font-size: 13px" ellipsis>
										{{ previewSubject || t('emailTemplatesUi.subject') }}
									</NText>
								</NFlex>
								<NTooltip :delay="1500">
									<template #trigger>
										<NButton size="tiny" quaternary type="info" @click="togglePreview">
											<template #icon>
												<NIcon><Icon name="tabler:pencil" /></NIcon>
											</template>
										</NButton>
									</template>
									{{ t('mjmlBuilder.backToEditor') }}
								</NTooltip>
							</NFlex>
							<NText depth="3" style="font-size: 11px">
								{{ t('mjmlBuilder.previewSample') }}
							</NText>
						</div>
						<NText v-if="previewLoading" depth="3" class="email-preview-state">
							{{ t('emailTemplates.previewLoading') }}
						</NText>
						<iframe
							v-else-if="previewHtml"
							class="email-preview-frame"
							:srcdoc="previewHtml"
							sandbox=""
						></iframe>
					</div>
				</template>

				<template v-else>
					<div
						ref="frameRef"
						class="contents email-canvas-frame email-sheet"
						:class="[selectedDevice, { currentlyEditing: !isMenuCollapsed, isWide: frameWide }]"
					>
					<VueDraggable
						v-if="blocks.length"
						v-model="blocks"
						class="email-sheet-draggable"
						:animation="150"
						ghost-class="mjml-drag-ghost"
					>
					<template v-for="block in blocks" :key="block.id">
						<div
							v-if="block.name"
							class="parentElement"
							:class="{ currentElement: isSelected(block.id) }"
							@click="selectBlock(block)"
						>
							<NButtonGroup class="groupButtons">
								<NButton v-if="$device.isMobile" type="primary" secondary @click="selectBlock(block)">
									<template #icon>
										<NIcon>
											<Icon name="tabler:pencil" />
										</NIcon>
									</template>
								</NButton>
								<NDropdown
									v-if="blocks.length > 1"
									:options="moveOptions(blocks, block)"
									@select="(value) => moveSelect(blocks, block, value)"
								>
									<NButton type="info" secondary>
										<template #icon>
											<NIcon>
												<Icon name="tabler:menu-order" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NDropdown :options="addOptions" @select="(value) => addSelectTop(block, value)">
									<NButton type="success" secondary>
										<template #icon>
											<NIcon>
												<Icon name="tabler:plus" />
											</NIcon>
										</template>
									</NButton>
								</NDropdown>
								<NButton
									type="info"
									secondary
									@click.stop="duplicateSelect(blocks, block, { kind: 'body' })"
								>
									<template #icon>
										<NIcon>
											<Icon name="tabler:copy" />
										</NIcon>
									</template>
								</NButton>
								<NPopconfirm
									:positive-text="t('mjmlBuilder.delete')"
									@positive-click="removeBlock(blocks, block)"
								>
									<template #trigger>
										<NButton type="error" secondary @click.stop>
											<template #icon>
												<NIcon>
													<Icon name="tabler:trash" />
												</NIcon>
											</template>
										</NButton>
									</template>
									{{ t('mjmlBuilder.deleteConfirm') }}
								</NPopconfirm>
							</NButtonGroup>

							<!-- Columns: nested draggable content blocks, each with its own preview -->
							<div v-if="blockType(block.name) === 'columns'" class="mjml-columns">
								<div
									v-for="(column, columnIndex) in block.children"
									:key="columnIndex"
									class="mjml-column"
									:class="{
										'mjml-column--selected': isColumnSelected(block.id, columnIndex),
									}"
									@click.stop="selectColumn(block.id, columnIndex)"
								>
									<VueDraggable
										:model-value="column"
										@update:model-value="onColumnReorder(block, columnIndex, $event)"
										:animation="150"
										ghost-class="mjml-drag-ghost"
										class="mjml-column-draggable"
									>
										<template v-for="child in column" :key="child.id">
											<div
												v-if="child.name"
												class="parentElement parentElement--inner"
												:class="{ currentElement: isSelected(child.id) }"
												@click.stop="selectInnerBlock(block.id, columnIndex, child)"
											>
												<NButtonGroup class="groupButtons">
													<NDropdown
														v-if="column.length > 1"
														:options="moveOptions(column, child)"
														@select="(value) => moveSelect(column, child, value)"
													>
														<NButton type="info" secondary>
															<template #icon>
																<NIcon>
																	<Icon name="tabler:menu-order" />
																</NIcon>
															</template>
														</NButton>
													</NDropdown>
													<NDropdown
														:options="addOptions"
														@select="(value) => addSelectColumn(block, columnIndex, child, value)"
													>
														<NButton type="success" secondary>
															<template #icon>
																<NIcon>
																	<Icon name="tabler:plus" />
																</NIcon>
															</template>
														</NButton>
													</NDropdown>
													<NButton
														type="info"
														secondary
														@click.stop="duplicateSelect(column, child, { kind: 'column', parentId: block.id, index: columnIndex })"
													>
														<template #icon>
															<NIcon>
																<Icon name="tabler:copy" />
															</NIcon>
														</template>
													</NButton>
													<NPopconfirm
														:positive-text="t('mjmlBuilder.delete')"
														@positive-click="removeBlock(column, child)"
													>
														<template #trigger>
															<NButton type="error" secondary @click.stop>
																<template #icon>
																	<NIcon>
																		<Icon name="tabler:trash" />
																	</NIcon>
																</template>
															</NButton>
														</template>
														{{ t('mjmlBuilder.deleteConfirm') }}
													</NPopconfirm>
												</NButtonGroup>
												<template>
													<div
														v-if="sheetBody(child)"
														class="sheet-zone-body"
														v-html="sheetBody(child)"
													></div>
													<span v-else-if="!sheetReady" class="sheet-zone-loading">
														{{ t('mjmlBuilder.thumbnailLoading') }}
													</span>
												</template>
											</div>
										</template>
									</VueDraggable>
									<NText v-if="!column.length" depth="3" style="font-size: 11px">
										{{ t('mjmlBuilder.columnEmpty') }}
									</NText>
									<NButton
										dashed
										size="tiny"
										style="margin-top: 6px"
										@click.stop="quickAddText(block, columnIndex)"
									>
										<template #icon>
											<NIcon>
												<Icon name="tabler:plus" />
											</NIcon>
										</template>
										{{ t('emailTemplates.add') }}
									</NButton>
								</div>
							</div>

							<!-- Content blocks: stitched compiled preview -->
							<template v-else>
								<div
									v-if="sheetBody(block)"
									class="sheet-zone-body"
									v-html="sheetBody(block)"
								></div>
								<span v-else-if="!sheetReady" class="sheet-zone-loading">
									{{ t('mjmlBuilder.thumbnailLoading') }}
								</span>
							</template>
						</div>
					</template>
				</VueDraggable>

						<!-- Empty state: add the first block -->
						<div v-else style="text-align: center">
							<NPopover placement="bottom" :delay="1500">
								<template #trigger>
									<NButton
										round
										style="width: fit-content; margin: 40px auto"
										type="primary"
										dashed
										@click="addFirstBlock"
									>
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
					</div>
				</template>
			</template>

			<!-- Code workspace -->
			<template v-else>
				<NInput
					ref="inputRef"
					v-model:value="codeValue"
					type="textarea"
					:placeholder="t('emailTemplates.contentPlaceholder')"
					:autosize="{ minRows: 14, maxRows: 40 }"
					style="font-family: monospace"
				/>
				<NText depth="3" style="font-size: 12px">
					{{ t('mjmlBuilder.codeHint') }}
				</NText>
			</template>
		</NLayoutContent>
	</NLayout>
</template>

<script lang="ts" setup>
import { isEmail } from "inibase/utils";
import { VueDraggable } from "vue-draggable-plus";
import { Icon, NIcon } from "#components";
import type { EmailBlock, EmailBlockType } from "~/composables/emailBuilder";
import {
	BUILTIN_VARIABLES,
	blockDefByName,
	blocksFromMJML,
	blockType,
	blockVariant,
	buildMJML,
	CUSTOM_VARIABLES_KEY,
	cloneBlock,
	collectPlaceholders,
	createBlock,
	createTextBlock,
	PALETTE_GROUPS,
	SAMPLE_VALUES,
	stripModelMarker,
	supportsTextProp,
} from "~/composables/emailBuilder";
import { renderEmailTemplateClient } from "~/composables/emailRender";
import { useEmailSheet } from "~/composables/emailSheet";

const props = defineProps<{ existing?: boolean; saving?: boolean }>();

const emit = defineEmits<{ save: [] }>();

const modelValue = defineModel<string>({ default: "" });
const name = defineModel<string>("name", { default: "" });
const subject = defineModel<string>("subject", { default: "" });

type Selection =
	| { kind: "body"; blockId?: string }
	| { kind: "column"; parentId: string; index: number; blockId?: string };

// ── View switching ──────────────────────────────────────────────────────────────

const view = ref<"visual" | "code">("visual");

function setView(next: "visual" | "code") {
	if (next === "code") previewMode.value = false;
	if (next === view.value) return;
	if (next === "code") flushBlocks();
	view.value = next;
	if (next === "visual") {
		// The user may have hand-edited the MJML in the code view — rebuild the
		// block tree (unknown pieces are preserved as raw blocks).
		blocks.value = blocksFromMJML(modelValue.value ?? "");
		selection.value = null;
	}
}

// The code editor never shows the model marker; it is re-added by the next
// visual save. Hand-edits are preserved: switching back re-parses from the
// (marker-stripped) document.
const codeValue = computed({
	get: () => stripModelMarker(modelValue.value ?? ""),
	set: (value: string) => {
		modelValue.value = value;
	},
});

// ── Blocks ─────────────────────────────────────────────────────────────────────

const blocks = ref<EmailBlock[]>([]);
const selection = ref<Selection | null>(null);

const selectedDevice = usePreviewDevice();
selectedDevice.value = "none";

// Continuous email-sheet rendering: stitched per-block previews + scoped CSS.
const { bodies: sheetBodies, css: sheetCss } = useEmailSheet(blocks);
const sheetReady = computed(() => Object.keys(sheetBodies.value).length > 0);
function sheetBody(block: EmailBlock): string {
	return sheetBodies.value[block.id] ?? "";
}

// The sheet's scoped CSS lives in <head> (Vue ignores side-effect tags in
// templates). Every selector is re-scoped under .email-sheet, so nothing leaks
// into the rest of the app page.
useHead(() => ({
	style: sheetCss.value
		? [{ children: sheetCss.value, id: "email-sheet-css" }]
		: [],
}));

// Right-drawer state, mirroring the page builder (Builder.vue).
const expandedNames = ref("config");
const isMenuCollapsed = ref(false);

let ready = false;
let emitting = false;
let blocksTimer: ReturnType<typeof setTimeout> | undefined;

// External content changes (template load/save) resync the block tree. While
// the code view is active every keystroke would re-parse — the tree is only
// rebuilt when leaving code view (setView) or on external saves.
watch(
	modelValue,
	(value) => {
		if (emitting || view.value === "code") return;
		blocks.value = blocksFromMJML(value ?? "");
		selection.value = null;
		ready = true;
	},
	{ immediate: true },
);

// Placeholders (name: "") are mid-insertion elements waiting for a type pick —
// never serialized into the MJML document.
function serializeBlocks(): EmailBlock[] {
	return blocks.value
		.filter((block) => block.name)
		.map((block) => {
			if (!block.children) return block;
			return {
				...block,
				children: block.children.map((column) =>
					column.filter((child) => child.name),
				),
			};
		});
}

function flushBlocks() {
	if (!ready || emitting) return;
	clearTimeout(blocksTimer);
	emitting = true;
	modelValue.value = buildMJML(serializeBlocks());
	nextTick(() => {
		emitting = false;
	});
}

// Visual edits are serialized back to MJML (debounced).
watch(
	blocks,
	() => {
		if (!ready || emitting || view.value === "code") return;
		clearTimeout(blocksTimer);
		blocksTimer = setTimeout(flushBlocks, 250);
	},
	{ deep: true },
);

onBeforeUnmount(() => clearTimeout(blocksTimer));

// Save from the drawer header (mirrors the page-builder Save button): flush any
// pending edits first so the parent always receives the latest MJML.
function save() {
	flushBlocks();
	emit("save");
}

let placeholderCounter = 0;
function createPlaceholder(): EmailBlock {
	placeholderCounter += 1;
	return {
		id: `eb_ph_${Date.now().toString(36)}_${placeholderCounter}`,
		name: "",
		config: {},
	};
}

function addFirstBlock() {
	const placeholder = createPlaceholder();
	blocks.value = [placeholder];
	selection.value = { kind: "body", blockId: placeholder.id };
	isMenuCollapsed.value = false;
	expandedNames.value = "type";
}

function currentContainer(): EmailBlock[] {
	const sel = selection.value;
	if (!sel || sel.kind === "body") return blocks.value;
	const parent = blocks.value.find((block) => block.id === sel.parentId);
	return parent?.children?.[sel.index] ?? blocks.value;
}

// The placeholder currently selected in the type tab becomes a real block.
// The object identity is kept so list references and the selection stay valid.
function onTypeSelect(type: EmailBlockType) {
	const element = selectedBlock.value;
	if (!element) return;
	const created = createBlock(type);
	created.id = element.id;
	Object.assign(element, created);
	expandedNames.value = "style";
}

function quickAddText(parent: EmailBlock, columnIndex: number) {
	const column = parent.children?.[columnIndex];
	if (!column) return;
	const block = createTextBlock("");
	column.push(block);
	selection.value = {
		kind: "column",
		parentId: parent.id,
		index: columnIndex,
		blockId: block.id,
	};
}

function selectBlock(block: EmailBlock) {
	selection.value = { kind: "body", blockId: block.id };
}

// Clicking a column selects its parent columns block (config opens in the drawer).
function selectColumn(parentId: string, _index: number) {
	const parent = blocks.value.find((block) => block.id === parentId);
	if (parent) selection.value = { kind: "body", blockId: parent.id };
}

function selectInnerBlock(parentId: string, index: number, child: EmailBlock) {
	selection.value = { kind: "column", parentId, index, blockId: child.id };
}

function clearSelection() {
	blocks.value = serializeBlocks();
	selection.value = null;
}

function isSelected(id: string): boolean {
	return selection.value?.blockId === id;
}

function isColumnSelected(parentId: string, index: number): boolean {
	const sel = selection.value;
	if (
		sel?.kind === "column" &&
		sel.parentId === parentId &&
		sel.index === index
	)
		return true;
	// The columns block itself is selected — highlight all its cells.
	if (sel?.kind === "body" && sel.blockId === parentId) return true;
	return false;
}

function moveInList(list: EmailBlock[], block: EmailBlock, direction: -1 | 1) {
	const index = list.indexOf(block);
	const target = index + direction;
	if (index < 0 || target < 0 || target >= list.length) return;
	list.splice(index, 1);
	list.splice(target, 0, block);
}

// Floating toolbar (mirrors the page builder's .groupButtons): move up/down,
// add above/below, delete — shown on hover or when the block is selected.
function moveOptions(list: EmailBlock[], block: EmailBlock) {
	const index = list.indexOf(block);
	return [
		{
			label: t("mjmlBuilder.moveUp"),
			key: "up",
			show: index > 0,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-narrow-up" })),
		},
		{
			label: t("mjmlBuilder.moveDown"),
			key: "down",
			show: index >= 0 && index < list.length - 1,
			icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-narrow-down" })),
		},
	];
}

function moveSelect(list: EmailBlock[], block: EmailBlock, value: string) {
	moveInList(list, block, value === "up" ? -1 : 1);
}

const addOptions = [
	{
		label: t("mjmlBuilder.addAbove"),
		key: "above",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-bar-up" })),
	},
	{
		label: t("mjmlBuilder.addBelow"),
		key: "below",
		icon: () => h(NIcon, () => h(Icon, { name: "tabler:arrow-bar-down" })),
	},
];

// "Add" inserts a placeholder and opens the type tab in the drawer — the exact
// page-builder flow ("when you click the plus, the drawer shows the blocks").
function addSelectTop(block: EmailBlock, value: string) {
	const list = blocks.value;
	const index = list.indexOf(block);
	if (index < 0) return;
	const placeholder = createPlaceholder();
	list.splice(value === "above" ? index : index + 1, 0, placeholder);
	selection.value = { kind: "body", blockId: placeholder.id };
	expandedNames.value = "type";
}

function addSelectColumn(
	parent: EmailBlock,
	columnIndex: number,
	child: EmailBlock,
	value: string,
) {
	const column = parent.children?.[columnIndex];
	if (!column) return;
	const index = column.indexOf(child);
	const placeholder = createPlaceholder();
	column.splice(value === "above" ? index : index + 1, 0, placeholder);
	selection.value = {
		kind: "column",
		parentId: parent.id,
		index: columnIndex,
		blockId: placeholder.id,
	};
	expandedNames.value = "type";
}

// vue-draggable-plus 0.6.x only supports v-model (no `:list` prop), so nested
// column lists use the controlled pattern: model-value + reorder handler.
function onColumnReorder(
	parent: EmailBlock,
	columnIndex: number,
	next: EmailBlock[],
) {
	const column = parent.children?.[columnIndex];
	if (!column || !Array.isArray(next)) return;
	column.splice(0, column.length, ...next);
}

function removeBlock(list: EmailBlock[], block: EmailBlock) {
	const index = list.indexOf(block);
	if (index < 0) return;
	list.splice(index, 1);
	if (selection.value?.blockId === block.id) selection.value = null;
}

// Duplicate a block right after itself, selecting the copy. Column children keep
// their column context so the config panel opens for the right block.
function duplicateSelect(
	list: EmailBlock[],
	block: EmailBlock,
	context:
		| { kind: "body" }
		| { kind: "column"; parentId: string; index: number },
) {
	const index = list.indexOf(block);
	if (index < 0) return;
	const copy = cloneBlock(block);
	list.splice(index + 1, 0, copy);
	selection.value =
		context.kind === "body"
			? { kind: "body", blockId: copy.id }
			: {
					kind: "column",
					parentId: context.parentId,
					index: context.index,
					blockId: copy.id,
				};
}

// Full-email preview: a faithful, sandboxed render of the whole template at the
// selected device width (media queries respond to the iframe, unlike the sheet).
const previewMode = ref(false);
const previewHtml = ref("");
const previewSubject = ref("");
const previewLoading = ref(false);

async function openPreview() {
	flushBlocks();
	const content = buildMJML(serializeBlocks());
	if (!content) {
		previewHtml.value = "";
		return;
	}
	previewLoading.value = true;
	try {
		const rendered = await renderEmailTemplateClient(
			content,
			subject.value,
			sampleVariables(),
		);
		previewHtml.value = rendered.html;
		previewSubject.value = rendered.subject;
	} finally {
		previewLoading.value = false;
	}
}

async function togglePreview() {
	if (previewMode.value) {
		previewMode.value = false;
		return;
	}
	if (view.value !== "visual") setView("visual");
	previewMode.value = true;
	await openPreview();
}

// The sheet's injected CSS mirrors MJML's `@media (min-width:480px)` through an
// `.isWide` class on the frame — observe it so columns stack on the mobile
// canvas and sit side-by-side on desktop/tablet frames.
const frameRef = ref<HTMLElement | null>(null);
const frameWide = ref(true);
let frameObserver: ResizeObserver | undefined;

function observeFrame() {
	frameObserver?.disconnect();
	frameObserver = undefined;
	const el = frameRef.value;
	if (!el || typeof ResizeObserver === "undefined") return;
	const update = () => {
		frameWide.value = el.clientWidth >= 480;
	};
	update();
	frameObserver = new ResizeObserver(update);
	frameObserver.observe(el);
}

watch(frameRef, observeFrame, { flush: "post" });
onBeforeUnmount(() => frameObserver?.disconnect());

const selectedBlock = computed<EmailBlock | null>(() => {
	const sel = selection.value;
	if (!sel) return null;
	if (sel.kind === "body") {
		return blocks.value.find((block) => block.id === sel.blockId) ?? null;
	}
	const parent = blocks.value.find((block) => block.id === sel.parentId);
	const column = parent?.children?.[sel.index];
	return column?.find((block) => block.id === sel.blockId) ?? null;
});

const selectedDef = computed(() =>
	selectedBlock.value ? blockDefByName(selectedBlock.value.name) : null,
);

function setVariant(block: EmailBlock, variant: number) {
	const type = blockType(block.name);
	block.name = `${type}/${variant}`;
}

// Page-builder keyboard shortcuts: Ctrl/Cmd+B toggles the drawer, Ctrl/Cmd+S saves.
onMounted(() => {
	document.onkeydown = (e) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key.toLowerCase() === "b" || e.key === "ب") {
				e.preventDefault();
				isMenuCollapsed.value = !isMenuCollapsed.value;
			} else if (e.key.toLowerCase() === "s" || e.key === "س") {
				e.preventDefault();
				save();
			}
		}
	};
});

// ── Variables ──────────────────────────────────────────────────────────────────

const customVariables = ref<string[]>([]);
function loadCustomVariables() {
	if (!import.meta.client) return;
	try {
		const raw = localStorage.getItem(CUSTOM_VARIABLES_KEY);
		if (raw) customVariables.value = JSON.parse(raw);
	} catch {
		customVariables.value = [];
	}
}
loadCustomVariables();

const allVariables = computed(() => [
	...new Set([...BUILTIN_VARIABLES, ...customVariables.value]),
]);

const variableTag = (key: string) => `{{${key}}}`;

const showAddVariable = ref(false);
const newVariable = ref("");

function persistCustomVariables() {
	if (!import.meta.client) return;
	try {
		localStorage.setItem(
			CUSTOM_VARIABLES_KEY,
			JSON.stringify(customVariables.value),
		);
	} catch {
		// localStorage unavailable — keep in-memory list
	}
}

function addCustomVariable() {
	const key = newVariable.value.trim().replace(/[{}]/g, "");
	if (!key) return;
	if (!customVariables.value.includes(key)) {
		customVariables.value.push(key);
		persistCustomVariables();
	}
	newVariable.value = "";
	showAddVariable.value = false;
	insertVariable(key);
}

function removeCustomVariable(key: string) {
	customVariables.value = customVariables.value.filter(
		(variable) => variable !== key,
	);
	persistCustomVariables();
}

const inputRef = ref();

function insertAtTextarea(token: string) {
	const textarea = inputRef.value?.textareaElRef?.value as
		| HTMLTextAreaElement
		| undefined;
	const current = modelValue.value ?? "";

	if (!textarea) {
		modelValue.value = current + token;
		return;
	}

	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	modelValue.value = current.slice(0, start) + token + current.slice(end);

	nextTick(() => {
		textarea.focus();
		const position = start + token.length;
		textarea.setSelectionRange(position, position);
	});
}

function insertVariable(variable: string) {
	const token = `{{${variable}}}`;

	// Code view: insert at the textarea cursor, like the raw editor.
	if (view.value === "code") {
		insertAtTextarea(token);
		return;
	}

	// Visual view: append to the selected block's text, or create a text block
	// in the current container when no text-capable block is selected.
	const block = selectedBlock.value;
	if (block && supportsTextProp(block)) {
		block.config.text = `${String(block.config.text ?? "")}${token}`;
		return;
	}

	const container = currentContainer();
	const created = createTextBlock(token);
	container.push(created);
	const sel = selection.value;
	if (sel?.kind === "column") {
		selection.value = {
			kind: "column",
			parentId: sel.parentId,
			index: sel.index,
			blockId: created.id,
		};
	} else {
		selection.value = { kind: "body", blockId: created.id };
	}
}

// ── Send a test email with the current (possibly unsaved) template ─────────────
const database = useState<Database>("database");
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

// Sample variables for every placeholder used in the template so test emails
// demonstrate real substitution. Never sent to real users.
function sampleVariables(): Record<string, string> {
	const variables: Record<string, string> = { ...SAMPLE_VALUES };
	for (const key of collectPlaceholders(subject.value, modelValue.value)) {
		if (!(key in variables))
			variables[key] = `sample_${key.replace(/^@/, "").replace(/\./g, "_")}`;
	}
	return variables;
}

const testRecipient = ref("");
const showTestPopover = ref(false);

async function sendTest() {
	if (!isEmail(testRecipient.value)) return;

	Loading.value.testEmail = true;
	try {
		const data = await $fetch<apiResponse>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/email/test`,
			{
				method: "POST",
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
				body: {
					email: testRecipient.value,
					templateContent: modelValue.value ?? "",
					subject: subject.value ?? "",
					variables: sampleVariables(),
				},
			},
		);
		if (data.result) window.$message?.success(data.message);
		else window.$message?.error(data.message);
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message?.error(message ?? t("emailSendFailed"));
	} finally {
		Loading.value.testEmail = false;
		showTestPopover.value = false;
	}
}
</script>

<style>
.ltr .n-layout-sider.n-layout-sider--right-placement.n-layout-sider--bordered .n-layout-toggle-button {
	left: -16px;
}

.rtl .n-layout-sider.n-layout-sider--right-placement.n-layout-sider--bordered .n-layout-toggle-button {
	right: -30px;
	transform: scaleX(-1);
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

.EditorDrawer {
	z-index: 999;
	position: absolute;
	height: 100%;
}

.rtl .EditorDrawer {
	left: 0;
}

.ltr .EditorDrawer {
	right: 0;
}

.previewBox {
	cursor: pointer;
}

.previewBox:hover {
	opacity: 0.6;
}

/* Canvas top bar (variables, device, view, send test) */
.email-canvas-toolbar {
	padding: 10px 0 10px 10px;
	margin-bottom: 10px;
	border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.rtl .email-canvas-toolbar {
	padding: 10px 10px 10px 0;
}

/* Device-width frame so the stacked block previews read as the email.
   Mirrors the layout direction: hugs the left in LTR, the right in RTL. */
.email-canvas-frame {
	margin: auto;
	padding: 16px 8px 32px;
	transition: max-width 0.2s ease;
}

.email-canvas-frame.none {
	max-width: none;
}

.email-canvas-frame.desktop {
	max-width: 600px;
}

.email-canvas-frame.tablet {
	max-width: 512px;
}

.email-canvas-frame.mobile {
	max-width: 375px;
}

/* ── Page-builder block item pattern (copied from Builder.vue) ────────────────── */

.parentElement {
	cursor: pointer;
	position: relative;
}

.currentlyEditing .parentElement:hover,
.currentlyEditing .parentElement.currentElement {
	outline: 2px solid rgb(var(--primaryColor));
	outline-offset: -2px;
}

.currentlyEditing .parentElement:not(.currentElement) > :nth-child(2) * {
	opacity: 0.8;
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

.parentElement :deep(.n-button-group > .n-button) {
	border-radius: 0;
}

.parentElement > :nth-child(2) *:focus {
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

/* ── Email-specific tile pieces ───────────────────────────────────────────────── */

.parentElement--inner {
	margin-bottom: 6px;
}

.parentElement--inner:last-child {
	margin-bottom: 0;
}

.mjml-columns {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.mjml-column {
	background: rgba(2, 132, 199, 0.05);
	border: 1px dashed rgba(2, 132, 199, 0.3);
	border-radius: 8px;
	padding: 8px;
	min-height: 48px;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.mjml-column--selected {
	border-color: #2563eb;
	box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.mjml-column-draggable {
	display: flex;
	flex-direction: column;
	min-height: 32px;
}

.mjml-drag-ghost {
	opacity: 0.45;
}

/* ── Continuous email sheet ────────────────────────────────────────── */

.email-sheet {
	background-color: #f1f5f9;
}

.email-sheet-draggable {
	width: 100%;
}

.dark .email-sheet {
	background-color: #162033;
}

.sheet-zone-body {
	width: 100%;
}

/* Email markup is preview-only — links must never navigate the editor. */
.sheet-zone-body a {
	pointer-events: none;
}

.sheet-zone-loading {
	display: block;
	padding: 20px 8px;
	text-align: center;
	font-size: 11px;
}

/* ── Full-email preview (mail-client look) ─────────────────────────── */

.email-preview-client {
	padding: 10px 14px;
	border: 1px solid rgba(128, 128, 128, 0.25);
	border-bottom: 0;
	border-radius: 10px 10px 0 0;
	background: rgba(255, 255, 255, 0.85);
}

.dark .email-preview-client {
	background: rgba(30, 41, 59, 0.92);
}

.email-preview-state {
	display: block;
	padding: 30px 8px;
	text-align: center;
}

.email-preview-frame {
	display: block;
	width: 100%;
	min-height: 420px;
	border: 1px solid rgba(128, 128, 128, 0.25);
	background: #f1f5f9;
}

.mjml-palette-group + .mjml-palette-group {
	margin-top: 14px;
}

.mjml-pane-group-title {
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	display: block;
	margin-bottom: 6px;
}
</style>