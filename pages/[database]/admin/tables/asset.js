import { FileText } from "@vicons/tabler";
import {
  NCard,
  NA,
  NGi,
  NGrid,
  NIcon,
  NImage,
  NSkeleton,
  NDrawer,
  NDrawerContent,
  NSpace,
  NText,
  NTime,
} from "naive-ui";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
        name: "الإسم",
        size: "الحجم",
        type: "النوع",
        link: "الرابط",
        created_at: "تاريخ الرفع",
      },
      en: {
        name: "Name",
        size: "Size",
        type: "Type",
        link: "Link",
        created_at: "Uplaoded at",
      },
    });
    const database = useState("database");
    useHead({
      title: `${database.value.slug} | ${t("Assets")}`,
      link: [{ rel: "icon", href: database.value.icon }],
    });

    const route = useRoute(),
      user = useState("user"),
      { data: Assets } = await useLazyFetch(
        `/api/${route.params.database}/asset`,
        {
          transform: (res) => res.result,
        }
      ),
      CurrentAsset = ref({});
    return () => [
      h(
        NDrawer,
        {
          show: CurrentAsset.value.hasOwnProperty("name"),
          "on-update:show": (v) =>
            v === false ? (CurrentAsset.value = {}) : null,
          placement: Language.value === "ar" ? "left" : "right",
        },
        () =>
          h(
            NDrawerContent,
            { nativeScrollbar: false, closable: true },
            {
              header: () => CurrentAsset.value.name,
              default: () =>
                CurrentAsset.value.hasOwnProperty("name")
                  ? h(NSpace, { vertical: true }, () => [
                      [
                        "png",
                        "jpg",
                        "jpeg",
                        "ico",
                        "webp",
                        "svg",
                        "gif",
                      ].includes(CurrentAsset.value.public_url.split(".").pop())
                        ? h(NImage, {
                            style: {
                              height: "100%",
                              width: "100%",
                              minHeight: "60px",
                              borderRadius: "15px",
                            },
                            src: `${CurrentAsset.value.public_url}?w=100`,
                            previewSrc: CurrentAsset.value.public_url,
                            imgProps: { style: "width: 100%" },
                          })
                        : h(
                            NIcon,
                            {
                              style: {
                                height: "100%",
                                width: "100%",
                                minHeight: "60px",
                                borderRadius: "15px",
                                position: "absolute",
                              },
                            },
                            () =>
                              h(
                                NA,
                                {
                                  href: CurrentAsset.value.public_url,
                                  target: "_blank",
                                },
                                () =>
                                  h(FileText, {
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
                              humanFileSize(CurrentAsset.value.size)
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
                            h(NText, () => CurrentAsset.value.mime_type),
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
                                href: CurrentAsset.value.public_url,
                              },
                              () => CurrentAsset.value.public_url
                            ),
                          ],
                        }
                      ),
                      h(
                        "div",
                        {},
                        {
                          default: () => [
                            h(
                              NText,
                              { strong: true },
                              () => `${t("created_at")}: `
                            ),
                            h(NTime, {
                              time: CurrentAsset.value.created_at,
                              unix: true,
                            }),
                          ],
                        }
                      ),
                    ])
                  : null,
            }
          )
      ),
      h(
        NCard,
        {
          title: t("Assets"),
          id: "assets_card",
          style: {
            height: "fit-content",
          },
        },
        {
          default: () => [
            h(
              NGrid,
              {
                xGap: "12px",
                yGap: "12px",
                cols: "100:2 300:3 500:4 650:6 900:8 1000:10",
              },
              () =>
                Array.isArray(Assets.value)
                  ? Assets.value.map((Asset) =>
                      h(
                        NGi,
                        {
                          style: {
                            position: "relative",
                            display: "flex",
                          },
                        },
                        () =>
                          [
                            "png",
                            "jpg",
                            "jpeg",
                            "ico",
                            "webp",
                            "svg",
                            "gif",
                          ].includes(Asset.public_url.split(".").pop())
                            ? h(NImage, {
                                onClick: () => (CurrentAsset.value = Asset),
                                previewDisabled: true,
                                style: {
                                  cursor: "pointer",
                                  height: "100%",
                                  width: "100%",
                                  minHeight: "60px",
                                  borderRadius: "15px",
                                },
                                intersectionObserverOptions: {
                                  root: "#assets_card",
                                },
                                lazy: true,
                                src: `${Asset.public_url}?w=60`,
                                imgProps: { style: "width: 100%" },
                              })
                            : h(
                                NIcon,
                                {
                                  onClick: () => (CurrentAsset.value = Asset),
                                  style: {
                                    cursor: "pointer",
                                    height: "100%",
                                    width: "100%",
                                    minHeight: "60px",
                                    borderRadius: "15px",
                                    position: "absolute",
                                  },
                                },
                                () =>
                                  h(FileText, {
                                    style: {
                                      width: "100%",
                                      height: "100%",
                                    },
                                  })
                              )
                      )
                    )
                  : [...Array(20).keys()].map(() =>
                      h(NGi, () =>
                        h(NSkeleton, {
                          style: {
                            width: "100%",
                            height: "100%",
                            minHeight: "100px",
                            borderRadius: "15px",
                          },
                        })
                      )
                    )
            ),
          ],
        }
      ),
    ];
  },
});
