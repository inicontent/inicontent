import { get, has, set } from "object-path";
import { deepMerge } from "inibase/utils";
export const useLanguage = (messages: Record<string, any>) => {
  const Messages = useState("LanguageMessages");
  if (Messages.value) Messages.value = deepMerge(Messages.value, messages);
  else Messages.value = messages;
};

export const t = (key: string | null): string => {
  if (!key) return "";
  const Messages = useState("LanguageMessages");
  const Language = useGlobalCookie("Language");
  if (!has(Messages.value ?? {}, `${Language.value}.${key}`)) {
    if (!Messages.value) Messages.value = {};
    set(Messages.value as any, `${Language.value}.${key}`, null);
  }
  return get(Messages.value ?? {}, `${Language.value}.${key}`, key) ?? key;
};
