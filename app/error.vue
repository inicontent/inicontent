<template>
	<!--
		Offline / no-data bootstrap failures render OUTSIDE the layout chain.
		When this error is registered during the very first navigation (e.g.
		the database middleware fails before anything is cached), Nuxt's root
		<Suspense> never settles while error.vue's lazy layout chain
		(dashboard → default → LazyHeader…) resolves, so the app stays blank.
		A synchronous panel here renders instantly instead.
	-->
	<div v-if="rendersOffline" class="offline-page">
		<NFlex vertical justify="center" align="center" style="min-height: 60vh">
			<NResult :status="code" :title="message" />
		</NFlex>
	</div>

	<NuxtLayout v-else :name="layoutName">
		<NFlex vertical justify="center" align="center" style="min-height: 60vh">
			<NResult :status="code" :title="message" />
		</NFlex>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

type errorCodes =
	| "info"
	| "success"
	| "warning"
	| "error"
	| "404"
	| "403"
	| "500"
	| "418";
const { error } = defineProps({
	error: Object as () => NuxtError & { message: "database" | "table" | "item" },
});
const code = ref<errorCodes>();
const message = ref();

const route = useRoute();

const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

// Network failures while offline (mapped to 503/"offline" by the database
// middleware) get a friendly offline page — not a raw fetch stack trace.
const rendersOffline = computed(
	() => !!error && (isOffline || error.statusMessage === "offline"),
);

if (error && !rendersOffline.value) {
	code.value = String(error.statusCode) as errorCodes;
	switch (error.statusCode) {
		case 404:
			code.value = "warning";
			message.value = `${t(error.message)} ${t("notFound")}`;
			break;
		case 403:
			code.value = "warning";
			message.value = t("accessDenied");
			break;
		default:
			code.value = "error";
			message.value = t("internalServerError");
			console.clear();
			console.error(error);
			break;
	}
} else if (!error) {
	code.value = "error";
	message.value = t("internalServerError");
} else {
	// offline branch
	code.value = "warning";
	message.value = t("offline");
	// Match the app's other pages (function form — evaluated reactively and
	// applied after the suspense-resolved mount, unlike a plain object).
	useHead(() => ({
		title: `${t("inicontent")} | ${t("offline")}`,
	}));
}

// Pages that run inside the "table" layout (with the sidebar menu) are
// /admin/tables/:slug/... (incl. backups/assets), /admin/dashboards and
// /admin/settings. Errors thrown there — like a 404 for a non-existing
// table — should render inside that layout so the user keeps the sidebar
// navigation instead of being dropped to the bare dashboard shell.
const tableErrorMessages = ["table", "item"];
const layoutName = computed(() => {
	if (error && tableErrorMessages.includes(error.statusMessage ?? ""))
		return "table";
	const segments = route.path.split("/").filter(Boolean);
	const tablesIndex = segments.indexOf("tables");
	if (tablesIndex !== -1 && segments[tablesIndex + 1]) return "table";
	if (
		route.path.includes("/admin/dashboards") ||
		route.path.includes("/admin/settings")
	)
		return "table";
	return "dashboard";
});
</script>

<style scoped>
.offline-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
}
</style>