<template>
	<NCard hoverable style="max-width: 300px">
		<NTabs ref="tabsInstRef" v-model:value="tabsValue" size="large" justify-content="center" animated>
			<NTabPane name="signin" :tab="t('signin')">
				<NForm ref="SigninFormRef" :model="SigninForm" @submit="SigninSubmit">
					<FieldS v-model="SigninForm" :schema="SigninColumns" />
					<NButton attr-type="submit" type="primary" block secondary strong :loading="Loading.Signin">
						{{ t("signin") }}
					</NButton>
				</NForm>
			</NTabPane>
			<NTabPane name="signup" :tab="t('signup')" :disabled="!table?.allowedMethods?.includes('c')">
				<Form ref="SignupFormRef" v-model="SignupForm" table="users" @after-create="onAfterSignup" />
				<NButton @click="SignupFormRef?.create" type="primary" block secondary strong :loading="Loading.Signup">
					{{ t("signup") }}
				</NButton>
			</NTabPane>
		</NTabs>
	</NCard>
</template>

<script lang="ts" setup>
import type { FormInst, TabsInst } from "naive-ui"

const props = defineProps<{
	modal?: boolean
}>()

const emit = defineEmits<{
	loggedIn: []
}>()

const appConfig = useAppConfig()
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))

const fromPath = useCookie("from", { sameSite: true })

const SigninFormRef = ref<FormInst | null>(null)
const route = useRoute()
const tabsInstRef = ref<TabsInst | null>(null)
const tabsValue = ref((route.query.tab as string) ?? "signin") // Default tab
const database = useState<Database>("database")
const table = useState<Table>("table")
const user = useState<User>("user")
const SignupForm = useState(() => ({
	role: "b4694ff1f8c483824582c1e2dc75f0f9",
}))
const SignupFormRef = ref<FormRef>()
const SigninForm = ref({
	username: "",
	password: "",
})
const SigninColumns: Schema = [
	{
		key: "username",
		type: "string",
		required: true,
	},
	{
		key: "password",
		type: "password",
		required: true,
	},
]

const Language = useCookie<LanguagesType>("language", { sameSite: true })
function onAfterSignup(data?: Item) {
	SigninForm.value.username = data?.username || ""
	tabsValue.value = "signin"
	tabsInstRef.value?.syncBarPosition()
}

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function SigninSubmit(e: Event) {
	e.preventDefault()
	SigninFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(SigninForm.value)
			if (Loading.value.Signin !== true) {
				Loading.value.Signin = true
				const data = await $fetch<Record<string, any>>(
					`${appConfig.apiBase}${database.value.slug}/auth/signin`,
					{
						method: "PUT",
						body: bodyContent,
						params: {
							locale: Language.value
						},
						credentials: "include",
					},
				)
				if (data.result?.id) {
					sessionID.value = data.result.sessionID
					window.$message.success(data.message)
					user.value = data.result
					database.value = (
						await $fetch<apiResponse<Database>>(
							`${appConfig.apiBase}inicontent/databases/${database.value.slug}`,
							{
								credentials: "include", params: {
									[`${database.value.slug}_sid`]: sessionID.value
								}
							},
						)
					).result
					if (props.modal) {
						emit('loggedIn')
					} else {
						await navigateTo(
							fromPath.value &&
								(fromPath.value.startsWith(`/${database.value.slug}`) ||
									fromPath.value.startsWith("/admin")) &&
								!fromPath.value.endsWith("/auth")
								? fromPath.value
								: route.params.database
									? `/${database.value.slug}/admin`
									: "/admin",
						)
					}
				} else window.$message.error(data.message)
				Loading.value.Signin = false
			}
		} else window.$message.error(t("inputsAreInvalid"))
	})
}

useHead({
	title: `${t(database.value.slug)} | ${t("authentication")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
})
</script>
