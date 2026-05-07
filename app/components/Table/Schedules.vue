<template>
	<div>
		<NFlex justify="space-between" align="center" style="margin-bottom: 16px; gap: 12px;">
			<div>
				<h1 style="margin: 0 0 4px;">{{ t("tableSchedules") }}</h1>
				<NText depth="3">{{ t("creationCronNotice") }}</NText>
			</div>
			<NButton type="primary" secondary round :loading="loading" @click="openCreateModal">
				<template #icon>
					<NIcon>
						<Icon name="tabler:plus" />
					</NIcon>
				</template>
				{{ t("addSchedule") }}
			</NButton>
		</NFlex>

		<NCard>
			<NFlex justify="space-between" align="center" style="margin-bottom: 12px; gap: 12px;">
				<NText depth="3">{{ t("friendlyScheduleHint") }}</NText>
				<NButton size="small" quaternary @click="loadSchedules">
					<template #icon>
						<NIcon>
							<Icon name="tabler:refresh" />
						</NIcon>
					</template>
					{{ t("refresh") }}
				</NButton>
			</NFlex>
			<NDataTable
				:columns="columns"
				:data="schedules"
				:loading="loading"
				:pagination="false"
				:single-line="false"
			/>
		</NCard>

		<NModal v-model:show="showModal" preset="card" :title="editingSchedule?.id ? t('editSchedule') : t('addSchedule')"
			style="max-width: 720px; width: calc(100vw - 24px);">
			<NForm label-placement="top">
				<NFormItem :label="t('name')">
					<NInput v-model:value="form.name" :placeholder="t('name')" />
				</NFormItem>
				<NFormItem :label="t('preset')">
					<NSelect v-model:value="form.preset" :options="presetOptions" />
                    <template #feedback>
					    <NText depth="3" style="margin: 8px 0 20px; display: block;">{{ currentPresetDescription }}</NText>
                    </template>
				</NFormItem>
				<NFormItem :label="t('cronExpression')">
					<NInput v-model:value="form.cronExpression" :disabled="form.preset !== 'custom'"
						:placeholder="t('cronExpression')" />
                    <NText v-if="form.preset === 'custom'" depth="3" style="margin-top: 6px; display: block;">
                        {{ t("customCronHint") }}
                    </NText>
				</NFormItem>
				<NFormItem :label="t('excludeDays')">
					<NCheckboxGroup v-model:value="form.excludeWeekdays">
						<NFlex wrap>
							<NCheckbox v-for="day of weekdayOptions" :key="day.value" :value="day.value" :label="day.label" />
						</NFlex>
					</NCheckboxGroup>
                    <template #feedback>
					    <NText depth="3" style="margin: 0 0 20px; display: block;">{{ t("excludeDaysHelp") }}</NText>
                    </template>
				</NFormItem>
				<NFormItem :label="t('payloadTemplate')">
					<NInput v-model:value="form.payloadText" type="textarea" :autosize="{ minRows: 8, maxRows: 18 }"
						:placeholder="t('payloadTemplate')" />
                    <template #feedback>
                        <NFlex style="margin: 8px 0 20px;" justify="space-between" align="center" wrap>
                            <NText depth="3">{{ t("payloadHelp") }}</NText>
                            <NButtonGroup size="small">
                                <NButton @click="formatPayloadText">{{ t("formatJSON") }}</NButton>
                                <NButton @click="fillPayloadExample">{{ t("fillExample") }}</NButton>
								<NButton :loading="previewing" @click="previewResolvedPayload">{{ t("previewResolvedPayload") }}</NButton>
                            </NButtonGroup>
                        </NFlex>
						<NText depth="3" style="display: block; margin: 0 0 8px;">{{ t("payloadTemplateVariablesHelp") }}</NText>
						<pre style="margin: 0; background: var(--n-code-color); border: 1px solid var(--n-border-color); border-radius: 10px; padding: 10px; max-height: 220px; overflow: auto; font-size: 12px; line-height: 1.45;">{{ payloadTemplateExamples }}</pre>
						<div v-if="resolvedPreviewText" style="margin-top: 12px;">
							<NText depth="3" style="display: block; margin: 0 0 8px;">{{ t("resolvedPayloadPreview") }}</NText>
							<pre style="margin: 0; background: var(--n-code-color); border: 1px solid var(--n-border-color); border-radius: 10px; padding: 10px; max-height: 240px; overflow: auto; font-size: 12px; line-height: 1.45;">{{ resolvedPreviewText }}</pre>
						</div>
                    </template>
				</NFormItem>
				<NAlert type="default" :show-icon="false" style="margin: 15px 0">
					{{ scheduleSummaryPreview }}
				</NAlert>
				<NFlex justify="space-between" align="center">
					<NText depth="3">{{ t("active") }}</NText>
					<NSwitch v-model:value="form.isActive" />
				</NFlex>
			</NForm>

			<template #footer>
				<NFlex justify="end">
					<NButton @click="closeModal">{{ t("cancel") }}</NButton>
					<NButton type="primary" :loading="saving" @click="saveSchedule">{{ t("save") }}</NButton>
				</NFlex>
			</template>
		</NModal>
	</div>
</template>

<script lang="ts" setup>
import type { DataTableColumns, SelectOption } from "naive-ui"
import Inison from "inison"
import { Icon, NButton, NButtonGroup, NIcon, NTag } from "#components"

const config = useRuntimeConfig()
const Language = useCookie<LanguagesType>("language", { sameSite: true })
const sessionID = useSessionCookie()

const database = useState<Database>("database")
const table = useState<Table>("table")

const loading = ref(false)
const saving = ref(false)
const previewing = ref(false)
const showModal = ref(false)
const schedules = ref<CreationSchedule[]>([])
const editingSchedule = ref<CreationSchedule | null>(null)
const resolvedPreviewText = ref("")

const presetCronMap: Record<Exclude<CreationSchedulePreset, "custom">, string> = {
	hourly: "0 * * * *",
	daily: "0 0 * * *",
	weekly: "0 0 * * 1",
	monthly: "0 0 1 * *",
}

const form = reactive({
	name: "",
	preset: "hourly" as CreationSchedulePreset,
	cronExpression: presetCronMap.hourly,
	payloadText: "{}",
	excludeWeekdays: [] as number[],
	isActive: true,
})

const presetOptions = computed<SelectOption[]>(() => [
	{ label: t("hourly"), value: "hourly" },
	{ label: t("daily"), value: "daily" },
	{ label: t("weekly"), value: "weekly" },
	{ label: t("monthly"), value: "monthly" },
	{ label: t("custom"), value: "custom" },
])

const weekdayOptions = computed(() => [
	{ label: t("sunday"), value: 0 },
	{ label: t("monday"), value: 1 },
	{ label: t("tuesday"), value: 2 },
	{ label: t("wednesday"), value: 3 },
	{ label: t("thursday"), value: 4 },
	{ label: t("friday"), value: 5 },
	{ label: t("saturday"), value: 6 },
])

const currentPresetDescription = computed(() => {
	switch (form.preset) {
		case "hourly":
			return t("presetDescriptionHourly")
		case "daily":
			return t("presetDescriptionDaily")
		case "weekly":
			return t("presetDescriptionWeekly")
		case "monthly":
			return t("presetDescriptionMonthly")
		default:
			return t("presetDescriptionCustom")
	}
})

const payloadTemplateExamples = computed(() =>
	JSON.stringify(
		{
			title: "Digest for {{ today|date }}",
			runAt: "{{ now }}",
			runAtISO: "{{ now|iso }}",
			expiresAt: "{{ now + 7d }}",
			meta: {
				scheduleId: "{{ schedule.id }}",
				database: "{{ database.slug }}",
				table: "{{ table.slug }}",
				note: "Generated at {{ run.iso }}",
			},
		},
		null,
		2,
	),
)

const scheduleSummaryPreview = computed(() => {
	const excluded = formatExcludedDays(form.excludeWeekdays)
	return excluded === t("noExcludedDays")
		? t("scheduleSummaryNoExcluded")
		: t("scheduleSummaryWithExcluded", { days: excluded })
})

watch(
	() => form.preset,
	(preset) => {
		if (preset !== "custom") form.cronExpression = presetCronMap[preset]
	},
)

function getRequestParams() {
	return {
		locale: Language.value,
		[`${database.value.slug}_sid`]: sessionID.value,
	}
}

function formatDate(value?: number) {
	if (!value) return "--"
	return new Date(value).toLocaleString()
}

function formatExcludedDays(excludedDays?: number[]) {
	if (!excludedDays?.length) return t("noExcludedDays")
	return excludedDays
		.map((day) => weekdayOptions.value.find((item) => item.value === day)?.label ?? String(day))
		.join(", ")
}

function buildPayloadExample() {
	const result: Record<string, any> = {}
	for (const field of table.value.schema ?? []) {
		if (["id", "createdAt", "updatedAt"].includes(field.key)) continue
		switch (Array.isArray(field.type) ? field.type[0] : field.type) {
			case "number":
				result[field.key] = 0
				break
			case "boolean":
				result[field.key] = false
				break
			case "date":
				result[field.key] = Date.now()
				break
			case "array":
				result[field.key] = []
				break
			case "object":
			case "json":
				result[field.key] = {}
				break
			case "table":
				result[field.key] = "<id>"
				break
			default:
				result[field.key] = ""
		}
	}
	return result
}

function parsePayloadText(payloadText: string) {
	const normalizedPayloadText = payloadText.trim()
	if (!normalizedPayloadText) return {}

	try {
		return JSON.parse(normalizedPayloadText)
	} catch {
		return Inison.unstringify(normalizedPayloadText) as Record<string, any>
	}
}

function formatPayloadText() {
	try {
		form.payloadText = JSON.stringify(parsePayloadText(form.payloadText || "{}"), null, 2)
	} catch {
		window.$message.error(t("invalidJSON"))
	}
}

function fillPayloadExample() {
	form.payloadText = JSON.stringify(buildPayloadExample(), null, 2)
}

async function previewResolvedPayload() {
	let payload: Record<string, unknown>

	try {
		payload = parsePayloadText(form.payloadText || "{}") as Record<string, unknown>
	} catch {
		window.$message.error(t("invalidJSON"))
		return
	}

	if (Array.isArray(payload) || !payload || typeof payload !== "object") {
		window.$message.error(t("invalidJSON"))
		return
	}

	previewing.value = true
	try {
		const response = await $fetch<apiResponse<Record<string, unknown>>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/${table.value.slug}/schedules/preview`,
			{
				method: "POST",
				body: {
					payload,
					scheduleID: editingSchedule.value?.id,
				},
				params: getRequestParams(),
				credentials: "include",
			},
		)

		resolvedPreviewText.value = JSON.stringify(response.result ?? {}, null, 2)
	} catch (error: unknown) {
		const errorMessage =
			typeof error === "object" && error !== null && "message" in error
				? String((error as { message?: unknown }).message ?? t("error"))
				: t("error")
		window.$message.error(errorMessage)
	} finally {
		previewing.value = false
	}
}

function resetForm() {
	form.name = ""
	form.preset = "hourly"
	form.cronExpression = presetCronMap.hourly
	form.payloadText = "{}"
	form.excludeWeekdays = []
	form.isActive = true
	resolvedPreviewText.value = ""
	editingSchedule.value = null
	showModal.value = false
	return true
}

function openCreateModal() {
	resetForm()
	showModal.value = true
}

function openEditModal(schedule: CreationSchedule) {
	editingSchedule.value = schedule
	form.name = schedule.name
	form.preset = schedule.preset ?? "custom"
	form.cronExpression = schedule.cronExpression
	form.payloadText = JSON.stringify(schedule.payload ?? {}, null, 2)
	form.excludeWeekdays = [...(schedule.excludeWeekdays ?? [])]
	form.isActive = schedule.isActive !== false
	resolvedPreviewText.value = ""
	showModal.value = true
}

function closeModal() {
	showModal.value = false
}

async function loadSchedules() {
	loading.value = true
	try {
		const response = await $fetch<apiResponse<CreationSchedule[]>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/${table.value.slug}/schedules`,
			{
				params: getRequestParams(),
				credentials: "include",
			},
		)

		if (response.result) schedules.value = response.result
		return response
	} catch (error: any) {
		window.$message.error(error?.data?.message ?? error?.message ?? t("error"))
		return null
	} finally {
		loading.value = false
	}
}

async function saveSchedule() {
	let payload: Record<string, any>

	try {
		payload = parsePayloadText(form.payloadText || "{}")
	} catch {
		window.$message.error(t("invalidJSON"))
		return
	}

	if (Array.isArray(payload) || !payload || typeof payload !== "object") {
		window.$message.error(t("invalidJSON"))
		return
	}

	if (form.excludeWeekdays.length >= 7) {
		window.$message.error(t("invalidExcludedDays"))
		return
	}

	saving.value = true
	try {
		const requestBody = {
			name: form.name,
			preset: form.preset,
			cronExpression: form.preset === "custom" ? form.cronExpression : undefined,
			payload,
			excludeWeekdays: [...form.excludeWeekdays].sort((a, b) => a - b),
			isActive: form.isActive,
		}

		const endpoint = editingSchedule.value?.id
			? `${config.public.apiBase}inicontent/databases/${database.value.slug}/${table.value.slug}/schedules/${editingSchedule.value.id}`
			: `${config.public.apiBase}inicontent/databases/${database.value.slug}/${table.value.slug}/schedules`

		const method = editingSchedule.value?.id ? "PUT" : "POST"
		const response = await $fetch<apiResponse<CreationSchedule>>(endpoint, {
			method,
			body: requestBody,
			params: getRequestParams(),
			credentials: "include",
		})

		if (response.result) {
			window.$message.success(response.message)
			closeModal()
			await loadSchedules()
		} else window.$message.error(response.message)
	} catch (error: any) {
		window.$message.error(error?.data?.message ?? error?.message ?? t("error"))
	} finally {
		saving.value = false
	}
}

async function removeSchedule(schedule: CreationSchedule) {
	if (!window.confirm(t("theFollowingActionIsIrreversible"))) return

	loading.value = true
	try {
		const response = await $fetch<apiResponse<boolean>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}/${table.value.slug}/schedules/${schedule.id}`,
			{
				method: "DELETE",
				params: getRequestParams(),
				credentials: "include",
			},
		)

		if (response.result || response.code === 204) {
			window.$message.success(response.message)
			await loadSchedules()
		} else window.$message.error(response.message)
	} catch (error: any) {
		window.$message.error(error?.data?.message ?? error?.message ?? t("error"))
	} finally {
		loading.value = false
	}
}

const columns = computed<DataTableColumns<CreationSchedule>>(() => [
	{
		title: t("name"),
		key: "name",
		minWidth: 180,
	},
	{
		title: t("status"),
		key: "isActive",
		width: 120,
		render: (schedule) =>
			h(
				NTag,
				{ type: schedule.isActive ? "success" : "default", bordered: false, round: true },
				{ default: () => (schedule.isActive ? t("active") : t("inactive")) },
			),
	},
	{
		title: t("cronExpression"),
		key: "cronExpression",
		minWidth: 160,
	},
	{
		title: t("excludedDays"),
		key: "excludeWeekdays",
		minWidth: 180,
		render: (schedule) => formatExcludedDays(schedule.excludeWeekdays),
	},
	{
		title: t("nextRunAt"),
		key: "nextRunAt",
		minWidth: 170,
		render: (schedule) => (schedule.isActive ? formatDate(schedule.nextRunAt) : "--"),
	},
	{
		title: t("lastRunAt"),
		key: "lastRunAt",
		minWidth: 170,
		render: (schedule) => formatDate(schedule.lastRunAt),
	},
	{
		title: t("lastError"),
		key: "lastError",
		minWidth: 200,
		render: (schedule) => schedule.lastError || "--",
	},
	{
		title: t("actions"),
		key: "actions",
		width: 120,
		render: (schedule) =>
			h(NButtonGroup, { size: "small" }, () => [
				h(
					NButton,
					{ secondary: true, type: "primary", onClick: () => openEditModal(schedule) },
					{
						icon: () =>
							h(NIcon, null, () => h(Icon, { name: "tabler:pencil" })),
					},
				),
				h(
					NButton,
					{ secondary: true, type: "error", onClick: () => removeSchedule(schedule) },
					{
						icon: () =>
							h(NIcon, null, () => h(Icon, { name: "tabler:trash" })),
					},
				),
			]),
	},
])

onMounted(loadSchedules)

useHead({
	title: `${t(database.value.slug)} | ${t(table.value.slug)} : ${t("tableSchedules")}`,
	link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
})
</script>