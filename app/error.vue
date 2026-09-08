<template>
	<NuxtLayout name="dashboard">
		<NResult :status="code" :title="message" />
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

const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

if (error) {
	// Network failures while offline (mapped to 503/"offline" by the database
	// middleware) get a friendly offline page — not a raw fetch stack trace.
	if (isOffline || error.statusMessage === "offline") {
		code.value = "warning";
		message.value = t("offline");
	} else {
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
	}
} else {
	code.value = "error";
	message.value = t("internalServerError");
}
</script>