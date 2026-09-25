<template>
	<NModal
		v-model:show="isOpen"
		preset="card"
		:title="t('resolveConflicts')"
		:style="{ width: 'min(720px, calc(100vw - 32px))' }"
		:mask-closable="false"
	>
		<!-- Explain why this popped up: an offline edit collided with the server -->
		<NAlert
			v-if="conflicts.length"
			type="warning"
			:show-icon="true"
			style="margin-bottom: 16px"
		>
			{{ t('offlineBlockedIntro') }}
		</NAlert>

		<NSpin :show="isSyncing">
			<NFlex v-if="conflicts.length === 0 && !isSyncing" vertical align="center" justify="center"
				style="padding: 60px 0; gap: 12px">
				<NIcon size="48" color="#888">
					<Icon name="tabler:circle-check" />
				</NIcon>
				<NText depth="3">{{ t('noConflicts') }}</NText>
			</NFlex>

			<NFlex vertical :size="16">
				<NCard
					v-for="conflict in conflicts.slice(0, 1)"
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

					<NAlert v-if="conflict.errorMessage" type="error" style="margin-bottom: 12px">{{ t(conflict.errorMessage) }}</NAlert>
					<NDescriptions :column="1" size="small" label-placement="top">
						<NDescriptionsItem :label="t('localVersion')">
							<NInput v-model:value="drafts[conflict.id]" type="textarea" :autosize="{ minRows: 5, maxRows: 16 }" :disabled="isSyncing" />
						</NDescriptionsItem>
						<NDescriptionsItem :label="t('serverVersion')">
							<pre class="json">{{ pretty(conflict.conflictData?.server) }}</pre>
						</NDescriptionsItem>
					</NDescriptions>

					<template #footer>
						<NFlex justify="end" :size="8">
							<NButton
								:disabled="isSyncing"
								size="small"
								type="error"
								@click="keepServer(conflict.id)"
							>
								<template #icon>
									<NIcon><Icon name="tabler:server" /></NIcon>
								</template>
								{{ t('offlineDiscard') }}
							</NButton>
							<NButton
								:disabled="isSyncing"
								size="small"
								type="primary"
								@click="keepLocal(conflict.id)"
							>
								<template #icon>
									<NIcon><Icon name="tabler:device-mobile" /></NIcon>
								</template>
								{{ t('offlineEditRetry') }}
							</NButton>
						</NFlex>
					</template>
				</NCard>
			</NFlex>
		</NSpin>
	</NModal>
</template>

<script setup lang="ts">
import {
	Icon,
	NAlert,
	NButton,
	NCard,
	NDescriptions,
	NDescriptionsItem,
	NFlex,
	NIcon,
	NInput,
	NModal,
	NSpin,
	NTag,
	NText,
} from "#components";
import {
	resolveConflictKeepLocal,
	resolveConflictKeepServer,
	useOfflineSync,
} from "~/composables/useOfflineSync";

// Shared bus: SyncStatus's "resolve conflicts" action opens the *same* modal.
// Keeping this a useState (not component-local) means the modal can live
// globally in the layout and still be reachable from anywhere.
const isOpen = useState<boolean>("offline_conflictModalOpen", () => false);

// Destructure at the top level so the template compiler auto-unwraps these
// refs. Accessing them as `sync.conflicts` (properties of the plain object
// returned by useOfflineSync) would NOT unwrap: `v-for="conflict in
// sync.conflicts"` would iterate the raw Ref and crash rendering.
const { conflicts, isSyncing, refreshCounts } = useOfflineSync();

/**
 * Auto-open the modal whenever a NEW conflict batch is detected — i.e. a
 * queued offline mutation collided with the server during a sync (typically
 * right after the device reconnects). Re-armed when the conflict list empties
 * or when the user manually closes the modal, so a later conflict batch pops
 * it again instead of silently parking behind the header badge.
 */
const armed = ref(true);

function arm() {
	armed.value = true;
}

watch(
	() => conflicts.value.length,
	(count) => {
		if (count === 0) {
			arm();
			return;
		}
		if (armed.value) {
			isOpen.value = true;
			armed.value = false;
		}
	},
);

watch(isOpen, (open) => {
	if (!open) arm();
});

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

const drafts = reactive<Record<string, string>>({});
watch(
	conflicts,
	(entries) => {
		for (const entry of entries)
			drafts[entry.id] = JSON.stringify(entry.body, null, 2);
	},
	{ immediate: true },
);

async function keepLocal(id: string) {
	let body: any;
	try {
		body = JSON.parse(drafts[id] ?? "null");
	} catch {
		window.$message?.error(t("offlineInvalidJson"));
		return;
	}
	if (body !== null && (typeof body !== "object" || Array.isArray(body))) {
		window.$message?.error(t("offlineInvalidJson"));
		return;
	}
	try {
		await resolveConflictKeepLocal(id, body);
	} catch {
		window.$message?.error(t("offlineSyncFailed"));
	}
	await refreshCounts();
}

async function keepServer(id: string) {
	try {
		await resolveConflictKeepServer(id);
	} catch {
		window.$message?.error(t("offlineSyncFailed"));
	}
	await refreshCounts();
}
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