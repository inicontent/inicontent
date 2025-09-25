<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui"

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const osThemeRef = useOsTheme()
if (!Theme.value) Theme.value = osThemeRef.value ?? "light"

const Language = useCookie<LanguagesType>("language", { sameSite: true })

watch(Theme, setThemeConfig)

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