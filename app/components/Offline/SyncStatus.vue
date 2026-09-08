<template>
	<NPopover
		v-model:show="show"
		trigger="click"
		:placement="'bottom'"
		:style="{ maxWidth: '280px' }"
	>
		<template #trigger>
			<NBadge
				v-if="badgeCount > 0"
				:value="badgeCount"
				:max="9"
				:type="conflictCount > 0 ? 'error' : 'warning'"
				:offset="[3, 3]"
			>
				<NButton round size="small" :type="buttonType">
					<template #icon>
						<NIcon>
							<Icon :name="buttonIcon" />
						</NIcon>
					</template>
				</NButton>
			</NBadge>
			<NButton v-else round size="small" :type="buttonType">
				<template #icon>
					<NIcon>
						<Icon :name="buttonIcon" />
					</NIcon>
				</template>
			</NButton>
		</template>

		<NFlex vertical justify="center" :size="6" style="min-width: 200px">
			<!-- Connection + sync status -->
			<NFlex align="center" justify="center" :reverse="Language === 'ar'" :size="6">
				<NIcon :class="{ spin: sync.isSyncing }">
					<Icon
						:name="
							sync.isSyncing
								? 'tabler:refresh'
								: sync.isOnline
									? 'tabler:cloud-check'
									: 'tabler:cloud-off'
						"
					/>
				</NIcon>
				<NText depth="2" style="font-size: 12px">
					{{
						sync.isSyncing
							? t("syncingPending")
							: sync.isOnline
								? t("online")
								: t("offline")
					}}
				</NText>
			</NFlex>

			<NText
				v-if="!sync.isOnline && !sync.isSyncing"
				depth="3"
				style="font-size: 12px; line-height: 1.4; white-space: normal"
			>
				{{ t("offlineTooltip") }}
			</NText>

			<!-- Pending changes + sync now -->
			<template v-if="sync.pendingCount > 0 && !sync.isSyncing">
				<NFlex align="center" justify="center" :size="12">
					<NText depth="2" style="font-size: 12px">
						{{ t("pendingChanges", { count: sync.pendingCount }) }}
					</NText>
					<NButton size="tiny" type="primary" tertiary @click="onOpenSync">
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

	<OfflineConflictDrawer ref="conflictDrawer" />
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

const Language = useLanguageCookie()

const sync = useOfflineSync();
const show = ref(false);

// Reactive $pwa instance injected by the vite-pwa Nuxt client plugin.
const { $pwa } = useNuxtApp() as any;
const pwa = ref($pwa);

const conflictCount = computed(() => sync.conflicts.value.length);
const badgeCount = computed(() => sync.pendingCount.value + conflictCount.value);

const buttonIcon = computed(() =>
	sync.isSyncing.value
		? "tabler:refresh"
		: sync.isOnline.value
			? "tabler:cloud-check"
			: "tabler:cloud-off",
);

const buttonType = computed(() => {
	if (conflictCount.value > 0) return "error";
	if (sync.pendingCount.value > 0) return "warning";
	if (!sync.isOnline.value) return "error";
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
	sync.syncPendingMutations();
}

const conflictDrawer = ref();
function onOpenConflicts() {
	show.value = false;
	conflictDrawer.value?.open();
}

onMounted(() => {
	// Deferred so opening IndexedDB never competes with initial render/fetch.
	const runInit = () => sync.initSync();
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