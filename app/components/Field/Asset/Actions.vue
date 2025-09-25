<template>
    <NTooltip :delay="1500">
        <template #trigger>
            <NButton circle secondary size="tiny" @click.prevent.stop="showAssetsModal = true">
                <template #icon>
                    <NIcon>
                        <Icon name="tabler:books" />
                    </NIcon>
                </template>
            </NButton>
        </template>
        {{ t('gallery') }}
    </NTooltip>
    <NPopover trigger="click">
        <template #trigger>
            <NTooltip :delay="1500" placement="bottom">
                <template #trigger>
                    <NButton circle secondary size="tiny" @click.prevent.stop="importInputRef?.focus()">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:link" />
                            </NIcon>
                        </template>
                    </NButton>
                </template>
                {{ t('import') }}
            </NTooltip>
        </template>
        <NInputGroup>
            <NInput :input-props="{ type: 'url' }" ref="importInputRef" v-model:value="assetURLs"
                :placeholder="t('assetLink')" clearable @keydown.enter.prevent="importAsset">
                <template #suffix>
                    <NIcon>
                        <Icon name="tabler:link" />
                    </NIcon>
                </template>
            </NInput>
            <NTooltip :delay="1500">
                <template #trigger>
                    <NButton :loading="Loading.import" :disabled="!assetURLs" tag="a" @click.prevent.stop="importAsset">
                        <template #icon>
                            <NIcon>
                                <Icon name="tabler:arrow-right" />
                            </NIcon>
                        </template>
                    </NButton>
                </template>
                {{ t('import') }}
            </NTooltip>
        </NInputGroup>
    </NPopover>
</template>

<script lang="ts" setup>
import type { NInput } from "naive-ui"

defineTranslation({
	ar: {
		import: "إستيراد",
		gallery: "قائمة الملفات",
		assetLink: "رابط الملف",
	},
})

const { field, callback } = defineProps<{
	field: Field
	callback: CallableFunction
}>()

const showAssetsModal = defineModel<boolean>("showAssetsModal")

const importInputRef = ref<InstanceType<typeof NInput>>()

const appConfig = useAppConfig()
const assetURLs = ref()
const database = useState<Database>("database")
const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
const Language = useCookie<LanguagesType>("language", { sameSite: true })

async function importAsset() {
	Loading.value.import = true
	const data = await $fetch<apiResponse<Asset | Asset[]>>(
		`${appConfig.apiBase}${database.value.slug ?? "inicontent"}/assets/import${field.params ? `?${field.params}` : ""}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
			body: assetURLs.value,
			params: {
				locale: Language.value,
			},
			credentials: "include",
		},
	)
	if (data.result) {
		assetURLs.value = undefined
		callback(data.result)
		importInputRef.value?.clear()
	} else window.$message.error(data.message)
	Loading.value.import = false
}
</script>
