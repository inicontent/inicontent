<template>
	<UAccordion :default-expanded-names="isOpen ? ['logs'] : []" @item-header-click="handleCollapseChange">
		<UAccordionItem name="logs">
			<template #header>
				<h3 class="font-semibold"4 style="margin: 0">{{ t('latestActivities') }}</NH4>
			</template>
			<div class="animate-spin" :show="Loading.logs">
				<div class="overflow-auto" v-if="data?.result" style="max-height: 340px">
					<timeline :item-placement="Language === 'ar' ? 'right' : 'left'">
						<timelineItem v-for="log in data.result?.filter((log) => log.actions?.length)" :key="log.id"
							:type="getTypeFromAction((log.actions[0] as Actions[0])[0])">
							<template #header>
								<div class="flex" align="center" size="small">
									<span type="primary">{{ renderLabel(usersTable, log.madeBy) }}</span>
									<template v-if="(log.actions[0] as Actions[0])[0] === 'create'">
										{{ t('created') }} {{ t("newItem") }}:
										<UButtonGroup>
											<UButton v-for="item in ([] as Item[]).concat(log.item)" round secondary
												size="small" type="primary">
												{{ renderLabel(table, item, `[${t('removed')}]`) }}
											</UButton>
										</div>
									</template>
									<template v-else-if="(log.actions[0] as Actions[0])[0] === 'delete'">
										{{ t('deleted') }} {{ t("anItem") }}
									</template>
									<template v-else>
										{{ t('updated') }}
										<UButtonGroup>
											<UButton v-for="item in ([] as Item[]).concat(log.item)" round secondary
												size="small" type="primary">{{ renderLabel(table, item) }}
											</UButton>
										</div>
										{{ t('asFollow') }}:
									</template>
								</div>
							</template>
							<div class="flex flex-col" style="line-height: 2.5;">
								<template v-for="action in log.actions">
									<span v-if="action[0] === 'unset'">{{ t(action[0]) }} <UBadge :bordered="false" round
											type="warning">{{
												t(action[1]) }}</UBadge>
									</span>
									<span v-else-if="action[0] === 'remove'">{{ t(action[0]) }} {{ t("from") }}
										<UBadge :bordered="false" round type="error">{{ t(action[1]) }}</UBadge>
									</span>
									<span v-else-if="action[0] === 'add'">{{ t(action[0]) }} {{ t("to") }} <UBadge
											:bordered="false" round type="success">{{ t(action[1]) }}</UBadge>
									</span>
									<span v-else-if="action[0] === 'set'">{{ t(action[0]) }} <UBadge :bordered="false"
											round type="info">{{ t(action[1]) }}</UBadge> {{ t("as") }} <UBadge
											:bordered="false" round>{{ t(action[2]) }}
										</UBadge>
									</span>
									<span v-else-if="action[0] === 'update'">{{ t(action[0]) }} <UBadge :bordered="false"
											round type="info">
											{{ t(action[1]) }}</UBadge> {{
												t("to") }}
										<UBadge :bordered="false" round>{{ t(action[2]) }}</UBadge>
									</span>
								</template>
							</div>
							<template #footer>
								<time :time="log.createdAt" type="relative" />
							</template>
						</NTimelineItem>
					</NTimeline>
				</div>
			</div>
		</UAccordionItem>
	</UAccordion>
</template>

<script lang="ts" setup>
import Inison from "inison"

type ActionName =
	| "set"
	| "add"
	| "remove"
	| "update"
	| "unset"
	| "delete"
	| "create"
type Actions = [ActionName, string, any?][]
interface Log extends Item {
	actions: Actions
	madeBy?: User
	item: Item | Item[]
}

defineTranslation({
	ar: {
		latestActivities: "أخر العمليات",
		set: "تحديد",
		unset: "إفراغ",
		remove: "إزالة عنصر",
		add: "إضافة عنصر",
		updated: "قام بتعديل",
		deleted: "قام بحذف",
		removed: "محذوف",
		created: "قام بإنشاء",
		anItem: "عنصر",
		asFollow: "كالأتي",
		in: "في",
		to: "إلى",
		from: "من",
		as: "كـ",
		item: "عنصر",
	},
})

const { id, open } = defineProps<{
	id?: string | number
	open?: boolean
}>()
const isOpen = ref(open)

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const Language = useCookie<LanguagesType>("language", { sameSite: true })
const database = useState<Database>("database")

const usersTable = database.value.tables?.find(({ slug }) => slug === "users")

const table = useState<Table>("table")

onBeforeRouteLeave(() => {
	clearNuxtData(`${database.value.slug}/${table.value?.slug as string}/logs`)
})

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

const { data, execute } = await useLazyFetch<apiResponse<Log[]>>(
	() => `${appConfig.apiBase}${database.value.slug}/${table.value.slug}/logs`,
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
			locale: Language.value,
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		immediate: false,
		onRequest() {
			Loading.value.logs = true
		},
		onResponse() {
			Loading.value.logs = false
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
</script>
