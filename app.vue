<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script lang="ts" setup>
import { useOsTheme } from "naive-ui";

const Theme = useCookie<"dark" | "light">("theme", { sameSite: true });
const osThemeRef = useOsTheme();
if (!Theme.value) Theme.value = osThemeRef.value ?? "light";

const Language = useCookie<LanguagesType>("language", { sameSite: true });
if (!Language.value) Language.value = "en";

watch(Theme, setThemeConfig);

useHead({
	bodyAttrs: {
		class: computed(() =>
			[
				Language.value === "ar" ? "rtl" : "ltr",
				Theme.value === "dark" ? "dark" : "light",
			].join(" "),
		),
	},
});
</script>


<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>