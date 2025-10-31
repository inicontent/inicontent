<template>
	<NuxtPwaManifest />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const isManual = ref(false)

// Detect OS theme preference
const getOsTheme = (): "dark" | "light" => {
	if (import.meta.client && window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	}
	return "light"
}

const osTheme = ref(getOsTheme())

if (!Theme.value) {
	Theme.value = osTheme.value
} else {
	isManual.value = true
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })

watch(Theme, () => {
	setThemeConfig()
	if (Theme.value !== osTheme.value) {
		isManual.value = true
	}
})

// Listen for OS theme changes
if (import.meta.client && window.matchMedia) {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
	mediaQuery.addEventListener("change", (e) => {
		const newOsTheme = e.matches ? "dark" : "light"
		osTheme.value = newOsTheme
		if (!isManual.value) {
			Theme.value = newOsTheme
		}
	})
}

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