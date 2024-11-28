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
	darkTheme,
	createDiscreteApi,
	type ConfigProviderProps,
} from "naive-ui";

import "~/assets/css/main.css";
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
const { message, dialog } = createDiscreteApi(["message", "dialog"], {
	messageProviderProps: {
		keepAliveOnHover: true,
		closable: true,
		containerStyle: {
			top: "70px",
		},
	},
	configProviderProps,
});

onMounted(() => {
	window.$message = message;
	window.$dialog = dialog;
});

// onMounted(fetchTranslation);
// watch(Language, fetchTranslation);
</script>