<template>
	<div />
</template>

<script setup lang="ts">
/**
 * `/login` — the sign-in entry point a browser password manager and users
 * expect on a database host.
 *
 * The sign-in form lives at `/auth`; this is a stable alias so the "open
 * database login" action (and saved-credential autofill) always resolves to a
 * real page on `https://<database>.inicontent.com/login`.
 *
 * Region context arrives as `?region=<code>` and has already been validated and
 * applied by `region.global.ts` before this page renders, so it is dropped from
 * the redirect target to avoid re-selecting on every navigation.
 */
const route = useRoute();

const query = { ...route.query };
delete query[REGION_QUERY_PARAM];

await navigateTo({ path: "/auth", query }, { replace: true });
</script>
