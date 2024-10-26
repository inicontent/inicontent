<template>
    <NConfigProvider :dir="Language === 'ar' ? 'rtl' : 'ltr'" :rtl="Language === 'ar' ? rtlStyles : undefined"
        :theme="Theme === 'dark' ? darkTheme : null" :theme-overrides="{ common: ThemeConfig }"
        :locale="(Locales as any)[Language]" :date-locale="(dateLocales as any)[Language]">
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
    useOsTheme,
} from "naive-ui";

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
];
const Language = useCookie<string>("Language", { sameSite: true });
const Theme = useCookie<string>("Theme", { sameSite: true });

const osThemeRef = useOsTheme();
if (!Theme.value) Theme.value = osThemeRef.value ?? "light";
const ThemeConfig = useState<ThemeConfig>("ThemeConfig");

watch(Theme, setThemeConfig)

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

<style>
a {
    text-decoration: none !important;
}

.n-input-number,
.n-date-picker {
    width: 100%;
}

.rtl,
.rtl * {
    /* --n-label-padding: 0 0 0 12px !important; */
    --n-prefix-margin: 0 0 0 8px !important;
    --n-padding-single: 0 12px 0 26px !important;
    --n-padding-multiple: 3px 12px 0 26px !important;
}

.rtl .n-data-table .n-data-table-check-extra {
    left: -4px;
    right: unset !important;
}

.rtl .n-base-selection .n-base-suffix {
    left: 10px;
    right: unset !important;
}

.rtl .n-pagination .n-pagination-item.n-pagination-item--button .n-base-icon,
.rtl .n-layout-sider .n-layout-toggle-bar,
.rtl .n-collapse .n-collapse-item .n-collapse-item__header .n-collapse-item-arrow .n-icon,
.rtl .n-switch,
.rtl .tabler-icon-arrow-right,
.rtl .tabler-icon-chevron-right {
    transform: scaleX(-1) !important;
}

.rtl .n-input-group {
    flex-direction: row-reverse !important;
}

.rtl .n-layout-sider .n-layout-toggle-bar {
    left: -28px;
    right: unset !important;
}

.rtl .n-menu .n-menu-item-content .n-menu-item-content__icon {
    margin-left: 8px;
    margin-right: unset !important;
}

.rtl .n-dropdown-menu .n-dropdown-option .n-dropdown-option-body {
    flex-direction: row-reverse !important;
    text-align: right !important;
}

.n-breadcrumb .n-breadcrumb-item .n-breadcrumb-item__separator {
    margin: 0 2px !important;
}

.n-data-table .n-data-table-th .n-data-table-sorter {
    margin-right: 4px;
}

.n-upload-file-list .n-upload-file.n-upload-file--image-type .n-upload-file-info .n-upload-file-info__thumbnail img {
    overflow: hidden;
    height: 44px;
}

.n-tabs .n-tabs-nav {
    position: relative;
}
</style>