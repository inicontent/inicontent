import type { Field, Schema } from "inibase";

function GenerateSearchInOptions(
  schema: Schema,
  { key, type, children }: Field,
  path?: string
): any {
  switch (type) {
    case "array":
    case "object":
      return {
        type: "group",
        label: t(key),
        key: (path ?? "") + key,
        children: (children as Schema)
          .filter(({ type }) =>
            Array.isArray(type)
              ? type.some((t) => !["table", "array", "object"].includes(t))
              : !["table", "array", "object"].includes(type)
          )
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
          (
            (<any>useState("database")).value?.tables?.find(
              ({ slug }: any) => slug === key
            )?.schema as Schema | undefined
          )
            ?.filter(({ type }: any) => !["table"].includes(type))
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
}

export default GenerateSearchInOptions;
