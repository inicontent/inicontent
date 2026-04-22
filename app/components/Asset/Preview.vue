<template>
    <NModal :show="currentPreviewAsset !== undefined" @mask-click="onClosePreview" @close="onClosePreview"
        @esc="onClosePreview" :width="800">
        <NSpin v-if="currentPreviewAsset" :show="Loading.previewModal" size="large" style="width: 80%;">
            <video v-if="videoExtensions.includes(currentPreviewAsset.extension)" controls autoplay
                style="width:100%;height:auto;max-height:100vh;" :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }"
                @loadeddata="Loading.previewModal = false" @canplay="Loading.previewModal = false"
                @error="Loading.previewModal = false">
                <source :src="currentPreviewAsset?.publicURL" :type="currentPreviewAsset?.type" />
            </video>
            <object v-else-if="currentPreviewAsset.extension === 'pdf'" :data="currentPreviewAsset.publicURL"
                type="application/pdf" style="width:100%;height:80vh;"
                :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }"
                @load="Loading.previewModal = false"></object>

            <!-- DOCX preview -->
            <div v-else-if="currentPreviewAsset.extension === 'docx'"
                style="width:100%;height:80vh;overflow:auto;background:white;border-radius:8px;"
                :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }">
                <div ref="docxContainer" style="min-height:100%;"></div>
            </div>

            <!-- XLSX preview -->
            <div v-else-if="currentPreviewAsset.extension === 'xlsx'"
                style="width:100%;height:80vh;overflow:auto;background:white;border-radius:8px;"
                :style="{ visibility: Loading.previewModal ? 'hidden' : 'visible' }">
                <div v-if="xlsxSheetNames.length > 1" style="display:flex;gap:4px;padding:8px;border-bottom:1px solid #eee;flex-wrap:wrap;">
                    <NButton v-for="name in xlsxSheetNames" :key="name" size="small"
                        :type="xlsxActiveSheet === name ? 'primary' : 'default'"
                        @click="xlsxActiveSheet = name">
                        {{ name }}
                    </NButton>
                </div>
                <div v-html="xlsxHtml" class="xlsx-preview" style="padding:12px;font-size:13px;"></div>
            </div>
        </NSpin>
        <NEmpty v-else />
    </NModal>
</template>

<script setup lang="ts">
import { videoExtensions } from "~/composables";

const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const currentPreviewAsset = useState<Asset | undefined>("currentPreviewAsset");

const docxContainer = ref<HTMLElement | null>(null);

// XLSX state
const xlsxSheetNames = ref<string[]>([]);
const xlsxActiveSheet = ref<string>("");
const xlsxSheets = ref<Record<string, string>>({});
const xlsxHtml = computed(() => xlsxSheets.value[xlsxActiveSheet.value] ?? "");

function onClosePreview() {
	currentPreviewAsset.value = undefined;
	Loading.value.previewModal = false;
	xlsxSheetNames.value = [];
	xlsxActiveSheet.value = "";
	xlsxSheets.value = {};
}

async function renderDocxPreview(asset: Asset) {
	await nextTick();
	if (!docxContainer.value || !asset.publicURL) return;
	try {
		const response = await fetch(asset.publicURL);
		if (!response.ok) throw new Error("Failed to fetch DOCX");
		const data = await response.arrayBuffer();

		const { renderAsync } = await import("docx-preview");
		await renderAsync(data, docxContainer.value, undefined, {
			breakPages: true,
			ignoreLastRenderedPageBreak: false,
			ignoreWidth: false,
			ignoreHeight: false,
			ignoreFonts: false,
			inWrapper: true,
		});
	} catch (error) {
		console.warn("Failed to render DOCX preview:", error);
		if (docxContainer.value)
			docxContainer.value.innerHTML = '<p style="padding:20px;color:#999;">Failed to load document preview.</p>';
	} finally {
		Loading.value.previewModal = false;
	}
}

async function renderXlsxPreview(asset: Asset) {
	try {
		const response = await fetch(asset.publicURL);
		if (!response.ok) throw new Error("Failed to fetch XLSX");
		const data = await response.arrayBuffer();

		const XLSX = await import("xlsx");
		const workbook = XLSX.read(data, { type: "array" });

		const sheets: Record<string, string> = {};
		for (const name of workbook.SheetNames) {
			const sheet = workbook.Sheets[name];
			if (sheet) sheets[name] = XLSX.utils.sheet_to_html(sheet);
		}

		xlsxSheetNames.value = workbook.SheetNames;
		xlsxSheets.value = sheets;
		xlsxActiveSheet.value = workbook.SheetNames[0] ?? "";
	} catch (error) {
		console.warn("Failed to render XLSX preview:", error);
	} finally {
		Loading.value.previewModal = false;
	}
}

watch(currentPreviewAsset, (asset) => {
	if (!asset) return;
	if (asset.extension === "docx") renderDocxPreview(asset);
	else if (asset.extension === "xlsx") renderXlsxPreview(asset);
});
</script>

<style scoped>
.xlsx-preview :deep(table) {
	border-collapse: collapse;
	width: 100%;
}
.xlsx-preview :deep(td),
.xlsx-preview :deep(th) {
	border: 1px solid #d0d0d0;
	padding: 4px 8px;
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 200px;
	font-size: 12px;
}
.xlsx-preview :deep(th) {
	background: #f5f5f5;
	font-weight: 600;
}
.xlsx-preview :deep(tr:nth-child(even)) {
	background: #fafafa;
}
</style>
