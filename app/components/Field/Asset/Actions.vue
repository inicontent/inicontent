<template>
    <UTooltip :delay="1500">
        <template #trigger>
            <UButton circle secondary size="tiny" @click.prevent.stop="showAssetsModal = true">
                <template #icon>
                    <div class="inline-block">
                        <Icon name="tabler:books" />
                    </div>
                </template>
            </UButton>
        </template>
        {{ t('gallery') }}
    </UTooltip>
    <UPopover trigger="click">
        <template #trigger>
            <UTooltip :delay="1500" placement="bottom">
                <template #trigger>
                    <UButton circle secondary size="tiny" @click.prevent.stop="importInputRef?.focus()">
                        <template #icon>
                            <div class="inline-block">
                                <Icon name="tabler:link" />
                            </div>
                        </template>
                    </UButton>
                </template>
                {{ t('import') }}
            </UTooltip>
        </template>
        <UInputGroup>
            <UInput :input-props="{ type: 'url' }" ref="importInputRef" v-model:value="assetURLs"
                :placeholder="t('assetLink')" clearable @keydown.enter.prevent="importAsset">
                <template #suffix>
                    <div class="inline-block">
                        <Icon name="tabler:link" />
                    </div>
                </template>
            </UInput>
            <UTooltip :delay="1500">
                <template #trigger>
                    <UButton :loading="Loading.import" :disabled="!assetURLs" tag="a" @click.prevent.stop="importAsset">
                        <template #icon>
                            <div class="inline-block">
                                <Icon name="tabler:arrow-right" />
                            </div>
                        </template>
                    </UButton>
                </template>
                {{ t('import') }}
            </UTooltip>
        </div>
    </UPopover>
</template>

<script lang="ts" setup>

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

const sessionID = useCookie<string | null>("sessionID", {
	sameSite: true,
})

async function importAsset() {
	Loading.value.import = true
	const data = await $fetch<apiResponse<Asset | Asset[]>>(
		`${appConfig.apiBase}${database.value.slug ?? "inicontent"}/assets/import${field.suffix || ""}${field.suffix?.includes("?") ? "&" : "?"}${database.value.slug}_sid=${sessionID}`,
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
