export const pathTo = (array, target) => {
  var result;
  array.some(({ key, name, children = [] }) => {
    if (key === target)
      return (result = (name ?? "Field Name")
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""));
    var temp = pathTo(children, target);
    if (temp)
      return (result =
        (name ?? "Field Name")
          .toLowerCase()
          .replace(/ /g, "_")
          .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
        "." +
        temp);
  });
  return result;
};

export const pathToSearch = (array, target) => {
  var result;
  array.some(({ key, name, duplicatable = false, children = [] }) => {
    if (key === target)
      return (result = name
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""));
    var temp = pathToSearch(children, target);
    if (temp)
      return (result =
        name
          .toLowerCase()
          .replace(/ /g, "_")
          .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
        (duplicatable ? ".*." : ".") +
        temp);
  });
  return result;
};

export const GenerateSearchInOptions = (schema, item, prefix = null) => {
  if (item.type === "group")
    return {
      type: "group",
      label: item.name,
      key: (prefix ? `${prefix + item.name}` : item.name)
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
      children: item.children
        .filter((i) => i.type !== "table" && i.type !== "group")
        .map((i) =>
          GenerateSearchInOptions(
            schema,
            i,
            item.name
              .toLowerCase()
              .replace(/ /g, "_")
              .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
              (item.duplicatable ? ".*." : ".")
          )
        ),
    };
  else if (item.type === "table")
    return {
      type: "group",
      label:
        item.name.charAt(0).toUpperCase() +
        item.name.slice(1).replaceAll("_", " "),
      key: item.name,
      children: database.value.tables
        .find((table) => table.slug === item.name)
        .schema.filter((item) => item.type !== "table")
        .map((i, _index, schema) =>
          GenerateSearchInOptions(
            schema,
            i,
            !item.hasOwnProperty("single") || item.single
              ? `${item.name}.`
              : `${item.name}.*.`
          )
        ),
    };
  else if (
    item.type === "tags" ||
    (item.hasOwnProperty("single") && !item.single)
  )
    return {
      label: item.name,
      value: prefix
        ? `${prefix + pathToSearch(schema, item.key)}.*`
        : `${pathToSearch(schema, item.key)}.*`,
      ty: item.type,
    };
  else
    return {
      label: item.name,
      value: prefix
        ? `${prefix + pathToSearch(schema, item.key)}`
        : pathToSearch(schema, item.key),
      ty: item.type,
    };
};

export const GetPathes = (schema, item, prefix = null) => {
  if (item.type === "group")
    return item.children.map((i) => GetPathes(schema, i, prefix));
  else if (item.type === "table")
    return [
      `${item.name}_id`,
      ...item.label.map((l) =>
        !item.hasOwnProperty("single") || item.single
          ? `${item.name}.${l}`
          : `${item.name}.*.${l}`
      ),
      !item.hasOwnProperty("single") || item.single
        ? `${item.name}.${item.image}`
        : `${item.name}.*.${item.image}`,
    ];
  else if (
    item.type === "tags" ||
    (item.hasOwnProperty("single") && item.single === false) ||
    ((item.type === "upload" || item.type === "list") &&
      (!item.hasOwnProperty("single") || item.single === false))
  )
    return prefix
      ? `${prefix + pathToSearch(schema, item.key)}.*`
      : `${pathToSearch(schema, item.key)}.*`;
  else
    return prefix
      ? `${prefix + pathToSearch(schema, item.key)}`
      : pathToSearch(schema, item.key);
};
