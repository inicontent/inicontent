<template>
	<NuxtLayout name="default">
		<NLayout position="absolute">
			<NScrollbar id="iniHeader" style="max-height: 65px" xScrollable trigger="none">
				<NLayoutHeader style="height: 64px; padding: 15px 24px" bordered>
					<LazyHeader />
				</NLayoutHeader>
			</NScrollbar>
			<NLayoutContent id="container" position="absolute"
				content-style="display: flex;justify-content: center;align-items: center;padding: 24px 0;height: max-content"
				:native-scrollbar="false">
				<slot></slot>
			</NLayoutContent>
		</NLayout>

		<NModal v-model:show="showAuthModal" :mask-closable="false" :close-on-esc="false">
			<Auth modal @logged-in="onLoggedIn" />
		</NModal>

		<LazyAssetPreview />
	</NuxtLayout>
</template>

<script setup lang="ts">
// onBeforeUpdate(() => {
//     clearNuxtState("translations");
// })

const appConfig = useAppConfig()
const route = useRoute()
const database = useState<Database>("database")


const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})


const showAuthModal = ref(false)

async function checkAuth() {
	if (showAuthModal.value || String(route.name).endsWith('auth')) return;

	if (!sessionID.value) {
		showAuthModal.value = true
		return;
	}

	try {
		const data = await $fetch<{ result: boolean }>(
			`${appConfig.apiBase}${database.value.slug}/auth/current`,
			{
				credentials: "include",
				query: { isSignedIn: true, [`${database.value.slug}_sid`]: sessionID.value },
			},
		)
		if (!data.result) {
			showAuthModal.value = true
		}
	} catch (error) {
		showAuthModal.value = true
	}
}

function onLoggedIn() {
	showAuthModal.value = false
	// User and sessionID are already updated in Auth component
}

onMounted(async () => {
	checkAuth()
	if (!String(route.name).endsWith("auth")) {
		const interval = setInterval(checkAuth, 60000) // Check every 1 minute
		onUnmounted(() => clearInterval(interval))
	}
})
</script>