export const toSlug = (string) =>
  string
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/[^\[a-zA-Zء-ي]-_+/g, "");

export const toName = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).replaceAll("_", " ");

export const GenerateSearchInOptions = (
  schema,
  { key, type, children },
  path
) => {
  const database = useState("database");
  switch (type) {
    case "array":
    case "object":
      return {
        type: "group",
        label: t(key),
        key: (path ?? "") + key,
        children: children
          .filter(({ type }) => !["table", "array", "object"].includes(type))
          .map((field) =>
            GenerateSearchInOptions(schema, field, (path ?? "") + key + ".")
          ),
      };
    case "table":
      return {
        type: "group",
        label: t(key),
        key: (path ?? "") + key,
        children:
          database.value.tables
            .find(({ slug }) => slug === key)
            ?.schema?.filter(({ type }) => !["table"].includes(type))
            .map((field, _index, schema) =>
              GenerateSearchInOptions(schema, field, (path ?? "") + key + ".")
            ) ?? [],
      };
    default:
      return {
        label: t(key),
        value: (path ?? "") + key,
        ty: type,
      };
  }
};

export const ReturnUNIX = (value) =>
  typeof value == "number" && value >= -8.64e12 && value <= +8.64e12
    ? value
    : Date.parse(value) / 1000;

export const getPath = (
  schema,
  id,
  listNumbers = undefined,
  currentPath = ""
) => {
  for (const item of schema) {
    const newPath = currentPath ? `${currentPath}.${item.key}` : item.key;

    if (item.id === id) {
      return newPath;
    }

    if (item.type === "array" && item.children) {
      let nestedPath;
      if (listNumbers) {
        if (!Array.isArray(listNumbers)) listNumbers = [listNumbers];
        const firstItem = listNumbers.shift();
        nestedPath = getPath(
          item.children,
          id,
          listNumbers,
          newPath + "." + firstItem
        );
      } else nestedPath = getPath(item.children, id, newPath + ".");
      if (nestedPath) return nestedPath;
    } else if (item.children) {
      const nestedPath = getPath(item.children, id, newPath);
      if (nestedPath) return nestedPath;
    }
  }

  return null;
};

export const humanFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};
