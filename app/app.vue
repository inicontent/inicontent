<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui"

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const osThemeRef = useOsTheme()
const isManual = ref(false)
if (!Theme.value) {
	Theme.value = osThemeRef.value ?? "light"
} else {
	isManual.value = true
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })

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