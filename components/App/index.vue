<template>
    <NConfigProvider :dir="Language === 'ar' ? 'rtl' : 'ltr'" :rtl="Language === 'ar' ? rtlStyles : undefined"
        :theme="Theme === 'dark' ? darkTheme : null" :theme-overrides :locale="(Locales as any)[Language]"
        :date-locale="(dateLocales as any)[Language]">
        <NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
        <AppPreLayoutContent>
            <NuxtLayout>
                <slot></slot>
            </NuxtLayout>
        </AppPreLayoutContent>
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
    useOsTheme,
    darkTheme,
} from "naive-ui";

import '~/assets/css/main.css'
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
    unstableDialogRtl
];
const Language = useCookie<LanguagesType>("language", { sameSite: true });
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true });

const osThemeRef = useOsTheme();
if (!Theme.value) Theme.value = osThemeRef.value ?? "light";
const ThemeConfig = useState<ThemeConfig>("ThemeConfig");

watch(Theme, setThemeConfig);
const themeOverrides = computed(() => ({
    common: {
        ...ThemeConfig.value,
        fontFamily: "Cairo Variable",
        fontFamilyMono: "Cairo Variable",
    },
}));

const Locales = {
    ar: arDZ,
    en: enUS,
};
const dateLocales = {
    ar: dateArDZ,
    en: dateEnUS,
};

if (!Language.value) Language.value = "en";

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

// onMounted(fetchTranslation);
// watch(Language, fetchTranslation);
</script>