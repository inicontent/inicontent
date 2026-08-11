<template>
	<NCard hoverable style="max-width: 300px; margin: auto;">
		<NTabs ref="tabsInstRef" v-model:value="tabsValue" size="large" justify-content="center" animated>
			<NTabPane name="signin" :tab="t('signin')">
				<NForm ref="SigninFormRef" :model="SigninForm" @submit="SigninSubmit">
					<FieldS v-model="SigninForm" :schema="SigninColumns" />
					<NButtonGroup style="width: 100%;">
						<NButton attr-type="submit" type="primary" style="flex: 1;" secondary strong :loading="Loading.Signin">
							{{ t("signin") }}
						</NButton>
						<NTooltip v-if="isPasskeySupported" trigger="hover" :disabled="!passkeySigninHint">
							<template #trigger>
								<NButton
									type="primary"
									secondary
									strong
									:loading="Loading.PasskeySignin"
									:disabled="!canStartPasskeySignin"
									@click="SigninWithPasskey"
								>
									<template #icon>
										<NIcon>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<circle cx="8" cy="8" r="3"/>
												<path d="M13 8a5 5 0 0 1 5 5v1h2v2h-2v2h-2v-2h-4.17"/>
												<line x1="8" y1="11" x2="8" y2="21"/>
											</svg>
										</NIcon>
									</template>
								</NButton>
							</template>
							{{ passkeySigninHint }}
						</NTooltip>
					</NButtonGroup>
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

	<NModal
		v-model:show="showPasskeyEnrollment"
		preset="card"
		:mask-closable="false"
		:close-on-esc="false"
		:title="t('passkey.enrollmentTitle')"
		style="width: min(420px, calc(100vw - 32px));"
	>
		<NFlex vertical :size="16">
			<NText>{{ t("passkey.enrollmentPrompt") }}</NText>
			<NFlex justify="end">
				<NButton :disabled="Loading.PasskeyRegistration" @click="skipPasskeyEnrollment">
					{{ t("passkey.notNow") }}
				</NButton>
				<NButton
					type="primary"
					secondary
					strong
					:loading="Loading.PasskeyRegistration"
					@click="registerPasskeyAfterLogin"
				>
					{{ t("passkey.register") }}
				</NButton>
			</NFlex>
		</NFlex>
	</NModal>
</template>

<script lang="ts" setup>
import type { FormInst, TabsInst } from "naive-ui";
import { usePasskeyAuth } from "~/composables/usePasskeyAuth";

const props = defineProps<{
	modal?: boolean;
}>();

const emit = defineEmits<{
	loggedIn: [];
}>();

const config = useRuntimeConfig();
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const { beginPasskeySignIn, isPasskeySupported, registerCurrentUserPasskey } =
	usePasskeyAuth();

const redirectTo = useCookie("redirectTo", { sameSite: true });

const SigninFormRef = ref<FormInst | null>(null);
const route = useRoute();
const tabsInstRef = ref<TabsInst | null>(null);
const tabsValue = ref((route.query.tab as string) ?? "signin"); // Default tab
const database = useState<Database>("database");
const table = useState<Table>("table");
const user = useState<User>("user");
const SignupForm = useState(() => ({
	role: "b4694ff1f8c483824582c1e2dc75f0f9",
}));
const SignupFormRef = ref<FormRef>();
const SigninForm = ref({
	username: "",
	password: "",
});
const showPasskeyEnrollment = ref(false);
let resolvePasskeyEnrollment: (() => void) | undefined;
const canStartPasskeySignin = computed(
	() => isPasskeySupported.value && !!SigninForm.value.username?.trim(),
);
const passkeySigninHint = computed(() => {
	if (!SigninForm.value.username?.trim()) {
		return t("passkey.signinHintUsername");
	}

	return t("passkey.signinHintDevice");
});
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
];

const Language = useCookie<LanguagesType>("language", { sameSite: true });
function onAfterSignup(data?: Item) {
	SigninForm.value.username = data?.username || "";
	tabsValue.value = "signin";
	tabsInstRef.value?.syncBarPosition();
}

const sessionID = useSessionCookie();

const isSafeRedirect = (value?: string) =>
	!!value &&
	value.startsWith("/") &&
	!value.startsWith("//") &&
	!value.endsWith("/auth") &&
	!value.includes("/auth?");

type LoginPayload = User & { sessionID: string; hasPasskey?: boolean };
type LoginResponse = apiResponse<LoginPayload>;

function promptForPasskeyEnrollment() {
	showPasskeyEnrollment.value = true;
	return new Promise<void>((resolve) => {
		resolvePasskeyEnrollment = resolve;
	});
}

async function finishPasskeyEnrollment() {
	showPasskeyEnrollment.value = false;
	await nextTick();
	resolvePasskeyEnrollment?.();
	resolvePasskeyEnrollment = undefined;
}

function skipPasskeyEnrollment() {
	finishPasskeyEnrollment();
}

async function registerPasskeyAfterLogin() {
	if (Loading.value.PasskeyRegistration === true) return;

	Loading.value.PasskeyRegistration = true;
	try {
		const response = await registerCurrentUserPasskey();
		window.$message.success(
			response.message || t("passkey.registeredSuccessfully"),
		);
		finishPasskeyEnrollment();
	} catch (error: unknown) {
		window.$message.error(
			error instanceof Error ? error.message : t("passkey.registrationFailed"),
		);
	} finally {
		Loading.value.PasskeyRegistration = false;
	}
}

async function handleSuccessfulLogin(
	data: LoginResponse,
	offerPasskeyEnrollment = false,
) {
	sessionID.value = data.result.sessionID;
	window.$message.success(data.message);
	user.value = data.result;
	database.value = (
		await $fetch<apiResponse<Database>>(
			`${config.public.apiBase}inicontent/databases/${database.value.slug}`,
			{
				credentials: "include",
				params: {
					[`${database.value.slug}_sid`]: sessionID.value,
				},
			},
		)
	).result;

	if (
		offerPasskeyEnrollment &&
		isPasskeySupported.value &&
		!data.result.hasPasskey
	) {
		await promptForPasskeyEnrollment();
	}

	if (props.modal) {
		emit("loggedIn");
		return;
	}

	const queryRedirectTo =
		typeof route.query.redirectTo === "string"
			? route.query.redirectTo
			: undefined;
	const target = isSafeRedirect(queryRedirectTo)
		? queryRedirectTo
		: isSafeRedirect(redirectTo.value ?? undefined)
			? redirectTo.value
			: undefined;
	await navigateTo(
		target
			? target
			: route.params.database
				? `/${database.value.slug}/admin`
				: "/admin",
	);
}

async function SigninSubmit(e: Event) {
	e.preventDefault();
	SigninFormRef.value?.validate(async (errors) => {
		if (!errors) {
			const bodyContent = toRaw(SigninForm.value);
			if (Loading.value.Signin !== true) {
				Loading.value.Signin = true;
				const data = await $fetch<LoginResponse>(
					`${config.public.apiBase}${database.value.slug}/auth/signin`,
					{
						method: "PUT",
						body: bodyContent,
						params: {
							locale: Language.value,
						},
						credentials: "include",
					},
				);
				if (data.result?.id) {
					await handleSuccessfulLogin(data, true);
				} else window.$message.error(data.message);
				Loading.value.Signin = false;
			}
		} else window.$message.error(t("inputsAreInvalid"));
	});
}

async function SigninWithPasskey() {
	if (!canStartPasskeySignin.value) {
		window.$message.error(passkeySigninHint.value);
		return;
	}

	const identifier = SigninForm.value.username.trim();

	if (Loading.value.PasskeySignin === true) return;

	Loading.value.PasskeySignin = true;
	try {
		const data = await beginPasskeySignIn(identifier);
		if (data.result?.id) {
			await handleSuccessfulLogin(data);
		} else {
			window.$message.error(data.message);
		}
	} catch (error: unknown) {
		window.$message.error(
			error instanceof Error ? error.message : t("passkey.signinFailed"),
		);
	} finally {
		Loading.value.PasskeySignin = false;
	}
}

useHead(() => ({
	title: `${t(database.value.slug)} | ${t("authentication")}`,
	link: [
		{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" },
	],
}));
</script>
