<template>
	<NDrawer :show="show" @update:show="emit('update:show', $event)" :width="drawerWidth"
		@update:width="drawerWidth = $event" resizable :placement="Language === 'ar' ? 'left' : 'right'">
		<NDrawerContent :title="t('translateItem')" closable :native-scrollbar="false">
			<template #footer>
				<NFlex justify="end" style="width:100%">
					<NButton round secondary type="primary" :loading="saving" :disabled="!hasChanges || saving"
						@click="saveTranslations">
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
				<NEmpty v-if="!secondaryLanguages.length" :description="t('noSecondaryLanguages')"
					style="padding: 32px 0" />
				<NEmpty v-else-if="!translatableFields.length" :description="t('noTranslatableFields')"
					style="padding: 32px 0" />
				<NTabs v-else v-model:value="activeLocale" type="line" animated style="margin-top: -8px">
					<NTabPane v-for="locale in secondaryLanguages" :key="locale" :name="locale"
						:tab="t(`languages.${locale}`)">
						<NFlex vertical :size="20" style="padding: 8px 0">
							<div v-for="field in translatableFields" :key="field.key">
								<NFlex align="center" :size="4" style="margin-bottom: 4px">
									<NText strong>{{ t(field.key) }}</NText>
									<NTag v-if="getTranslationEntry(locale, field.id)?.existingId" size="tiny"
										type="success" round :bordered="false">
										{{ t("translated") }}
									</NTag>
								</NFlex>

								<!-- Original value (editable via pencil icon) -->
								<NCard size="small" :bordered="false"
									style="background: var(--n-color-modal); margin-bottom: 6px; border-radius: 8px">
									<template #header>
										<NFlex align="center" :size="6" style="width: 100%">
											<NText depth="3" style="font-size: 12px">
												{{ t("original") }}:
											</NText>
											<NButton quaternary circle size="tiny" type="warning"
												@click="toggleEditOriginal(field)">
												<template #icon>
													<NIcon :size="14">
														<Icon name="tabler:pencil" />
													</NIcon>
												</template>
											</NButton>
										</NFlex>
									</template>
									<LazyField v-if="editingOriginal[field.key]"
										:field="{ ...field, inputProps: { onBlur: () => saveOriginal(field), 'on:keydown.enter.prevent': () => saveOriginal(field), 'on:keydown.esc': () => toggleEditOriginal(field) } }"
										v-model="originalDraft[field.key]" />
									<NText v-else depth="3" style="white-space: pre-wrap; word-break: break-word">
										{{ displayOriginal(field.key) || "—" }}
									</NText>
								</NCard>

								<!-- Translation input (rendered by field type) -->
								<LazyField :field="field" v-model="draft[locale][field.id]" />
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
import {
	isArrayLikeField,
	isEmptyTranslationValue,
	isTranslatableField,
	normalizeTranslationValue,
	parseTranslationValue,
} from "~/composables/translationValue";

const props = defineProps<{
	show: boolean;
	item: Item | null;
}>();

const emit = defineEmits<(e: "update:show", v: boolean) => void>();

const config = useRuntimeConfig();
const Language = useLanguageCookie();
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

const translatableFields = computed(() => {
	if (!table.value?.schema) return [];
	return flattenSchema(table.value.schema, true).filter(
		(field) => !field.key.includes(".") && isTranslatableField(field),
	);
});

function getItemValue(fieldKey: string): unknown {
	const isMainLanguage = Language.value === database.value?.primaryLanguage;
	const source =
		!isMainLanguage && mainLanguageItem.value
			? mainLanguageItem.value
			: props.item;
	if (!source) return undefined;
	return (source as any)[fieldKey];
}

function displayOriginal(fieldKey: string): string {
	const value = getItemValue(fieldKey);
	return stringifyValue(value);
}

function stringifyValue(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (Array.isArray(value)) return JSON.stringify(value);
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
}

const itemLabel = computed(() =>
	props.item ? renderLabel(table.value, props.item) : "",
);

// ── State ─────────────────────────────────────────────────────────────────────

// draft[locale][fieldId] = current typed input value (string, item, array, …)
const draft = ref<Record<string, Record<string | number, unknown>>>({});

// baseline[locale][fieldId] = the loaded value before the user edited it, used
// to detect changes (covers in-place array mutations from repeater/tag fields).
const baseline = ref<Record<string, Record<string | number, unknown>>>({});

// existingMap[locale][fieldId] = existing translation record id
const existingMap = ref<Record<string, Record<string, string>>>({});

// changedKeys[locale][fieldId] = true when the user edited the value
const changedKeys = ref<Record<string, Record<string, boolean>>>({});

const loading = ref(false);
const saving = ref(false);
const originalSaving = ref(false);

// editingOriginal[fieldKey] = true while editing the original value
const editingOriginal = ref<Record<string, boolean>>({});

// originalDraft[fieldKey] = in-progress edit of original value
const originalDraft = ref<Record<string, unknown>>({});

// original item data in the primary language, fetched only when the current
// language is not the primary language
const mainLanguageItem = ref<Item | null>(null);

const hasChanges = computed(() =>
	Object.values(changedKeys.value).some((localeMap) =>
		Object.values(localeMap).some(Boolean),
	),
);

// ── Change tracking ───────────────────────────────────────────────────────────

function snapshotValues(
	source: Record<string, Record<string | number, unknown>>,
): Record<string, Record<string | number, unknown>> {
	return JSON.parse(JSON.stringify(source)) as typeof draft.value;
}

function updateChangedFlags() {
	for (const lang of secondaryLanguages.value) {
		if (!changedKeys.value[lang]) changedKeys.value[lang] = {};
		for (const field of translatableFields.value) {
			changedKeys.value[lang][field.id] =
				JSON.stringify(draft.value[lang]?.[field.id]) !==
				JSON.stringify(baseline.value[lang]?.[field.id]);
		}
	}
}

watch(draft, updateChangedFlags, { deep: true });

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTranslationEntry(locale: string, fieldId: string | number) {
	return {
		value: draft.value[locale]?.[fieldId] ?? "",
		existingId: existingMap.value[locale]?.[String(fieldId)],
	};
}

function toggleEditOriginal(field: Field) {
	const fieldKey = field.key;
	if (!editingOriginal.value[fieldKey]) {
		originalDraft.value[fieldKey] = deepClone(getItemValue(fieldKey));
		editingOriginal.value[fieldKey] = true;
	} else {
		editingOriginal.value[fieldKey] = false;
	}
}

function initDraft() {
	const langs = secondaryLanguages.value;
	const fields = translatableFields.value;
	const newDraft: Record<string, Record<string | number, unknown>> = {};
	const newChanged: Record<string, Record<string, boolean>> = {};
	for (const lang of langs) {
		newDraft[lang] = {};
		newChanged[lang] = {};
		for (const field of fields) {
			newDraft[lang][field.id] = isArrayLikeField(field) ? [] : "";
		}
	}
	draft.value = newDraft;
	baseline.value = snapshotValues(newDraft);
	changedKeys.value = newChanged;
	existingMap.value = {};
	editingOriginal.value = {};
	originalDraft.value = {};
}

// ── Fetch translations for the current item across ALL locales ──────────────
async function fetchItemTranslations() {
	initDraft();
	if (!props.item?.id) return;
	try {
		const result = (
			await $fetch<apiResponse<Item[]>>(
				`${config.public.apiBase}${database.value.slug}/translations`,
				{
					params: {
						where: Inison.stringify({
							table: table.value.id,
							item: props.item.id,
						}),
						options: Inison.stringify({ perPage: 500 }),
						locale: Language.value,
						[`${database.value.slug}_sid`]: sessionID.value,
					},
					credentials: "include",
				},
			)
		).result;

		const fieldById = new Map(
			translatableFields.value.map((field) => [String(field.id), field]),
		);

		if (result)
			for (const record of result) {
				const fieldId: string = record.field;
				if (!record.locale || !fieldId) continue;
				const field = fieldById.get(fieldId);
				if (!field) continue;
				if (!existingMap.value[record.locale])
					existingMap.value[record.locale] = {};
				existingMap.value[record.locale][fieldId] = String(record.id);
				if (!draft.value[record.locale]) draft.value[record.locale] = {};
				draft.value[record.locale][fieldId] = parseTranslationValue(
					field,
					record.translation ?? record.translated ?? "",
				);
			}

		// Snapshot the loaded state so change detection has a baseline.
		baseline.value = snapshotValues(draft.value);
		updateChangedFlags();
	} catch (e) {
		console.error("[TranslateDrawer] fetch item translations error", e);
	}
}

// ── Fetch the original item data in the primary language ─────────────────────
// When the current language is not the primary one, the row passed in
// (`props.item`) holds translated values, so the true "original" has to be
// fetched separately in the primary language.
async function fetchMainLanguageItem() {
	const primary = database.value?.primaryLanguage;
	mainLanguageItem.value = null;
	if (!props.item?.id || !primary || Language.value === primary) return;

	try {
		const res = await $fetch<apiResponse<Item>>(
			`${config.public.apiBase}${database.value.slug}/${table.value.slug}/${props.item.id}`,
			{
				params: {
					locale: primary,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		);
		mainLanguageItem.value = res?.result ?? null;
	} catch (e) {
		console.error("[TranslateDrawer] fetch main language item error", e);
	}
}

// ── Save ──────────────────────────────────────────────────────────────────────

async function saveTranslations() {
	if (!props.item?.id) return;
	saving.value = true;

	const baseUrl = `${config.public.apiBase}${database.value.slug}/translations`;
	const sidLang = {
		locale: Language.value,
		[`${database.value.slug}_sid`]: sessionID.value,
	};
	const itemId = String(props.item.id);

	// Group changes so we send as few requests as possible: every new
	// translation in one POST, every modified one in one PUT, every deleted
	// one in one DELETE.
	const toCreate = [];
	const createdIndex: { locale: string; fieldId: string }[] = [];
	const toUpdate = [];
	const toDelete = [];

	for (const locale of secondaryLanguages.value) {
		for (const field of translatableFields.value) {
			const fieldId = String(field.id);
			if (!changedKeys.value[locale]?.[fieldId]) continue;

			const rawValue = draft.value[locale]?.[field.id];
			const translationValue = normalizeTranslationValue(field, rawValue);
			const empty = isEmptyTranslationValue(rawValue);
			const existingId = existingMap.value[locale]?.[fieldId];

			// Clearing an existing translation removes its record entirely.
			if (existingId && empty) {
				toDelete.push(existingId);
			} else if (existingId) {
				toUpdate.push({ id: existingId, translation: translationValue });
			} else if (!empty) {
				toCreate.push({
					translation: translationValue,
					locale,
					table: table.value.slug,
					field: field.id,
					item: itemId,
				});
				createdIndex.push({ locale, fieldId });
			}
		}
	}

	const operations: Promise<any>[] = [];

	if (toCreate.length) {
		const createOps = $fetch(baseUrl, {
			method: "POST",
			body: toCreate.length === 1 ? toCreate[0] : toCreate,
			params: sidLang,
			credentials: "include",
		});
		operations.push(
			createOps.then((res: any) => {
				const result = res?.result;
				const ids = Array.isArray(result)
					? result.map((r: any) => (r && typeof r === "object" ? r.id : r))
					: result?.id != null
						? [result.id]
						: [];
				// Store the created record ids for future saves
				for (let i = 0; i < ids.length && i < createdIndex.length; i++) {
					const { locale, fieldId } = createdIndex[i] as {
						locale: string;
						fieldId: string;
					};
					if (!existingMap.value[locale]) existingMap.value[locale] = {};
					existingMap.value[locale][fieldId] = String(ids[i]);
				}
			}),
		);
	}

	if (toDelete.length) {
		if (toDelete.length === 1) {
			operations.push(
				$fetch(`${baseUrl}/${toDelete[0]}`, {
					method: "DELETE",
					params: sidLang,
					credentials: "include",
				}),
			);
		} else {
			operations.push(
				$fetch(baseUrl, {
					method: "DELETE",
					body: toDelete,
					params: sidLang,
					credentials: "include",
				}),
			);
		}
	}

	if (toUpdate.length) {
		if (toUpdate.length === 1) {
			operations.push(
				$fetch(`${baseUrl}/${toUpdate[0].id}`, {
					method: "PUT",
					body: { translation: toUpdate[0].translation },
					params: sidLang,
					credentials: "include",
				}),
			);
		} else {
			operations.push(
				$fetch(baseUrl, {
					method: "PUT",
					body: toUpdate,
					params: sidLang,
					credentials: "include",
				}),
			);
		}
	}

	try {
		await Promise.allSettled(operations);
		window.$message.success(t("translationsSaved"));
		changedKeys.value = {};
		baseline.value = snapshotValues(draft.value);
	} catch (e: any) {
		window.$message.error(e?.message ?? t("error"));
	} finally {
		saving.value = false;
	}
}

// ── Save original value (PUT) ────────────────────────────────────────────────

async function saveOriginal(field: Field) {
	const fieldKey = field.key;
	const newOriginal = originalDraft.value[fieldKey];
	const oldOriginal = getItemValue(fieldKey);
	editingOriginal.value[fieldKey] = false;

	if (
		JSON.stringify(newOriginal ?? null) ===
			JSON.stringify(oldOriginal ?? null) ||
		!props.item?.id
	)
		return;

	const bodyValue: unknown =
		newOriginal === undefined || newOriginal === null ? "" : newOriginal;

	// Update the local item so subsequent display reflects the change; when the
	// current language is not the primary one, update the fetched
	// main-language item instead
	if (mainLanguageItem.value)
		(mainLanguageItem.value as any)[fieldKey] = bodyValue;
	else if (props.item) (props.item as any)[fieldKey] = bodyValue;

	// Update the source item's field value to stay in sync
	originalSaving.value = true;
	const ops: Promise<any>[] = [
		$fetch(
			`${config.public.apiBase}${database.value.slug}/${table.value.slug}/${props.item.id}`,
			{
				method: "PUT",
				body: { [fieldKey]: bodyValue },
				params: {
					locale: database.value?.primaryLanguage,
					[`${database.value.slug}_sid`]: sessionID.value,
				},
				credentials: "include",
			},
		),
	];

	try {
		await Promise.all(ops);
		window.$message.success(t("savedSuccessfully"));
	} catch (e: any) {
		window.$message.error(e?.message ?? t("error"));
	} finally {
		originalSaving.value = false;
	}
}

// ── Watch for open ────────────────────────────────────────────────────────────

watch(
	() => props.show,
	async (open) => {
		if (!open) return;
		// open on the current interface language tab, otherwise fall back to
		// the first secondary language
		if (Language.value && secondaryLanguages.value.includes(Language.value))
			activeLocale.value = Language.value;
		else if (secondaryLanguages.value[0])
			activeLocale.value = secondaryLanguages.value[0];
		// fetch this item's translations across all locales, plus the original
		// item data when the current language is not the primary one
		loading.value = true;
		try {
			await Promise.all([fetchItemTranslations(), fetchMainLanguageItem()]);
		} finally {
			loading.value = false;
		}
	},
);
</script>