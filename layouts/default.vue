<template>
	<NConfigProvider v-bind="configProviderProps">
		<NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
		<slot></slot>
	</NConfigProvider>
</template>

<script setup lang="ts">
import {
	arDZ,
	dateArDZ,
	enUS,
	dateEnUS,
	unstableAvatarGroupRtl,
	unstableButtonGroupRtl,
	unstableButtonRtl,
	unstableCardRtl,
	unstableCheckboxRtl,
	unstableCollapseRtl,
	unstableDrawerRtl,
	unstableInputNumberRtl,
	unstableInputRtl,
	unstableListRtl,
	unstableMessageRtl,
	unstablePageHeaderRtl,
	unstableRadioRtl,
	unstableScrollbarRtl,
	unstableTableRtl,
	unstableTagRtl,
	unstableFlexRtl,
	unstableSelectRtl,
	unstableDataTableRtl,
	unstableDialogRtl,
	unstablePaginationRtl,
	unstableNotificationRtl,
	unstableStepsRtl,
	darkTheme,
	createDiscreteApi,
	type ConfigProviderProps,
} from "naive-ui"

import "~/assets/main.css"

const rtlStyles: any = [
	unstableListRtl,
	unstablePageHeaderRtl,
	unstableButtonGroupRtl,
	unstableButtonRtl,
	unstableCardRtl,
	unstableScrollbarRtl,
	unstableMessageRtl,
	unstableCollapseRtl,
	unstableDrawerRtl,
	unstableInputNumberRtl,
	unstableCheckboxRtl,
	unstableRadioRtl,
	unstableTagRtl,
	unstableTableRtl,
	unstableInputRtl,
	unstableAvatarGroupRtl,
	unstableFlexRtl,
	unstableSelectRtl,
	unstableDataTableRtl,
	unstableDialogRtl,
	unstablePaginationRtl,
	unstableNotificationRtl,
	unstableStepsRtl,
]

const Language = useCookie<LanguagesType>("language", { sameSite: true })
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const ThemeConfig = useState<ThemeConfig>("ThemeConfig")

const Locales = {
	ar: arDZ,
	en: enUS,
}
const dateLocales = {
	ar: dateArDZ,
	en: dateEnUS,
}

const configProviderProps = computed<ConfigProviderProps>(() => ({
	dir: Language.value === "ar" ? "rtl" : "ltr",
	rtl: Language.value === "ar" ? rtlStyles : undefined,
	theme: Theme.value === "dark" ? darkTheme : undefined,
	themeOverrides: {
		common: {
			...ThemeConfig.value,
			fontFamily: "Cairo",
			fontFamilyMono: "Cairo",
		},
	},
	locale: Locales[Language.value as "ar" | "en"] ?? Locales.en,
	dateLocale: dateLocales[Language.value as "ar" | "en"] ?? dateLocales.en,
}))
const { message, notification } = createDiscreteApi(
	["message", "notification"],
	{
		messageProviderProps: {
			keepAliveOnHover: true,
			closable: true,
			containerStyle: {
				top: "70px",
			},
		},
		configProviderProps,
	},
)

onMounted(() => {
	window.$message = message
	window.$notification = notification

	// Add an event listener for the print action
	window.onbeforeprint = () => {
		// Select the element with the class "printable"
		let element = document.querySelector(".printable")

		// Check if the element and its parent exist
		if (element?.parentElement) {
			// Add the class "printable-direct-parent" to the direct parent
			element.parentElement.classList.add("printable-direct-parent")

			// Traverse up the DOM starting from the direct parent's parent
			let parent = element.parentElement.parentElement
			while (parent) {
				// Add the class "printable-parent" to all other ancestors
				parent.classList.add("printable-parent")
				parent = parent.parentElement
			}
		}
	}

	// Optional: Remove the added classes after printing
	window.onafterprint = () => {
		// Remove the "printable-parent" class after printing
		const elements = document.querySelectorAll(".printable-parent")
		for (let i = 0; i < elements.length; i++)
			elements[i]?.classList.remove("printable-parent")

		document
			.querySelector(".printable-direct-parent")
			?.classList.remove("printable-parent")
	}
})

useHead({
	bodyAttrs: {
		style: computed(
			() =>
				`--primaryColor: ${hexToRGB(ThemeConfig.value.primaryColor).join(", ")}`,
		),
	},
})

// onMounted(fetchTranslation);
// watch(Language, fetchTranslation);
</script>