<template>
	<div class="chat-interface">
		<template v-if="subscriptionChecked && hasActiveSubscription">
		<div ref="scrollbarRef" class="messages-area" @scroll="handleScroll">
			<NFlex v-for="(message, index) in messages" :key="index" :wrap="false" align="start" class="message-row"
				:justify="isRTL ? (message.sender === 'User' ? 'start' : 'end') : (message.sender === 'User' ? 'end' : 'start')"
				:reverse="isRTL">
				<NButton v-if="message.sender === 'AI'" circle>
					<Icon name="tabler:robot" />
				</NButton>

				<NCard :bordered="true" class="message-card">
					<template v-if="message.sender === 'AI'" #header>
						<div class="message-text">
							{{ message.text }}
						</div>
					</template>
					<div v-if="message.sender === 'User'" class="message-text">
						{{ message.text }}
					</div>

					<!-- Database picker: context switch, not an approval, so it has no action buttons. -->
					<NFlex
						v-if="message.action === 'database_selection_needed' && !message.selectedDatabase"
						align="center"
						:wrap="true"
						:size="8"
						style="margin-top: 8px;"
					>
						<NButton
							v-for="option in message.databases ?? []"
							:key="option.slug"
							size="small"
							round
							:loading="switchingDatabaseSlug === option.slug"
							@click="selectDatabaseForPendingRequest(message, option)"
						>
							<template #icon>
								<NIcon><Icon name="tabler:database" /></NIcon>
							</template>
							{{ option.label }}
						</NButton>
					</NFlex>

					<template v-if="message.action && (['database_approval_pending', 'roles_defined', 'tables_naming_pending', 'tables_approval_pending', 'structure_generated', 'data_approval_pending', 'translation_approval_pending', 'dashboards_approval_pending', 'dashboards_delete_pending']).includes(message.action)">
						<NFlex align="center" :wrap="true">
							<NTag v-if="message.action === 'database_approval_pending' && getMessageDatabasePlan(message)" size="small" round type="success">
								<template #icon><NIcon><Icon name="tabler:database-plus" /></NIcon></template>
								{{ getMessageDatabasePlan(message)?.slug }}
							</NTag>

							<NButton
								v-else-if="message.action === 'tables_naming_pending'"
								v-for="(tableName, nameIndex) in getMessageNameTables(message)"
								:key="nameIndex"
								size="small"
								round
								:title="tableName.label || tableName.slug"
							>
								<template #icon>
									<LazyTableIcon :table="tableName" />
								</template>
								{{ tableName.slug }}
								<NTag
									v-if="tableName.isNew !== undefined"
									:type="tableName.isNew ? 'success' : 'warning'"
									size="small"
									round
									style="margin-inline-start: 4px;"
								>
									{{ tableName.isNew ? t('new') : t('edit') }}
								</NTag>
							</NButton>

							<NButton
								v-else-if="message.action === 'tables_approval_pending'"
								v-for="(table, tableIndex) in getMessageTables(message)"
								:key="tableIndex"
								size="small"
								round
								@click="openTableDemoModal(table)"
							>
								<template #icon>
									<LazyTableIcon :table />
								</template>
								{{ table.slug }}
								<NTag
									v-if="table.isNew !== undefined"
									:type="table.isNew ? 'success' : 'warning'"
									size="small"
									round
									style="margin-inline-start: 4px;"
								>
									{{ table.isNew ? t('new') : t('edit') }}
								</NTag>
							</NButton>

							<NButton
								v-else-if="message.action === 'roles_defined'"
								v-for="table in uniqueTables"
								:key="table"
								@click="selectRoleTable(table)"
								:type="selectedTable === table ? 'primary' : 'default'"
								size="small"
								round
							>
								<template #icon>
									<Icon :name="`tabler:${getTableIcon(table) || 'question-mark'}`" />
								</template>
								{{ table }}
							</NButton>

							<template v-else-if="message.action === 'structure_generated'">
								<NButton
									v-for="page in getMessagePages(message)"
									:key="page.slug"
									size="small"
									round
									@click="openPagePreviewModal(page)"
								>
									/{{ page.slug }}
								</NButton>
								<NButton
									v-for="(rb, rbIndex) in getMessageReusableBlocks(message)"
									:key="`reusable-${rbIndex}`"
									size="small"
									round
									type="warning"
								>
									<template #icon>
										<NIcon><Icon name="tabler:layers-linked" /></NIcon>
									</template>
									{{ rb.name }}
								</NButton>
							</template>

							<template v-else-if="message.action === 'data_approval_pending'">
								<NButton
									v-for="item in getMessageDataItems(message)"
									:key="item.table"
									size="small"
									round
									type="success"
									secondary
									@click="openDataItemPreviewModal(item)"
								>
									<template #icon><NIcon><Icon name="tabler:eye" /></NIcon></template>
									{{ item.table }} ({{ item.records.length }})
								</NButton>
								<NTag v-if="message.loadingMore" size="small" round type="warning">
									<template #icon><NIcon><Icon name="tabler:loader-2" class="spin-icon" /></NIcon></template>
									{{ t('generatingMoreTables') }}
								</NTag>
							</template>

							<template v-else-if="message.action === 'translation_approval_pending'">
								<NTag v-for="item in getMessageTranslationPlan(message)" :key="`${item.table}_${item.locale}`" size="small" round type="warning">
									<template #icon><NIcon><Icon name="tabler:language" /></NIcon></template>
									{{ item.table }} → {{ item.locale }}
								</NTag>
							</template>

							<NButton
								v-else-if="message.action === 'dashboards_approval_pending'"
								v-for="(dashboard, dashboardIndex) in getMessageDashboards(message)"
								:key="dashboardIndex"
								size="small"
								round
								@click="openDashboardPreviewModal(dashboard)"
							>
								<template #icon>
									<NIcon><Icon :name="`tabler:${tablerIcon(dashboard.icon)}`" /></NIcon>
								</template>
								{{ dashboard.name }}
								<NTag
									v-if="dashboard.id !== undefined"
									type="warning"
									size="small"
									round
									style="margin-inline-start: 4px;"
								>
									{{ t('edit') }}
								</NTag>
								<NTag
									v-else
									type="success"
									size="small"
									round
									style="margin-inline-start: 4px;"
								>
									{{ t('new') }}
								</NTag>
							</NButton>

							<NTag v-else-if="message.action === 'dashboards_delete_pending'" size="small" round type="error">
								<template #icon><NIcon><Icon name="tabler:trash" /></NIcon></template>
								{{ t('delete') }} ({{ getMessageDeleteIDs(message).length }})
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'database_approval_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingDatabaseIndex === index" :disabled="applyingDatabaseIndex !== null" @click="applyDatabase(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:database-plus" />
									</NIcon>
								</template>
								{{ t('createDatabase') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'database_approval_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('applied') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'tables_approval_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingIndex === index" :disabled="applyingIndex !== null" @click="applyTables(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('applyChanges') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'tables_approval_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('applied') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'tables_naming_pending' && !message.continued && !message.superseded && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingIndex === index" :disabled="applyingIndex !== null" @click="continueToSchema(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:arrow-right" />
									</NIcon>
								</template>
								{{ t('continue') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'tables_naming_pending' && message.superseded" justify="end" style="margin-top: 8px;">
							<NTag type="info" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:refresh" />
									</NIcon>
								</template>
								{{ t('namesUpdated') }}
							</NTag>
						</NFlex>
						<NFlex v-else-if="message.action === 'tables_naming_pending' && message.continued" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('continued') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'data_approval_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingDataIndex === index" :disabled="applyingDataIndex !== null || message.loadingMore" @click="applyData(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:database-import" />
									</NIcon>
								</template>
								{{ t('publishData') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'data_approval_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('published') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'translation_approval_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingTranslateIndex === index" :disabled="applyingTranslateIndex !== null" @click="applyTranslation(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:language" />
									</NIcon>
								</template>
								{{ t('translateData') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'translation_approval_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('translated') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'dashboards_approval_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="primary" :loading="applyingDashboardsIndex === index" :disabled="applyingDashboardsIndex !== null" @click="applyDashboards(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:layout-dashboard-plus" />
									</NIcon>
								</template>
								{{ t('applyChanges') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'dashboards_approval_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('applied') }}
							</NTag>
						</NFlex>

						<NFlex v-if="message.action === 'dashboards_delete_pending' && !message.applied && isAdmin" justify="end" style="margin-top: 8px;">
							<NButton size="small" type="error" :loading="applyingDashboardsIndex === index" :disabled="applyingDashboardsIndex !== null" @click="applyDashboardDeletes(message, index)">
								<template #icon>
									<NIcon>
										<Icon name="tabler:trash" />
									</NIcon>
								</template>
								{{ t('delete') }}
							</NButton>
						</NFlex>
						<NFlex v-else-if="message.action === 'dashboards_delete_pending' && message.applied" justify="end" style="margin-top: 8px;">
							<NTag type="success" size="small" round>
								<template #icon>
									<NIcon>
										<Icon name="tabler:check" />
									</NIcon>
								</template>
								{{ t('deleted') }}
							</NTag>
						</NFlex>
					</template>

					<template v-if="message.action === 'roles_defined' && selectedTable">
						<NTable striped size="small" style="margin-top: 8px;">
							<thead>
								<tr>
									<th>{{ t('role') }}</th>
									<th>C</th>
									<th>R</th>
									<th>U</th>
									<th>D</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="roleData in rolesForSelectedTable" :key="roleData.role">
									<td>{{ roleData.role }}</td>
									<td>
										<NIcon :color="getPermissionIcon(roleData.allowedMethods, 'c').color">
											<Icon :name="getPermissionIcon(roleData.allowedMethods, 'c').name" />
										</NIcon>
									</td>
									<td>
										<NIcon :color="getPermissionIcon(roleData.allowedMethods, 'r').color">
											<Icon :name="getPermissionIcon(roleData.allowedMethods, 'r').name" />
										</NIcon>
									</td>
									<td>
										<NIcon :color="getPermissionIcon(roleData.allowedMethods, 'u').color">
											<Icon :name="getPermissionIcon(roleData.allowedMethods, 'u').name" />
										</NIcon>
									</td>
									<td>
										<NIcon :color="getPermissionIcon(roleData.allowedMethods, 'd').color">
											<Icon :name="getPermissionIcon(roleData.allowedMethods, 'd').name" />
										</NIcon>
									</td>
								</tr>
							</tbody>
						</NTable>
					</template>

					<NFlex
						v-if="message.translationResults?.length"
						vertical
						:size="8"
						class="translation-results"
					>
						<NFlex
							v-for="result in message.translationResults"
							:key="`${result.table}_${result.locale}`"
							align="center"
							justify="space-between"
							:wrap="false"
							class="translation-result-row"
						>
							<NFlex align="center" :size="8" :wrap="false">
								<strong>{{ result.table }}</strong>
								<NTag size="small" round type="info">{{ result.locale }}</NTag>
							</NFlex>
							<span class="translation-result-count">
								{{ t('translationCount', { count: result.count }) }}
							</span>
						</NFlex>
					</NFlex>
					<NFlex
						v-if="message.action === 'dashboards_approval_pending'"
						vertical
						:size="8"
						style="margin-top: 8px;"
					>
						<NCard
							v-for="(dashboard, dashboardIndex) in getMessageDashboards(message)"
							:key="dashboardIndex"
							size="small"
							:bordered="true"
						>
							<NFlex align="center" :wrap="true" style="margin-bottom: 6px;">
								<NIconWrapper :border-radius="50" style="font-style: normal">
									<NIcon size="16">
										<Icon :name="`tabler:${tablerIcon(dashboard.icon)}`" />
									</NIcon>
								</NIconWrapper>
								<NH4 style="margin: 0">{{ dashboard.name }}</NH4>
								<NTag
									v-if="dashboard.id !== undefined"
									size="small"
									round
									type="warning"
									style="margin-inline-start: 4px;"
								>
									{{ t('edit') }}
								</NTag>
								<NTag
									v-else
									size="small"
									round
									type="success"
									style="margin-inline-start: 4px;"
								>
									{{ t('new') }}
								</NTag>
							</NFlex>
							<NText
								v-if="dashboard.description"
								depth="3"
								style="display: block; margin-bottom: 6px;"
							>
								{{ dashboard.description }}
							</NText>
							<NFlex :wrap="true" :size="6">
								<NTag
									v-for="(widget, widgetIndex) in dashboard.widgets || []"
									:key="widgetIndex"
									size="small"
									round
								>
									{{ widget.title }} · {{ t(widget.type) || widget.type }}
								</NTag>
							</NFlex>
						</NCard>
					</NFlex>
				</NCard>

				<NButton v-if="message.sender === 'User'" type="primary" circle>
					<Icon name="tabler:user-circle" />
				</NButton>
			</NFlex>
		</div>
		<NFlex align="center" class="message-input">
			<NInput ref="inputRef" type="textarea" :rows="1" style="flex: 1; max-height: 200px; overflow-y: auto"
				:autosize="{ minRows: 2, maxRows: 5 }" v-model:value="currentMessage" :placeholder="dynamicPlaceholder"
				@keydown.enter="handleEnterKey" :disabled="loading" clearable />
			<NButton :loading type="primary" secondary @click="sendMessage"
				:disabled="!currentMessage.trim() || loading">
				<template #icon>
					<NIcon>
						<Icon name="tabler:send" />
					</NIcon>
				</template>
			</NButton>
		</NFlex>
		<NFlex v-if="$attrs.onSkip" justify="center">
			<NButton text size="small" :disabled="loading" @click="$emit('skip')">
				{{ t('skipAiHelp') }}
			</NButton>
		</NFlex>
		<NModal v-model:show="showTableModal" preset="card" :title="`${t(previewModalTitleKey)}: ${t(dataTable.title)}`"
			size="large">
			<template #header-extra>
				<NButton v-if="tableModalHistory.length" size="small" secondary circle @click="undoTableDemoModal">
					<template #icon>
						<NIcon><Icon name="tabler:arrow-back-up" /></NIcon>
					</template>
				</NButton>
			</template>
			<NDataTable v-if="showTableModal" :columns="dataTable.columns" :data="dataTable.data" />
		</NModal>

		<LazyChatPagePreview
			v-if="showPageModal"
			:show="showPageModal"
			:page="selectedPageData"
			:primary-color="databaseModel?.primaryColor"
			@update:show="showPageModal = $event"
		/>

		<NModal v-model:show="showDashboardModal" preset="card" :title="t('dashboardPreview')" size="large">
			<NFlex vertical :size="10">
				<NText v-if="selectedDashboardPreview?.description" depth="3">
					{{ selectedDashboardPreview.description }}
				</NText>
				<NCard
					v-for="(widget, widgetIndex) in selectedDashboardPreview?.widgets || []"
					:key="widgetIndex"
					size="small"
				>
					<NFlex align="center" justify="space-between" :wrap="false">
						<NFlex align="center" :size="8" :wrap="false">
							<NTag size="small" round>{{ t(widget.type) || widget.type }}</NTag>
							<strong>{{ widget.title }}</strong>
						</NFlex>
						<NTag size="small" round type="info">
							{{ getWidgetTableLabel(widget) || t('sourceTable') }}
						</NTag>
					</NFlex>
					<NFlex v-if="getWidgetDetails(widget).length" :wrap="true" :size="6" style="margin-top: 6px;">
						<NTag v-for="(detail, detailIndex) in getWidgetDetails(widget)" :key="detailIndex" size="small" round quaternary>
							{{ detail }}
						</NTag>
					</NFlex>
				</NCard>
			</NFlex>
		</NModal>
		</template>

		<template v-else-if="subscriptionChecked">
			<NCard :bordered="true" class="message-card" style="max-width: 100%;">
				<NFlex vertical :size="12" align="start">
					<div style="white-space: pre-wrap">
						{{ t('chatPaidPlanRequired') }}
					</div>
					<NFlex :wrap="true" :size="8">
						<NButton type="primary" secondary @click="goToPricing">
							{{ t('billing') }}
						</NButton>
						<NButton v-if="$attrs.onSkip" text @click="$emit('skip')">
							{{ t('skipAiHelp') }}
						</NButton>
					</NFlex>
				</NFlex>
			</NCard>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { DataTableColumns } from "naive-ui";
import { buildChatGenerationMessage, buildChatRoutingMessage, buildCreateDatabaseMessage, redirectChat } from "../utils/chatRouting";
import { Icon, LazyColumn, NFlex } from "#components";

const props = defineProps<{
	endpoint?: string;
	persistKey?: string;
	resetNonce?: number;
}>();
const emit = defineEmits<{ skip: []; databaseCreated: [database: Database] }>();
const databaseModel = defineModel<Database>("database");
const route = useRoute();
const { hasActiveSubscription, loadSubscriptionData } = useSubscription();

type DatabaseOption = {
	slug: string;
	label: string;
	primaryLanguage?: string;
	secondaryLanguages?: string[];
	primaryColor?: string;
};

type MessageAction =
	| "clarification_needed"
	| "database_selection_needed"
	| "database_approval_pending"
	| "tables_naming_pending"
	| "tables_approval_pending"
	| "data_approval_pending"
	| "translation_approval_pending"
	| "dashboards_approval_pending"
	| "dashboards_delete_pending"
	| "rejected"
	| "error"
	| "roles_defined"
	| "redirect"
	| "structure_generated"
	| "completed";

type TableResponse = {
	slug: string;
	schema: Schema;
	demo: Array<Record<string, unknown>>;
	defaultSearchableColumns?: number[];
	icon?: string;
	isNew?: boolean;
	label?: string;
};

/** A proposed table name (names step): no schema/demo yet. */
type TableNameProposal = {
	id?: string;
	slug: string;
	oldSlug?: string;
	label?: string;
	icon?: string;
	isNew?: boolean;
};

type RolePermission = {
	table: string;
	allowedMethods: string;
};

type RoleResponse = {
	role: string;
	permissions: RolePermission[];
};

type PageResponse = {
	slug: string;
	seo?: { title?: string };
	template?: { table?: string; segments?: Record<string, string> };
	content?: unknown;
};

/** A NEW reusable component proposed by the AI (no id yet — created later). */
type ReusableBlockProposal = {
	name: string;
	config?: Record<string, unknown>;
};

type DataItem = {
	table: string;
	records: Array<Record<string, unknown>>;
};

type TranslationPlanItem = {
	table: string;
	locale: string;
};

type TranslationResult = {
	table: string;
	locale: string;
	count: number;
	success: boolean;
};

/** A widget proposed by the dashboard assistant (field refs are table/field
 *  ids once sanitized, matching the front-end `Widget` contract). */
type DashboardWidgetProposal = {
	id?: string | number;
	icon?: string;
	type: string;
	title: string;
	table: string;
	field?: string | number;
	operation?: string;
	groupBy?: string | number;
	dateField?: string | number;
	dateRange?: string;
	limit?: number;
	color?: string;
	size?: string;
	searchArray?: Record<string, unknown>;
	columns?: (string | number)[];
	sortField?: string | number;
	sortOrder?: string;
};

/** A dashboard proposed by the assistant, pending user approval. */
type DashboardProposal = {
	id?: string | number;
	name: string;
	description?: string;
	icon?: string;
	widgets?: DashboardWidgetProposal[];
};

type DatabasePlan = {
	slug: string;
	primaryLanguage?: string;
	secondaryLanguages?: string[];
	primaryColor?: string;
	tablesPrompt?: string;
};

type AIResponsePayload = {
	action: MessageAction | "redirect";
	target?: string;
	questions?: string[];
	tables?: TableResponse[] | TableNameProposal[];
	roles?: RoleResponse[];
	pages?: PageResponse[];
	items?: DataItem[] | TranslationPlanItem[];
	remainingTables?: string[];
	database?: DatabasePlan;
	databases?: DatabaseOption[];
	// Named `targetDatabase` rather than `target`: `target` is already the
	// string routing label a `redirect` action carries.
	targetDatabase?: { slug: string; label: string };
	canCreate?: boolean;
	reusableBlocks?: ReusableBlockProposal[];
	dashboards?: DashboardProposal[];
	deleteIDs?: Array<string | number>;
	message?: string;
};

type AIHttpEnvelope = {
	responseID?: string;
	response?: AIResponsePayload | null;
	action?: string;
	target?: string;
	questions?: string[];
	tables?: TableResponse[];
	roles?: RoleResponse[];
	pages?: PageResponse[];
	items?: DataItem[];
	database?: DatabasePlan;
	databases?: DatabaseOption[];
	targetDatabase?: { slug: string; label: string };
	canCreate?: boolean;
	reusableBlocks?: ReusableBlockProposal[];
	message?: string;
	result?: {
		responseID?: string;
		response?: AIResponsePayload | null;
		action?: string;
		target?: string;
		questions?: string[];
		tables?: TableResponse[];
		roles?: RoleResponse[];
		pages?: PageResponse[];
		items?: DataItem[];
		database?: DatabasePlan;
		databases?: DatabaseOption[];
		targetDatabase?: { slug: string; label: string };
		canCreate?: boolean;
		reusableBlocks?: ReusableBlockProposal[];
		message?: string;
	};
};

type Message = {
	sender: "User" | "AI";
	text: string;
	action?: MessageAction;
	response?: unknown;
	responseID?: string;
	requestText?: string;
	reusableBlocks?: ReusableBlockProposal[];
	applied?: boolean;
	/** A pending names card that a newer proposal replaced. */
	superseded?: boolean;
	/** A names card the user already continued to the schema step. */
	continued?: boolean;
	/** Databases offered by a `database_selection_needed` card. */
	databases?: DatabaseOption[];
	/** Set once the user picks one, so the card stops offering a choice. */
	selectedDatabase?: string;
	translationResults?: TranslationResult[];
	/** Data-agent tables the AI still has to generate for this message, auto-fetched next. */
	remainingTables?: string[];
	loadingMore?: boolean;
};

type PersistedChatState = {
	messages: Message[];
	responseID: string;
	currentEndpoint?: string;
	currentMessage: string;
	chatDatabaseContext: Database | null;
	selectedTable: string | null;
};

const MAX_PERSISTED_CHAT_STATE_LENGTH = 180_000;
const RECENT_MESSAGES_TO_KEEP = 30;
const RECENT_MESSAGES_FALLBACK = 8;
const PROTECTED_TABLES = new Set([
	"users",
	"sessions",
	"assets",
	"translations",
	"pages",
	"blocks",
	"dashboards",
	"templates",
	"passkey_credentials",
	"passkey_challenges",
]);
const DEFAULT_TRANSLATION_KEYS = new Set([
	"name",
	"slug",
	"description",
	"title",
	"content",
	"type",
	"status",
	"date",
	"time",
	"size",
	"link",
	"label",
	"icon",
	"username",
	"email",
	"password",
	"role",
	"item",
]);

const collectTranslationKeys = (
	field: Record<string, unknown>,
	parentPath = "",
	seen = new Set<string>(),
): string[] => {
	const key = typeof field.key === "string" ? field.key.trim() : "";
	if (!key) return [];
	if (DEFAULT_TRANSLATION_KEYS.has(key.toLowerCase())) return [];

	const path = parentPath ? `${parentPath}.${key}` : key;
	const children = Array.isArray(field.children)
		? field.children
		: isRecord(field.children)
			? [field.children]
			: [];

	if (!children.length) {
		return [path];
	}

	const keys: string[] = [];
	for (const child of children) {
		if (!isRecord(child)) continue;
		for (const nestedKey of collectTranslationKeys(child, path, seen)) {
			if (!seen.has(nestedKey)) {
				seen.add(nestedKey);
				keys.push(nestedKey);
			}
		}
	}

	return keys;
};

const summarizeTranslationContext = (
	tables: Array<{ slug: string; schema?: Schema }> = [],
): Record<string, string[]> => {
	const summarized: Record<string, string[]> = {};
	for (const table of tables) {
		if (typeof table.slug !== "string" || PROTECTED_TABLES.has(table.slug))
			continue;
		const keys = new Set<string>();
		for (const field of Array.isArray(table.schema) ? table.schema : []) {
			if (!isRecord(field)) continue;
			for (const key of collectTranslationKeys(field, "", keys)) {
				keys.add(key);
			}
		}
		if (keys.size) summarized[table.slug] = Array.from(keys).sort();
	}
	return summarized;
};

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);
const isRTL = computed(() => Language.value === "ar");
const sessionID = useScopedCookie<string>("sid", database.value?.slug);
const platformSessionID = useScopedCookie<string>("sid", "inicontent");

const currentEndpoint = ref(props.endpoint);
const subscriptionChecked = ref(false);

const routeDatabaseSlug = computed(() => {
	const value = route.params.database;
	if (Array.isArray(value)) return value[0] ?? "";
	return value ? String(value) : "";
});

const pricingPath = computed(() => {
	const slug =
		routeDatabaseSlug.value ||
		databaseModel.value?.slug ||
		database.value?.slug ||
		"";
	if (slug && slug !== "inicontent") return `/${slug}/pricing`;
	return "/pricing";
});

const goToPricing = async () => {
	await navigateTo(pricingPath.value);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const isTableResponse = (value: unknown): value is TableResponse =>
	isRecord(value) &&
	typeof value.slug === "string" &&
	Array.isArray(value.schema);

const isTableNameProposal = (value: unknown): value is TableNameProposal =>
	isRecord(value) &&
	typeof value.slug === "string" &&
	value.slug.trim().length > 0;

const isRoleResponse = (value: unknown): value is RoleResponse => {
	if (
		!isRecord(value) ||
		typeof value.role !== "string" ||
		!Array.isArray(value.permissions)
	) {
		return false;
	}

	return value.permissions.every(
		(permission) =>
			isRecord(permission) &&
			typeof permission.table === "string" &&
			typeof permission.allowedMethods === "string",
	);
};

const isPageResponse = (value: unknown): value is PageResponse =>
	isRecord(value) && typeof value.slug === "string";

const isReusableBlockProposal = (
	value: unknown,
): value is ReusableBlockProposal =>
	isRecord(value) && typeof value.name === "string";

const isDataItem = (value: unknown): value is DataItem =>
	isRecord(value) &&
	typeof value.table === "string" &&
	Array.isArray(value.records);

const isTranslationPlanItem = (value: unknown): value is TranslationPlanItem =>
	isRecord(value) &&
	typeof value.table === "string" &&
	typeof value.locale === "string" &&
	!Array.isArray(value.records);

const isDashboardProposal = (value: unknown): value is DashboardProposal =>
	isRecord(value) && typeof value.name === "string";

const isDatabasePlan = (value: unknown): value is DatabasePlan =>
	isRecord(value) &&
	typeof value.slug === "string" &&
	value.slug.trim().length > 0;

const normalizeHexColor = (value?: string): string | undefined => {
	if (!value) return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
	return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withHash)
		? withHash.toLowerCase()
		: undefined;
};

const isAIResponsePayload = (value: unknown): value is AIResponsePayload =>
	isRecord(value) && typeof value.action === "string";

const isMessage = (value: unknown): value is Message =>
	isRecord(value) &&
	(value.sender === "User" || value.sender === "AI") &&
	typeof value.text === "string" &&
	(value.action === undefined || typeof value.action === "string");

const migrateTranslationSummary = (message: Message): Message => {
	if (message.sender !== "AI" || message.translationResults?.length)
		return message;

	const results = Array.from(
		message.text.matchAll(/([\w-]+)→([\w-]+):\s*(\d+)\s+translations/g),
	).map((match) => ({
		table: match[1] as string,
		locale: match[2] as string,
		count: Number(match[3]),
		success: true,
	}));

	return results.length
		? { ...message, text: t("translated"), translationResults: results }
		: message;
};

const createPersistedChatState = (
	chatMessages: Message[],
): PersistedChatState => ({
	messages: chatMessages,
	responseID: responseID.value,
	currentEndpoint: currentEndpoint.value,
	currentMessage: currentMessage.value,
	chatDatabaseContext: chatDatabaseContext.value,
	selectedTable: selectedTable.value,
});

const serializePersistedChatState = (): string => {
	const state = createPersistedChatState(messages.value);
	let serialized = JSON.stringify(state);
	if (serialized.length <= MAX_PERSISTED_CHAT_STATE_LENGTH) return serialized;

	const importantMessages = new Set(
		messages.value
			.map((message, index) =>
				message.action && message.action !== "error" ? index : -1,
			)
			.filter((index) => index >= 0),
	);
	const recentStart = Math.max(
		0,
		messages.value.length - RECENT_MESSAGES_TO_KEEP,
	);
	let trimmedMessages = messages.value.filter(
		(_message, index) => importantMessages.has(index) || index >= recentStart,
	);
	serialized = JSON.stringify(createPersistedChatState(trimmedMessages));
	if (serialized.length <= MAX_PERSISTED_CHAT_STATE_LENGTH) return serialized;

	const fallbackStart = Math.max(
		0,
		messages.value.length - RECENT_MESSAGES_FALLBACK,
	);
	trimmedMessages = messages.value.filter(
		(_message, index) => importantMessages.has(index) || index >= fallbackStart,
	);
	serialized = JSON.stringify(createPersistedChatState(trimmedMessages));
	if (serialized.length <= MAX_PERSISTED_CHAT_STATE_LENGTH) return serialized;

	return JSON.stringify(
		createPersistedChatState(
			messages.value.slice(fallbackStart).map((message) => ({
				...message,
				response: message.action ? message.response : undefined,
				text:
					message.text.length > 4_000
						? `${message.text.slice(0, 4_000)}...`
						: message.text,
			})),
		),
	);
};

let persistTimer: ReturnType<typeof setTimeout> | null = null;

const persistChatState = () => {
	if (!import.meta.client || !props.persistKey) return;
	try {
		localStorage.setItem(props.persistKey, serializePersistedChatState());
	} catch {
		// localStorage unavailable or full — keep the active in-memory chat.
	}
};

const schedulePersistChatState = () => {
	if (!import.meta.client || !props.persistKey) return;
	if (persistTimer) clearTimeout(persistTimer);
	persistTimer = setTimeout(() => {
		persistTimer = null;
		persistChatState();
	}, 250);
};

const loadPersistedChatState = (): boolean => {
	if (!import.meta.client || !props.persistKey) return false;
	try {
		const raw = localStorage.getItem(props.persistKey);
		if (!raw) return false;
		const parsed = JSON.parse(raw) as unknown;
		if (!isRecord(parsed)) return false;

		if (Array.isArray(parsed.messages)) {
			messages.value = parsed.messages
				.filter(isMessage)
				.map(migrateTranslationSummary);
		}
		if (typeof parsed.responseID === "string")
			responseID.value = parsed.responseID;
		if (typeof parsed.currentEndpoint === "string")
			currentEndpoint.value = parsed.currentEndpoint;
		if (typeof parsed.currentMessage === "string")
			currentMessage.value = parsed.currentMessage;
		if (typeof parsed.selectedTable === "string")
			selectedTable.value = parsed.selectedTable;
		else selectedTable.value = null;
		if (isRecord(parsed.chatDatabaseContext)) {
			chatDatabaseContext.value = parsed.chatDatabaseContext as Database;
		} else {
			chatDatabaseContext.value = null;
		}

		return true;
	} catch {
		return false;
	}
};

const getMessageTables = (message: Message): TableResponse[] =>
	Array.isArray(message.response)
		? message.response.filter(isTableResponse)
		: [];

const getMessageNameTables = (message: Message): TableNameProposal[] =>
	Array.isArray(message.response)
		? message.response.filter(isTableNameProposal)
		: [];

const getMessageRoles = (message: Message): RoleResponse[] =>
	Array.isArray(message.response)
		? message.response.filter(isRoleResponse)
		: [];

const getMessagePages = (message: Message): PageResponse[] =>
	Array.isArray(message.response)
		? message.response.filter(isPageResponse)
		: [];

const getMessageReusableBlocks = (message: Message): ReusableBlockProposal[] =>
	Array.isArray(message.reusableBlocks) ? message.reusableBlocks : [];

const getMessageDataItems = (message: Message): DataItem[] =>
	Array.isArray(message.response) ? message.response.filter(isDataItem) : [];

const getMessageTranslationPlan = (message: Message): TranslationPlanItem[] =>
	Array.isArray(message.response)
		? message.response.filter(isTranslationPlanItem)
		: [];

const getMessageDatabasePlan = (message: Message): DatabasePlan | null =>
	isDatabasePlan(message.response) ? message.response : null;

const getMessageDashboards = (message: Message): DashboardProposal[] =>
	Array.isArray(message.response)
		? message.response.filter(isDashboardProposal)
		: [];

const getMessageDeleteIDs = (message: Message): Array<string | number> =>
	Array.isArray(message.response)
		? message.response.filter(
				(id): id is string | number =>
					(typeof id === "string" && id.trim().length > 0) ||
					(typeof id === "number" && Number.isFinite(id)),
			)
		: [];

/** Strip a `tabler:` prefix from an icon name (Grid renders bare Tabler slugs). */
const tablerIcon = (icon?: string): string =>
	(icon || "chart-bar").replace(/^tabler:/, "").trim() || "chart-bar";

/** Recursively find a schema field's key by its id (array children included). */
const findFieldKeyById = (
	schema: Schema | undefined,
	id: string | number,
): string | undefined => {
	if (!schema) return undefined;
	const needle = String(id);
	for (const field of schema) {
		if (field.id !== undefined && String(field.id) === needle)
			return typeof field.key === "string" && field.key ? field.key : undefined;
		const children = Array.isArray(field.children)
			? field.children
			: field.children && typeof field.children === "object"
				? [field.children]
				: [];
		if (children.length) {
			const found = findFieldKeyById(children as Schema, id);
			if (found) return found;
		}
	}
	return undefined;
};

/** Widgets persist table/field ids; resolve them to readable labels. */
const getWidgetTableLabel = (widget: DashboardWidgetProposal): string => {
	const table = activeDatabase.value?.tables?.find(
		(t) => t.id != null && String(t.id) === String(widget.table),
	);
	return table?.slug || widget.table;
};

const widgetDateRangeLabel = (range?: string): string => {
	switch (range) {
		case "7d":
			return t("last7Days");
		case "30d":
			return t("last30Days");
		case "90d":
			return t("last90Days");
		case "1y":
			return t("lastYear");
		case "all":
			return t("allTime");
		default:
			return "";
	}
};

/** One-line facts about a widget, shown as chips in the preview modal. */
const getWidgetDetails = (widget: DashboardWidgetProposal): string[] => {
	const details: string[] = [];
	if (widget.operation) details.push(t(widget.operation) || widget.operation);
	if (widget.size) details.push(t(widget.size) || widget.size);
	const range = widgetDateRangeLabel(widget.dateRange);
	if (range) details.push(range);

	const table = activeDatabase.value?.tables?.find(
		(t) => t.id != null && String(t.id) === String(widget.table),
	);
	const schema =
		table && Array.isArray(table.schema) ? table.schema : undefined;
	const fieldLabel = (ref?: string | number) =>
		ref === undefined ? "" : (findFieldKeyById(schema, ref) ?? String(ref));

	if (widget.field !== undefined) details.push(fieldLabel(widget.field));
	if (widget.groupBy !== undefined)
		details.push(`${t("groupBy")}: ${fieldLabel(widget.groupBy)}`);
	if (widget.dateField !== undefined)
		details.push(`${t("dateField")}: ${String(widget.dateField)}`);
	if (widget.columns?.length)
		details.push(widget.columns.map(fieldLabel).join(", "));
	if (widget.sortField !== undefined) {
		const sort =
			`${fieldLabel(widget.sortField)} ${widget.sortOrder || ""}`.trim();
		if (sort) details.push(sort);
	}
	if (widget.limit !== undefined) details.push(`${widget.limit} rows`);
	if (widget.color) details.push(widget.color);
	return details;
};

/**
 * Tables endpoint step selection: propose names first for fresh build flows
 * and when refining a pending name-proposal card; fall back to the full
 * schema step once the conversation reached schema approval (roles, deletes
 * and schema edits keep working as before).
 */
const shouldUseNamesStep = (): boolean => {
	if (currentEndpoint.value !== "tables") return false;

	// The most recent actionable card decides the step.
	let sawAdvancedNames = false;
	for (let i = messages.value.length - 1; i >= 0; i--) {
		const message = messages.value[i];
		if (message.sender !== "AI" || !message.action) continue;

		if (message.action === "tables_approval_pending") return false;

		if (message.action === "tables_naming_pending") {
			// A still-open names card → keep proposing names.
			if (!message.continued && !message.superseded) return true;
			// A continued/superseded names card means the schema flow took
			// over — keep scanning for the real conversation state.
			sawAdvancedNames = true;
			continue;
		}

		// Any other action card (roles, deletes, database plan...) — fall
		// through to the fresh-flow rule below.
		break;
	}

	// Names already continued to the schema step → stay on the schema step
	// (schema-stage clarifications must not loop back to name proposals).
	if (sawAdvancedNames) return false;

	// Fresh build flow (schema approval never reached) → start with names.
	return !messages.value.some(
		(message) => message.action === "tables_approval_pending",
	);
};

const isNestedDatabaseContext = computed(() => {
	const slug = databaseModel.value?.slug || database.value?.slug || "";
	return !!slug && slug !== "inicontent";
});

/**
 * A database-scoped request made from the inicontent workspace. Held so that
 * picking (or creating) a database can replay the user's original message
 * against it instead of losing the request.
 */
type PendingDatabaseRequest = {
	endpoint: string;
	/** The user's original wording, replayed verbatim after a context switch. */
	originalMessage: string;
	databases: DatabaseOption[];
};
const pendingDatabaseRequest = ref<PendingDatabaseRequest | null>(null);
const switchingDatabaseSlug = ref<string | null>(null);

/** Load a database so `activeDatabase` can supply its tables to the agent. */
const loadDatabaseForChat = async (slug: string): Promise<Database | null> => {
	try {
		const fetched = await $fetch<apiResponse<Database>>(
			`${config.public.apiBase}inicontent/databases/${encodeURIComponent(slug)}`,
			{
				credentials: "include",
				query: buildRequestParams("inicontent"),
			},
		);
		return fetched?.result ?? null;
	} catch {
		return null;
	}
};

/**
 * Switch the chat to a real database and replay the pending request against it.
 * The response id is cleared because the conversation was routed against the
 * workspace, and its tables/dashboards are a different scope.
 */
const switchChatToDatabase = async (slug: string) => {
	const pending = pendingDatabaseRequest.value;
	if (!pending) return;

	switchingDatabaseSlug.value = slug;
	try {
		// The chat usually already holds this database; only pay for a fetch
		// when the context switch targets one it has never seen.
		const loaded = findKnownDatabase(slug) ?? (await loadDatabaseForChat(slug));
		if (!loaded?.slug) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Could not open the database "${slug}".`,
			});
			return;
		}

		chatDatabaseContext.value = loaded;
		if (databaseModel.value) databaseModel.value = loaded;
		responseID.value = "";
		pendingDatabaseRequest.value = null;

		// Replay the original request now that a real database is in context.
		await sendMessage(pending.originalMessage);
	} finally {
		switchingDatabaseSlug.value = null;
	}
};

const selectDatabaseForPendingRequest = async (
	message: Message,
	option: DatabaseOption,
) => {
	message.selectedDatabase = option.slug;
	await switchChatToDatabase(option.slug);
};

const getWelcomeMessage = () => {
	if (isNestedDatabaseContext.value) {
		return t("chatWelcomeScopedDatabase");
	}

	if (currentEndpoint.value === "tables") {
		return t("chatWelcomeTables");
	} else if (currentEndpoint.value === "pages") {
		return t("chatWelcomePages");
	}
	return t("chatWelcomeDefault");
};

const getTableIcon = (tableSlug: string): string | undefined => {
	for (let i = messages.value.length - 1; i >= 0; i--) {
		const message = messages.value[i];
		if (
			message &&
			message.action === "tables_approval_pending" &&
			message.response
		) {
			const table = getMessageTables(message).find((t) => t.slug === tableSlug);
			if (table?.icon) {
				return table.icon.trim();
			}
		}
	}
	return undefined;
};

const messages = ref<Message[]>([]);

const selectedTable = ref<string | null>(null);
const showTableModal = ref(false);
const previewModalTitleKey = ref<"tableDemo" | "dataPreview">("tableDemo");
const selectedTableForModal = ref<TableResponse | null>(null);
const dataTable = ref<{
	title: string;
	columns: DataTableColumns<Record<string, unknown>>;
	data: Array<Record<string, unknown>>;
}>({
	title: "",
	columns: [],
	data: [],
});
const createDemoTableColumns = (
	schema: Schema,
): DataTableColumns<Record<string, unknown>> => {
	return schema.map((field) => ({
		title: () =>
			h(NFlex, { wrap: false, align: "center", justify: "start" }, () => [
				getField(field).icon(),
				t(field.key),
			]),
		key: field.key,
		render(row: Record<string, unknown>) {
			return h(LazyColumn, { value: row[field.key], field: field });
		},
	}));
};

// Fallback for data preview when the target table's schema isn't in the
// current context (columns are derived straight from the generated records).
const createGenericColumns = (
	records: Array<Record<string, unknown>>,
): DataTableColumns<Record<string, unknown>> => {
	const keys = new Set<string>();
	for (const record of records) {
		for (const key of Object.keys(record)) keys.add(key);
	}
	return Array.from(keys).map((key) => ({
		title: key,
		key,
		render(row: Record<string, unknown>) {
			const value = row[key];
			if (value === null || value === undefined) return "";
			return typeof value === "object" ? JSON.stringify(value) : String(value);
		},
	}));
};

const tableModalHistory = ref<TableResponse[]>([]);

watch(showTableModal, (val) => {
	if (!val) tableModalHistory.value = [];
});

const openTableDemoModal = (table: TableResponse) => {
	if (showTableModal.value && selectedTableForModal.value) {
		tableModalHistory.value.push(selectedTableForModal.value);
	}
	previewModalTitleKey.value = "tableDemo";
	selectedTableForModal.value = table;
	dataTable.value.data = table.demo;
	dataTable.value.columns = createDemoTableColumns(table.schema);
	dataTable.value.title =
		table.slug.charAt(0).toUpperCase() + table.slug.slice(1);
	showTableModal.value = true;
};

const undoTableDemoModal = () => {
	const prev = tableModalHistory.value.pop();
	if (prev) openTableDemoModal(prev);
	else showTableModal.value = false;
};

// Preview a data-agent item's generated records before publishing them.
const openDataItemPreviewModal = (item: DataItem) => {
	tableModalHistory.value = [];
	selectedTableForModal.value = null;
	previewModalTitleKey.value = "dataPreview";
	const tableObj = activeDatabase.value?.tables?.find(
		(t): t is { slug: string; schema: Schema } =>
			t.slug === item.table && Array.isArray(t.schema),
	);
	dataTable.value = {
		title: item.table.charAt(0).toUpperCase() + item.table.slice(1),
		columns: tableObj
			? createDemoTableColumns(tableObj.schema)
			: createGenericColumns(item.records),
		data: item.records,
	};
	showTableModal.value = true;
};

const showPageModal = ref(false);
const selectedPageData = ref<PageResponse | null>(null);

const openPagePreviewModal = (page: PageResponse) => {
	selectedPageData.value = page;
	showPageModal.value = true;
};

const showDashboardModal = ref(false);
const selectedDashboardPreview = ref<DashboardProposal | null>(null);

const openDashboardPreviewModal = (dashboard: DashboardProposal) => {
	selectedDashboardPreview.value = dashboard;
	showDashboardModal.value = true;
};

const user = useState<User>("user");
const config = useRuntimeConfig();
const chatDatabaseContext = ref<Database | null>(null);
const isAdmin = computed(
	() =>
		!!user.value?.id &&
		(user.value?.role === config.public.idOne ||
			database.value?.slug === "inicontent"),
);
const applyingIndex = ref<number | null>(null);
const applyingDataIndex = ref<number | null>(null);
const applyingTranslateIndex = ref<number | null>(null);
const applyingDatabaseIndex = ref<number | null>(null);
const applyingDashboardsIndex = ref<number | null>(null);
const activeDatabaseSlug = computed(
	() =>
		chatDatabaseContext.value?.slug ||
		databaseModel.value?.slug ||
		database.value?.slug ||
		"",
);
const activeDatabase = computed(
	() => chatDatabaseContext.value ?? databaseModel.value ?? database.value,
);

/**
 * Resolve a database by slug, preferring the copy the chat already holds. A
 * context switch must not depend on an extra round trip, and the object the
 * chat holds is the one whose tables the agent will see.
 */
const findKnownDatabase = (slug: string): Database | null => {
	const candidates = [
		chatDatabaseContext.value,
		databaseModel.value,
		database.value,
	];
	for (const candidate of candidates) {
		if (candidate?.slug === slug) return candidate;
	}
	return null;
};

const buildRequestParams = (targetSlug: string) => {
	const scopedSession = useScopedCookie<string>("sid", targetSlug);
	const params: Record<string, string> = {
		locale: Language.value,
	};

	if (scopedSession.value) params[`${targetSlug}_sid`] = scopedSession.value;
	else if (sessionID.value) params[`${targetSlug}_sid`] = sessionID.value;

	if (platformSessionID.value) {
		params.inicontent_sid = platformSessionID.value;
	}

	return params;
};

const resolveAIHttpEnvelope = (payload: AIHttpEnvelope) => {
	if (payload?.result && isAIResponsePayload(payload.result.response)) {
		return {
			responseID: payload.result.responseID,
			response: payload.result.response,
		};
	}

	if (payload?.result && isAIResponsePayload(payload.result)) {
		return {
			responseID: undefined,
			response: payload.result,
		};
	}

	if (isAIResponsePayload(payload?.response)) {
		return {
			responseID: payload?.responseID,
			response: payload.response,
		};
	}

	if (isAIResponsePayload(payload)) {
		return {
			responseID: undefined,
			response: payload,
		};
	}

	return {
		responseID: payload?.responseID,
		response: payload?.response,
	};
};

const applyDatabase = async (message: Message, index: number) => {
	if (applyingDatabaseIndex.value !== null) return;

	const plan = getMessageDatabasePlan(message);
	if (!plan?.slug) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid database plan was returned by AI.",
		});
		return;
	}

	applyingDatabaseIndex.value = index;
	try {
		const normalizedPrimaryColor = normalizeHexColor(plan.primaryColor);

		const created = await $fetch<apiResponse<Database>>(
			`${config.public.apiBase}inicontent/databases/${encodeURIComponent(plan.slug)}`,
			{
				method: "POST",
				body: {
					slug: plan.slug,
					primaryLanguage: plan.primaryLanguage,
					secondaryLanguages: plan.secondaryLanguages,
					primaryColor: normalizedPrimaryColor,
				},
				params: buildRequestParams("inicontent"),
				credentials: "include",
			},
		);

		if (!created?.result) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: created?.message || "Failed to create database.",
			});
			return;
		}

		const createdSlug = created.result.slug;
		if (!createdSlug) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: "Database was created but no valid slug was returned.",
			});
			return;
		}

		message.applied = true;
		chatDatabaseContext.value = created.result;
		if (databaseModel.value) databaseModel.value = created.result;
		// Let the host refresh the database list it owns: the row was created
		// outside that request.
		refreshNuxtData("databases");

		messages.value.push({
			sender: "AI",
			text: `Database ${createdSlug} created successfully. Generating tables now...`,
		});

		const tablePrompt =
			plan.tablesPrompt ||
			`Generate the required tables for the ${createdSlug} database.`;

		const generated = await $fetch<AIHttpEnvelope>(
			`${config.public.apiBase}${createdSlug}/ai/tables`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: tablePrompt,
					step: "names",
					existingTables: (created.result.tables || [])
						.filter(
							(table): table is { slug: string; schema: Schema } =>
								typeof table.slug === "string" && Array.isArray(table.schema),
						)
						.map((table) => ({
							slug: table.slug,
							schema: table.schema as Schema,
						})),
				}),
				params: buildRequestParams(createdSlug),
				credentials: "include",
			},
		);

		const normalized = resolveAIHttpEnvelope(generated);
		const response = normalized.response;

		if (!response || typeof response.action !== "string") {
			throw new Error("AI returned an invalid response for table generation.");
		}

		if (
			response.action === "clarification_needed" &&
			response.questions?.length
		) {
			messages.value.push({
				sender: "AI",
				text: response.questions.map((q, i) => `${i + 1}. ${q}`).join("\n"),
			});
		} else if (response.action === "tables_naming_pending") {
			const names = Array.isArray(response.tables)
				? response.tables.filter(isTableNameProposal)
				: [];

			if (!names.length) {
				throw new Error("AI returned no valid table name proposals.");
			}

			messages.value.push({
				sender: "AI",
				action: "tables_naming_pending",
				response: names,
				responseID: normalized.responseID,
				requestText: tablePrompt,
				text:
					response.message ||
					"Review the proposed table names before continuing.",
			});

			// Follow-up chat turns continue from the names conversation.
			if (normalized.responseID) responseID.value = normalized.responseID;
		} else if (response.message) {
			messages.value.push({
				sender: "AI",
				action: response.action as MessageAction,
				text: response.message,
			});
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error creating database from AI plan:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({
			sender: "AI",
			action: "error",
			text: errorMsg,
		});
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingDatabaseIndex.value = null;
	}
};

const applyTables = async (message: Message, index: number) => {
	if (applyingIndex.value !== null) return;
	const tables = getMessageTables(message);
	if (!tables.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid table definitions were returned by AI.",
		});
		return;
	}

	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingIndex.value = index;
	try {
		const data = await $fetch<{
			results?: {
				slug: string;
				action: string;
				success: boolean;
				error?: string;
			}[];
			tables?: TableResponse[];
			result?: {
				results?: {
					slug: string;
					action: string;
					success: boolean;
					error?: string;
				}[];
				tables?: TableResponse[];
			};
		}>(`${config.public.apiBase}${activeDatabaseSlug.value}/ai/tables`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tables }),
			params: buildRequestParams(activeDatabaseSlug.value),
			credentials: "include",
		});

		const normalized = data.result ?? data;

		if (!Array.isArray(normalized.results) || !normalized.results.length) {
			throw new Error("The server did not confirm any changes. Refresh before retrying.");
		}
		const failed = normalized.results.filter((r) => r.success !== true);
		if (failed.length) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Failed to apply some tables: ${failed.map((f) => `${f.slug} (${f.error})`).join(", ")}`,
			});
		} else {
			message.applied = true;
			// Refresh database tables state
			if (normalized.tables) {
				if (database.value?.slug === activeDatabaseSlug.value)
					database.value.tables = normalized.tables;
				if (databaseModel.value?.slug === activeDatabaseSlug.value)
					databaseModel.value.tables = normalized.tables;
				if (chatDatabaseContext.value?.slug === activeDatabaseSlug.value)
					chatDatabaseContext.value.tables = normalized.tables;
			}
			messages.value.push({
				sender: "AI",
				text: `${(normalized.results || []).map((r) => `${r.slug} (${t(r.action)})`).join(", ")}`,
			});
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error applying tables:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({
			sender: "AI",
			action: "error",
			text: errorMsg,
		});
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingIndex.value = null;
	}
};

const continueToSchema = async (message: Message, index: number) => {
	if (applyingIndex.value !== null) return;
	const names = getMessageNameTables(message);
	if (!names.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid table name proposals were returned by AI.",
		});
		return;
	}

	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingIndex.value = index;
	try {
		const requestText = message.requestText?.trim();
		const messageText = requestText
			? `${requestText}\n\nDesign the full schemas for the approved table names.`
			: `Design the full schemas for these approved table names:\n${names
					.map(
						(name) => `- ${name.slug}${name.label ? ` (${name.label})` : ""}`,
					)
					.join("\n")}`;

		const data = await $fetch<AIHttpEnvelope>(
			`${config.public.apiBase}${activeDatabaseSlug.value}/ai/tables`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: messageText,
					step: "schema",
					approvedTables: names.map((name) => ({
						slug: name.slug,
						label: name.label,
						icon: name.icon,
						id: name.id,
						oldSlug: name.oldSlug,
						isNew: name.isNew,
					})),
					existingTables: (activeDatabase.value?.tables || [])
						.filter(
							(table): table is { slug: string; schema: Schema } =>
								typeof table.slug === "string" && Array.isArray(table.schema),
						)
						.map((table) => ({
							slug: table.slug,
							schema: table.schema as Schema,
						})),
				}),
				params: buildRequestParams(activeDatabaseSlug.value),
				credentials: "include",
			},
		);

		const normalized = resolveAIHttpEnvelope(data);
		const response = normalized.response;
		if (!response || typeof response.action !== "string") {
			throw new Error("AI returned an invalid response for table generation.");
		}

		// The schema conversation continues from this turn.
		if (normalized.responseID) responseID.value = normalized.responseID;
		message.continued = true;

		if (
			response.action === "clarification_needed" &&
			response.questions?.length
		) {
			messages.value.push({
				sender: "AI",
				text: response.questions.map((q, i) => `${i + 1}. ${q}`).join("\n"),
			});
		} else if (response.action === "tables_approval_pending") {
			const tables = Array.isArray(response.tables)
				? response.tables.filter(isTableResponse)
				: [];

			if (!tables.length) {
				throw new Error("AI returned no valid table definitions.");
			}

			messages.value.push({
				sender: "AI",
				action: "tables_approval_pending",
				response: tables,
				responseID: normalized.responseID,
				text:
					response.message ||
					"Review the generated tables before applying the changes.",
			});
		} else if (response.message) {
			messages.value.push({
				sender: "AI",
				action: response.action as MessageAction,
				text: response.message,
			});
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error continuing to schema generation:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({
			sender: "AI",
			action: "error",
			text: errorMsg,
		});
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingIndex.value = null;
	}
};

const applyData = async (message: Message, index: number) => {
	if (applyingDataIndex.value !== null) return;
	const items = getMessageDataItems(message);
	if (!items.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid data items were returned by AI.",
		});
		return;
	}
	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingDataIndex.value = index;
	try {
		const data = await $fetch<{
			results?: {
				table: string;
				count: number;
				success: boolean;
				error?: string;
			}[];
			result?: {
				results?: {
					table: string;
					count: number;
					success: boolean;
					error?: string;
				}[];
			};
		}>(`${config.public.apiBase}${activeDatabaseSlug.value}/ai/data`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items }),
			params: buildRequestParams(activeDatabaseSlug.value),
			credentials: "include",
		});

		const normalized = data.result ?? data;
		if (!Array.isArray(normalized.results) || !normalized.results.length) {
			throw new Error("The server did not confirm any changes. Refresh before retrying.");
		}
		const failed = normalized.results.filter((r) => r.success !== true);
		if (failed.length) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Failed to publish some data: ${failed.map((f) => `${f.table} (${f.error})`).join(", ")}`,
			});
		} else {
			message.applied = true;
			const summary = (normalized.results || [])
				.map((r) => `${r.table}: ${r.count} records`)
				.join(", ");
			messages.value.push({ sender: "AI", text: summary });
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error publishing data:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({ sender: "AI", action: "error", text: errorMsg });
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingDataIndex.value = null;
	}
};

const applyTranslation = async (message: Message, index: number) => {
	if (applyingTranslateIndex.value !== null) return;
	const items = getMessageTranslationPlan(message);
	if (!items.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid translation plan returned by AI.",
		});
		return;
	}
	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingTranslateIndex.value = index;
	try {
		const data = await $fetch<{
			results?: {
				table: string;
				locale: string;
				count: number;
				success: boolean;
				error?: string;
			}[];
			result?: {
				results?: {
					table: string;
					locale: string;
					count: number;
					success: boolean;
					error?: string;
				}[];
			};
		}>(`${config.public.apiBase}${activeDatabaseSlug.value}/ai/translate`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items }),
			params: buildRequestParams(activeDatabaseSlug.value),
			credentials: "include",
		});

		const normalized = data.result ?? data;
		if (!Array.isArray(normalized.results) || !normalized.results.length) {
			throw new Error("The server did not confirm any changes. Refresh before retrying.");
		}
		const failed = normalized.results.filter((r) => r.success !== true);
		if (failed.length) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Failed to translate some tables: ${failed.map((f) => `${f.table}→${f.locale} (${f.error})`).join(", ")}`,
			});
		} else {
			message.applied = true;
			const results = (normalized.results || []).filter(
				(r): r is TranslationResult =>
					typeof r.table === "string" &&
					typeof r.locale === "string" &&
					typeof r.count === "number" &&
					typeof r.success === "boolean",
			);
			messages.value.push({
				sender: "AI",
				text: t("translated"),
				translationResults: results,
			});
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error applying translations:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({ sender: "AI", action: "error", text: errorMsg });
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingTranslateIndex.value = null;
	}
};

type DashboardApplyResult = {
	id?: string | number;
	name: string;
	action?: "created" | "updated";
	success: boolean;
	error?: string;
};

const applyDashboards = async (message: Message, index: number) => {
	if (applyingDashboardsIndex.value !== null) return;
	const dashboards = getMessageDashboards(message);
	if (!dashboards.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid dashboard definitions returned by AI.",
		});
		return;
	}
	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingDashboardsIndex.value = index;
	try {
		const data = await $fetch<{
			results?: DashboardApplyResult[];
			dashboards?: Dashboard[];
			result?: {
				results?: DashboardApplyResult[];
				dashboards?: Dashboard[];
			};
		}>(`${config.public.apiBase}${activeDatabaseSlug.value}/ai/dashboards`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ dashboards }),
			params: buildRequestParams(activeDatabaseSlug.value),
			credentials: "include",
		});

		const normalized = data.result ?? data;
		if (!Array.isArray(normalized.results) || !normalized.results.length) {
			throw new Error("The server did not confirm any changes. Refresh before retrying.");
		}
		const failed = normalized.results.filter((r) => r.success !== true);
		if (failed.length) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Failed to apply some dashboards: ${failed.map((f) => `${f.name} (${f.error})`).join(", ")}`,
			});
		} else {
			message.applied = true;
			const appliedText = (normalized.results || [])
				.map((r) => `${r.name} (${t(r.action || "applied")})`)
				.join(", ");
			messages.value.push({ sender: "AI", text: appliedText });
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error applying dashboards:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({ sender: "AI", action: "error", text: errorMsg });
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingDashboardsIndex.value = null;
	}
};

const applyDashboardDeletes = async (message: Message, index: number) => {
	if (applyingDashboardsIndex.value !== null) return;
	const ids = getMessageDeleteIDs(message);
	if (!ids.length) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "No valid dashboard ids returned by AI.",
		});
		return;
	}
	if (!activeDatabaseSlug.value) {
		messages.value.push({
			sender: "AI",
			action: "error",
			text: "The current database is not available.",
		});
		return;
	}

	applyingDashboardsIndex.value = index;
	try {
		const data = await $fetch<{
			results?: { id?: string | number; success: boolean; error?: string }[];
			result?: {
				results?: {
					id?: string | number;
					success: boolean;
					error?: string;
				}[];
			};
		}>(`${config.public.apiBase}${activeDatabaseSlug.value}/ai/dashboards`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ids }),
			params: buildRequestParams(activeDatabaseSlug.value),
			credentials: "include",
		});

		const normalized = data.result ?? data;
		if (!Array.isArray(normalized.results) || !normalized.results.length) {
			throw new Error("The server did not confirm any changes. Refresh before retrying.");
		}
		const failed = normalized.results.filter((r) => r.success !== true);
		if (failed.length) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: `Failed to delete some dashboards: ${failed
					.map((f) => String(f.id ?? ""))
					.filter(Boolean)
					.join(", ")}`,
			});
		} else {
			message.applied = true;
			messages.value.push({ sender: "AI", text: t("deleted") });
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		console.error("Error deleting dashboards:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({ sender: "AI", action: "error", text: errorMsg });
		if (!userHasScrolledUp.value) await scrollToBottom();
	} finally {
		applyingDashboardsIndex.value = null;
	}
};

const uniqueTables = computed(() => {
	const rolesMessage = messages.value.find(
		(msg) => msg.action === "roles_defined",
	);
	if (!rolesMessage) return [];
	const tables = new Set<string>();
	getMessageRoles(rolesMessage).forEach((roleEntry) => {
		roleEntry.permissions.forEach((permission) => {
			tables.add(permission.table);
		});
	});
	return Array.from(tables);
});

const rolesForSelectedTable = computed(() => {
	if (!selectedTable.value) return [];
	const rolesMessage = messages.value.find(
		(msg) => msg.action === "roles_defined",
	);
	if (!rolesMessage) return [];

	const rolesMap = new Map<string, { role: string; allowedMethods: string }>();

	getMessageRoles(rolesMessage).forEach((roleEntry) => {
		const permissionForTable = roleEntry.permissions.find(
			(p) => p.table === selectedTable.value,
		);
		if (permissionForTable) {
			rolesMap.set(roleEntry.role, {
				role: roleEntry.role,
				allowedMethods: permissionForTable.allowedMethods,
			});
		} else {
			// Ensure role is added even if it has no specific permissions for the selected table, showing all as denied
			if (!rolesMap.has(roleEntry.role)) {
				rolesMap.set(roleEntry.role, {
					role: roleEntry.role,
					allowedMethods: "",
				});
			}
		}
	});
	return Array.from(rolesMap.values());
});

const selectRoleTable = (tableName: string) => {
	selectedTable.value = tableName;
};

watch(
	messages,
	(newMessages) => {
		const rolesMsg = newMessages.find((msg) => msg.action === "roles_defined");
		if (rolesMsg) {
			const tables = new Set<string>();
			getMessageRoles(rolesMsg).forEach((roleEntry) => {
				roleEntry.permissions.forEach((permission) => {
					tables.add(permission.table);
				});
			});
			const availableTables = Array.from(tables);
			if (
				availableTables.length > 0 &&
				(!selectedTable.value || !availableTables.includes(selectedTable.value))
			)
				selectRoleTable(availableTables[0] as string);
		}
	},
	{ deep: true, immediate: true },
);

const getPermissionIcon = (
	allowedMethods: string,
	method: "c" | "r" | "u" | "d",
) => {
	if (allowedMethods?.includes(method))
		return { name: "tabler:check", color: "green" };

	return { name: "tabler:x", color: "red" };
};

const currentMessage = ref("");
const responseID = ref("");

const loading = ref(false);
const requestVersion = ref(0);

const clearPersistedChatState = () => {
	if (!import.meta.client || !props.persistKey) return;
	try {
		localStorage.removeItem(props.persistKey);
	} catch {
		// localStorage unavailable - nothing to clear.
	}
};

const addWelcomeMessage = async () => {
	if (!subscriptionChecked.value || !hasActiveSubscription.value) return;
	if (messages.value.length > 0) return;
	messages.value.push({ sender: "AI", text: getWelcomeMessage() });
	await nextTick();
	if (!userHasScrolledUp.value) await scrollToBottom();
};

const resetChat = async () => {
	requestVersion.value++;
	if (persistTimer) {
		clearTimeout(persistTimer);
		persistTimer = null;
	}
	clearPersistedChatState();
	messages.value = [];
	responseID.value = "";
	currentEndpoint.value = props.endpoint;
	currentMessage.value = "";
	chatDatabaseContext.value = null;
	pendingDatabaseRequest.value = null;
	switchingDatabaseSlug.value = null;
	selectedTable.value = null;
	showTableModal.value = false;
	showPageModal.value = false;
	selectedTableForModal.value = null;
	tableModalHistory.value = [];
	selectedPageData.value = null;
	userHasScrolledUp.value = false;
	loading.value = false;
	applyingIndex.value = null;
	applyingDataIndex.value = null;
	applyingTranslateIndex.value = null;
	applyingDatabaseIndex.value = null;
	applyingDashboardsIndex.value = null;
	showDashboardModal.value = false;
	selectedDashboardPreview.value = null;
	await addWelcomeMessage();
	persistChatState();
};

defineExpose({ resetChat });

const dynamicPlaceholder = computed(() => {
	if (isNestedDatabaseContext.value) {
		return t("chatPlaceholderScopedDatabase");
	}

	return messages.value.length > 2
		? t("chatPlaceholderShort")
		: t("chatPlaceholder");
});

const scrollbarRef = ref();
const inputRef = ref();
const userHasScrolledUp = ref(false);

const handleEnterKey = (event: KeyboardEvent) => {
	// Allow default behavior (insert newline) when Shift+Enter is pressed
	if (event.shiftKey) return;

	// Prevent default behavior (insert newline) and send message when Enter is pressed
	event.preventDefault();
	sendMessage();
	nextTick(() => {
		inputRef.value?.focus();
		inputRef.value?.$el?.querySelector("textarea")?.focus();
	});
};

const scrollToBottom = async () => {
	await nextTick();
	const scrollbarInstance = scrollbarRef.value;
	if (scrollbarInstance)
		scrollbarInstance.scrollTo({
			top: scrollbarInstance.scrollHeight,
			behavior: "smooth",
		});
};

const handleScroll = (e: Event) => {
	const target = e.target as HTMLElement;
	if (!target) return;

	const { scrollTop, scrollHeight, clientHeight } = target;
	const threshold = 20; // Pixels from bottom to consider "at bottom"

	// Check if user is close to the bottom
	userHasScrolledUp.value = scrollHeight - scrollTop - clientHeight > threshold;
};

// Automatically resumes a truncated multi-table data generation until no
// tables remain, appending the newly generated tables onto the same message.
const continueDataGeneration = async (dataMessage: Message) => {
	const requestSnapshot = requestVersion.value;
	let guard = 20; // hard cap against a misbehaving assistant looping forever
	while (dataMessage.remainingTables?.length && guard-- > 0) {
		try {
			const payload: {
				message: string;
				responseID?: string;
				existingTables?: Array<Pick<TableResponse, "slug" | "schema">>;
			} = {
				message: `Continue generating the remaining tables: ${dataMessage.remainingTables.join(", ")}.`,
				responseID: responseID.value || undefined,
			};

			if (activeDatabase.value?.tables?.length) {
				payload.existingTables = activeDatabase.value.tables
					.filter(
						(table): table is { slug: string; schema: Schema } =>
							typeof table.slug === "string" &&
							Array.isArray(table.schema) &&
							!PROTECTED_TABLES.has(table.slug),
					)
					.map((table) => ({
						slug: table.slug,
						schema: table.schema as Schema,
					}));
			}

			const data = await $fetch<AIHttpEnvelope>(
				`${config.public.apiBase}${activeDatabaseSlug.value}/ai/data`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					params: buildRequestParams(activeDatabaseSlug.value),
					credentials: "include",
				},
			);

			const normalized = resolveAIHttpEnvelope(data);
			if (requestSnapshot !== requestVersion.value) return;
			responseID.value = normalized.responseID ?? responseID.value;

			const response = normalized.response;
			if (!response || response.action !== "data_approval_pending") {
				if (response?.message)
					messages.value.push({ sender: "AI", text: response.message });
				break;
			}

			const newItems = Array.isArray(response.items)
				? response.items.filter(isDataItem)
				: [];
			const existingItems = Array.isArray(dataMessage.response)
				? (dataMessage.response as DataItem[])
				: [];
			dataMessage.response = [...existingItems, ...newItems];
			dataMessage.remainingTables = Array.isArray(response.remainingTables)
				? response.remainingTables.filter(
						(t): t is string => typeof t === "string" && t.trim().length > 0,
					)
				: [];

			if (!userHasScrolledUp.value) await scrollToBottom();
		} catch (error: unknown) {
			if (requestSnapshot !== requestVersion.value) return;
			console.error("Error continuing data generation:", error);
			const apiError = error as {
				data?: { result?: { message?: string }; message?: string };
				message?: string;
			};
			messages.value.push({
				sender: "AI",
				action: "error",
				text:
					apiError?.data?.result?.message ||
					apiError?.data?.message ||
					apiError?.message ||
					t("error"),
			});
			break;
		}
	}
	if (requestSnapshot !== requestVersion.value) return;
	dataMessage.loadingMore = false;
};

/** Load the rows of the protected `dashboards` table for AI context. */
const fetchExistingDashboards = async (): Promise<Dashboard[] | undefined> => {
	if (!activeDatabaseSlug.value) return undefined;
	try {
		const res = await $fetch<apiResponse<Dashboard[]>>(
			`${config.public.apiBase}${activeDatabaseSlug.value}/dashboards`,
			{
				params: buildRequestParams(activeDatabaseSlug.value),
				credentials: "include",
			},
		);
		return res.result;
	} catch {
		return undefined;
	}
};

const sendMessage = async (explicitText?: string) => {
	const originalUserText = (explicitText ?? currentMessage.value).trim();
	if (originalUserText === "" || loading.value) return;
	const requestSnapshot = requestVersion.value;

	loading.value = true;
	const userMessageToPush = originalUserText; // Store before clearing
	currentMessage.value = "";
	messages.value.push({ sender: "User", text: userMessageToPush });

	if (!userHasScrolledUp.value) await scrollToBottom();

	let responseIdForPayload = responseID.value;
	// Reclassify every user turn; a schema assistant cannot insert data or
	// build pages. Keep its response chain only if the router selects it again.
	let requestEndpoint = "";
	const routingMessage = buildChatRoutingMessage(userMessageToPush, currentEndpoint.value,
		messages.value.slice(0, -1).slice(-2));

	let keepTrying = true;
	let maxRedirects = 3;

	try {
		if (!activeDatabaseSlug.value) {
			throw new Error("The current database is not available.");
		}

		while (keepTrying && maxRedirects > 0) {
			if (requestSnapshot !== requestVersion.value) return;
			maxRedirects--;
			keepTrying = false;

			const payload: {
				message: string;
				step?: "names" | "schema";
				responseID?: string;
				existingTables?:
					| Record<string, string[]>
					| Array<{ id?: string; slug: string; keys?: string[]; schema?: Schema }>;
				existingDashboards?: Dashboard[];
				secondaryLanguages?: string[];
				primaryLanguage?: string;
			} = {
				message: requestEndpoint ? buildChatGenerationMessage(userMessageToPush) : routingMessage,
				responseID: requestEndpoint ? responseIdForPayload || undefined : undefined,
			};

			// Step selection for the tables endpoint: propose names first on
			// fresh build flows, then design schemas once names are approved.
			if (requestEndpoint === "tables") {
				payload.step = shouldUseNamesStep() ? "names" : "schema";
			}

			// Include existing tables context when targeting the tables, data,
			// pages or dashboards endpoint (dashboards need them to validate
			// widget table/field references).
			if (
				(requestEndpoint === "tables" ||
					requestEndpoint === "data" ||
					requestEndpoint === "pages" ||
					requestEndpoint === "dashboards") &&
				activeDatabase.value?.tables?.length
			) {
				const systemTables = ["sessions", "assets", "translations"];
				payload.existingTables = activeDatabase.value.tables
					.filter(
						(table): table is { slug: string; schema: Schema } =>
							typeof table.slug === "string" &&
							Array.isArray(table.schema) &&
							!systemTables.includes(table.slug),
					)
					.map((table) => ({
						// The dashboards assistant stores widget table refs by id;
						// ids are also harmless extra context for other endpoints.
						id: table.id,
						slug: table.slug,
						schema: table.schema as Schema,
					}));
			}

			// Included existing dashboards context so the assistant can edit
			// stored dashboards and cannot duplicate names.
			if (requestEndpoint === "dashboards") {
				payload.existingDashboards = await fetchExistingDashboards();
			}

			// Include language context when targeting the translate endpoint
			if (requestEndpoint === "translate") {
				if (activeDatabase.value?.secondaryLanguages?.length)
					payload.secondaryLanguages = activeDatabase.value
						.secondaryLanguages as string[];
				if (activeDatabase.value?.primaryLanguage)
					payload.primaryLanguage = activeDatabase.value
						.primaryLanguage as string;
				if (activeDatabase.value?.tables?.length) {
					payload.existingTables = summarizeTranslationContext(
						activeDatabase.value.tables,
					);
				}
			}

			const data = await $fetch<AIHttpEnvelope>(
				`${config.public.apiBase}${activeDatabaseSlug.value}/ai${
					requestEndpoint ? `/${requestEndpoint}` : ""
				}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					params: buildRequestParams(activeDatabaseSlug.value),
					credentials: "include",
				},
			);

			const normalized = resolveAIHttpEnvelope(data);
			if (requestSnapshot !== requestVersion.value) return;
			if (requestEndpoint) {
				responseID.value = normalized.responseID ?? "";
				responseIdForPayload = normalized.responseID ?? "";
			}

			const response = normalized.response;
			if (!response || typeof response.action !== "string") {
				throw new Error("AI returned an invalid response.");
			}

			if (response.action === "redirect" && response.target) {
				// A "create it" reply to the database picker: the databases agent
				// needs the original request to name and scope the new database,
				// not the bare confirmation.
				const createMessage = pendingDatabaseRequest.value
					? buildCreateDatabaseMessage(pendingDatabaseRequest.value.originalMessage)
					: undefined;

				const next = redirectChat(currentEndpoint.value, responseIdForPayload, response.target);
				currentEndpoint.value = next.endpoint;
				requestEndpoint = next.endpoint;
				responseID.value = next.responseID;
				responseIdForPayload = next.responseID;
				pendingDatabaseRequest.value = null;

				if (createMessage) {
					messages.value.push({ sender: "User", text: createMessage });
					await sendMessage(createMessage);
					return;
				}

				keepTrying = true;
			} else {
				if (
					response.action === "clarification_needed" &&
					response.questions?.length
				) {
					messages.value.push({
						sender: "AI",
						text: response.questions.map((q, i) => `${i + 1}. ${q}`).join("\n"),
					});
				} else if (response.action === "database_selection_needed") {
					// The API resolved one unambiguous database on its own: switch
					// context and replay rather than asking the user to choose.
					if (response.targetDatabase?.slug) {
						await switchChatToDatabase(response.targetDatabase.slug);
						return;
					}

					const databases = Array.isArray(response.databases)
						? response.databases.filter(
								(option): option is DatabaseOption =>
									typeof option?.slug === "string" && !!option.slug,
							)
						: [];

					pendingDatabaseRequest.value = {
						endpoint: requestEndpoint,
						originalMessage: originalUserText,
						databases,
					};

					messages.value.push({
						sender: "AI",
						action: "database_selection_needed",
						databases,
						text:
							response.message ||
							'Which database should I use? You can also reply "create it" to create a new one.',
					});
				} else if (response.action === "database_approval_pending") {
					const databasePlan = isDatabasePlan(response.database)
						? response.database
						: null;

					if (!databasePlan) {
						throw new Error("AI returned no valid database plan.");
					}

					messages.value.push({
						sender: "AI",
						action: "database_approval_pending",
						response: databasePlan,
						text:
							response.message ||
							`Review database ${databasePlan.slug} before creating it.`,
					});
				} else if (response.action === "tables_naming_pending") {
					const names = Array.isArray(response.tables)
						? response.tables.filter(isTableNameProposal)
						: [];

					if (!names.length) {
						throw new Error("AI returned no valid table name proposals.");
					}

					// A newer proposal supersedes any earlier pending names card.
					for (const existing of messages.value) {
						if (
							existing.action === "tables_naming_pending" &&
							!existing.applied
						) {
							existing.superseded = true;
						}
					}

					messages.value.push({
						sender: "AI",
						action: "tables_naming_pending",
						response: names,
						responseID: responseIdForPayload,
						requestText: userMessageToPush,
						text:
							response.message ||
							"Review the proposed table names before continuing.",
					});
				} else if (response.action === "tables_approval_pending") {
					const tables = Array.isArray(response.tables)
						? response.tables.filter(isTableResponse)
						: [];

					if (!tables.length) {
						throw new Error("AI returned no valid table definitions.");
					}

					messages.value.push({
						sender: "AI",
						action: "tables_approval_pending",
						response: tables,
						text:
							response.message ||
							"Review the generated tables before applying the changes.",
					});
				} else if (response.action === "roles_defined") {
					const roles = Array.isArray(response.roles)
						? response.roles.filter(isRoleResponse)
						: [];

					if (!roles.length) {
						throw new Error("AI returned no valid role definitions.");
					}

					messages.value.push({
						sender: "AI",
						action: "roles_defined",
						response: roles,
						text: response.message || "Roles have been defined.",
					});
				} else if (response.action === "structure_generated") {
					const pages = Array.isArray(response.pages)
						? response.pages.filter(isPageResponse)
						: [];

					messages.value.push({
						sender: "AI",
						action: "structure_generated",
						response: pages.length ? pages : undefined,
						reusableBlocks: Array.isArray(response.reusableBlocks)
							? response.reusableBlocks.filter(isReusableBlockProposal)
							: undefined,
						text: response.message || "Here is the generated page structure.",
					});
				} else if (response.action === "data_approval_pending") {
					const items = Array.isArray(response.items)
						? response.items.filter(isDataItem)
						: [];

					if (!items.length) {
						throw new Error("AI returned no valid data items.");
					}

					const remainingTables = Array.isArray(response.remainingTables)
						? response.remainingTables.filter(
								(t): t is string =>
									typeof t === "string" && t.trim().length > 0,
							)
						: [];

					const dataMessage: Message = {
						sender: "AI",
						action: "data_approval_pending",
						response: items,
						remainingTables,
						loadingMore: remainingTables.length > 0,
						text:
							response.message ||
							"Review the generated records before publishing.",
					};
					messages.value.push(dataMessage);

					if (remainingTables.length) continueDataGeneration(dataMessage);
				} else if (response.action === "translation_approval_pending") {
					const items = Array.isArray(response.items)
						? response.items.filter(isTranslationPlanItem)
						: [];

					if (!items.length) {
						throw new Error("AI returned no valid translation plan.");
					}

					messages.value.push({
						sender: "AI",
						action: "translation_approval_pending",
						response: items,
						text:
							response.message ||
							"Review the translation plan before proceeding.",
					});
				} else if (response.action === "dashboards_approval_pending") {
					const dashboards = Array.isArray(response.dashboards)
						? response.dashboards.filter(isDashboardProposal)
						: [];

					if (!dashboards.length) {
						throw new Error("AI returned no valid dashboard definitions.");
					}

					messages.value.push({
						sender: "AI",
						action: "dashboards_approval_pending",
						response: dashboards,
						text:
							response.message ||
							"Review the generated dashboards before applying the changes.",
					});
				} else if (response.action === "dashboards_delete_pending") {
					const ids = Array.isArray(response.deleteIDs)
						? response.deleteIDs.filter(
								(id): id is string | number =>
									(typeof id === "string" && id.trim().length > 0) ||
									(typeof id === "number" && Number.isFinite(id)),
							)
						: [];

					if (!ids.length) {
						throw new Error("AI returned no valid dashboard ids to delete.");
					}

					messages.value.push({
						sender: "AI",
						action: "dashboards_delete_pending",
						response: ids,
						text:
							response.message ||
							"Review the dashboards to delete before confirming.",
					});
				} else if (response.action === "completed") {
					// A generation response is never evidence that a write occurred.
					messages.value.push({ sender: "AI", text: response.action ?? t("chatNoChangesApplied") });
					responseID.value = "";
				} else if (response.message) {
					messages.value.push({
						sender: "AI",
						action: response.action as MessageAction,
						text: response.message,
					});
				} else {
					throw new Error("No message in AI response");
				}
			}
		}

		if (maxRedirects === 0 && keepTrying) {
			messages.value.push({
				sender: "AI",
				action: "error",
				text: "Too many redirects occurred.",
			});
		}

		if (!userHasScrolledUp.value) await scrollToBottom();
	} catch (error: unknown) {
		if (requestSnapshot !== requestVersion.value) return;
		console.error("Error sending message:", error);
		const apiError = error as {
			data?: { result?: { message?: string }; message?: string };
			message?: string;
		};
		const errorMsg =
			apiError?.data?.result?.message ||
			apiError?.data?.message ||
			apiError?.message ||
			t("error");
		messages.value.push({
			sender: "AI",
			action: "error",
			text: errorMsg,
		});
		if (!userHasScrolledUp.value) await scrollToBottom();
	}
	if (requestSnapshot === requestVersion.value) loading.value = false;
};

onMounted(async () => {
	await loadSubscriptionData();
	subscriptionChecked.value = true;

	if (!hasActiveSubscription.value) {
		return;
	}

	loadPersistedChatState();
	await addWelcomeMessage();
});

watch(
	[
		messages,
		responseID,
		currentEndpoint,
		currentMessage,
		chatDatabaseContext,
		selectedTable,
	],
	schedulePersistChatState,
	{ deep: true, flush: "post" },
);

watch(
	() => props.resetNonce,
	(newValue, oldValue) => {
		if (newValue === oldValue) return;
		resetChat();
	},
);

onBeforeUnmount(() => {
	if (persistTimer) {
		clearTimeout(persistTimer);
		persistTimer = null;
		persistChatState();
	}
});
</script>