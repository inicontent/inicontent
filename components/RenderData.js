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
    const Language = useGlobalCookie("Language");
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
                  objectPath.has(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  )
                    ? h(NSpace, () =>
                        []
                          .concat(
                            objectPath.get(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                  objectPath.has(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  )
                    ? []
                        .concat(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )
                        )
                        .map((item) =>
                          h(
                            NuxtLink,
                            {
                              to: `/${route.params.db_slug}/tables/${name}/${item.id}`,
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
                                                    objectPath.get(
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
                                          options.label
                                            .map((single_label) =>
                                              objectPath.get(item, single_label)
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
                  objectPath.has(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  )
                    ? [].concat(
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      ).length === 1
                      ? []
                          .concat(
                            objectPath.get(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                                objectPath.get(
                                  single.value,
                                  (path ?? "") +
                                    name
                                      .toLowerCase()
                                      .replace(/ /g, "_")
                                      .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                  objectPath.has(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  )
                    ? h(NTime, {
                        time: objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                      objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NIconWrapper,
                    {
                      color: objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                    ? objectPath.has(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                      ? objectPath
                          .get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )
                          .map((item, index) =>
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
                                        (path ?? "") +
                                        name
                                          .toLowerCase()
                                          .replace(/ /g, "_")
                                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                                        `.${index}.`,
                                    })
                                  ),
                              }
                            )
                          )
                      : null
                    : h(NSpace, { vertical: true }, () =>
                        options.children.map((child) =>
                          RenderField({
                            ...child,
                            path:
                              (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                              ".",
                          })
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
                    h(NText, { strong: true }, () => `${name}: `)
                  ),
                default: () =>
                  h(
                    NA,
                    {
                      href: objectPath.has(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                        ? `mailto:${objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )}`
                        : "#",
                      _target: "blank",
                    },
                    () =>
                      objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      ) ?? "--"
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
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ) ?? "#",
                      _target: "blank",
                    },
                    () =>
                      objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                  objectPath.has(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  )
                    ? h(
                        NTag,
                        { round: true },
                        {
                          default: () =>
                            objectPath
                              .get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              )
                              .charAt(0)
                              .toUpperCase() +
                            objectPath
                              .get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
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
                      objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      ) ?? "--"
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
          [
            ...Schema,
            { name: "ID", type: "text" },
            { name: "Created at", type: "date" },
          ].map((item) => RenderField(item))
        )
      ),
    ];
  },
});
