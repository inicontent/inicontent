<template>
	<FieldWrapper :field :rule v-model="modelValue">
		<NFlex vertical :size="12" style="width: 100%">
			<NFlex justify="space-between" align="center" :size="8" wrap>
				<!-- Variable chips -->
				<NFlex wrap align="center" :size="8">
					<NText depth="3" style="font-size: 12px; white-space: nowrap;">
						{{ t("emailTemplates.variables") }}
					</NText>

					<NTag
						v-for="variable in allVariables"
						:key="variable"
						size="small"
						round
						:bordered="false"
						:type="builtinVariables.includes(variable) ? 'info' : 'warning'"
						:closable="!builtinVariables.includes(variable)"
						style="cursor: pointer"
						@click="insert(variable)"
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
							<NButton size="tiny" quaternary type="primary" @click="showAddVariable = !showAddVariable">
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
								{{ t("emailTemplates.add") }}
							</NButton>
						</NFlex>
					</NPopover>
				</NFlex>

				<!-- Send a test email with the current (possibly unsaved) template -->
				<NPopover
					trigger="click"
					placement="bottom-end"
					:show="showTestPopover"
					@update:show="(value: boolean) => (showTestPopover = value)"
				>
					<template #trigger>
						<NButton
							size="tiny"
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
							{{ t("emailTemplates.sendTest") }}
						</NButton>
					</template>
					<NFlex vertical :size="8" style="width: 300px">
						<NText depth="3" style="font-size: 12px;">
							{{ t("emailTemplates.sendTestHint") }}
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
							{{ t("sendTestEmail") }}
						</NButton>
					</NFlex>
				</NPopover>
			</NFlex>

			<NText depth="3" style="font-size: 12px;">
				{{ t("emailTemplates.recordFieldsHint") }}
			</NText>

			<!-- MJML content editor -->
			<NInput
				ref="inputRef"
				v-model:value="modelValue"
				type="textarea"
				:placeholder="t('emailTemplates.contentPlaceholder')"
				:autosize="{ minRows: 12, maxRows: 36 }"
				style="font-family: monospace"
			/>

			<!-- Live preview — compiled server-side, rendered in a sandboxed iframe -->
			<NCollapse>
				<NCollapseItem :name="'preview'" :title="t('emailTemplates.preview')">
					<NAlert
						v-if="!previewHtml && !previewText && !previewLoading"
						type="info"
						:bordered="false"
					>
						{{ t("emailTemplates.previewEmpty") }}
					</NAlert>
					<NText v-if="previewLoading" depth="3" style="font-size: 12px;">
						{{ t("emailTemplates.previewLoading") }}
					</NText>
					<template v-else>
						<NText
							v-if="previewSubject"
							depth="3"
							class="email-template-subject"
						>
							{{ t("emailTemplates.previewSubject") }}: {{ previewSubject }}
						</NText>
						<!-- sandbox="" blocks scripts inside the preview so template
						     markup can never affect the CMS or the editor session. -->
						<iframe
							v-if="previewHtml"
							class="email-template-preview-frame"
							:srcdoc="previewHtml"
							sandbox=""
						></iframe>
						<pre v-else-if="previewText" class="email-template-preview">{{
							previewText
						}}</pre>
					</template>
				</NCollapseItem>
			</NCollapse>
		</NFlex>
	</FieldWrapper>
</template>

<script lang="ts" setup>
import type { FormItemRule } from "naive-ui";

const { field, item } = defineProps<{ field: Field; item?: Item }>();

const modelValue = defineModel<string>();

const rule: FormItemRule = {
	trigger: ["blur", "input"],
	required: field.required,
	validator: async () => {
		await nextTick();
		return fieldValidator(field, modelValue.value);
	},
};

import { isEmail } from "inibase/utils";

// Placeholders that flows always provide when sending through the `email`
// rule (see api/utils/handleFlow.ts):
//   @user.*  — current user fields
//   @data.*  — fields of the record that triggered the email (also available
//              bare, e.g. {{status}})
const builtinVariables = [
	"@user.id",
	"@user.username",
	"@user.email",
	"@user.role",
];

const CUSTOM_VARIABLES_KEY = "emailTemplates.customVariables";

// Sample values used only for the preview and test emails — never sent.
const sampleValues: Record<string, string> = {
	"@user.id": "e7b4c2f8a1d9",
	"@user.username": "karim",
	"@user.email": "karim@example.com",
	"@user.role": "1",
};

// Placeholder syntax: {{name}}, {{@data.field}}, {{@user.field.name}}, …
const PLACEHOLDER_PATTERN = /\{\{([@\w][\w.-]*)\}\}/g;

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
	...new Set([...builtinVariables, ...customVariables.value]),
]);

// Rendered in the template as `{{variable}}` — kept as a function because the
// literal `}}` inside an interpolation would close the Vue expression early.
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
	insert(key);
}

function removeCustomVariable(key: string) {
	customVariables.value = customVariables.value.filter(
		(variable) => variable !== key,
	);
	persistCustomVariables();
}

const inputRef = ref();

// Insert {{token}} at the textarea cursor position, falling back to append.
function insert(key: string) {
	const textarea = inputRef.value?.textareaElRef?.value as
		| HTMLTextAreaElement
		| undefined;
	const token = `{{${key}}}`;
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

// ── Live preview (compiled server-side, rendered in a sandboxed iframe) ────────
const database = useState<Database>("database");
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));

const previewHtml = ref("");
const previewText = ref("");
const previewSubject = ref("");
const previewLoading = ref(false);
let previewTimer: ReturnType<typeof setTimeout> | undefined;

// Build sample variables from every placeholder used in the template so the
// preview and test emails demonstrate real substitution.
function sampleVariables(): Record<string, string> {
	const variables: Record<string, string> = { ...sampleValues };
	const template = `${item?.subject ?? ""}\n${modelValue.value ?? ""}`;
	for (const match of template.matchAll(PLACEHOLDER_PATTERN)) {
		const key = match[1];
		if (key && !(key in variables))
			variables[key] = `sample_${key.replace(/^@/, "").replace(/\./g, "_")}`;
	}
	return variables;
}

// Compile the current (possibly unsaved) template on the server and render it
// in a sandboxed iframe. The sandbox disables scripts, so arbitrary images or
// HTML/MJML markup in a template cannot affect the CMS or the editor session.
// Debounced so typing in the editor does not hammer the server.
async function refreshPreview() {
	const template = (modelValue.value ?? "").trim();
	if (!template || !import.meta.client) {
		previewHtml.value = "";
		previewText.value = "";
		previewSubject.value = "";
		return;
	}
	previewLoading.value = true;
	try {
		const response = await $fetch<
			apiResponse<{ html: string; subject: string; text: string }>
		>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/email/preview`,
			{
				method: "POST",
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
				body: {
					templateContent: modelValue.value ?? "",
					subject: item?.subject ?? "",
					variables: sampleVariables(),
				},
			},
		);
		previewHtml.value = response.result?.html ?? "";
		previewText.value = response.result?.text ?? "";
		previewSubject.value = response.result?.subject ?? "";
	} catch {
		// Preview is best-effort — never interrupt the editor.
		previewHtml.value = "";
		previewText.value = "";
		previewSubject.value = "";
	} finally {
		previewLoading.value = false;
	}
}

watch(
	[modelValue, () => item?.subject],
	() => {
		clearTimeout(previewTimer);
		previewTimer = setTimeout(refreshPreview, 400);
	},
	{ immediate: true },
);

onBeforeUnmount(() => clearTimeout(previewTimer));

// ── Send a test email with the current (possibly unsaved) template ─────────────

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
					subject: item?.subject ?? "",
					variables: sampleVariables(),
				},
			},
		);
		if (data.result) window.$message.success(data.message);
		else window.$message.error(data.message);
	} catch (error: unknown) {
		const message = (error as { data?: { message?: string } })?.data?.message;
		window.$message.error(message ?? t("emailSendFailed"));
	} finally {
		Loading.value.testEmail = false;
		showTestPopover.value = false;
	}
}
</script>

<style scoped>
.email-template-preview {
	background-color: rgba(128, 128, 128, 0.08);
	border-radius: 6px;
	margin: 0;
	padding: 12px;
	white-space: pre-wrap;
	word-break: break-word;
	max-height: 320px;
	overflow: auto;
}

.email-template-subject {
	display: block;
	font-size: 12px;
	margin-bottom: 8px;
}

.email-template-preview-frame {
	width: 100%;
	height: 480px;
	border: 1px solid rgba(128, 128, 128, 0.3);
	border-radius: 6px;
	background-color: #ffffff;
}
</style>