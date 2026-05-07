<template>
	<NFlex vertical :size="16">
		<LazyFormCard v-if="dataObject" v-model="dataObject" />

		<NCard
			v-if="isCurrentUserProfile"
			:title="t('passkey.securityTitle')"
			hoverable
		>
			<NFlex vertical :size="12">
				<NText depth="3">
					{{ t('passkey.description') }}
				</NText>

				<NButton
					type="primary"
					secondary
					strong
					:disabled="!isPasskeySupported"
					:loading="isRegisteringPasskey"
					@click="registerPasskey"
				>
					{{ t('passkey.register') }}
				</NButton>

				<NText depth="3" style="font-size: 12px;">
					{{ passkeyRegisterHint }}
				</NText>
			</NFlex>
		</NCard>

		<LazyTableLogs v-if="table.config?.log && dataObject" :id="dataObject.id" />
	</NFlex>
</template>

<script lang="ts" setup>
import Inison from "inison"
import { usePasskeyAuth } from "~/composables/usePasskeyAuth"

definePageMeta({
	middleware: ["database", "user", "dashboard", "table", "global"],
	layout: "table",
})

onBeforeRouteUpdate((route, currentRoute) => {
	if (route.fullPath !== currentRoute.fullPath.slice(0, -5))
		clearNuxtState("currentItem")
})

const route = useRoute()
const config = useRuntimeConfig()
const database = useState<Database>("database")
const table = useState<Table>("table")
const user = useState<User | undefined>("user")
const dataObject = ref<Item>({})
const isRegisteringPasskey = ref(false)

const { registerCurrentUserPasskey, isPasskeySupported } = usePasskeyAuth()

const isCurrentUserProfile = computed(
	() =>
		table.value?.slug === "users" &&
		String(route.params.id) === String(user.value?.id),
)

const passkeyRegisterHint = computed(() => {
	if (!isPasskeySupported.value) {
		return t("passkey.notSupported");
	}

	return t("passkey.hint");
})

async function registerPasskey() {
	if (!isPasskeySupported.value) {
		window.$message.error(passkeyRegisterHint.value)
		return
	}

	if (isRegisteringPasskey.value) return

	isRegisteringPasskey.value = true
	try {
		const response = await registerCurrentUserPasskey()
		window.$message.success(response.message || t("passkey.registeredSuccessfully"))
	} catch (error: unknown) {
		window.$message.error(
			error instanceof Error ? error.message : t("passkey.registrationFailed"),
		)
	} finally {
		isRegisteringPasskey.value = false
	}
}

const sessionID = useSessionCookie()

await useFetch<Item>(
	`${config.public.apiBase}${database.value.slug}/${table.value.slug
	}/${route.params.id}`,
	{
		query: {
			options: Inison.stringify({
				columns: table.value.columns,
			}),
			[`${database.value.slug}_sid`]: sessionID.value,
		},
		transform: (input) => {
			dataObject.value = input.result
		},
		credentials: "include",
	},
)

if (!dataObject.value?.id)
	throw createError({
		statusCode: 404,
		statusMessage: "item",
		fatal: true,
	})

const currentItem = useState<Item>("currentItem")
currentItem.value = dataObject.value
</script>
