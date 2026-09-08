<template>
	<NDrawer v-model:show="show" :width="720" placement="right">
		<NDrawerContent :title="t('resolveConflicts')" closable>
			<template #header-extra>
				<NButton
					v-if="sync.conflicts.length"
					size="small"
					type="error"
					quaternary
					@click="onDiscardAll"
				>
					{{ t('discardAll') }}
				</NButton>
			</template>

			<NSpin :show="sync.isSyncing">
				<NFlex v-if="sync.conflicts.length === 0 && !sync.isSyncing" vertical align="center" justify="center"
					style="padding: 60px 0; gap: 12px">
					<NIcon size="48" color="#888">
						<Icon name="tabler:circle-check" />
					</NIcon>
					<NText depth="3">{{ t('noConflicts') }}</NText>
				</NFlex>

				<NFlex vertical :size="16">
					<NCard
						v-for="conflict in sync.conflicts"
						:key="conflict.id"
						:title="`${conflict.method} · ${conflict.table || conflict.database}`"
						size="small"
						bordered
					>
						<template #header-extra>
							<NTag size="small" type="warning" :bordered="false">
								{{ conflict.method }}
							</NTag>
						</template>

						<NDescriptions :column="1" size="small" label-placement="top">
							<NDescriptionsItem :label="t('localVersion')">
								<pre class="json">{{ pretty(conflict.conflictData?.local) }}</pre>
							</NDescriptionsItem>
							<NDescriptionsItem :label="t('serverVersion')">
								<pre class="json">{{ pretty(conflict.conflictData?.server) }}</pre>
							</NDescriptionsItem>
						</NDescriptions>

						<template #footer>
							<NFlex justify="end" :size="8">
								<NButton
									size="small"
									type="error"
									@click="keepServer(conflict.id)"
								>
									<template #icon>
										<NIcon><Icon name="tabler:server" /></NIcon>
									</template>
									{{ t('keepServer') }}
								</NButton>
								<NButton
									size="small"
									type="primary"
									@click="keepLocal(conflict.id)"
								>
									<template #icon>
										<NIcon><Icon name="tabler:device-mobile" /></NIcon>
									</template>
									{{ t('keepLocal') }}
								</NButton>
							</NFlex>
						</template>
					</NCard>
				</NFlex>
			</NSpin>
		</NDrawerContent>
	</NDrawer>
</template>

<script setup lang="ts">
import {
	Icon,
	NButton,
	NCard,
	NDescriptions,
	NDescriptionsItem,
	NIcon,
	NTag,
} from "#components";
import {
	discardAllConflicts,
	resolveConflictKeepLocal,
	resolveConflictKeepServer,
	useOfflineSync,
} from "~/composables/useOfflineSync";

const show = ref(false);
const sync = useOfflineSync();

function pretty(value: any): string {
	if (value === undefined || value === null) return "—";
	if (typeof value === "string") {
		try {
			return JSON.stringify(JSON.parse(value), null, 2);
		} catch {
			return value;
		}
	}
	return JSON.stringify(value, null, 2);
}

function open() {
	show.value = true;
	sync.refreshCounts();
}

async function keepLocal(id: string) {
	await resolveConflictKeepLocal(id);
	await sync.refreshCounts();
	window.$message?.success(t("changeQueuedForSync"));
}

async function keepServer(id: string) {
	await resolveConflictKeepServer(id);
	await sync.refreshCounts();
	window.$message?.info(t("localChangeDiscarded"));
}

async function onDiscardAll() {
	await discardAllConflicts();
	await sync.refreshCounts();
	window.$message?.info(t("allLocalChangesDiscarded"));
}

defineExpose({ open });
</script>

<style scoped>
.json {
	background: rgba(127, 127, 127, 0.08);
	border-radius: 6px;
	padding: 8px;
	font-size: 12px;
	white-space: pre-wrap;
	word-break: break-word;
	max-height: 240px;
	overflow: auto;
	margin: 0;
}
</style>
