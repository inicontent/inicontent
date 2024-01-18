import { deepMerge } from "inibase/utils";
import type { apiResponse } from "~/types";

export const useLanguage = (messages: Record<string, any>) => {
  const Messages = useState<Record<string, any>>("LanguageMessages");
  if (Messages.value) Messages.value = deepMerge(Messages.value, messages);
  else Messages.value = messages;
};

export const t = (key: string | null | undefined): string => {
  if (!key) return "";
  const Messages = useState<Record<string, any>>("LanguageMessages");
  const Language = useGlobalCookie<string>("Language");
  if (!hasProperty(Messages.value ?? {}, `${Language.value}.${key}`)) {
    const UnfoundMessages = useState<Record<string, any>>(
      "UnfoundLanguageMessages"
    );
    if (!UnfoundMessages.value) UnfoundMessages.value = {};
    setProperty(UnfoundMessages.value as any, key, null);
  }
  return (
    getProperty(Messages.value ?? {}, `${Language.value}.${key}`, key) ?? key
  );
};

export const fetchTranslation = async () => {
  const Language = useGlobalCookie<string>("Language"),
    route = useRoute(),
    Messages = useState<Record<string, any>>("LanguageMessages"),
    UnfoundMessages = useState<Record<string, any>>("UnfoundLanguageMessages");

  if (Language.value && UnfoundMessages.value) {
    await useFetch<apiResponse>(
      `${useRuntimeConfig().public.apiBase}${
        route.params?.database ?? "inicontent"
      }/translation`,
      {
        params: {
          _where: JSON.stringify({
            original: "[]" + Object.keys(UnfoundMessages.value).join(","),
            locale: Language.value,
          }),
        },
        transform: (res) => {
          if (res.result)
            res.result.forEach((translation: Record<string, string>) => {
              if (!Messages.value[`${Language.value}`])
                Messages.value[`${Language.value}`] = {};
              Messages.value[`${Language.value}`][`${translation.original}`] =
                translation.translated;
            });

          return res;
        },
      }
    );
  }
};

export const Languages = [
  "ab",
  "aa",
  "af",
  "ak",
  "sq",
  "am",
  "ar",
  "an",
  "hy",
  "as",
  "av",
  "ae",
  "ay",
  "az",
  "bm",
  "ba",
  "eu",
  "be",
  "bn",
  "bh",
  "bi",
  "bs",
  "br",
  "bg",
  "my",
  "ca",
  "km",
  "ch",
  "ce",
  "ny",
  "zh",
  "cu",
  "cv",
  "kw",
  "co",
  "cr",
  "hr",
  "cs",
  "da",
  "dv",
  "nl",
  "dz",
  "en",
  "eo",
  "et",
  "ee",
  "fo",
  "fj",
  "fi",
  "fr",
  "ff",
  "gd",
  "gl",
  "lg",
  "ka",
  "de",
  "ki",
  "el",
  "kl",
  "gn",
  "gu",
  "ht",
  "ha",
  "he",
  "hz",
  "hi",
  "ho",
  "hu",
  "is",
  "io",
  "ig",
  "id",
  "ia",
  "ie",
  "iu",
  "ik",
  "ga",
  "it",
  "ja",
  "jv",
  "kn",
  "kr",
  "ks",
  "kk",
  "rw",
  "kv",
  "kg",
  "ko",
  "kj",
  "ku",
  "ky",
  "lo",
  "la",
  "lv",
  "lb",
  "li",
  "ln",
  "lt",
  "lu",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "gv",
  "mi",
  "mr",
  "mh",
  "ro",
  "mn",
  "na",
  "nv",
  "nd",
  "ng",
  "ne",
  "se",
  "no",
  "nb",
  "nn",
  "ii",
  "oc",
  "oj",
  "or",
  "om",
  "os",
  "pi",
  "pa",
  "ps",
  "fa",
  "pl",
  "pt",
  "qu",
  "rm",
  "rn",
  "ru",
  "sm",
  "sg",
  "sa",
  "sc",
  "sr",
  "sn",
  "sd",
  "si",
  "sk",
  "sl",
  "so",
  "st",
  "nr",
  "es",
  "su",
  "sw",
  "ss",
  "sv",
  "tl",
  "ty",
  "tg",
  "ta",
  "tt",
  "te",
  "th",
  "bo",
  "ti",
  "to",
  "ts",
  "tn",
  "tr",
  "tk",
  "tw",
  "ug",
  "uk",
  "ur",
  "uz",
  "ve",
  "vi",
  "vo",
  "wa",
  "cy",
  "fy",
  "wo",
  "xh",
  "yi",
  "yo",
  "za",
  "zu",
];
