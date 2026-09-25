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

			<!-- PWA actions -->
			<template v-if="showPwa && (pwa?.needRefresh || pwa?.showInstallPrompt)">
				<NDivider style="margin: 6px 0" />
				<NButton
					v-if="pwa?.showInstallPrompt"
					size="tiny"
					block
					secondary
					@click="onInstall"
				>
					<template #icon>
						<NIcon>
							<Icon name="tabler:download" />
						</NIcon>
					</template>
					{{ t("installApp") }}
				</NButton>
				<NButton
					v-if="pwa?.needRefresh"
					size="tiny"
					block
					type="primary"
					secondary
					@click="onUpdate"
				>
					<template #icon>
						<NIcon>
							<Icon name="tabler:refresh-alert" />
						</NIcon>
					</template>
					{{ t("updateAvailable") }}
				</NButton>
			</template>
		</NFlex>
	</NPopover>
</template>

<script setup lang="ts">
import {
	Icon,
	NBadge,
	NButton,
	NDivider,
	NFlex,
	NIcon,
	NText,
} from "#components";
import { useOfflineSync } from "~/composables/useOfflineSync";

const props = defineProps<{
	showPwa?: boolean;
}>();

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

// Reactive $pwa instance injected by the vite-pwa Nuxt client plugin.
const { $pwa } = useNuxtApp() as any;
const pwa = ref($pwa);

const conflictCount = computed(() => conflicts.value.length);
const badgeCount = computed(() => pendingCount.value + conflictCount.value);

// Hide the network status button entirely when everything is fine: online,
// nothing pending, no conflicts, no PWA update/install prompt. It only appears
// when there is something the user should be aware of (offline, syncing, queued
// changes, conflicts) or can act on (PWA prompt).
const buttonVisible = computed(
	() =>
		!isOnline.value ||
		isSyncing.value ||
		badgeCount.value > 0 ||
		!!(pwa.value?.needRefresh || pwa.value?.showInstallPrompt),
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

async function onUpdate() {
	show.value = false;
	await $pwa.updateServiceWorker();
	$pwa.cancelPrompt();
	window.location.reload();
}

function onInstall() {
	show.value = false;
	$pwa.install();
}

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