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
						ThemeConfig.value = {
							primaryColor: vibrantColor.hex,
							primaryColorHover: `${vibrantColor.hex}CC`,
							primaryColorPressed: `${vibrantColor.hex}80`,
							primaryColorSuppl: mutedColor.hex,
							revert: Palette.Vibrant.bodyTextColor === "#fff",
						};
				}
			} catch (error) {
				console.error(database.value.icon);
			}
		}

		watch(Language, fetchTranslation);

		return () =>
			h(
				NConfigProvider,
				{
					inlineThemeDisabled: true,
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
				],
			);
	},
});
