<template>
    <div class="api-auth-doc-page">
        <NCard :bordered="false">
            <template #header>
                <NFlex align="center" :size="8">
                    <Icon name="tabler:key" size="18" />
                    <span>{{ t('apiDocs.auth.title') }}</span>
                </NFlex>
            </template>
            <NP>
                {{
                    t('apiDocs.auth.description', {
                        param: sessionParamName,
                    })
                }}
            </NP>
        </NCard>

        <NGrid cols="1 900:2" :x-gap="16" :y-gap="16">
            <NGridItem>
                <NCard>
                    <template #header>
                        <NFlex align="center" wrap :size="8">
                            <NTag type="success">POST</NTag>
                            <NTag type="warning">PUT</NTag>
                            <span>/auth/signin</span>
                        </NFlex>
                    </template>
                    <NP>{{ t('apiDocs.auth.signinDescription') }}</NP>
                    <NList>
                        <NListItem>{{ t('apiDocs.auth.usernameField') }}</NListItem>
                        <NListItem>{{ t('apiDocs.auth.passwordField') }}</NListItem>
                    </NList>
                    <NCode :code="signinSnippet" language="json" word-wrap />
                </NCard>
            </NGridItem>

            <NGridItem>
                <NCard>
                    <template #header>
                        <NFlex align="center" wrap :size="8">
                            <NTag type="success">POST</NTag>
                            <span>/auth/signup</span>
                        </NFlex>
                    </template>
                    <NP>{{ t('apiDocs.auth.signupDescription') }}</NP>
                    <NCode :code="signupSnippet" language="json" word-wrap />
                </NCard>
            </NGridItem>

            <NGridItem>
                <NCard>
                    <template #header>
                        <NFlex align="center" wrap :size="8">
                            <NTag type="info">GET</NTag>
                            <span>/auth/current</span>
                        </NFlex>
                    </template>
                    <NP>{{ t('apiDocs.auth.currentDescription') }}</NP>
                </NCard>
            </NGridItem>

            <NGridItem>
                <NCard>
                    <template #header>
                        <NFlex align="center" wrap :size="8">
                            <NTag type="info">GET</NTag>
                            <span>/auth/signout</span>
                        </NFlex>
                    </template>
                    <NP>{{ t('apiDocs.auth.signoutDescription') }}</NP>
                </NCard>
            </NGridItem>
        </NGrid>

        <NCard :bordered="false" class="api-auth-doc-page__schema" v-if="usersTable?.schema?.length">
            <template #header>
                <NFlex align="center" :size="8">
                    <Icon name="tabler:users" size="18" />
                    <span>{{ t('apiDocs.auth.signupSchemaTitle') }}</span>
                </NFlex>
            </template>
            <ApiSchemaDocsTable :schema="usersTable.schema" size="large" />
        </NCard>

        <NAlert type="info" :show-icon="false">
            {{ t('apiDocs.auth.cookieHint', { param: sessionParamName }) }}
        </NAlert>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "#components"

definePageMeta({
    layout: "dashboard",
    middleware: ["database", "user", "dashboard", "global"],
})

const route = useRoute()
const database = useState<Database>("database")

const sessionParamName = computed(() => {
    const slug =
        (route.params.database as string | undefined) || database.value?.slug || "inicontent"
    return `${slug}_sid`
})

const usersTable = computed(() =>
    database.value?.tables?.find((table) => table.slug === "users"),
)

const signinSnippet = `{
  "username": "demo",
  "password": "********"
}`

const signupSnippet = `{
  "username": "demo",
  "password": "********",
  "email": "demo@example.com",
  "role": "editor"
}`

useHead(() => ({
    title: `${t("auth")} | ${t("apiDocumentation")}`,
}))
</script>

<style scoped>
.api-auth-doc-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.api-auth-doc-page__schema {
    margin-top: 8px;
}
</style>
