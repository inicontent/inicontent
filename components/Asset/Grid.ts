import {
  NGrid,
  NGi,
  NImage,
  NIcon,
  NSkeleton,
  NA,
  NDrawer,
  NDrawerContent,
  NSpace,
  NText,
  NTime,
  NTooltip,
} from "naive-ui";
import { LazyAssetIcon } from "#components";
import type { Asset, ThemeConfig } from "~/types";

export default defineNuxtComponent({
  props: {
    modelValue: {
      type: (Array || null) as PropType<Asset[] | null>,
    },
    targetID: String || undefined,
  },
  setup: (props, { slots }) => {
    const assets = toRef(props, "modelValue"),
      ThemeConfig = useState<ThemeConfig>("ThemeConfig"),
      Theme = useGlobalCookie("Theme"),
      route = useRoute(),
      CurrentAsset = useState<Asset & { show?: boolean }>("asset", () => ({})),
      Language = useGlobalCookie("Language");

    useLanguage({
      ar: {
        name: "الإسم",
        size: "الحجم",
        type: "النوع",
        link: "الرابط",
        createdAt: "تاريخ الرفع",
      },
      en: {
        name: "Name",
        size: "Size",
        type: "Type",
        link: "Link",
        createdAt: "Uploaded at",
      },
    });
    return () => [
      h(
        "style",
        {},
        `
            .asset {
                background:
                ${
                  Theme.value === "dark"
                    ? "rgb(0 0 0 / 21%)"
                    : "rgb(179 179 179 / 20%)"
                };
                cursor: pointer;
                width: 100%;
                height: 100px;
                border-radius: 15px;
            }
        `
      ),
      h(
        NDrawer,
        {
          show: CurrentAsset.value.show === true,
          "on-update:show": (v: boolean) =>
            v === false ? (CurrentAsset.value.show = false) : null,
          placement: Language.value === "ar" ? "left" : "right",
        },
        () =>
          h(
            NDrawerContent,
            { nativeScrollbar: false, closable: true },
            {
              header: () => CurrentAsset.value.name,
              default: () =>
                h(NSpace, { vertical: true }, () => [
                  CurrentAsset.value.type !== "folder" &&
                  ["png", "jpg", "jpeg", "ico", "webp", "svg", "gif"].includes(
                    CurrentAsset.value.publicURL?.split(".").pop() ?? ""
                  )
                    ? h(NImage, {
                        style: {
                          width: "100%",
                          height: "200px",
                          borderRadius: "15px",
                          background:
                            Theme.value === "dark"
                              ? "rgb(0 0 0 / 21%)"
                              : "rgb(179 179 179 / 20%)",
                        },
                        src: `${CurrentAsset.value.publicURL}?fit=200&q=1`,
                        previewSrc: CurrentAsset.value.publicURL,
                        imgProps: { width: "100%", height: "200px" },
                      })
                    : h(
                        NIcon,
                        {
                          style: {
                            width: "100%",
                            height: "200px",
                            borderRadius: "15px",
                            background:
                              Theme.value === "dark"
                                ? "rgb(0 0 0 / 21%)"
                                : "rgb(179 179 179 / 20%)",
                          },
                        },
                        () =>
                          h(
                            NA,
                            {
                              href: CurrentAsset.value.publicURL,
                              target: "_blank",
                            },
                            () =>
                              h(LazyAssetIcon, {
                                type: CurrentAsset.value.type,
                                style: {
                                  width: "100%",
                                  height: "100%",
                                },
                              })
                          )
                      ),
                  h(
                    "div",
                    {},
                    {
                      default: () => [
                        h(NText, { strong: true }, () => `${t("name")}: `),
                        h(NText, () => CurrentAsset.value.name),
                      ],
                    }
                  ),
                  h(
                    "div",
                    {},
                    {
                      default: () => [
                        h(NText, { strong: true }, () => `${t("size")}: `),
                        h(NText, () =>
                          humanFileSize(CurrentAsset.value.size ?? 0)
                        ),
                      ],
                    }
                  ),
                  h(
                    "div",
                    {},
                    {
                      default: () => [
                        h(NText, { strong: true }, () => `${t("type")}: `),
                        h(NText, () => CurrentAsset.value.type),
                      ],
                    }
                  ),
                  h(
                    "div",
                    {},
                    {
                      default: () => [
                        h(NText, { strong: true }, () => `${t("link")}: `),
                        h(
                          NA,
                          {
                            target: "_blank",
                            href: CurrentAsset.value.publicURL,
                          },
                          () => CurrentAsset.value.publicURL
                        ),
                      ],
                    }
                  ),
                  h(
                    "div",
                    {},
                    {
                      default: () => [
                        h(NText, { strong: true }, () => `${t("createdAt")}: `),
                        h(NTime, {
                          time: Number(CurrentAsset.value.createdAt),
                          type: "relative",
                        }),
                      ],
                    }
                  ),
                ]),
            }
          )
      ),
      h(
        NGrid,
        {
          xGap: "12px",
          yGap: "12px",
          cols: "100:2 200:3 300:4 400:5 500:6 700:8 900:11",
        },
        () =>
          assets.value
            ? assets.value.map((asset) =>
                h(NGi, () =>
                  h(
                    NTooltip,
                    {},
                    {
                      default: () => asset.name,
                      trigger: () =>
                        h(
                          "div",
                          {
                            style: {
                              position: "relative",
                              display: "flex",
                            },
                          },
                          [
                            slots.default ? slots.default(asset) : null,
                            asset.type !== "folder" &&
                            [
                              "png",
                              "jpg",
                              "jpeg",
                              "ico",
                              "avif",
                              "webp",
                              "svg",
                              "gif",
                            ].includes(asset.publicURL?.split(".").pop() ?? "")
                              ? h(NImage, {
                                  class: "asset",
                                  onClick: () =>
                                    (CurrentAsset.value = {
                                      ...asset,
                                      show: true,
                                    }),
                                  previewDisabled: true,
                                  intersectionObserverOptions: {
                                    root: `#${props.targetID ?? "container"}`,
                                  },
                                  lazy: true,
                                  src: `${asset.publicURL}?fit=100&q=1`,
                                  imgProps: {
                                    style: { width: "100%", height: "100px" },
                                  },
                                })
                              : h(
                                  NIcon,
                                  {
                                    class: "asset",
                                    onClick: () =>
                                      asset.type === "folder"
                                        ? navigateTo(
                                            `${route.path}/${asset.name}`
                                          )
                                        : (CurrentAsset.value = {
                                            ...asset,
                                            show: true,
                                          }),
                                  },
                                  () =>
                                    h(LazyAssetIcon, {
                                      type: asset.type,
                                      style: {
                                        color:
                                          ThemeConfig.value.primaryColor ??
                                          "#fff",
                                        width: "100%",
                                        height: "100px",
                                      },
                                    })
                                ),
                          ]
                        ),
                    }
                  )
                )
              )
            : [...Array(15).keys()].map(() =>
                h(NGi, () =>
                  h(NSkeleton, {
                    style: {
                      width: "100%",
                      height: "100px",
                      borderRadius: "15px",
                    },
                  })
                )
              )
      ),
    ];
  },
});
