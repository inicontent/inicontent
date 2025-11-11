<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui"
import { loadCoreTranslations } from "./composables"

const Language = useCookie<LanguagesType>("language", { sameSite: true })

// Load core translations with the initial language
loadCoreTranslations(Language.value)

// Watch for language changes and load translations dynamically
watch(Language, async (newLang, oldLang) => {
	if (newLang)
		await loadCoreTranslations(newLang, oldLang)
})

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const osThemeRef = useOsTheme()
const isManual = ref(false)
if (!Theme.value) {
	Theme.value = osThemeRef.value ?? "light"
} else {
	isManual.value = true
}

watch(Theme, () => {
	setThemeConfig()
	if (Theme.value !== osThemeRef.value) {
		isManual.value = true
	}
})

watch(osThemeRef, (newOsTheme) => {
	if (!isManual.value && newOsTheme) {
		Theme.value = newOsTheme
	}
})

useHead({
	bodyAttrs: {
		class: computed(() =>
			[
				Language.value === "ar" ? "rtl" : "ltr",
				Theme.value === "dark" ? "dark" : "light",
			].join(" "),
		),
	},
})
</script>