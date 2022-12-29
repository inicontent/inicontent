<template>
  <NConfigProvider :dir="Language === 'ar' ? 'rtl' : 'ltr'" :rtl="Language === 'ar' ? rtlStyles : undefined"
    :theme="Theme === 'dark' ? darkTheme : {}" :theme-overrides="{ common: ThemeConfig }" :locale="Locales[Language]"
    :date-locale="dateLocales[Language]">
    <NLoadingBarProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<script setup>
import {
  NConfigProvider,
  NLoadingBarProvider,
  darkTheme,
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
  unstableButtonGroupRtl,
  unstableButtonRtl,
  unstableCardRtl,
  unstableScrollbarRtl,
  unstableMessageRtl,
  unstablePageHeaderRtl,
  unstableListRtl,
  enUS, dateEnUS,
  arDZ, dateArDZ
} from "naive-ui";
import * as Vibrant from "node-vibrant";
const rtlStyles = [
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
];

const Language = useGlobalCookie("Language"),
  Theme = useGlobalCookie("Theme"),
  database = useState("database", () => ({
    name: "Inicontent",
    icon: "/inicontent/favicon.ico",
  })),
  ThemeConfig = useState("ThemeConfig", () => ({
    primaryColor: "#FF9800",
    primaryColorHover: "#F7A42A",
    primaryColorPressed: "#E19421",
    primaryColorSuppl: "#CB7900",
  }));
const Locales = {
  ar: arDZ,
  en: enUS
},
  dateLocales = {
    ar: dateArDZ,
    en: dateEnUS
  }
if (!Theme.value) Theme.value = "light";

if (!Language.value) Language.value = "en";

if (
  database.value &&
  database.value.slug !== "inicontent" &&
  database.value.icon
) {
  try {
    const Palette = await Vibrant.from(database.value.icon).getPalette();
    if (Palette && Palette.Vibrant)
      ThemeConfig.value = {
        primaryColor: Palette.Vibrant.hex,
        primaryColorHover: Palette.LightVibrant.hex,
        primaryColorPressed: Palette.DarkVibrant.hex,
        primaryColorSuppl: Palette.Muted.hex,
      };
  } catch (error) {
    console.error(error);
  }
}
</script>

<style>
a {
  text-decoration: none !important;
}

.n-input-number,
.n-date-picker {
  width: 100%;
}

.rich-editor {
  border: 1px solid;
  border-radius: 10px;
  padding: 15px;
  width: calc(100% - 32px);
}

[dir="rtl"],
[dir="rtl"] * {
  --n-prefix-margin: 0 0 0 8px !important;
  --n-padding-single: 0 12px 0 26px !important;
  --n-padding-multiple: 3px 12px 0 26px !important;
}

[dir="rtl"] .n-data-table .n-data-table-check-extra {
  left: -4px;
  right: unset !important;
}

[dir="rtl"] .n-base-selection .n-base-suffix {
  left: 10px;
  right: unset !important;
}

[dir="rtl"] .n-pagination .n-pagination-item.n-pagination-item--button .n-base-icon,
[dir="rtl"] .n-layout-sider .n-layout-toggle-bar,
[dir="rtl"] .n-collapse .n-collapse-item .n-collapse-item__header .n-collapse-item-arrow .n-icon {
  transform: scaleX(-1) !important;
}

[dir="rtl"] .n-layout-sider .n-layout-toggle-bar {
  left: -28px;
  right: unset !important;
}

[dir="rtl"] .n-menu .n-menu-item-content .n-menu-item-content__icon {
  margin-left: 8px;
  margin-right: unset !important;
}
</style>
