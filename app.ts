import {
  NConfigProvider,
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
  enUS,
  dateEnUS,
  arDZ,
  dateArDZ,
} from "naive-ui";
import Vibrant from "node-vibrant";
import { NuxtLayout, NuxtPage, NuxtLoadingIndicator } from "#components";

export default defineNuxtComponent({
  async setup() {
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
      Language = useGlobalCookie<string>("Language"),
      Theme = useGlobalCookie<string>("Theme"),
      database = useState<Database>("database", () => ({
        name: "Inicontent",
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
            primaryColorHover: Palette.LightVibrant?.hex ?? "",
            primaryColorPressed: Palette.DarkVibrant?.hex ?? "",
            primaryColorSuppl: Palette?.Muted?.hex ?? "",
          };
      } catch (error) {
        console.error(error);
      }
    }

    useHead({
      bodyAttrs: {
        class: computed(() =>
          [
            Language.value === "ar" ? "rtl" : "ltr",
            Theme.value === "dark" ? "dark" : "light",
          ].join(" ")
        ),
      },
    });

    onMounted(fetchTranslation);
    watch(Language, fetchTranslation);

    return () =>
      h(
        NConfigProvider,
        {
          dir: Language.value === "ar" ? "rtl" : "ltr",
          rtl: Language.value === "ar" ? rtlStyles : undefined,
          theme: Theme.value === "dark" ? darkTheme : null,
          themeOverrides: { common: ThemeConfig.value },
          locale: (Locales as any)[Language.value],
          dateLocale: (dateLocales as any)[Language.value],
        },
        () => [
          h(NuxtLoadingIndicator, {
            color: ThemeConfig.value.primaryColor,
            height: 2,
          }),
          h(NuxtLayout, () => h(NuxtPage)),
        ]
      );
  },
});
