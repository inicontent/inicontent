<template>
	<NPopover
		v-if="buttonVisible"
		v-model:show="show"
		trigger="click"
		:placement="'bottom'"
		:style="{ maxWidth: '280px' }"
	>
		<template #trigger>
			<NTooltip :show="reconnectHint" trigger="manual">
			<template #trigger><span>
			<NBadge
				v-if="badgeCount > 0"
				:value="badgeCount"
				:max="9"
				:type="conflictCount > 0 ? 'error' : 'warning'"
				:offset="[3, 3]"
			>
				<NButton secondary round size="small" :type="buttonType">
					<template #icon>
						<NIcon>
							<Icon :name="buttonIcon" />
						</NIcon>
					</template>
				</NButton>
			</NBadge>
			<NButton secondary v-else round size="small" :type="buttonType">
				<template #icon>
					<NIcon>
						<Icon :name="buttonIcon" />
					</NIcon>
				</template>
			</NButton>
			</span></template>
			{{ t("offlineReconnect") }}
			</NTooltip>
		</template>

		<NFlex vertical justify="center" :size="6" style="min-width: 200px">
			<!-- Connection + sync status -->
			<NFlex align="center" justify="center" :reverse="Language === 'ar'" :size="6">
				<NIcon :class="{ spin: isSyncing }">
					<Icon
						:name="
							isSyncing
								? 'tabler:refresh'
								: isOnline
									? 'tabler:cloud-check'
									: 'tabler:cloud-off'
						"
					/>
				</NIcon>
				<NText depth="2" style="font-size: 12px">
					{{
						isSyncing
							? t("syncingPending")
							: isOnline
								? t("online")
								: t("offline")
					}}
				</NText>
			</NFlex>

			<NText
				v-if="!isOnline && !isSyncing"
				depth="3"
				style="font-size: 12px; line-height: 1.4; white-space: normal"
			>
				{{ t("offlineTooltip") }}
			</NText>

			<!-- Pending changes + sync now -->
			<template v-if="pendingCount > 0 && !isSyncing">
				<NFlex align="center" justify="center" :size="12">
					<NText depth="2" style="font-size: 12px">
						{{ t("pendingChanges", { count: pendingCount }) }}
					</NText>
					<NButton size="tiny" type="primary" tertiary :disabled="!isOnline || conflictCount > 0" @click="onOpenSync">
						{{ t("syncNow") }}
					</NButton>
				</NFlex>
			</template>

			<!-- Conflicts -->
			<template v-if="conflictCount > 0">
				<NFlex align="center" justify="center" :size="12">
					<NText depth="2" style="font-size: 12px">
						{{ t("conflictsPending", { count: conflictCount }) }}
					</NText>
					<NButton size="tiny" type="error" tertiary @click="onOpenConflicts">
						{{ t("resolveConflicts") }}
					</NButton>
				</NFlex>
			</template>
		</NFlex>
	</NPopover>
</template>

<script setup lang="ts">
import {
	Icon,
	NBadge,
	NButton,
	NFlex,
	NIcon,
	NText,
} from "#components";
import { shouldShowSyncStatus } from "~/composables/offlineStatus";
import { useOfflineSync } from "~/composables/useOfflineSync";

const database = useState<Database>("database");
const Language = useScopedCookie<LanguagesType>(
	"language",
	database.value?.slug,
);

// Destructured at top level so the template compiler auto-unwraps these refs
// (a plain-object property like `sync.isSyncing` would NOT unwrap, silently
// breaking the popover content: `!sync.isSyncing` is always false because a
// Ref object is always truthy).
const {
	isOnline,
	isSyncing,
	conflicts,
	pendingCount,
	syncPendingMutations,
	initSync,
} = useOfflineSync();
const show = ref(false);
const reconnectHint = ref(false);
let hintTimer: ReturnType<typeof setTimeout> | undefined;
watch(isOnline, (online, wasOnline) => {
	clearTimeout(hintTimer);
	reconnectHint.value =
		online && !wasOnline && pendingCount.value + conflicts.value.length > 0;
	if (reconnectHint.value)
		hintTimer = setTimeout(() => {
			reconnectHint.value = false;
		}, 2000);
});
onUnmounted(() => clearTimeout(hintTimer));

const conflictCount = computed(() => conflicts.value.length);
const badgeCount = computed(() => pendingCount.value + conflictCount.value);

// Hide the network status button entirely when everything is fine: online,
// nothing pending, no conflicts. It only appears when there is something the
// user should be aware of (offline, syncing, queued changes, conflicts). App
// updates and install prompts are a separate concern with their own button
// (Offline/PwaStatus.vue) — they must never make a sync button show up.
const buttonVisible = computed(() =>
	shouldShowSyncStatus({
		isOnline: isOnline.value,
		isSyncing: isSyncing.value,
		pendingCount: pendingCount.value,
		conflictCount: conflictCount.value,
	}),
);

const buttonIcon = computed(() =>
	isSyncing.value
		? "tabler:refresh"
		: isOnline.value
			? "tabler:cloud-check"
			: "tabler:cloud-off",
);

const buttonType = computed(() => {
	if (conflictCount.value > 0) return "error";
	if (pendingCount.value > 0) return "warning";
	if (!isOnline.value) return "error";
	return "default";
});

function onOpenSync() {
	void syncPendingMutations().catch(() =>
		window.$message?.error(t("offlineSyncFailed")),
	);
}

// The conflict resolution UI lives as a global modal (mounted in the layout);
// opening it here just flips the shared useState bus so it appears.
const conflictModalOpen = useState<boolean>(
	"offline_conflictModalOpen",
	() => false,
);
function onOpenConflicts() {
	show.value = false;
	conflictModalOpen.value = true;
}

onMounted(() => {
	// Deferred so opening IndexedDB never competes with initial render/fetch.
	const runInit = () => initSync();
	if ("requestIdleCallback" in window) {
		// @ts-expect-error requestIdleCallback types not present
		window.requestIdleCallback(runInit, { timeout: 3000 });
	} else {
		setTimeout(runInit, 500);
	}
});
</script>

<style scoped>
.spin {
	animation: spin 1s linear infinite;
}
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>