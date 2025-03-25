<template>
	<NH3>{{ t('latestActivities') }}</NH3>
	<NSpin v-if="data?.result || status === 'pending'" :show="Loading.logs">
		<NScrollbar v-if="data?.result" style="max-height: 340px">
			<NTimeline :item-placement="Language === 'ar' ? 'right' : 'left'">
				<NTimelineItem v-for="log in data.result" :key="log.id" :type="getTypeFromAction(log.actions[0][0])">
					<template #header>
						<NFlex align="center" size="small">
							{{ renderLabel(usersTable, log.madeBy) }}
							<template v-if="log.actions[0][0] === 'create'">
								{{ t('created') }} {{ t("newItem") }}
							</template>
							<template v-else-if="log.actions[0][0] === 'delete'">
								{{ t('deleted') }} {{ t("anItem") }}
							</template>
							<template v-else>
								{{ t('updated') }}
								<NButtonGroup v-if="Array.isArray(log.item)">
									<NButton v-for="item in log.item" secondary size="small" type="primary">{{ item }}
									</NButton>
								</NButtonGroup>
								<NButton v-else size="small" round secondary type="primary">{{ log.item }}</NButton>
								{{ t('asFollow') }}:
							</template>
						</NFlex>
					</template>
					<NFlex vertical>
						<template v-for="action in log.actions">
							<NText v-if="action[0] === 'unset'">{{ t(action[0]) }} {{ action[1] }}</NText>
							<NText v-else-if="action[0] === 'remove'">{{ t(action[0]) }} {{ t("from") }} <NTag
									:bordered="false" round>{{ action[1] }}</NTag>
							</NText>
							<NText v-else-if="action[0] === 'add'">{{ t(action[0]) }} {{ t("to") }} <NTag
									:bordered="false" round>{{ action[1] }}</NTag>
							</NText>
							<NText v-else-if="action[0] === 'set'">{{ t(action[0]) }} <NTag :bordered="false" round>{{
								action[1] }}</NTag> {{ t("as") }} <NTag :bordered="false" round>{{ action[2] }}
								</NTag>
							</NText>
							<NText v-else-if="action[0] === 'update'">{{ t(action[0]) }} <NTag :bordered="false" round>
									{{ action[1] }}</NTag> {{
										t("to") }}
								<NTag :bordered="false" round>{{ action[2] }}</NTag>
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
	<NEmpty v-else />
</template>

<script lang="ts" setup>
import {
	NH3,
	NSpin,
	NScrollbar,
	NTimeline,
	NTimelineItem,
	NText,
	NTime,
	NEmpty,
	NFlex,
	NTag,
	NButtonGroup,
	NButton,
} from "naive-ui";

type ActionName =
	| "set"
	| "add"
	| "remove"
	| "update"
	| "unset"
	| "delete"
	| "create";
type Actions = [ActionName, string, any?][];
interface Log extends Item {
	actions: Actions;
	madeBy?: User;
	item: string | number | (string | number)[];
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
		created: "قام بإنشاء",
		anItem: "عنصر",
		asFollow: "كالأتي",
		in: "في",
		to: "إلى",
		from: "من",
		as: "كـ",
		item: "عنصر",
	},
});

const props = defineProps<{ item?: string | number }>();

const appConfig = useAppConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const database = useState<Database>("database");
const usersTable = database.value.tables?.find(({ slug }) => slug === "users");
const table = useState<Table>("table");
const { data, status } = await useLazyFetch<apiResponse<Log[]>>(
	`${appConfig.apiBase}${database.value.slug}/${table.value.slug}/logs`,
	{
		onRequest() {
			Loading.value.logs = true;
		},
		onResponse() {
			Loading.value.logs = false;
		},
	},
);
function getTypeFromAction(
	ActionName: ActionName,
): "error" | "info" | "success" {
	switch (ActionName) {
		case "create":
			return "success";
		case "delete":
			return "error";
		default:
			return "info";
	}
}
</script>
