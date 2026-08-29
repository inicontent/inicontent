<template>
	<main class="api-auth-doc-page">
		<NCard :bordered="false">
			<template #header>
				<NFlex align="center" :size="8">
					<Icon name="tabler:key" size="18" />
					<NH2 style="margin: 0">{{ t('apiDocs.auth.title') }}</NH2>
				</NFlex>
			</template>
			<NH5>{{ t('apiDocs.auth.description', { param: sessionParamName }) }}</NH5>
		</NCard>

		<section class="api-auth-doc-page__endpoints">
			<ApiEndpointCard
				:endpoint="signinEndpoint"
				method="PUT"
				:description="t('apiDocs.auth.signinDescription')"
				:request-example="signinRequest"
				:response-example="signinResponse"
				:params="signinParams"
			/>

			<ApiEndpointCard
				:endpoint="signupEndpoint"
				method="POST"
				:description="t('apiDocs.auth.signupDescription')"
				:request-example="signupRequest"
				:response-example="signupResponse"
			/>

			<ApiEndpointCard
				:endpoint="currentEndpoint"
				method="GET"
				:description="t('apiDocs.auth.currentDescription', { param: sessionParamName })"
				:response-example="currentResponse"
				:params="currentParams"
			/>

			<ApiEndpointCard
				:endpoint="signoutEndpoint"
				method="GET"
				:description="t('apiDocs.auth.signoutDescription')"
				:response-example="signoutResponse"
			/>

			<ApiEndpointCard
				:endpoint="resetRequestEndpoint"
				method="POST"
				:description="t('apiDocs.auth.resetRequestDescription')"
				:request-example="resetRequestRequest"
				:response-example="resetRequestResponse"
			/>

			<ApiEndpointCard
				:endpoint="resetCompleteEndpoint"
				method="PUT"
				:description="t('apiDocs.auth.resetCompleteDescription')"
				:request-example="resetCompleteRequest"
				:response-example="resetCompleteResponse"
			/>
		</section>

		<section v-if="usersTable?.schema?.length" class="api-auth-doc-page__schema">
			<NCard :bordered="false">
				<template #header>
					<NFlex align="center" :size="8">
						<Icon name="tabler:users" size="18" />
						<NH3 style="margin: 0">{{ t('apiDocs.auth.signupSchemaTitle') }}</NH3>
					</NFlex>
				</template>
				<ApiSchemaDocsTable :schema="usersTable.schema" size="large" />
			</NCard>
		</section>

		<NAlert type="info" :show-icon="false">
			{{ t('apiDocs.auth.cookieHint', { param: sessionParamName }) }}
		</NAlert>
	</main>
</template>

<script setup lang="ts">
import { Icon } from "#components";

definePageMeta({
	layout: "dashboard",
	middleware: ["database", "user", "dashboard", "global"],
});

const route = useRoute();
const database = useState<Database>("database");
const config = useRuntimeConfig();

const sessionParamName = computed(() => {
	const slug =
		(route.params.database as string | undefined) ||
		database.value?.slug ||
		"inicontent";
	return `${slug}_sid`;
});

const dbSlug = computed(
	() =>
		(route.params.database as string | undefined) ||
		database.value?.slug ||
		"inicontent",
);

const apiBase = computed(() => config.public.apiBase);

const usersTable = computed(() =>
	database.value?.tables?.find((table) => table.slug === "users"),
);

const signinEndpoint = computed(() => `/${dbSlug.value}/auth/signin`);
const signupEndpoint = computed(() => `/${dbSlug.value}/auth/signup`);
const currentEndpoint = computed(() => `/${dbSlug.value}/auth/current`);
const signoutEndpoint = computed(() => `/${dbSlug.value}/auth/signout`);
const resetRequestEndpoint = computed(() => `/${dbSlug.value}/auth/reset`);
const resetCompleteEndpoint = computed(() => `/${dbSlug.value}/auth/reset`);

const signinRequest = `{
  "username": "demo",
  "password": "mypassword123"
}`;

const signinResponse = `{
  "result": {
    "id": "a1b2c3d4",
    "username": "demo",
    "email": "demo@example.com",
    "role": "editor",
    "createdBy": "...",
    "sessionID": "e5f6g7h8i9j0"
  },
  "message": "Signed in successfully",
  "options": {},
  "code": 200
}`;

const signinParams = computed(() => [
	{
		name: "locale",
		type: "string",
		required: false,
		description: t("apiDocs.localeParam"),
	},
]);

const signupRequest = `{
  "username": "newuser",
  "password": "securepass123",
  "email": "newuser@example.com",
  "role": "editor"
}`;

const signupResponse = `{
  "result": {
    "id": "b2c3d4e5",
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "editor",
    "createdBy": "..."
  },
  "message": "User created successfully",
  "options": {},
  "code": 200
}`;

const currentResponse = `{
  "result": {
    "id": "a1b2c3d4",
    "username": "demo",
    "email": "demo@example.com",
    "role": "editor",
    "createdBy": "..."
  },
  "message": "Session is valid",
  "options": {},
  "code": 200
}`;

const currentParams = computed(() => [
	{
		name: sessionParamName.value,
		type: "string",
		required: true,
		description: "Session ID",
	},
	{
		name: "isSignedIn",
		type: "boolean",
		required: false,
		description: t("apiDocs.isSignedInParam"),
	},
]);

const signoutResponse = `{
  "result": true,
  "message": "Signed out successfully",
  "options": {},
  "code": 200
}`;

const resetRequestRequest = `{
  "email": "demo@example.com"
}`;

const resetRequestResponse = `{
  "result": true,
  "message": "Password reset email sent",
  "options": {},
  "code": 200
}`;

const resetCompleteRequest = `{
  "token": "abc123def456",
  "password": "newpassword123"
}`;

const resetCompleteResponse = `{
  "result": true,
  "message": "Password has been reset successfully",
  "options": {},
  "code": 200
}`;

const jsonLd = computed(() => ({
	"@context": "https://schema.org",
	"@type": "WebAPI",
	name: `${dbSlug.value} Authentication API`,
	description: "Authentication endpoints for user sessions",
	baseUrl: `${apiBase.value}${dbSlug.value}/auth`,
	endpoints: [
		{
			"@type": "EntryPoint",
			name: "Sign in",
			httpMethod: "PUT",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/signin`,
		},
		{
			"@type": "EntryPoint",
			name: "Sign up",
			httpMethod: "POST",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/signup`,
		},
		{
			"@type": "EntryPoint",
			name: "Current user",
			httpMethod: "GET",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/current`,
		},
		{
			"@type": "EntryPoint",
			name: "Sign out",
			httpMethod: "GET",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/signout`,
		},
		{
			"@type": "EntryPoint",
			name: "Request password reset",
			httpMethod: "POST",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/reset`,
		},
		{
			"@type": "EntryPoint",
			name: "Complete password reset",
			httpMethod: "PUT",
			urlTemplate: `${apiBase.value}${dbSlug.value}/auth/reset`,
		},
	],
}));

useHead(() => ({
	title: `${t("auth")} | ${t("apiDocumentation")}`,
	meta: [
		{
			name: "description",
			content: `API authentication endpoints for ${dbSlug.value}. Sign in, sign up, manage sessions, and reset passwords.`,
		},
	],
	script: [
		{
			type: "application/ld+json",
			innerHTML: JSON.stringify(jsonLd.value),
		},
	],
}));
</script>

<style scoped>
.api-auth-doc-page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.api-auth-doc-page__endpoints {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.api-auth-doc-page__schema {
	margin-top: 8px;
}
</style>
