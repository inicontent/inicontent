import { getProperty, setProperty, hasProperty } from "dot-prop";
import { deepMerge } from "inibase/utils";
export const useLanguage = (messages: Record<string, any>) => {
  const Messages = useState("LanguageMessages");
  if (Messages.value) Messages.value = deepMerge(Messages.value, messages);
  else Messages.value = messages;
};

export const t = (key: string | null | undefined): string => {
  if (!key) return "";
  const Messages = useState("LanguageMessages");
  const Language = useGlobalCookie("Language");
  if (!hasProperty(Messages.value ?? {}, `${Language.value}.${key}`)) {
    if (!Messages.value) Messages.value = {};
    setProperty(Messages.value as any, `${Language.value}.${key}`, null);
  }
  return (
    getProperty(Messages.value ?? {}, `${Language.value}.${key}`, key) ?? key
  );
};
