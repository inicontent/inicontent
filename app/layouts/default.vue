<template>
	<NConfigProvider v-bind="configProviderProps">
		<NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
		<slot></slot>
	</NConfigProvider>
</template>

<script setup lang="ts">
import {
	type ConfigProviderProps,
	arDZ,
	createDiscreteApi,
	darkTheme,
	dateArDZ,
	dateEnUS,
	enUS,
} from "naive-ui"

import "~/assets/main.css"

import { hexToRGB } from "~/composables"

const Language = useLanguageCookie()
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const ThemeConfig = useState<ThemeConfig>("ThemeConfig")

// The unstable*Rtl styles are only meaningful for Arabic/rtl layouts. They used
// to be eagerly imported on every boot, pulling ~24 naive-ui style modules into
// the shared entry chunk that English/global sites never use. They are now
// loaded on demand (a single chunk, only when the language is "ar").
const rtlStyles = ref<any[]>([])

async function ensureRtlStyles() {
	if (rtlStyles.value.length) return rtlStyles.value
	const {
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
		unstableAlertRtl,
	} = await import("naive-ui")
	rtlStyles.value = [
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
		unstableAlertRtl,
	]
	return rtlStyles.value
}

watch(
	computed(() => Language.value === "ar"),
	async (isArabic) => {
		if (isArabic) void ensureRtlStyles()
	},
	{ immediate: true },
)

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
	rtl:
		Language.value === "ar" && rtlStyles.value.length
			? rtlStyles.value
			: undefined,
	theme: Theme.value === "dark" ? darkTheme : undefined,
	themeOverrides: {
		common: {
			...ThemeConfig.value,
			fontFamily: "Cairo",
			fontFamilyMono: "Cairo",
			borderRadius: "15px"
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

	fetchTranslation()
})

watch(Language, fetchTranslation)

useHead({
	meta: [
		{
			name: "theme-color",
			content: computed(() => ThemeConfig.value.primaryColor),
		},
	],
	htmlAttrs: {
		// Let the browser render its own chrome (scrollbars, form controls,
		// native widgets) in the matching color scheme so it follows the
		// database primary color on desktop, mobile, android, mac & windows.
		style: computed(() =>
			`color-scheme: ${Theme.value === "dark" ? "dark" : "light"}`,
		),
	},
	bodyAttrs: {
		style: computed(
			() =>
				`--primaryColor: ${hexToRGB(ThemeConfig.value.primaryColor).join(", ")}`,
		),
	},
})

</script>