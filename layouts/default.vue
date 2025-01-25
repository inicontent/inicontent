<template>
	<NConfigProvider v-bind="configProviderProps">
		<NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
		<slot></slot>
	</NConfigProvider>
</template>

<script setup lang="ts">
import {
	NConfigProvider,
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
	darkTheme,
	createDiscreteApi,
	type ConfigProviderProps,
} from "naive-ui";

import "~/assets/main.css";
import "@fontsource-variable/cairo";

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
];

const Language = useCookie<LanguagesType>("language", { sameSite: true });
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true });
const ThemeConfig = useState<ThemeConfig>("ThemeConfig");

const Locales = {
	ar: arDZ,
	en: enUS,
};
const dateLocales = {
	ar: dateArDZ,
	en: dateEnUS,
};

const configProviderProps = computed<ConfigProviderProps>(() => ({
	dir: Language.value === "ar" ? "rtl" : "ltr",
	rtl: Language.value === "ar" ? rtlStyles : undefined,
	theme: Theme.value === "dark" ? darkTheme : undefined,
	themeOverrides: {
		common: {
			...ThemeConfig.value,
			fontFamily: "Cairo Variable",
			fontFamilyMono: "Cairo Variable",
		},
	},
	locale: Locales[Language.value as "ar" | "en"] ?? Locales.en,
	dateLocale: dateLocales[Language.value as "ar" | "en"] ?? dateLocales.en,
}));
const { message, dialog, notification } = createDiscreteApi(
	["message", "dialog", "notification"],
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
);

onMounted(() => {
	window.$message = message;
	window.$dialog = dialog;
	window.$notification = notification;

	// Add an event listener for the print action
	window.onbeforeprint = () => {
		// Select the element with the class "printable"
		let element = document.querySelector(".printable");

		// Traverse up the DOM and add a class to each parent element
		while (element?.parentElement) {
			element.parentElement.classList.add("printable-parent");
			element = element.parentElement;
		}
	};

	// Optional: Remove the added classes after printing
	window.onafterprint = () => {
		// Remove the "printable-parent" class after printing
		const elements = document.querySelectorAll(".printable-parent");
		for (let i = 0; i < elements.length; i++) {
			elements[i].classList.remove("printable-parent");
		}
	};
});

// onMounted(fetchTranslation);
// watch(Language, fetchTranslation);
</script>