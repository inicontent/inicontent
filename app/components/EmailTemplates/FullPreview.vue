<template>
	<div class="email-sheet card-preview">
		<NText
			v-if="loading"
			depth="3"
			class="card-preview-state"
			style="font-size: 11px"
		>
			{{ t("mjmlBuilder.thumbnailLoading") }}
		</NText>
		<NEmpty
			v-else-if="!body && !text"
			:description="t('emailTemplates.previewEmpty')"
			style="padding: 18px 0"
		/>
		<div v-else-if="body" class="card-preview-body" v-html="body"></div>
		<NText
			v-else
			depth="3"
			class="card-preview-state"
			style="font-size: 12px; white-space: pre-wrap; text-align: left"
		>
			{{ text }}
		</NText>
	</div>
</template>

<script lang="ts" setup>
import { renderEmailTemplateClient } from "~/composables/emailRender";
import { extractBodyStyles, sampleVariables } from "~/composables/emailSheet";

/**
 * Rendered preview of a *full* stored email template (MJML document). Used by
 * the template gallery — compiled client-side with sample variables, so cards
 * show the real email. Cached by content; debounced and guarded against
 * out-of-order async renders.
 */

const props = defineProps<{ content: string }>();

const body = ref("");
const text = ref("");
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight = 0;
const cache = new Map<string, { body: string; text: string }>();

async function refresh() {
	const key = props.content ?? "";
	if (!key) {
		body.value = "";
		text.value = "";
		return;
	}
	const hit = cache.get(key);
	if (hit) {
		body.value = hit.body;
		text.value = hit.text;
		loading.value = false;
		return;
	}
	if (!import.meta.client) return;
	loading.value = true;
	const requestID = ++inFlight;
	try {
		const rendered = await renderEmailTemplateClient(
			key,
			"",
			sampleVariables(key),
		);
		const compiled = rendered.html
			? extractBodyStyles(rendered.html)
			: { body: "", styles: [] };
		const result = { body: compiled.body, text: rendered.text };
		if (requestID === inFlight) {
			body.value = result.body;
			text.value = result.text;
			if (cache.size > 120) {
				const first = cache.keys().next().value;
				if (first !== undefined) cache.delete(first);
			}
			cache.set(key, result);
		}
	} catch {
		if (requestID === inFlight) {
			body.value = "";
			text.value = "";
		}
	} finally {
		if (requestID === inFlight) loading.value = false;
	}
}

watch(
	() => props.content,
	() => {
		clearTimeout(timer);
		timer = setTimeout(refresh, 120);
	},
	{ immediate: true },
);

onBeforeUnmount(() => {
	clearTimeout(timer);
	inFlight += 1;
});
</script>

<style scoped>
.card-preview {
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	background: #f1f5f9;
	max-height: 240px;
}

.card-preview-body {
	width: 100%;
}

.card-preview-state {
	display: block;
	padding: 22px 8px;
	text-align: center;
}
</style>