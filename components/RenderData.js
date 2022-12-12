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
import { getProperty, hasProperty } from "dot-prop";
import { NuxtLink } from "#components";

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
    const Loading = useState("Loading");
    Loading.value["Drawer"] = false;
    const single = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      }),
      route = useRoute(),
      Schema = props.schema,
      RenderField = ({ name, key, path, type, ...options }) => {
        switch (type) {
          case "list":
          case "tags":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? h(
                        NSpace,
                        []
                          .concat(
                            getProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
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
                    h(
                      NText,
                      { strong: true },
                      () =>
                        `${
                          name.charAt(0).toUpperCase() +
                          name.slice(1).replaceAll("_", " ")
                        }: `
                    )
                  ),
                default: () =>
                  hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? []
                        .concat(
                          getProperty(single.value, path ?? pathTo(Schema, key))
                        )
                        .map((item) =>
                          h(
                            NuxtLink,
                            {
                              to: `/${route.params.db_slug}/table/${name}/${item.id}`,
                            },
                            () =>
                              h(
                                NTag,
                                {
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
                                          options.image
                                            ? h(NAvatar, {
                                                src: []
                                                  .concat(
                                                    getProperty(
                                                      item,
                                                      options.image
                                                    )
                                                  )
                                                  .map((link) =>
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
                                                      link.split(".").pop()
                                                    )
                                                      ? `${link}?fit=22`
                                                      : link
                                                  )[0],
                                                round: true,
                                                size: 22,
                                                style: {
                                                  marginRight: "4px",
                                                },
                                              })
                                            : null,
                                          options.label
                                            .map((single_label) =>
                                              getProperty(item, single_label)
                                            )
                                            .join(" "),
                                        ],
                                      }
                                    ),
                                }
                              )
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? [].concat(
                        getProperty(single.value, path ?? pathTo(Schema, key))
                      ).length === 1
                      ? []
                          .concat(
                            getProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
                            )
                          )
                          .map((link) =>
                            [
                              "png",
                              "jpg",
                              "jpeg",
                              "ico",
                              "webp",
                              "svg",
                              "gif",
                            ].includes(link.split(".").pop())
                              ? h(NImage, {
                                  src: link.includes("cdn.inicontent")
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
                                getProperty(
                                  single.value,
                                  path ?? pathTo(Schema, key)
                                )
                              )
                              .map((link) =>
                                [
                                  "png",
                                  "jpg",
                                  "jpeg",
                                  "ico",
                                  "webp",
                                  "svg",
                                  "gif",
                                ].includes(link.split(".").pop())
                                  ? h(NImage, {
                                      src: link.includes("cdn.inicontent")
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? h(NTime, {
                        time: getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(NText, {
                    innerHTML:
                      getProperty(single.value, path ?? pathTo(Schema, key)) ??
                      "--",
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NIconWrapper,
                    {
                      color: getProperty(
                        single.value,
                        path ?? pathTo(Schema, key)
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
                              path ?? pathTo(Schema, key)
                            )
                              ? Check
                              : X
                          )
                      )
                  ),
              }
            );
          case "group":
            return h(
              NListItem,
              {},
              {
                prefix: () =>
                  h(NButton, { text: true }, () =>
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  options.duplicatable
                    ? hasProperty(single.value, path ?? pathTo(Schema, key))
                      ? getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ).map((item, index) =>
                          h(
                            NListItem,
                            {},
                            {
                              prefix: () =>
                                h(NText, { strong: true }, () => index + 1),
                              default: () =>
                                options.children.map((child) =>
                                  RenderField({
                                    ...child,
                                    path:
                                      pathTo(Schema, child.key).substr(
                                        0,
                                        pathTo(Schema, child.key).lastIndexOf(
                                          "."
                                        )
                                      ) +
                                      `[${index}]` +
                                      pathTo(Schema, child.key).substr(
                                        pathTo(Schema, child.key).lastIndexOf(
                                          "."
                                        )
                                      ),
                                  })
                                ),
                            }
                          )
                        )
                      : null
                    : h(NSpace, { vertical: true }, () =>
                        options.children.map((child) => RenderField(child))
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NA,
                    {
                      href: hasProperty(
                        single.value,
                        path ?? pathTo(Schema, key)
                      )
                        ? `mailto:${getProperty(
                            single.value,
                            path ?? pathTo(Schema, key)
                          )}`
                        : "#",
                      _target: "blank",
                    },
                    () =>
                      getProperty(single.value, path ?? pathTo(Schema, key)) ??
                      "--"
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NA,
                    {
                      href:
                        getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ) ?? "#",
                      _target: "blank",
                    },
                    () =>
                      getProperty(single.value, path ?? pathTo(Schema, key)) ??
                      "--"
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
                    h(
                      NText,
                      { strong: true },
                      () =>
                        `${
                          name.charAt(0).toUpperCase() +
                          name.slice(1).replaceAll("_", " ")
                        }: `
                    )
                  ),
                default: () =>
                  hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? h(
                        NTag,
                        { round: true },
                        {
                          default: () =>
                            getProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
                            )
                              .charAt(0)
                              .toUpperCase() +
                            getProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
                            )
                              .slice(1)
                              .replaceAll("_", " "),
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NText,
                    () =>
                      getProperty(single.value, path ?? pathTo(Schema, key)) ??
                      "--"
                  ),
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
          Schema.map((item) => RenderField(item))
        )
      ),
    ];
  },
});
