<template>
	<NPopover
		v-if="visible"
		v-model:show="show"
		trigger="click"
		placement="bottom"
		:style="{ maxWidth: '280px' }"
	>
		<template #trigger>
			<NButton secondary round size="small" :type="needRefresh ? 'primary' : 'default'">
				<template #icon>
					<NIcon>
						<Icon :name="needRefresh ? 'tabler:refresh-alert' : 'tabler:download'" />
					</NIcon>
				</template>
			</NButton>
		</template>

		<NFlex vertical justify="center" :size="6" style="min-width: 180px">
			<NText
				v-if="needRefresh"
				depth="3"
				style="font-size: 12px; line-height: 1.4; white-space: normal"
			>
				{{ t("updateAvailableHint") }}
			</NText>

			<NButton
				v-if="installable"
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
				v-if="needRefresh"
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
		</NFlex>
	</NPopover>
</template>

<script setup lang="ts">
import { Icon, NButton, NFlex, NIcon, NText } from "#components";

/**
 * App lifecycle prompts, kept deliberately OUT of the sync status button.
 *
 * A waiting service worker (`$pwa.needRefresh`) flips true whenever the browser
 * next checks the worker script — after the app has been left open or revisited
 * for a while — which used to make the cloud "sync" button pop into the header
 * even though nothing was offline and nothing needed syncing. It now gets its
 * own button with its own icon, so the sync button only ever means
 * offline / syncing / pending changes / conflicts.
 */

// Reactive $pwa instance injected by the vite-pwa Nuxt client plugin (client
// only, so it is undefined while server-rendering).
const { $pwa } = useNuxtApp();
const pwa = ref($pwa);
const show = ref(false);

const needRefresh = computed(() => !!pwa.value?.needRefresh);
const installable = computed(() => !!pwa.value?.showInstallPrompt);
// `import.meta.client` is statically false during SSR, so the server always
// renders nothing here and hydration never sees a button appear out of nowhere.
const visible = computed(() => import.meta.client && (needRefresh.value || installable.value));

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
</script>