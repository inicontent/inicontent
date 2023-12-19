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
import { Check, X, FileText, User } from "@vicons/tabler";
import { get, has } from "object-path";

export default defineComponent({
  props: {
    schema: {
      type: [Object],
      default: [],
    },
    modelValue: {
      type: Object,
      default: {},
    },
  },
  setup: (props, { emit }) => {
    const Language = useGlobalCookie("Language");
    const Loading: any = useState("Loading");
    Loading.value["Drawer"] = false;
    const single = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      }),
      route = useRoute(),
      RenderData = (field: any, path?: string): any => {
        if (!has(single.value, (path ?? "") + getPath(props.schema, field.id)))
          switch (field.type) {
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
                          () => h(X)
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
        else
          switch (field.type) {
            case "list":
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
                          get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
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
                        get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        )
                      )
                      .map((item: any) =>
                        h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${route.params.database}/admin/tables/${field.key}/${item.id}`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${route.params.database}/admin/tables/${field.key}/${item.id}`
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
                                        .concat(get(item, field.image))
                                        .map((link: string) =>
                                          link &&
                                          link.includes("cdn.inicontent") &&
                                          [
                                            "png",
                                            "jpg",
                                            "jpeg",
                                            "ico",
                                            "webp",
                                            "svg",
                                            "gif",
                                          ].includes(
                                            link.split(".").pop() ?? ""
                                          )
                                            ? `${link}?fit=18`
                                            : link
                                        )[0],
                                    })
                                  ),
                                default: () =>
                                  field.label
                                    ? field.label
                                        .map((single_label: string) =>
                                          get(item, single_label)
                                        )
                                        .join(" ")
                                    : item.id,
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      field.key.charAt(0).toUpperCase()
                                    )
                                  ),
                                default: () =>
                                  field.label
                                    ? field.label
                                        .map((single_label: string) =>
                                          get(item, single_label)
                                        )
                                        .join(" ")
                                    : item.id,
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
                      get(
                        single.value,
                        (path ?? "") + getPath(props.schema, field.id)
                      )
                    ).length === 1
                      ? []
                          .concat(
                            get(
                              single.value,
                              (path ?? "") + getPath(props.schema, field.id)
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
                                  src: link?.includes("cdn.inicontent")
                                    ? `${link}?fit=32`
                                    : link,
                                  previewSrc: link,
                                  width: 32,
                                })
                              : h(NIcon, () => h(FileText))
                          )
                      : h(NImageGroup, () =>
                          h(NSpace, { align: "center" }, () =>
                            []
                              .concat(
                                get(
                                  single.value,
                                  (path ?? "") + getPath(props.schema, field.id)
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
                                      src: link?.includes("cdn.inicontent")
                                        ? `${link}?fit=32`
                                        : link,
                                      previewSrc: link,
                                      width: 32,
                                    })
                                  : h(NIcon, () => h(FileText))
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
                              get(
                                single.value,
                                (path ?? "") + getPath(props.schema, field.id)
                              )
                            ),
                            type: "relative",
                          }),
                        default: () =>
                          h(NTime, {
                            time: Number(
                              get(
                                single.value,
                                (path ?? "") + getPath(props.schema, field.id)
                              )
                            ),
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
                        get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
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
                        color: get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
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
                              get(
                                single.value,
                                (path ?? "") + getPath(props.schema, field.id)
                              )
                                ? Check
                                : X
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
                    get(
                      single.value,
                      (path ?? "") + getPath(props.schema, field.id)
                    ).map((item: any, index: number) =>
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
                                path ??
                                  getPath(props.schema, field.id) + `.${index}.`
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
                      field.children.map((child: any) =>
                        RenderData(
                          child,
                          (path ?? "") + getPath(props.schema, field.id) + "."
                        )
                      )
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
                        href: `mailto:${get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        )}`,
                        _target: "blank",
                      },
                      () =>
                        get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
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
                          backgroundColor: get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
                          ),
                        },
                      },
                      () =>
                        h(
                          NText,
                          { style: { mixBlendMode: "difference" } },
                          () =>
                            get(
                              single.value,
                              (path ?? "") + getPath(props.schema, field.id)
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
                          get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
                          ) ?? "#",
                        _target: "blank",
                      },
                      () =>
                        get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
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
                            get(
                              single.value,
                              (path ?? "") + getPath(props.schema, field.id)
                            )
                          ),
                        icon: () => h(NIcon, () => h(User)),
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
                        get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        ) ?? "--",
                    }),
                }
              );
          }
      };
    return () => [
      h(
        "style",
        {},
        {
          default: () => `@media only print {
            * {
                max-height: unset!important;
                overflow: visible!important;
                visibility: hidden!important;
            }
            .n-card-header {
                display: none!important;
            }
            #__nuxt,
            #__nuxt .n-config-provider,
            #__nuxt .n-config-provider .n-layout,
            #__nuxt .n-config-provider .n-layout .n-layout-scroll-container > div:nth-child(2),
            #__nuxt .n-config-provider .n-layout .n-layout-scroll-container > div:nth-child(2) #PRINT_CONTENT * {
                top: 0!important;
                visibility: visible!important;
            }
            #PRINT_CONTENT {
                position: absolute!important;
                top:0!important;
                bottom:0!important;
                right:0!important;
                left:0!important;
                z-index: 9999999!important;
            }
          }`,
        }
      ),
      h(NScrollbar, { xScrollable: true }, () =>
        h(NList, { id: "PRINT_CONTENT", hoverable: true, bordered: true }, () =>
          props?.schema.map((item: any) => RenderData(item))
        )
      ),
    ];
  },
});