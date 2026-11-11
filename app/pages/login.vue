<template>
	<div />
</template>

<script setup lang="ts">
import { databaseRoutePrefix, REGION_QUERY_PARAM } from "#imports";

/**
 * `/login` — the sign-in entry point a browser password manager and users
 * expect on a database host.
 *
 * The sign-in form lives at `/auth`; this is a stable alias so the "open
 * database login" action (and saved-credential autofill) always resolves to a
 * real page on `https://<database>.<region>.inicontent.com/login`.
 *
 * Region context arrives as `?region=<code>` and has already been validated and
 * applied by `region.global.ts` before this page renders, so it is dropped from
 * the redirect target to avoid re-selecting on every navigation.
 */
// Redirect during navigation so the auth middleware loads the tenant and
// initializes its theme before the default layout mounts.
definePageMeta({
	middleware: (to) => {
		const query = { ...to.query };
		delete query[REGION_QUERY_PARAM];
		return navigateTo(
			{ path: `${databaseRoutePrefix(to)}/auth`, query },
			{ replace: true },
		);
	},
});
</script>
