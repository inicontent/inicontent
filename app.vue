<template>
    <NConfigProvider inlineThemeDisabled :dir="Language === 'ar' ? 'rtl' : 'ltr'"
        :rtl="Language === 'ar' ? rtlStyles : undefined" :theme="Theme === 'dark' ? darkTheme : null"
        :theme-overrides="{ common: ThemeConfig }" :locale="(Locales as any)[Language]"
        :date-locale="(dateLocales as any)[Language]">
        <NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </NConfigProvider>
</template>

<script setup lang="ts">
import {
    NConfigProvider,
    arDZ,
    darkTheme,
    dateArDZ,
    dateEnUS,
    enUS,
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
    unstableSpaceRtl,
    unstableTableRtl,
    unstableTagRtl,
} from "naive-ui";
import Vibrant from "node-vibrant";

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
    unstableSpaceRtl,
    unstableInputRtl,
    unstableAvatarGroupRtl,
],
    Language = useCookie<string>("Language", { sameSite: true }),
    Theme = useCookie<string>("Theme", { sameSite: true }),
    database = useState<Database>("database", () => ({
        slug: "inicontent",
        icon: "/favicon.ico",
    })),
    ThemeConfig = useState<ThemeConfig>("ThemeConfig", () => ({
        primaryColor: "#FF9800",
        primaryColorHover: "#F7A42A",
        primaryColorPressed: "#E19421",
        primaryColorSuppl: "#CB7900",
    })),
    Locales = {
        ar: arDZ,
        en: enUS,
    },
    dateLocales = {
        ar: dateArDZ,
        en: dateEnUS,
    };

if (!Theme.value) Theme.value = "light";

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

onMounted(fetchTranslation);

if (database.value?.icon && database.value.slug !== "inicontent") {
    try {
        const Palette = await Vibrant.from(database.value.icon).getPalette();
        if (Palette.DarkVibrant && Palette.LightVibrant) {
            const vibrantColor =
                Palette[Theme.value === "light" ? "DarkVibrant" : "LightVibrant"];
            const mutedColor =
                Palette[Theme.value === "light" ? "DarkMuted" : "LightMuted"];
            if (vibrantColor && mutedColor && Palette.Vibrant)
                ThemeConfig.value.revert = Palette.Vibrant.bodyTextColor === "#fff";
            // ThemeConfig.value = {
            // 	primaryColor: vibrantColor.hex,
            // 	primaryColorHover: `${vibrantColor.hex}CC`,
            // 	primaryColorPressed: `${vibrantColor.hex}80`,
            // 	primaryColorSuppl: mutedColor.hex,
            // 	revert: Palette.Vibrant.bodyTextColor === "#fff",
            // };
        }
    } catch (error) {
        console.error(database.value.icon);
    }
}

watch(Language, fetchTranslation);
</script>