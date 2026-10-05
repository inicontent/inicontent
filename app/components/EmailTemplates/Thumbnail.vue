<template>
	<div
		class="mjml-thumb"
		:class="{ 'mjml-thumb--selected': selected, 'mjml-thumb--bare': bare }"
		:title="name"
	>
		<div class="mjml-thumb-bar">
			<NText code style="font-size: 10px">{{ name }}</NText>
		</div>
		<NText
			v-if="loading && !html"
			depth="3"
			class="mjml-thumb-state"
			style="font-size: 11px"
		>
			{{ t("mjmlBuilder.thumbnailLoading") }}
		</NText>
		<NText
			v-else-if="!html"
			depth="3"
			class="mjml-thumb-state"
			style="font-size: 11px"
		>
			{{ t("mjmlBuilder.thumbnailEmpty") }}
		</NText>
		<iframe
			v-else
			ref="iframeEl"
			class="mjml-thumb-frame"
			:srcdoc="html"
			sandbox="allow-same-origin"
			scrolling="no"
			:style="{ height: `${frameHeight}px` }"
			@load="onLoad"
		></iframe>
	</div>
</template>

<script lang="ts" setup>
import type { EmailBlock } from "~/composables/emailBuilder";
import { blockDefByName, buildMJML } from "~/composables/emailBuilder";
import { renderEmailTemplateClient } from "~/composables/emailRender";
import { sampleVariables } from "~/composables/emailSheet";

/**
 * Live preview for a single block: compiles the block (default content merged
 * with the current config) to HTML with MJML loaded client-side, then shows
 * the result in a read-only sandboxed iframe. Used both for the design-variant
 * picker and the canvas block previews — no server round-trip, so edits render
 * instantly. Debounced + guarded against out-of-order async renders.
 */

const props = defineProps<{
	name: string;
	config?: Record<string, unknown>;
	selected?: boolean;
	height?: number;
	/** When set, the preview frame auto-sizes to the rendered block content,
	 *  clamped to this maximum height (used by the drawer palette/variant
	 *  pickers so tall sections like features are actually visible). */
	maxHeight?: number;
	/** Canvas mode: render the compiled preview directly, without the card border
	 *  and name bar — the block content itself is the preview (page-builder look). */
	bare?: boolean;
}>();

const iframeEl = ref<HTMLIFrameElement | null>(null);
/** Current iframe height — fixed (`height` prop) or auto-measured + clamped. */
const frameHeight = ref(props.height ?? 96);

function onLoad() {
	if (!props.maxHeight || !iframeEl.value) return;
	try {
		const doc = iframeEl.value.contentDocument;
		const height = Math.round(
			doc?.body?.scrollHeight ?? doc?.documentElement?.scrollHeight ?? 0,
		);
		if (height > 0)
			frameHeight.value = Math.max(48, Math.min(height, props.maxHeight));
	} catch {
		// Sandbox/edge case — fall back to the cap so content is still visible.
		frameHeight.value = props.maxHeight;
	}
}

const html = ref("");
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight = 0;

// Cache compiled previews by block identity (name + merged config) so
// unchanged blocks — reorders, re-renders, identical variants — never
// recompile.
const previewCache = new Map<string, string>();

function previewCacheKey(
	name: string,
	config: Record<string, unknown> | undefined,
): string {
	return `${name}|${JSON.stringify({
		...(blockDefByName(name)?.defaults ?? {}),
		...(config ?? {}),
	})}`;
}

async function refresh() {
	const def = blockDefByName(props.name);
	if (!def || !import.meta.client) {
		html.value = "";
		return;
	}
	const block: EmailBlock = {
		id: "thumb",
		name: props.name,
		config: { ...def.defaults, ...(props.config ?? {}) },
	};
	const templateContent = buildMJML([block]);
	const requestID = ++inFlight;
	if (!templateContent) {
		html.value = "";
		return;
	}

	const key = previewCacheKey(props.name, props.config);
	const cached = previewCache.get(key);
	if (cached !== undefined) {
		html.value = cached;
		return;
	}

	loading.value = true;
	try {
		const rendered = await renderEmailTemplateClient(
			templateContent,
			"",
			sampleVariables(templateContent),
		);
		if (requestID === inFlight) {
			html.value = rendered.html;
			previewCache.set(key, rendered.html);
			if (previewCache.size > 300) {
				const first = previewCache.keys().next().value;
				if (first !== undefined) previewCache.delete(first);
			}
		}
	} catch {
		if (requestID === inFlight) html.value = "";
	} finally {
		if (requestID === inFlight) loading.value = false;
	}
}

watch(
	() => [props.name, props.config] as const,
	() => {
		clearTimeout(timer);
		timer = setTimeout(refresh, 120);
	},
	{ immediate: true, deep: true },
);

onBeforeUnmount(() => {
	clearTimeout(timer);
	inFlight += 1;
});
</script>

<style scoped>
.mjml-thumb {
	position: relative;
	overflow: hidden;
	border: 1px solid rgba(128, 128, 128, 0.35);
	border-radius: 8px;
	background: #ffffff;
	cursor: pointer;
	transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.mjml-thumb:hover {
	border-color: rgba(2, 132, 199, 0.55);
}

.mjml-thumb--selected {
	border-color: #2563eb;
	box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18);
}

.mjml-thumb--bare {
	border: 0;
	border-radius: 0;
	background: transparent;
}

.mjml-thumb--bare:hover {
	border-color: transparent;
}

.mjml-thumb--bare .mjml-thumb-bar {
	display: none;
}

.mjml-thumb-bar {
	padding: 4px 6px;
	border-bottom: 1px solid rgba(128, 128, 128, 0.2);
	background: rgba(128, 128, 128, 0.06);
}

.mjml-thumb-state {
	display: block;
	padding: 12px 8px;
	text-align: center;
}

.mjml-thumb-frame {
	display: block;
	width: 100%;
	height: 96px;
	border: 0;
	pointer-events: none;
	background: #f8fafc;
}

body.dark .mjml-thumb {
	background: rgba(15, 23, 42, 0.8);
	border-color: rgba(148, 163, 184, 0.35);
}
</style>