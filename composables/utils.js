export const GenerateSearchInOptions = (schema, item) => {
  if (item.type === "group")
    return {
      type: "group",
      label: item.name,
      key: `${(item.path ?? "") + item.name}`
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
      children: item.children
        .filter((i) => i.type !== "table" && i.type !== "group")
        .map((i) =>
          GenerateSearchInOptions(schema, {
            ...i,
            path:
              (item.path ?? "") + item.name + (item.duplicatable ? ".*." : "."),
          })
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
          GenerateSearchInOptions(schema, {
            ...i,
            path:
              (item.path ?? "") +
              item.name +
              (!item.hasOwnProperty("single") || item.single ? "." : ".*."),
          })
        ),
    };
  else if (
    item.type === "tags" ||
    (item.hasOwnProperty("single") && !item.single)
  )
    return {
      label: item.name,
      value: `${(item.path ?? "") + item.name}.*`
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
      ty: item.type,
    };
  else
    return {
      label: item.name,
      value: ((item.path ?? "") + item.name)
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
      ty: item.type,
    };
};

export const GetPathes = (item) => {
  if (item.type === "group")
    return item.children.map((i) =>
      GetPathes({
        ...i,
        path: (item.path ?? "") + item.name + (item.duplicatable ? ".*." : "."),
      })
    );
  else if (item.type === "table")
    return [
      `${item.name}_id`,
      ...item.label.map((l) =>
        (
          (item.path ?? "") +
          item.name +
          (!item.hasOwnProperty("single") || item.single ? "." : ".*.") +
          l
        )
          .toLowerCase()
          .replace(/ /g, "_")
          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
      ),
      (
        (item.path ?? "") +
        item.name +
        (!item.hasOwnProperty("single") || item.single ? "." : ".*.") +
        item.image
      )
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
    ];
  else if (
    item.type === "tags" ||
    (item.hasOwnProperty("single") && item.single === false) ||
    ((item.type === "upload" || item.type === "list") &&
      (!item.hasOwnProperty("single") || item.single === false))
  )
    return `${(item.path ?? "") + item.name}.*`
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^\[a-zA-Zء-ي]-_+/g, "");
  else
    return ((item.path ?? "") + item.name)
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^\[a-zA-Zء-ي]-_+/g, "");
};
