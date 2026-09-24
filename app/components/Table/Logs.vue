<template>
	<NCollapse v-if="hasLogs" :default-expanded-names="isOpen ? ['logs'] : []" @item-header-click="handleCollapseChange">
		<NCollapseItem name="logs">
			<template #header>
				<NH3 style="margin: 0">{{ t('latestActivities') }}</NH3>
			</template>
			<NCard>
				<NSpin :show="Loading.logs">
					<NScrollbar v-if="data?.result" style="max-height: 340px">
						<NTimeline :item-placement="Language === 'ar' ? 'right' : 'left'">
							<NTimelineItem v-for="(log, index) in data.result?.filter((log) => log.actions?.length)" :key="log.id"
								:type="getTypeFromAction((log.actions[0] as Actions[0])[0])">
								<template #header>
									<NFlex align="center" size="small">
										<NFlex align="center" size="small">
											<NButton size="tiny" type="primary">
												{{ renderLabel(usersTable, log.madeBy) }}
											</NButton>
											<template v-if="(log.actions[0] as Actions[0])[0] === 'create'">
												{{ t('created') }} {{ t("newItem") }}:
												<NButtonGroup>
													<NButton v-for="item in ([] as Item[]).concat(log.item)" round secondary
														size="tiny" type="primary">
														{{ renderLabel(table, item, `[${t('removed')}]`) }}
													</NButton>
												</NButtonGroup>
											</template>
											<template v-else-if="(log.actions[0] as Actions[0])[0] === 'delete'">
												{{ t('deleted') }} {{ t("anItem") }}
											</template>
											<template v-else>
												{{ t('updated') }}
												<NButtonGroup>
													<NButton v-for="item in ([] as Item[]).concat(log.item)" round secondary
														size="tiny" type="primary">{{ renderLabel(table, item) }}
													</NButton>
												</NButtonGroup>
												{{ t('asFollow') }}:
											</template>
										</NFlex>
										<!-- Revert button - only show for non-revert actions and not the latest log -->
										<NButton
											v-if="canRevert(log, index)"
											size="tiny"
											type="warning"
											circle
											@click="confirmRevert(log)"
											:disabled="Loading.revert === log.id"
										>
											<template #icon>
												<NIcon>
													<Icon name="tabler:restore" />
												</NIcon>
											</template>
										</NButton>
									</NFlex>
								</template>
								<NFlex vertical style="line-height: 2.5;">
									<template v-for="action in log.actions">
										<NText v-if="action[0] === 'unset'">{{ t(action[0]) }} <NTag :bordered="false" round
												type="warning" size="small">{{
													actionTargetLabel(action[1]) }}</NTag>
										</NText>
										<NText v-else-if="action[0] === 'remove'">{{ t(action[0]) }} {{ t("from") }}
											<NTag :bordered="false" round type="error" size="small">{{
												actionTargetLabel(action[1]) }}</NTag>
										</NText>
										<NText v-else-if="action[0] === 'add'">{{ t(action[0]) }} {{ t("to") }} <NTag
												:bordered="false" round type="success" size="small">{{ actionTargetLabel(action[1]) }}</NTag>
										</NText>
										<NText v-else-if="action[0] === 'set' || action[0] === 'update'">{{ t(action[0]) }}
											<NTag :bordered="false" round type="info" size="small">{{
												actionTargetLabel(action[1]) }}</NTag> {{ t(action[0] === 'update' ? 'to' : 'as') }}
											<NFlex v-if="(asset = assetFromAction(log, action))" align="center" size="small"
												class="asset-value">
												<LazyAssetThumb :asset="asset" :size="20" :hide-tooltip="true" />
												<NTag :bordered="false" round size="small" class="asset-name"><span
														class="asset-name-text">{{
															asset.name }}</span></NTag>
											</NFlex>
											<NTag v-else :bordered="false" round size="small">{{ t(action[2]) }}
											</NTag>
										</NText>
										<NText v-else-if="action[0] === 'revert'">{{ t('revertedToVersion') }} <NTag
												:bordered="false" round type="success" size="small">{{ formatRevertTime(action[2]?.restoredFrom) }}</NTag>
										</NText>
									</template>
								</NFlex>
								<template #footer>
									<NTime :time="log.createdAt" type="relative" />
								</template>
							</NTimelineItem>
						</NTimeline>
					</NScrollbar>
				</NSpin>
			</NCard>
		</NCollapseItem>
	</NCollapse>

	<!-- Revert Confirmation Dialog -->
	<NModal preset="dialog"
		v-model:show="showRevertDialog"
		:title="t('revertToVersion')"
		:content="t('revertConfirmMessage')"
		:positive-text="t('revert')"
		:negative-text="t('cancel')"
		@positive-click="executeRevert"
		:loading="Loading.revert === pendingRevertLog?.id"
	/>
</template>

<script lang="ts" setup>
import { flattenSchema } from "inibase/utils"
import Inison from "inison"

type ActionName =
	| "set"
	| "add"
	| "remove"
	| "update"
	| "unset"
	| "delete"
	| "create"
	| "revert"
type Actions = [ActionName, string, any?][]
interface Log extends Item {
	actions: Actions
	madeBy?: User
	item: Item | Item[]
}

const { id, open } = defineProps<{
	id?: string | number
	open?: boolean
}>()
const isOpen = ref(open)

const config = useRuntimeConfig()
const Loading = useState<Record<string, boolean | string>>("Loading", () => ({}))
const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>("language", database.value?.slug)

const usersTable = database.value.tables?.find(({ slug }) => slug === "users")

const table = useState<Table>("table")

onBeforeRouteLeave(() => {
	clearNuxtData(`${database.value.slug}/${table.value?.slug as string}/logs`)
})

const sessionID = useScopedCookie<string>("sid", database.value?.slug)
const hasLogs = ref(true)

const { data, execute, refresh } = await useLazyFetch<apiResponse<Log[]>>(
	() => `${config.public.apiBase}${database.value.slug}/${table.value.slug}/logs`,
	{
		query: {
			where: id ? `{item:${id}}` : undefined,
			options: Inison.stringify({
				columns: [
					"*",
					...(table.value.columns?.map((column) => `item.${column}`) ?? []),
					...(usersTable?.columns?.map((column) => `madeBy.${column}`) ?? []),
				],
			}),
			locale: Language,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		immediate: false,
		onRequest() {
			Loading.value.logs = true
		},
		onResponse: ({ response: { _data } }) => {
			Loading.value.logs = false
			hasLogs.value = !!_data?.result?.length
		},
		credentials: "include",
	},
)

let firstTime = true
watch(
	isOpen,
	(newValue) => {
		if (newValue && firstTime) {
			execute()
			firstTime = false
		}
	},
	{ immediate: true },
)

// Refetch logs when the current language changes (log messages are
// locale-dependent), but only once they've been loaded at least once
watch(Language, () => {
	if (!firstTime) execute()
})

function handleCollapseChange({
	name,
	expanded,
}: {
	name: string | number
	expanded: boolean
}) {
	if (name === "logs") isOpen.value = expanded
}

function getTypeFromAction(
	ActionName: ActionName,
): "error" | "info" | "success" {
	switch (ActionName) {
		case "create":
			return "success"
		case "delete":
			return "error"
		default:
			return "info"
	}
}

// Flattened current-table schema. Log actions address fields by raw schema id;
// the API maps ids back to keys but falls through for ids missing from the
// current schema (e.g. fields deleted after the edit was recorded) — so we
// re-resolve them here and translate the field label instead of a raw number.
const flatSchema = computed(() => flattenSchema(table.value?.schema ?? [], true))

/** Display label for an action's target: a field key/path, or a raw field id
 *  (decimal-encoded like "45.47") resolved against the current schema. */
function actionTargetLabel(target: unknown): string {
	if (typeof target === "number" || typeof target === "string") {
		const str = String(target)
		const idPart = str.match(/^\d+(?:\.\d+)?/)
		if (idPart) {
			const field = flatSchema.value.find(
				({ id }) => String(id) === idPart?.[0],
			)
			if (field?.key)
				return t(
					`${field.key.split(".").pop() ?? field.key}${str.slice(idPart[0].length)}`,
				)
			return str
		}
	}
	return t(target as string)
}

/** True when `value` looks like an asset object (id + name + extension/
 *  publicURL). Relation objects (e.g. `العميل`) embed an id but no name or
 *  extension, so they fall through. */
function isAssetObject(value: unknown): value is Asset {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		typeof (value as Asset).id === "string" &&
		typeof (value as Asset).name === "string" &&
		(typeof (value as Asset).extension === "string" ||
			typeof (value as Asset).publicURL === "string")
	)
}

/** Resolve an action's field path (e.g. `المرفقات.ملفات طباعة[0]`,
 *  `المنتجات[1].موك اب[0]`) inside the log's item snapshot. */
function resolveActionPath(
	item: Item | Item[] | undefined,
	path: string,
): unknown {
	let node: unknown = ([] as Item[]).concat(item)[0]
	if (node === undefined || node === null) return undefined
	for (const part of path.split(".").filter(Boolean)) {
		if (part === "*") return undefined
		const bracket = part.match(/^([^[\]]+)((?:\[\d+\])+)$/)
		if (bracket) {
			node = (node as Record<string, unknown>)?.[bracket[1] as string]
			if (node === undefined || node === null) return undefined
			for (const index of [...bracket[2].matchAll(/\[(\d+)\]/g)].map((m) =>
				Number(m[1]),
			)) {
				node = (node as unknown[])?.[index]
				if (node === undefined || node === null) return undefined
			}
		} else {
			node = (node as Record<string, unknown>)?.[part]
			if (node === undefined || node === null) return undefined
		}
	}
	return node
}

/** Best-effort asset behind a `set`/`update` action's value: either the value
 *  is a full asset object, or it's an asset id that still matches the current
 *  item state at the action's path. Log `item` snapshots reflect the current
 *  state, so replaced/removed assets can't be recovered — those fall back to
 *  the raw id tag. */
function assetFromAction(
	log: Log,
	action: Actions[number],
): Asset | undefined {
	const value = action[2]
	if (isAssetObject(value)) return value
	if (typeof value !== "string" || typeof action[1] !== "string")
		return undefined
	const node = resolveActionPath(log.item, action[1])
	if (isAssetObject(node) && node.id === value) return node
	return undefined
}

// Scratch variable used by the template to render an action asset once
let asset: Asset | undefined

// Revert functionality
const showRevertDialog = ref(false)
const pendingRevertLog = ref<Log | null>(null)

function canRevert(log: Log, index: number): boolean {
	// Don't show revert button for revert actions themselves
	if (log.actions[0]?.[0] === "revert") return false
	// Don't show for the latest log (current state)
	if (index === 0) return false
	// Don't show if already loading revert for this log
	return Loading.value.revert !== log.id
}

function confirmRevert(log: Log) {
	pendingRevertLog.value = log
	showRevertDialog.value = true
}

async function executeRevert() {
	if (!pendingRevertLog.value || !id) return

	Loading.value.revert = pendingRevertLog.value.id

	try {
		const response = await $fetch<apiResponse<Item>>(
			`${config.public.apiBase}${database.value.slug}/${table.value.slug}/${id}/revert`,
			{
				method: "POST",
				body: { logId: pendingRevertLog.value.id },
				credentials: "include",
				query: { [`${database.value.slug}_sid`]: sessionID.value },
			},
		)

		if (response.result) {
			window.$message?.success(t("revertSuccess"))
			// Refresh the item data and logs
			await refreshNuxtData(`${database.value.slug}/${table.value.slug}/${id}`)
			await refresh()
		} else {
			window.$message?.error(response.message || t("revertFailed"))
		}
	} catch (error: any) {
		window.$message?.error(error.data?.message || t("revertFailed"))
	} finally {
		Loading.value.revert = false
		showRevertDialog.value = false
		pendingRevertLog.value = null
	}
}

function formatRevertTime(timestamp?: number): string {
	if (!timestamp) return ""
	const date = new Date(timestamp)
	return date.toLocaleString()
}
</script>

<style scoped>
.revert-icon {
	transition: transform 0.3s ease;
}
.revert-icon:hover {
	transform: rotate(180deg);
}
.asset-name {
	max-width: 220px;
}
.asset-name-text {
	display: inline-block;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	vertical-align: bottom;
}
</style>
