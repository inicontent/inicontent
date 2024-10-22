<template>
    <NPopover trigger="manual" :show="showPopover">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="showPopover = !showPopover">
                <NIcon>
                    <IconLink />
                </NIcon>
            </NButton>
        </template>
        <NInputGroup>
            <NInput :input-props="{ type: 'url' }" v-model:value="assetURL" :placeholder="t('assetLink')" clearable
                @keydown.enter="importAsset">
                <template #suffix>
                    <NIcon>
                        <IconLink />
                    </NIcon>
                </template>
            </NInput>
            <NTooltip :delay="500">
                <template #trigger>
                    <NButton :disabled="!assetURL" tag="a" @click.prevent.stop="importAsset">
                        <template #icon>
                            <NIcon v-if="!importProgress">
                                <IconArrowRight />
                            </NIcon>
                            <NSpin v-else-if="importProgress < 100" type="warning" :size="16" />
                            <NIcon v-else-if="importProgress === 300" color="red">
                                <IconX />
                            </NIcon>
                            <NProgress v-else type="circle" :show-indicator="false"
                                :status="importProgress === 200 ? 'success' : 'warning'"
                                :percentage="importProgress / 2" :stroke-width="20" />
                        </template>
                    </NButton>
                </template>
                {{ t('importAsset') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>

    <NTooltip :delay="500">
        <template #trigger>
            <NButton circle strong secondary size="tiny" @click.prevent.stop="$emit('update:showAssetsModal', true)">
                <template #icon>
                    <NIcon>
                        <IconBooks />
                    </NIcon>
                </template>
            </NButton>
        </template>
        {{ t('gallery') }}
    </NTooltip>
</template>

<script lang="ts" setup>
import {
    IconArrowRight,
    IconBooks,
    IconLink,
    IconX,
} from "@tabler/icons-vue";
import {
    NButton,
    NIcon,
    NInput,
    NInputGroup,
    NPopover,
    NTooltip,
    NProgress,
    NSpin,
    useMessage
} from "naive-ui";
import mime from "mime"

const { callback } = defineProps({
    callback: {
        type: Function,
        required: true
    },
    showAssetsModal: {
        type: Boolean
    }
})
defineEmits(["update:showAssetsModal"])

const showPopover = ref(false)

const message = useMessage()
const assetURL = ref()
const database = useState<Database>("database");
const importProgress = ref(0);

async function importAsset() {
    try {
        const response = await fetch(assetURL.value);
        const contentLength = response.headers.get("content-length");
        if (response.status !== 200)
            throw new Error("Unable to determine file size");

        const contentDisposition = response.headers.get("content-disposition");
        const contentMimeType = response.headers.get("content-type");
        let fileName = "";
        if (contentDisposition) {
            fileName = contentDisposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (fileName.toLowerCase().startsWith("utf-8''"))
                fileName = decodeURIComponent(fileName.replace(/utf-8''/i, ''));
            else
                fileName = fileName.replace(/['"]/g, '');
        } else if (contentMimeType)
            fileName = `${randomID()}.${mime.getExtension(contentMimeType)}`
        else fileName = randomID()

        const totalBytes = contentLength ? Number.parseInt(contentLength, 10) : 0;
        let receivedBytes = 0;
        const reader = response.body?.getReader();
        const chunks = [];

        if (reader)
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                receivedBytes += value.length;
                importProgress.value = totalBytes ? Math.round((receivedBytes * 100) / totalBytes) : 0;
            }

        const blob = new Blob(chunks);

        const formData = new FormData();
        formData.append("file", blob, fileName);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${useRuntimeConfig().public.apiBase}${database.value.slug ?? 'inicontent'}/asset`, true);
        xhr.upload.onprogress = (event) => {
            importProgress.value = 100 + Math.round((event.loaded * 100) / event.total);
        };

        xhr.onload = function (e) {
            if (xhr.status === 200) {
                callback(JSON.parse(this.response).result)
                setTimeout(() => {
                    importProgress.value = 0; assetURL.value = undefined; showPopover.value = false
                }, 2000)
            } else
                console.error("Upload failed");
        };

        xhr.onerror = () => {
            console.error("Error during upload");
        };

        xhr.send(formData);
    } catch (error) {
        console.error("Error during file download or upload:", error);
        importProgress.value = 300
        message.error(t('cannotImportTheAsset'))
        setTimeout(() => {
            importProgress.value = 0;
        }, 3000)
    }
};
</script>
