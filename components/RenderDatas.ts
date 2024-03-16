import {
  NIcon,
  NIconWrapper,
  NButton,
  NSpace,
  NText,
  NA,
  NImage,
  NImageGroup,
  NAvatar,
  NTag,
  NTime,
  NList,
  NListItem,
  NScrollbar,
  NPopover,
} from "naive-ui";
import { IconCheck, IconX, IconFileText, IconUser } from "@tabler/icons-vue";
import { getProperty, hasProperty } from "inidot";

export default defineNuxtComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      default: [],
    },
    modelValue: {
      type: Object,
      default: {},
    },
  },
  setup: (props, { emit }) => {
    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Drawer"] = false;
    const single = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      }),
      database = useState<Database>("database"),
      route = useRoute(),
      RenderData = (
        field: any,
        path?: string,
        isAbsolutePath?: boolean
      ): any => {
        if (
          !hasProperty(
            single.value,
            (path ?? "") +
              (isAbsolutePath ? "" : getPath(props.schema, field.id))
          )
        ) {
          if (field.key === "updatedAt") return;
          switch (field.subType ?? field.type) {
            case "boolean":
              return h(
                NListItem,
                {},
                {
                  prefix: () =>
                    h(NButton, { text: true }, () =>
                      h(NText, { strong: true }, () => `${t(field.key)}: `)
                    ),
                  default: () =>
                    h(
                      NIconWrapper,
                      {
                        color: "red",
                        borderRadius: 50,
                        size: 18,
                      },
                      () =>
                        h(
                          NIcon,
                          {
                            size: 16,
                          },
                          () => h(IconX)
                        )
                    ),
                }
              );
            case "array":
              return h(
                NListItem,
                {},
                {
                  prefix: () =>
                    h(NButton, { text: true }, () =>
                      h(NText, { strong: true }, () => `${t(field.key)}: `)
                    ),
                  default: () =>
                    h(
                      NButton,
                      {
                        circle: true,
                      },
                      {
                        default: () =>
                          h(NText, { depth: 3 }, { default: () => "[--]" }),
                      }
                    ),
                }
              );
            case "object":
              return h(
                NListItem,
                {},
                {
                  prefix: () =>
                    h(NButton, { text: true }, () =>
                      h(NText, { strong: true }, () => `${t(field.key)}: `)
                    ),
                  default: () =>
                    h(
                      NButton,
                      {
                        circle: true,
                      },
                      {
                        default: () =>
                          h(NText, { depth: 3 }, { default: () => "{--}" }),
                      }
                    ),
                }
              );
            default:
              return h(
                NListItem,
                {},
                {
                  prefix: () =>
                    h(NButton, { text: true }, () =>
                      h(NText, { strong: true }, () => `${t(field.key)}: `)
                    ),
                  default: () => h(NText, { depth: 3 }, () => "--"),
                }
              );
          }
        }
        switch (field.subType ?? field.type) {
          case "select":
          case "tags":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(NSpace, () =>
                    []
                      .concat(
                        getProperty(
                          single.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(props.schema, field.id))
                        )
                      )
                      .map((item) =>
                        h(
                          NTag,
                          {
                            bordered: false,
                          },
                          () => item
                        )
                      )
                  ),
              }
            );
          case "table":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  []
                    .concat(
                      getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      )
                    )
                    .map((item: any) =>
                      h(
                        NButton,
                        {
                          tag: "a",
                          href: `/${route.params.database}/admin/tables/${field.table}/${item.id}`,
                          onClick: (e) => (
                            e.preventDefault(),
                            navigateTo(
                              `/${route.params.database}/admin/tables/${field.table}/${item.id}`
                            )
                          ),
                          size: "small",
                          round: true,
                        },
                        field.image
                          ? {
                              icon: () =>
                                h(NIcon, () =>
                                  h(NAvatar, {
                                    style: {
                                      width: "18px",
                                      height: "18px",
                                    },
                                    round: true,
                                    src: []
                                      .concat(
                                        getProperty(item, field.image) ?? []
                                      )
                                      .map((link: string) =>
                                        link &&
                                        link.includes("inicontent") &&
                                        [
                                          "png",
                                          "jpg",
                                          "jpeg",
                                          "ico",
                                          "webp",
                                          "svg",
                                          "gif",
                                        ].includes(link.split(".").pop() ?? "")
                                          ? `${link}?fit=18`
                                          : link
                                      )[0],
                                  })
                                ),
                              default: () =>
                                renderLabel(
                                  database.value.tables?.find(
                                    ({ slug }) => slug === field.table
                                  )?.label,
                                  database.value.tables?.find(
                                    ({ slug }) => slug === field.table
                                  )?.schema,
                                  item
                                ),
                            }
                          : {
                              icon: () =>
                                h(NIcon, () =>
                                  h(
                                    "span",
                                    {},
                                    field.key.charAt(0).toUpperCase()
                                  )
                                ),
                              default: () =>
                                renderLabel(
                                  database.value.tables?.find(
                                    ({ slug }) => slug === field.table
                                  )?.label,
                                  database.value.tables?.find(
                                    ({ slug }) => slug === field.table
                                  )?.schema,
                                  item
                                ),
                            }
                      )
                    ),
              }
            );
          case "upload":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  [].concat(
                    getProperty(
                      single.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(props.schema, field.id))
                    )
                  ).length === 1
                    ? []
                        .concat(
                          getProperty(
                            single.value,
                            (path ?? "") +
                              (isAbsolutePath
                                ? ""
                                : getPath(props.schema, field.id))
                          )
                        )
                        .map((link: any) =>
                          [
                            "png",
                            "jpg",
                            "jpeg",
                            "ico",
                            "webp",
                            "svg",
                            "gif",
                          ].includes(link?.split(".").pop())
                            ? h(NImage, {
                                src: link?.includes("inicontent")
                                  ? `${link}?fit=32`
                                  : link,
                                previewSrc: link,
                                width: 32,
                              })
                            : h(NIcon, () => h(IconFileText))
                        )
                    : h(NImageGroup, () =>
                        h(NSpace, { align: "center" }, () =>
                          []
                            .concat(
                              getProperty(
                                single.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(props.schema, field.id))
                              )
                            )
                            .map((link: any) =>
                              [
                                "png",
                                "jpg",
                                "jpeg",
                                "ico",
                                "webp",
                                "svg",
                                "gif",
                              ].includes(link?.split(".").pop())
                                ? h(NImage, {
                                    src: link?.includes("inicontent")
                                      ? `${link}?fit=32`
                                      : link,
                                    previewSrc: link,
                                    width: 32,
                                  })
                                : h(NIcon, () => h(IconFileText))
                            )
                        )
                      ),
              }
            );
          case "date":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(NTime, {
                          time: Number(
                            getProperty(
                              single.value,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(props.schema, field.id))
                            )
                          ),
                        }),
                      default: () =>
                        h(NTime, {
                          time: Number(
                            getProperty(
                              single.value,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(props.schema, field.id))
                            )
                          ),
                          type: "relative",
                        }),
                    }
                  ),
              }
            );
          case "html":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(NText, {
                    innerHTML:
                      getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      ) ?? "--",
                  }),
              }
            );
          case "boolean":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NIconWrapper,
                    {
                      color: getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      )
                        ? "green"
                        : "red",
                      borderRadius: 50,
                      size: 18,
                    },
                    () =>
                      h(
                        NIcon,
                        {
                          size: 16,
                        },
                        () =>
                          h(
                            getProperty(
                              single.value,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(props.schema, field.id))
                            )
                              ? IconCheck
                              : IconX
                          )
                      )
                  ),
              }
            );
          case "array":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  getProperty(
                    single.value,
                    (path ?? "") +
                      (isAbsolutePath ? "" : getPath(props.schema, field.id)),
                    []
                  )?.map((_: any, index: number) =>
                    h(
                      NListItem,
                      {},
                      {
                        prefix: () =>
                          h(NText, { strong: true }, () => index + 1),
                        default: () =>
                          field.children.map((child: any) =>
                            RenderData(
                              child,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(props.schema, field.id)) +
                                `.${index}.${child.key}`,
                              true
                            )
                          ),
                      }
                    )
                  ),
              }
            );
          case "object":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(NSpace, { vertical: true }, () =>
                    field.children.map((child: any) => RenderData(child))
                  ),
              }
            );
          case "email":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NA,
                    {
                      href: `mailto:${getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      )}`,
                      _target: "blank",
                    },
                    () =>
                      getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      ) ?? "--"
                  ),
              }
            );

          case "color":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NTag,
                    {
                      round: true,
                      style: {
                        backgroundColor: getProperty(
                          single.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(props.schema, field.id))
                        ),
                      },
                    },
                    () =>
                      h(NText, { style: { mixBlendMode: "difference" } }, () =>
                        getProperty(
                          single.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(props.schema, field.id))
                        )
                      )
                  ),
              }
            );
          case "url":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NA,
                    {
                      href:
                        getProperty(
                          single.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(props.schema, field.id))
                        ) ?? "#",
                      _target: "blank",
                    },
                    () =>
                      getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      ) ?? "--"
                  ),
              }
            );
          case "role":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(
                    NTag,
                    { round: true },
                    {
                      default: () =>
                        t(
                          database.value.roles?.find(
                            ({ id }) =>
                              id ===
                              getProperty(
                                single.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(props.schema, field.id))
                              )
                          )?.name
                        ),
                      icon: () => h(NIcon, () => h(IconUser)),
                    }
                  ),
              }
            );
          default:
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${t(field.key)}: `)
                  ),
                default: () =>
                  h(NText, {
                    style: {
                      whiteSpace: "pre-line",
                    },
                    innerHTML:
                      getProperty(
                        single.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(props.schema, field.id))
                      ) ?? "--",
                  }),
              }
            );
        }
      };
    return () =>
      h(NScrollbar, { xScrollable: true }, () =>
        h(NList, { id: "PRINT_CONTENT", hoverable: true, bordered: true }, () =>
          props?.schema.map((item: any) => RenderData(item))
        )
      );
  },
});
