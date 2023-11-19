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
} from "naive-ui";
import { Check, X, FileText, User as UserIcon } from "@vicons/tabler";
import objectPath from "object-path";

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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? h(NSpace, () =>
                        []
                          .concat(
                            objectPath.get(
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
                      )
                    : h(NText, () => "--"),
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? []
                        .concat(
                          objectPath.get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
                          )
                        )
                        .map((item: any) =>
                          h(
                            NTag,
                            {
                              onClick: () =>
                                navigateTo(
                                  `/${route.params.database}/admin/tables/${field.key}/${item.id}`
                                ),
                              style: {
                                cursor: "pointer",
                                padding: "0 6px 0 4px",
                              },
                              round: true,
                            },
                            {
                              default: () =>
                                h(
                                  "div",
                                  {
                                    style: {
                                      display: "flex",
                                      alignItems: "center",
                                    },
                                  },
                                  {
                                    default: () => [
                                      field.image
                                        ? h(NAvatar, {
                                            src: []
                                              .concat(
                                                objectPath.get(
                                                  item,
                                                  field.image
                                                )
                                              )
                                              .map((link: any) =>
                                                link.includes(
                                                  "cdn.inicontent"
                                                ) &&
                                                [
                                                  "png",
                                                  "jpg",
                                                  "jpeg",
                                                  "ico",
                                                  "webp",
                                                  "svg",
                                                  "gif",
                                                ].includes(
                                                  link?.split(".").pop()
                                                )
                                                  ? `${link}?fit=22`
                                                  : link
                                              )[0],
                                            round: true,
                                            size: 22,
                                            style:
                                              Language.value === "ar"
                                                ? {
                                                    marginLeft: "4px",
                                                  }
                                                : {
                                                    marginRight: "4px",
                                                  },
                                          })
                                        : null,
                                      field.label
                                        .map((single_label: any) =>
                                          objectPath.get(item, single_label)
                                        )
                                        .join(" "),
                                    ],
                                  }
                                ),
                            }
                          )
                        )
                    : null,
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? [].concat(
                        objectPath.get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        )
                      ).length === 1
                      ? []
                          .concat(
                            objectPath.get(
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
                                objectPath.get(
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
                        )
                    : h(NText, () => "--"),
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? h(NTime, {
                        time: ReturnUNIX(
                          objectPath.get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
                          )
                        ),
                        unix: true,
                        type: "relative",
                      })
                    : h(NText, () => "--"),
              }
            );
          case "editor":
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
                      objectPath.get(
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
                      color: objectPath.get(
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
                            objectPath.get(
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? objectPath
                        .get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        )
                        .map((item: any, index: number) =>
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
                                      getPath(props.schema, field.id) +
                                        `.${index}.`
                                  )
                                ),
                            }
                          )
                        )
                    : null,
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
                      href: objectPath.has(
                        single.value,
                        (path ?? "") + getPath(props.schema, field.id)
                      )
                        ? `mailto:${objectPath.get(
                            single.value,
                            (path ?? "") + getPath(props.schema, field.id)
                          )}`
                        : "#",
                      _target: "blank",
                    },
                    () =>
                      objectPath.get(
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? h(
                        NTag,
                        {
                          round: true,
                          style: {
                            backgroundColor: objectPath.get(
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
                              objectPath.get(
                                single.value,
                                (path ?? "") + getPath(props.schema, field.id)
                              )
                          )
                      )
                    : h(NText, { depth: 3 }, () => "--"),
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
                        objectPath.get(
                          single.value,
                          (path ?? "") + getPath(props.schema, field.id)
                        ) ?? "#",
                      _target: "blank",
                    },
                    () =>
                      objectPath.get(
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
                  objectPath.has(
                    single.value,
                    (path ?? "") + getPath(props.schema, field.id)
                  )
                    ? h(
                        NTag,
                        { round: true },
                        {
                          default: () =>
                            t(
                              objectPath.get(
                                single.value,
                                (path ?? "") + getPath(props.schema, field.id)
                              )
                            ),
                          icon: () => h(NIcon, () => h(UserIcon)),
                        }
                      )
                    : h(NText, { depth: 3 }, () => "--"),
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
                      objectPath.get(
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
