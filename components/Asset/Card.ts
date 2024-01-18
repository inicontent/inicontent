import type { Asset, apiResponse } from "~/types";
import { LazyAssetGrid } from "#components";
import {
  NButton,
  NCard,
  NIcon,
  NPopover,
  NProgress,
  NSpace,
  useMessage,
} from "naive-ui";
import { IconPlus } from "@tabler/icons-vue";

export default defineNuxtComponent({
  props: {
    modelValue: {
      type: Array as PropType<Asset[]>,
    },
  },
  setup: (props) => {
    const assets = toRef(props, "modelValue"),
      route = useRoute(),
      message = useMessage(),
      UploadInput = ref(),
      UploadProgress = ref<{ total: number[]; loaded: number[] }>({
        total: [],
        loaded: [],
      });

    return () =>
      h(
        NCard,
        {
          title: t("assets"),
          id: "assets_card",
          style: {
            height: "fit-content",
          },
        },
        {
          default: () => h(LazyAssetGrid, { modelValue: assets.value }),
          "header-extra": () =>
            h(NSpace, () => [
              h("input", {
                style: { display: "none" },
                ref: UploadInput,
                type: "file",
                multiple: true,
                onChange: async (e: Event) => {
                  if (
                    (<HTMLInputElement>e.target).files &&
                    (<HTMLInputElement>e.target).files?.length
                  )
                    for (
                      var i = 0;
                      i <
                      ((<HTMLInputElement>e.target).files as FileList).length;
                      i++
                    ) {
                      const formdata = new FormData(),
                        ajax = new XMLHttpRequest();
                      formdata.append(
                        "file",
                        ((<HTMLInputElement>e.target).files as FileList)[i]
                      );
                      ((n) =>
                        ajax.upload.addEventListener(
                          "progress",
                          (ev) => {
                            UploadProgress.value.total[n] = ev.total;
                            UploadProgress.value.loaded[n] = ev.loaded;
                          },
                          false
                        ))(i);
                      ((message) => {
                        ajax.addEventListener(
                          "loadend",
                          (ev) => {
                            if (
                              ev &&
                              ev.target &&
                              (ev.target as any).response
                            ) {
                              const response: apiResponse<Asset> = JSON.parse(
                                (ev.target as any).response
                              );
                              if (assets.value)
                                assets.value.unshift(response.result);
                              else assets.value = [response.result];

                              if (
                                UploadProgress.value.loaded.reduce(
                                  (acc, current) => acc + current,
                                  0
                                ) /
                                  UploadProgress.value.total.reduce(
                                    (acc, current) => acc + current,
                                    0
                                  ) ===
                                1
                              ) {
                                message.success(response.message.en);
                                setTimeout(
                                  () =>
                                    (UploadProgress.value = {
                                      total: [],
                                      loaded: [],
                                    }),
                                  1500
                                );
                              }
                            }
                          },
                          false
                        );
                        ajax.addEventListener(
                          "error",
                          () => {
                            message.error(t("upload_failed"));
                          },
                          false
                        );
                      })(message);
                      ajax.open(
                        "POST",
                        `${useRuntimeConfig().public.apiBase}${
                          route.params.database
                        }/asset${
                          route.params.folder
                            ? `/${[]
                                .concat(route.params.folder as any)
                                .join("/")}`
                            : ""
                        }`
                      );
                      ajax.send(formdata);
                    }
                },
              }),
              h(
                NPopover,
                {},
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        onClick: () => UploadInput.value.click(),
                        disabled: UploadProgress.value.total.length > 0,
                      },
                      {
                        icon: () =>
                          UploadProgress.value.total.length
                            ? h(NProgress, {
                                type: "circle",
                                showIndicator: false,
                                status:
                                  UploadProgress.value.loaded.reduce(
                                    (acc, current) => acc + current,
                                    0
                                  ) /
                                    UploadProgress.value.total.reduce(
                                      (acc, current) => acc + current,
                                      0
                                    ) ===
                                  1
                                    ? "success"
                                    : "warning",
                                percentage:
                                  (UploadProgress.value.loaded.reduce(
                                    (acc, current) => acc + current,
                                    0
                                  ) /
                                    UploadProgress.value.total.reduce(
                                      (acc, current) => acc + current,
                                      0
                                    )) *
                                  100,
                                strokeWidth: 20,
                              })
                            : h(NIcon, () => h(IconPlus)),
                      }
                    ),
                  default: () => t("upload"),
                }
              ),
            ]),
        }
      );
  },
});
