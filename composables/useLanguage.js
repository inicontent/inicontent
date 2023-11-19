import objectPath from "object-path";

export const useLanguage = (messages) => {
  const Messages = useState("LanguageMessages");
  const Language = useGlobalCookie("Language");

  const isObject = (item) => {
    return item && typeof item === "object" && !Array.isArray(item);
  };

  const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return mergeDeep(target, ...sources);
  };
  if (Messages.value) Messages.value = mergeDeep(Messages.value, messages);
  else Messages.value = messages;
};

export const t = (key) => {
  const Messages = useState("LanguageMessages");
  const Language = useGlobalCookie("Language");

  return objectPath.get(Messages.value, `${Language.value}.${key}`, key);
};
