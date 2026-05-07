<template>
	<NDrawer
		:show="show"
		@update:show="emit('update:show', $event)"
		:width="drawerWidth"
		@update:width="drawerWidth = $event"
		resizable
		:placement="Language === 'ar' ? 'left' : 'right'"
	>
		<NDrawerContent
			:title="t('translateItem')"
			closable
			:native-scrollbar="false"
		>
			<template #header-extra>
				<NTag v-if="item?.id" round size="small" :bordered="false" type="default">
					{{ itemLabel }}
				</NTag>
			</template>

			<template #footer>
				<NFlex justify="end" style="width:100%">
					<NButton
						round
						secondary
						type="primary"
						:loading="saving"
						:disabled="!hasChanges || saving"
						@click="saveTranslations"
					>
						<template #icon>
							<NIcon>
								<Icon name="tabler:device-floppy" />
							</NIcon>
						</template>
						{{ t("save") }}
					</NButton>
				</NFlex>
			</template>

			<NSpin :show="loading">
				<NEmpty
					v-if="!secondaryLanguages.length"
					:description="t('noSecondaryLanguages')"
					style="padding: 32px 0"
				/>
				<NEmpty
					v-else-if="!translatableFields.length"
					:description="t('noTranslatableFields')"
					style="padding: 32px 0"
				/>
				<NTabs
					v-else
					v-model:value="activeLocale"
					type="line"
					animated
					style="margin-top: -8px"
				>
					<NTabPane
						v-for="locale in secondaryLanguages"
						:key="locale"
						:name="locale"
						:tab="t(`languages.${locale}`)"
					>
						<NFlex vertical :size="20" style="padding: 8px 0">
							<div v-for="field in translatableFields" :key="field.key">
								<NFlex align="center" :size="4" style="margin-bottom: 4px">
									<NText strong>{{ t(field.key) }}</NText>
									<NTag
										v-if="getTranslationEntry(locale, field.key)?.existingId"
										size="tiny"
										type="success"
										round
										:bordered="false"
									>
										{{ t("translated") }}
									</NTag>
								</NFlex>

								<!-- Original value (read-only) -->
								<NCard
									size="small"
									:bordered="false"
									style="background: var(--n-color-modal); margin-bottom: 6px; border-radius: 8px"
								>
									<NText depth="2" style="white-space: pre-wrap; word-break: break-word">
										{{ item?.[field.key] || "—" }}
									</NText>
								</NCard>

								<!-- Translation input -->
								<NInput
									v-if="['string', 'text', 'textarea', 'html'].includes(
										(field.subType ?? (Array.isArray(field.type) ? field.type[0] : field.type)) as string
									) && (field.subType === 'textarea' || field.type === 'textarea')"
									v-model:value="draft[locale][field.key]"
									type="textarea"
									:placeholder="t('translationPlaceholder')"
									:autosize="{ minRows: 2, maxRows: 6 }"
									clearable
									@input="markChanged(locale, field.key)"
								/>
								<NInput
									v-else
									v-model:value="draft[locale][field.key]"
									type="text"
									:placeholder="t('translationPlaceholder')"
									clearable
									@input="markChanged(locale, field.key)"
								/>
							</div>
						</NFlex>
					</NTabPane>
				</NTabs>
			</NSpin>
		</NDrawerContent>
	</NDrawer>
</template>

<script setup lang="ts">
import { flattenSchema } from "inibase/utils";
import Inison from "inison";

const props = defineProps<{
	show: boolean;
	item: Item | null;
}>();

const emit = defineEmits<{
	(e: "update:show", v: boolean): void;
}>();

const config = useRuntimeConfig();
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const sessionID = useSessionCookie();
const database = useState<Database>("database");
const table = useState<Table>("table");

const drawerWidth = useCookie<number | string>("translateDrawerWidth", {
	sameSite: true,
	default: () => 560,
});

// ── Derived ───────────────────────────────────────────────────────────────────

const secondaryLanguages = computed(
	() => database.value?.secondaryLanguages ?? [],
);

const activeLocale = ref<LanguagesType>(secondaryLanguages.value[0]);

const translatableTypes = new Set([
	"string",
	"text",
	"textarea",
	"html",
]);

const translatableFields = computed(() => {
	if (!table.value?.schema) return [];
	return flattenSchema(table.value.schema).filter((field) => {
		const type = Array.isArray(field.type) ? field.type[0] : field.type;
		const subType = field.subType;
		return (
			translatableTypes.has(type as string) ||
			(subType && translatableTypes.has(subType as string))
		) && !["password", "email", "url", "color", "icon", "link", "role"].includes(
			(subType ?? type) as string,
		);
	});
});

const itemLabel = computed(() =>
	props.item ? renderLabel(table.value, props.item) : "",
);

// ── State ─────────────────────────────────────────────────────────────────────

// draft[locale][fieldKey] = current input value
const draft = ref<Record<string, Record<string, string>>>({});

// existingMap[locale][fieldKey] = existing translation record id
const existingMap = ref<Record<string, Record<string, string>>>({});

// changedKeys[locale][fieldKey] = true when user edited
const changedKeys = ref<Record<string, Record<string, boolean>>>({});

const loading = ref(false);
const saving = ref(false);

const hasChanges = computed(() =>
	Object.values(changedKeys.value).some((localeMap) =>
		Object.values(localeMap).some(Boolean),
	),
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTranslationEntry(locale: string, fieldKey: string) {
	return {
		value: draft.value[locale]?.[fieldKey] ?? "",
		existingId: existingMap.value[locale]?.[fieldKey],
	};
}

function markChanged(locale: string, fieldKey: string) {
	if (!changedKeys.value[locale]) changedKeys.value[locale] = {};
	changedKeys.value[locale][fieldKey] = true;
}

function initDraft() {
	const langs = secondaryLanguages.value;
	const fields = translatableFields.value;
	const newDraft: Record<string, Record<string, string>> = {};
	const newChanged: Record<string, Record<string, boolean>> = {};
	for (const lang of langs) {
		newDraft[lang] = {};
		newChanged[lang] = {};
		for (const field of fields) {
			newDraft[lang][field.key] = "";
		}
	}
	draft.value = newDraft;
	changedKeys.value = newChanged;
	existingMap.value = {};
}

// ── Fetch existing translations ───────────────────────────────────────────────

async function fetchExisting() {
	if (!props.item?.id || !secondaryLanguages.value.length) return;
	loading.value = true;
	try {
		const result = (
			await $fetch<apiResponse<any[]>>(
				`${config.public.apiBase}${database.value.slug}/translation`,
				{
					params: {
						where: Inison.stringify({
							table: table.value.slug,
							item: String(props.item.id),
						}),
						options: Inison.stringify({ perPage: 500 }),
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)
		).result;

		if (!result) return;

		for (const record of result) {
			const locale: string =
				Array.isArray(record.locale) ? record.locale[0] : record.locale;
			const fieldKey: string = record.field;
			if (!locale || !fieldKey) continue;

			if (!existingMap.value[locale]) existingMap.value[locale] = {};
			existingMap.value[locale][fieldKey] = String(record.id);

			if (!draft.value[locale]) draft.value[locale] = {};
			// canonical first, legacy fallback
			draft.value[locale][fieldKey] =
				record.translation ?? record.translated ?? "";
		}
	} catch (e) {
		console.error("[TranslateDrawer] fetch error", e);
	} finally {
		loading.value = false;
	}
}

// ── Save ──────────────────────────────────────────────────────────────────────

async function saveTranslations() {
	if (!props.item?.id) return;
	saving.value = true;

	const operations: Promise<any>[] = [];

	for (const locale of secondaryLanguages.value) {
		for (const field of translatableFields.value) {
			const fieldKey = field.key;
			if (!changedKeys.value[locale]?.[fieldKey]) continue;

			const translationValue = draft.value[locale]?.[fieldKey] ?? "";
			const existingId = existingMap.value[locale]?.[fieldKey];

			if (existingId) {
				// Update existing record
				operations.push(
					$fetch(
						`${config.public.apiBase}${database.value.slug}/translations/${existingId}`,
						{
							method: "PUT",
							body: { translation: translationValue },
							params: {
								[`${database.value.slug}_sid`]: sessionID.value,
							},
							credentials: "include",
						},
					),
				);
			} else if (translationValue.trim()) {
				// Create new record
				operations.push(
					$fetch(
						`${config.public.apiBase}${database.value.slug}/translations`,
						{
							method: "POST",
							body: {
								original: props.item?.[fieldKey] ?? "",
								translation: translationValue,
								locale: [locale],
								table: table.value.slug,
								field: fieldKey,
								item: String(props.item!.id),
							},
							params: {
								[`${database.value.slug}_sid`]: sessionID.value,
							},
							credentials: "include",
						},
					).then((res: any) => {
						// Store the new record id for future saves
						if (res?.result?.id) {
							if (!existingMap.value[locale]) existingMap.value[locale] = {};
							existingMap.value[locale][fieldKey] = String(res.result.id);
						}
					}),
				);
			}
		}
	}

	try {
		await Promise.all(operations);
		window.$message.success(t("translationsSaved"));
		changedKeys.value = {};
	} catch (e: any) {
		window.$message.error(e?.message ?? t("error"));
	} finally {
		saving.value = false;
	}
}

// ── Watch for open ────────────────────────────────────────────────────────────

watch(
	() => props.show,
	async (open) => {
		if (!open) return;
		// reset to first language when re-opened
		if (secondaryLanguages.value[0])
			activeLocale.value = secondaryLanguages.value[0];
		initDraft();
		await fetchExisting();
	},
);
</script>
