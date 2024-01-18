import {
  NForm,
  NFormItem,
  NInput,
  NUpload,
  NDatePicker,
  NSwitch,
  NIcon,
  NButton,
  NSpace,
  NInputNumber,
  NCollapse,
  NCollapseItem,
  NPopover,
  NUploadDragger,
  NText,
  NP,
  NA,
  NRadioGroup,
  NRadio,
  NCheckbox,
  NCheckboxGroup,
  NDrawer,
  NDrawerContent,
  NSkeleton,
  NSelect,
  NGrid,
  NGi,
  NImage,
  NImageGroup,
  NAvatar,
  NTag,
  NCard,
  NDataTable,
  NDynamicTags,
  useMessage,
  NColorPicker,
  NAutoComplete,
  type FormInst,
} from "naive-ui";
import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconChevronRight,
  IconUpload,
  IconLink,
  IconBooks,
  IconDeviceFloppy,
  IconQuestionMark,
} from "@tabler/icons-vue";
import {
  isArrayOfObjects,
  isURL,
  isEmail,
  validateFieldType,
  deepMerge,
} from "inibase/utils";
import { LazyRichEditor, LazyRenderFields, LazyAssetGrid } from "#components";
import type {
  Database,
  Field,
  Schema,
  apiResponse,
  User,
  Asset,
} from "~/types";
import type { FieldType } from "inibase";
export default defineNuxtComponent({
  props: {
    schema: {
      type: Object as PropType<Schema | never>,
      default: [],
    },
    modelValue: {
      type: Object as PropType<any>,
      default: {},
    },
  },
  setup: (props) => {
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
        delete: "حذف",
        actions: "أوامر",
      },
      en: {
        delete: "Delete",
        actions: "Actions",
      },
    });
    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Drawer"] = false;
    const modelValue = toRef(props, "modelValue"),
      runtimeConfig = useRuntimeConfig(),
      message = useMessage(),
      database = useState<Database>("database"),
      schema = toRef(props, "schema"),
      route = useRoute(),
      user = useState<User>("user"),
      OPTIONS = ref<any>({}),
      DisabledItem = useState<Record<string | number, boolean>>(() => ({})),
      DrawerFormRef = ref<FormInst | null>(null),
      Drawer = ref<{
        show: boolean;
        id?: null | string;
        table?: null | string;
        data?: any;
      }>({
        show: false,
        id: null,
        table: null,
        data: {},
      }),
      UpdateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["Drawer"] = true;
            const { data } = await useFetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}${
                route.params.database ?? "inicontent"
              }/${Drawer.value.table}/${Drawer.value.id}`,
              {
                method: "PUT",
                body: Drawer.value.data,
              }
            );
            if (!data.value) return message.error(t("error"));

            if (data.value.result && data.value.result.id) {
              message.success(data.value.message.en);
              Loading.value["Drawer"] = false;
              Drawer.value.show = false;
              Drawer.value.data = {};
            } else message.error(data.value.message.en);
            Loading.value["Drawer"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      CreateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["Drawer"] = true;
            const { data } = await useFetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}${
                route.params.database ?? "inicontent"
              }/${Drawer.value.table}`,
              {
                method: "POST",
                body: Drawer.value.data,
                transform: (res) => {
                  if (res.result) res.result = [].concat(res.result)[0];
                  return res;
                },
              }
            );
            if (!data.value) return message.error(t("error"));

            if (data.value.result && data.value.result.id) {
              message.success(data.value.message.en);
              Loading.value["Drawer"] = false;
              Drawer.value.show = false;
              Drawer.value.data = {};
            } else message.error(data.value.message.en);
            Loading.value["Drawer"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      CurrentField: any = ref(null),
      Showassets = ref(false),
      assets = ref<Asset[] | null>(null),
      HandleSelectassets = (url?: string) => {
        if (!url) return;
        if (
          (Array.isArray(CurrentField.value.type) &&
            !CurrentField.value.type.includes("array")) ||
          CurrentField.value.type !== "array"
        ) {
          if (
            (getProperty(modelValue.value, CurrentField.value.path) as any) ===
            url
          )
            deleteProperty(modelValue.value, CurrentField.value.path);
          else setProperty(modelValue.value, CurrentField.value.path, url);
        } else {
          if (
            hasProperty(modelValue.value, CurrentField.value.path) &&
            getProperty(
              modelValue.value,
              CurrentField.value.path,
              ""
            )?.includes(url)
          )
            deleteProperty(
              modelValue.value,
              CurrentField.value.path +
                `[${getProperty(
                  modelValue.value,
                  CurrentField.value.path,
                  ""
                )?.indexOf(url)}]`
            );
          else
            setProperty(
              modelValue.value,
              `${CurrentField.value.path}[${
                (getProperty(modelValue.value, CurrentField.value.path, [])
                  ?.length ?? 0) + 1
              }]`,
              url
            );
        }
      },
      RenderField = (
        field: Field,
        path?: string,
        absolutePath?: boolean
      ): any => {
        if (
          field.defaultValue &&
          !hasProperty(
            modelValue.value,
            (path ?? "") + (absolutePath ? "" : getPath(schema.value, field.id))
          )
        )
          setProperty(
            modelValue.value,
            (path ?? "") +
              (absolutePath ? "" : getPath(schema.value, field.id)),
            field.defaultValue
          );
        switch (field.subType ?? field.type) {
          case "string":
            return RenderField(
              {
                ...field,
                type: "text",
              },
              path,
              absolutePath
            );
          case "role":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: true,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NSelect, {
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  options: [
                    "admin",
                    "user",
                    ...(database.value.roles ?? []),
                  ].map((v) => ({
                    label: t(v),
                    value: v,
                  })),
                })
            );
          case "id":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      ""
                    )?.toString(),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "text":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "textarea":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    field.required && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    type: "textarea",
                    rows: field.isTable ? 1 : 3,
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    showCount: true,
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "radio":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NRadioGroup,
                  {
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value
                      ),
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  () =>
                    h(NSpace, {}, () =>
                      field.values?.map((value: any) =>
                        h(NRadio, {
                          value: value,
                          label: t(value),
                        })
                      )
                    )
                )
            );
          case "object":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                (field.children as Schema).map((child: any) =>
                  RenderField(child, path, absolutePath)
                )
            );
          case "array":
            if (!field.children) throw new Error("no children");
            if (field.subType)
              return RenderField(
                {
                  ...field,
                  type: field.subType,
                  single: false,
                } as Field,
                path,
                absolutePath
              );
            else if (!isArrayOfObjects(field.children))
              return RenderField(
                {
                  ...field,
                  type: "tags",
                  single: false,
                } as Field,
                path,
                absolutePath
              );
            else
              return field.children.filter(
                (f: any) => f.type === "array" && isArrayOfObjects(f.children)
              ).length
                ? h(
                    NCollapse,
                    {
                      displayDirective: "show",
                      style: {
                        margin: "20px 0",
                      },
                      arrowPlacement: "right",
                      accordion: true,
                    },
                    {
                      arrow: () =>
                        !hasProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        ) ||
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id)),
                          []
                        )?.length === 0
                          ? ""
                          : h(NIcon, () => h(IconChevronRight)),
                      default: () =>
                        h(
                          NCollapseItem,
                          {
                            displayDirective: "show",
                            disabled:
                              DisabledItem.value[
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id))
                              ] ||
                              !hasProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id))
                              ) ||
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )?.length === 0,
                            title: t(field.key),
                            name:
                              (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id)),
                          },
                          {
                            "header-extra": () =>
                              h(
                                NButton,
                                {
                                  onmouseleave: () =>
                                    (DisabledItem.value[
                                      (path ?? "") +
                                        (absolutePath
                                          ? ""
                                          : getPath(schema.value, field.id))
                                    ] = false),
                                  size: "small",
                                  round: true,
                                  onClick: () => (
                                    (DisabledItem.value[
                                      (path ?? "") +
                                        (absolutePath
                                          ? ""
                                          : getPath(schema.value, field.id))
                                    ] = true),
                                    setTimeout(
                                      () =>
                                        (DisabledItem.value[
                                          path ??
                                            (absolutePath
                                              ? ""
                                              : getPath(schema.value, field.id))
                                        ] = false),
                                      1
                                    ),
                                    setProperty(
                                      modelValue.value,
                                      `${
                                        (path ?? "") +
                                        (absolutePath
                                          ? ""
                                          : getPath(schema.value, field.id))
                                      }[${
                                        getProperty(
                                          modelValue.value,
                                          (path ?? "") +
                                            (absolutePath
                                              ? ""
                                              : getPath(
                                                  schema.value,
                                                  field.id
                                                )),
                                          []
                                        )?.length ?? 0
                                      }]`,
                                      field.onCreate
                                        ? field.onCreate instanceof Function
                                          ? field.onCreate(
                                              getProperty(
                                                modelValue.value,
                                                (path ?? "") +
                                                  (absolutePath
                                                    ? ""
                                                    : getPath(
                                                        schema.value,
                                                        field.id
                                                      )),
                                                []
                                              )?.length ?? 0
                                            )
                                          : field.onCreate
                                        : {}
                                    )
                                  ),
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconPlus)),
                                }
                              ),
                            default: () =>
                              h(
                                NCollapse,
                                {
                                  displayDirective: "show",
                                  accordion: true,
                                },
                                () =>
                                  getProperty(
                                    modelValue.value,
                                    path ??
                                      (absolutePath
                                        ? ""
                                        : getPath(schema.value, field.id)),
                                    []
                                  )?.map((_item: any, index: number) =>
                                    h(
                                      NCollapseItem,
                                      {
                                        displayDirective: "show",
                                        title: t(field.key) + " " + index,
                                        name:
                                          (path ?? "") +
                                          (absolutePath
                                            ? ""
                                            : getPath(schema.value, field.id)) +
                                          `[${index}]`,
                                      },
                                      {
                                        "header-extra": () =>
                                          h(
                                            NButton,
                                            {
                                              disabled:
                                                field.disabledItems &&
                                                field.disabledItems.includes(
                                                  index
                                                ),
                                              quaternary: true,
                                              circle: true,
                                              type: "error",
                                              onClick: () =>
                                                deleteProperty(
                                                  modelValue.value,
                                                  (path ?? "") +
                                                    (absolutePath
                                                      ? ""
                                                      : getPath(
                                                          schema.value,
                                                          field.id
                                                        )) +
                                                    `[${index}]`
                                                ),
                                            },
                                            {
                                              icon: () =>
                                                h(NIcon, () => h(IconTrash)),
                                            }
                                          ),
                                        default: () =>
                                          (field.children as Schema).map(
                                            (child) =>
                                              RenderField(
                                                {
                                                  ...child,
                                                  ...(field.disabledItems
                                                    ? {
                                                        inputProps: {
                                                          disabled:
                                                            field.disabledItems &&
                                                            field.disabledItems.includes(
                                                              index
                                                            ),
                                                        },
                                                      }
                                                    : {}),
                                                },
                                                (path ?? "") +
                                                  (absolutePath
                                                    ? ""
                                                    : getPath(
                                                        schema.value,
                                                        field.id
                                                      )) +
                                                  `[${index}].${child.key}`,
                                                true
                                              )
                                          ),
                                      }
                                    )
                                  )
                              ),
                          }
                        ),
                    }
                  )
                : h(
                    NCard,
                    {
                      title: t(field.key),
                      bordered: false,
                      contentStyle: { paddingLeft: 0, paddingRight: 0 },
                      headerStyle: { paddingLeft: 0, paddingRight: 0 },
                    },
                    {
                      "header-extra": () =>
                        field.disableActions === true
                          ? null
                          : h(
                              NButton,
                              {
                                size: "small",
                                round: true,
                                onClick: () =>
                                  setProperty(
                                    modelValue.value,
                                    `${
                                      (path ?? "") +
                                      (absolutePath
                                        ? ""
                                        : getPath(schema.value, field.id))
                                    }[${
                                      getProperty(
                                        modelValue.value,
                                        (path ?? "") +
                                          (absolutePath
                                            ? ""
                                            : getPath(schema.value, field.id)),
                                        []
                                      )?.length ?? 0
                                    }]`,
                                    field.onCreate
                                      ? field.onCreate instanceof Function
                                        ? field.onCreate(
                                            getProperty(
                                              modelValue.value,
                                              (path ?? "") +
                                                (absolutePath
                                                  ? ""
                                                  : getPath(
                                                      schema.value,
                                                      field.id
                                                    )),
                                              []
                                            )?.length ?? 0
                                          )
                                        : field.onCreate
                                      : {}
                                  ),
                              },
                              {
                                icon: () => h(NIcon, () => h(IconPlus)),
                              }
                            ),
                      default: () =>
                        h(NDataTable, {
                          columns: [
                            ...(field.children as any).map((child: any) => ({
                              width:
                                t(child.key) && child.key.length > 10
                                  ? child.key.length * 15
                                  : 200,
                              title: () => [
                                t(child.key),
                                child.required
                                  ? h(
                                      NText,
                                      {
                                        type: "error",
                                      },
                                      () => " *"
                                    )
                                  : null,
                              ],
                              key:
                                (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id)) +
                                `.${child.key}`,
                              render: (_item: any, index: number) =>
                                RenderField(
                                  {
                                    ...child,
                                    ...(field.disabledItems &&
                                    field.disabledItems.includes(index)
                                      ? {
                                          inputProps: {
                                            disabled: true,
                                          },
                                        }
                                      : {}),
                                    labelProps: {
                                      showLabel: false,
                                    },
                                  },
                                  (path ?? "") +
                                    (absolutePath
                                      ? ""
                                      : getPath(schema.value, field.id)) +
                                    `[${index}].${child.key}`,
                                  true
                                ),
                            })),
                            field.disableActions === true
                              ? {}
                              : {
                                  title: t("actions"),
                                  fixed: "right",
                                  align: "center",
                                  width: 100,
                                  key: "actions",
                                  render(_row, index) {
                                    return h(
                                      NPopover,
                                      {},
                                      {
                                        trigger: () =>
                                          h(
                                            NButton,
                                            {
                                              disabled:
                                                field.disabledItems &&
                                                field.disabledItems.includes(
                                                  index
                                                ),
                                              strong: true,
                                              secondary: true,
                                              circle: true,
                                              type: "error",
                                              onClick: () =>
                                                deleteProperty(
                                                  modelValue.value,
                                                  (path ?? "") +
                                                    (absolutePath
                                                      ? ""
                                                      : getPath(
                                                          schema.value,
                                                          field.id
                                                        )) +
                                                    `[${index}]`
                                                ),
                                            },
                                            {
                                              icon: () =>
                                                h(NIcon, () => h(IconTrash)),
                                            }
                                          ),
                                        default: () => t("delete"),
                                      }
                                    );
                                  },
                                },
                          ],
                          data: getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          ),
                          scrollX: (field.children as Schema).reduce(
                            (accumulator: number, child: any) => {
                              return (
                                accumulator +
                                (t(child.key) && child.key.length > 10
                                  ? child.key.length * 15
                                  : 200)
                              );
                            },
                            100
                          ),
                        }),
                    }
                  );
          case "table":
            return h(
              NFormItem,
              {
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: field.single === true ? "object" : "array",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              {
                label: () =>
                  h(NSpace, {}, () => [
                    t(field.key),
                    field.single === true &&
                    hasProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)) +
                        ".id"
                    )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => {
                              Drawer.value.table = field.key;
                              Drawer.value.id = getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)) +
                                  ".id"
                              );
                              Drawer.value.data = getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id))
                              );
                              Drawer.value.show = true;
                            },
                          },
                          { icon: () => h(NIcon, () => h(IconPencil)) }
                        )
                      : null,
                    user.value.role === "admin" ||
                    database.value.tables
                      ?.find(({ slug }) => slug === field.key)
                      ?.allowed_methods?.find(
                        (method: any) =>
                          method.role === user.value.role &&
                          method.methods.includes("c")
                      )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => (
                              (Drawer.value.table = field.key),
                              (Drawer.value.show = true)
                            ),
                          },
                          { icon: () => h(NIcon, () => h(IconPlus)) }
                        )
                      : null,
                  ]),
                default: () =>
                  h(NSelect, {
                    value: hasProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    )
                      ? field.single === true
                        ? []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              ) ?? []
                            )
                            .map((i: any) => i.id)[0]
                        : []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              ) ?? []
                            )
                            .map((i: any) => i.id)
                      : null,
                    onUpdateValue: (_value, option: any) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        Array.isArray(option)
                          ? option.map((i: any) => i.raw)
                          : option.raw
                      ),
                    options: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    )
                      ? deepMerge(
                          []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              ) ?? []
                            )
                            .map((single_value: any) => ({
                              label: field.label
                                ?.map((single_label: any) =>
                                  t(
                                    getProperty(single_value, single_label) ??
                                      ""
                                  )
                                )
                                .join(" "),
                              value: single_value.id,
                              image: field.image
                                ? getProperty(single_value, field.image, null)
                                : null,
                              raw: single_value,
                            })),
                          OPTIONS.value ? OPTIONS.value[field.key] ?? [] : []
                        )
                      : OPTIONS.value
                      ? OPTIONS.value[field.key]
                      : [],
                    remote: true,
                    clearable: true,
                    filterable: true,
                    loading: Loading.value[`options_${field.key}`],
                    multiple: field.single === false,
                    renderLabel: field.image
                      ? (option: any) =>
                          h(
                            "div",
                            {
                              style: {
                                padding: "5px",
                                display: "flex",
                                alignItems: "center",
                              },
                            },
                            [
                              h(NAvatar, {
                                src: []
                                  .concat(option.image)
                                  .map((link: string) =>
                                    link.includes("cdn.inicontent") &&
                                    [
                                      "png",
                                      "jpg",
                                      "jpeg",
                                      "ico",
                                      "webp",
                                      "svg",
                                      "gif",
                                    ].includes(link?.split(".")?.pop() ?? "")
                                      ? `${link}?fit=80`
                                      : link
                                  )[0],
                                round: true,
                                size: "large",
                                style:
                                  Language.value === "ar"
                                    ? {
                                        marginLeft: "12px",
                                      }
                                    : {
                                        marginRight: "12px",
                                      },
                              }),
                              option.label,
                            ]
                          )
                      : undefined,
                    renderTag: ({
                      option,
                      handleClose,
                    }: {
                      option: any;
                      handleClose: () => void;
                    }) =>
                      field.image
                        ? field.single === true
                          ? h(
                              "div",
                              {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                },
                              },
                              () => [
                                h(NAvatar, {
                                  src: ([] as string[])
                                    .concat(option.image)
                                    .map((link) =>
                                      link.includes("cdn.inicontent") &&
                                      [
                                        "png",
                                        "jpg",
                                        "jpeg",
                                        "ico",
                                        "webp",
                                        "svg",
                                        "gif",
                                      ].includes(link?.split(".")?.pop() ?? "")
                                        ? `${link}?fit=24`
                                        : link
                                    )[0],
                                  round: true,
                                  size: 24,
                                  style:
                                    Language.value === "ar"
                                      ? {
                                          marginLeft: "12px",
                                        }
                                      : {
                                          marginRight: "12px",
                                        },
                                }),
                                option.label,
                              ]
                            )
                          : h(
                              NTag,
                              {
                                style: {
                                  padding: "0 6px 0 4px",
                                },
                                round: true,
                                closable: true,
                                onClose: (e) => {
                                  e.stopPropagation();
                                  handleClose();
                                },
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
                                    () => [
                                      h(NAvatar, {
                                        src: []
                                          .concat(option.image as any)
                                          .map((link: string) =>
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
                                              link?.split(".")?.pop() ?? ""
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
                                      }),
                                      option.label,
                                    ]
                                  ),
                              }
                            )
                        : undefined,
                    onSearch: async (v) => {
                      if (v.length > 3) {
                        Loading.value[`options_${field.key}`] = true;
                        OPTIONS.value[field.key] = (
                          await useFetch<apiResponse>(
                            `${useRuntimeConfig().public.apiBase}${
                              route.params.database ?? "inicontent"
                            }/${field.key}`,
                            {
                              params: {
                                _where: JSON.stringify(
                                  field.search
                                    ?.flatMap((search: any) => [
                                      [search, "like", v],
                                      "OR",
                                    ])
                                    .slice(0, -1)
                                ),
                              },
                              transform: (res) =>
                                res.result
                                  ? res.result.map((single_result: any) => ({
                                      label: field.label
                                        ?.map((single_label: any) =>
                                          t(
                                            getProperty(
                                              single_result,
                                              single_label
                                            ) ?? ""
                                          )
                                        )
                                        .join(" "),
                                      value: single_result.id,
                                      image: field.image
                                        ? Array.isArray(
                                            getProperty(
                                              single_result,
                                              field.image
                                            )
                                          )
                                          ? getProperty(
                                              single_result,
                                              `${field.image}[0]`
                                            )
                                          : getProperty(
                                              single_result,
                                              field.image
                                            )
                                        : null,
                                      raw: single_result,
                                    }))
                                  : [],
                            }
                          )
                        ).data.value;
                        Loading.value[`options_${field.key}`] = false;
                      }
                    },
                  }),
              }
            );
          case "upload":
            return h(
              NFormItem,
              {
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule:
                  field.single === true
                    ? {
                        required: field.required,
                        trigger: "change",
                        message: "This field is required",
                      }
                    : {
                        type: "array",
                        required: field.required,
                        trigger: "change",
                        message: "This field is required",
                      },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              {
                label: () =>
                  h(
                    NSpace,
                    {
                      inline: true,
                      align: "center",
                    },
                    () => [
                      t(field.key),
                      h(
                        NPopover,
                        {
                          trigger: "hover",
                        },
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                circle: true,
                                strong: true,
                                secondary: true,
                                size: "tiny",
                              },
                              { icon: () => h(NIcon, () => h(IconLink)) }
                            ),
                          default: () =>
                            h(
                              NInput,
                              {
                                inputProps: { type: "url" },
                                onUpdateValue: (value) =>
                                  field.single === true
                                    ? setProperty(
                                        modelValue.value,
                                        (path ?? "") +
                                          (absolutePath
                                            ? ""
                                            : getPath(schema.value, field.id)),
                                        value
                                      )
                                    : setProperty(
                                        modelValue.value,
                                        `${
                                          (path ?? "") +
                                          (absolutePath
                                            ? ""
                                            : getPath(schema.value, field.id))
                                        }[${
                                          (getProperty(
                                            modelValue.value,
                                            (path ?? "") +
                                              (absolutePath
                                                ? ""
                                                : getPath(
                                                    schema.value,
                                                    field.id
                                                  )),
                                            []
                                          )?.length ?? 0) + 1
                                        }]`,
                                        value
                                      ),
                                placeholder: "Link",
                                clearable: true,
                              },
                              {
                                suffix: () => h(NIcon, () => h(IconLink)),
                              }
                            ),
                        }
                      ),
                      h(
                        NButton,
                        {
                          circle: true,
                          strong: true,
                          secondary: true,
                          size: "tiny",
                          onClick: () => (
                            (CurrentField.value = {
                              path:
                                (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id)),
                              field,
                            }),
                            (Showassets.value = true)
                          ),
                        },
                        { icon: () => h(NIcon, () => h(IconBooks)) }
                      ),
                    ]
                  ),
                default: () =>
                  h(
                    NUpload,
                    {
                      directoryDnd: true,
                      "on-update:file-list": (files: any) =>
                        files.map((file: any) => file.url ?? file)[0]
                          ? setProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id)),
                              field.single === true
                                ? files.map((file: any) => file.url ?? file)[0]
                                : files.map((file: any) => file.url ?? file)
                            )
                          : deleteProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            ),
                      max: field.single === true ? 1 : undefined,
                      multiple: field.single === false,
                      accept: field.accept ? field.accept.join(",") : "*",
                      action: `${useRuntimeConfig().public.apiBase}${
                        database.value.slug ?? "inicontent"
                      }/asset`,
                      fileList: hasProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id))
                      )
                        ? ([]
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (absolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              ) ?? []
                            )
                            .map((src: string | object) =>
                              typeof src === "object"
                                ? src
                                : {
                                    id: src
                                      .split("/")
                                      .pop()
                                      ?.split("#")[0]
                                      ?.split("?")[0],
                                    name: src
                                      .split("/")
                                      .pop()
                                      ?.split("#")[0]
                                      ?.split("?")[0],
                                    status: "finished",
                                    url: src,
                                    thumbnailUrl:
                                      src.includes("cdn.inicontent") &&
                                      [
                                        "png",
                                        "jpg",
                                        "jpeg",
                                        "ico",
                                        "webp",
                                        "svg",
                                        "gif",
                                      ].includes(src?.split(".")?.pop() ?? "")
                                        ? `${src}?fit=94`
                                        : null,
                                  }
                            ) as any)
                        : undefined,
                      onFinish: ({ file, event }: any) => {
                        if (event && event.target && event.target.response) {
                          const response = JSON.parse(
                            event.target.response
                          ).result;
                          file.url = response.publicURL;
                          file.name = response.name;
                          return file;
                        } else return file;
                      },
                      onPreview: ({ url }) =>
                        url && field.single === false
                          ? window.open(url, "blank")?.focus() ?? undefined
                          : undefined,
                      listType:
                        field.single === true && field.isTable !== true
                          ? "image"
                          : "image-card",
                    },
                    () =>
                      field.single === true && field.isTable !== true
                        ? h(NUploadDragger, () => [
                            h(
                              "div",
                              {
                                style: {
                                  marginBottom: "12px",
                                },
                              },
                              h(NIcon, { size: 48, depth: 3 }, () =>
                                h(IconUpload)
                              )
                            ),
                            h(
                              NText,
                              { style: { "font-size": "16px" } },
                              () =>
                                "Click or drag a file to this area to upload"
                            ),
                          ])
                        : null
                  ),
              }
            );
          case "color":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: "change",
                  message: "This field is required",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NColorPicker, {
                  modes: ["hex"],
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          )
                        ) ?? {}
                      : field.inputProps
                    : {}),
                })
            );
          case "url":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  validator(_rule, value) {
                    if (!value)
                      return field.required
                        ? new Error("This field is required")
                        : true;
                    if (!isURL(value))
                      return new Error("Please type a valid link");
                  },
                  trigger: "change",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "url" },
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "email":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: "email",
                  required: field.required,
                  trigger: "change",
                  validator(_rule, value) {
                    if (!value)
                      return field.required
                        ? new Error("This field is required")
                        : true;
                    if (!isEmail(value))
                      return new Error("Please type a valid email");
                  },
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NAutoComplete,
                  {
                    inputProps: { type: "email", autocomplete: "disabled" },
                    options: [
                      "@gmail.com",
                      "@outlook.com",
                      "@hotmail.com",
                      "@qq.com",
                    ].map((suffix) => {
                      const prefix =
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id)),
                          ""
                        )?.split("@")[0] ?? "";
                      return {
                        label: prefix + suffix,
                        value: prefix + suffix,
                      };
                    }),
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "date":
            if (
              !hasProperty(
                modelValue.value,
                (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id))
              ) &&
              field.required
            )
              setProperty(
                modelValue.value,
                (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                Date.now()
              );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: "number",
                  required: field.required,
                  trigger: ["blur", "change"],
                  message: "Please select a valid date",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NDatePicker, {
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  )
                    ? Number(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      )
                    : null,
                  onConfirm: (e: number) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      e
                    ),
                  type: "datetime",
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          )
                        ) ?? {}
                      : field.inputProps
                    : {}),
                })
            );
          case "html":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                  message: "Please write something",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(LazyRichEditor, {
                  modelValue: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  "onUpdate:modelValue.value": (v: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      v
                    ),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          )
                        ) ?? {}
                      : field.inputProps
                    : {}),
                })
            );
          case "number":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: "number",
                  required: field.required,
                  trigger: ["blur", "change"],
                  validator: (_rule, value) =>
                    field.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NInputNumber,
                  {
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value
                      ),
                    placeholder: t(field.key),
                    showButton: false,
                    clearable: true,
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(
                          ({ key }) => key === (field.subType ?? field.type)
                        )
                        ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                  }
                )
            );
          case "password":
            const alreadyRun = useState("alreadyRun", () => false);

            if (
              !alreadyRun.value &&
              getProperty(
                modelValue.value,
                (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id))
              ) !== undefined
            ) {
              alreadyRun.value = true;
              setProperty(
                modelValue.value,
                (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                undefined
              );
            }
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required:
                    !getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ) && field.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    !getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ) &&
                    field.required &&
                    !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NInput, {
                  type: "password",
                  showPasswordOn: "click",
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  placeholder: t(field.key),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          )
                        ) ?? {}
                      : field.inputProps
                    : {}),
                })
            );
          case "boolean":
            return h(
              NFormItem,
              {
                labelPlacement: "left",
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NSwitch, {
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                })
            );
          case "select":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: field.single === false ? "array" : "any",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NSelect, {
                  value: getProperty(
                    modelValue.value,
                    (path ?? "") +
                      (absolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  options: field.values?.map((value: any) => ({
                    value: value,
                    label: t(value),
                  })),
                  filterable: true,
                  multiple: field.single === false,
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          )
                        ) ?? {}
                      : field.inputProps
                    : {}),
                })
            );
          case "checkbox":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: "array",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(
                  NCheckboxGroup,
                  {
                    value: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (absolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (absolutePath ? "" : getPath(schema.value, field.id)),
                        value
                      ),
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (absolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  () =>
                    h(
                      NSpace,
                      {
                        "item-style": "display: flex",
                        align: "center",
                      },
                      () =>
                        field.values?.map((value: any) =>
                          h(NCheckbox, {
                            value: value,
                            label: t(value),
                          })
                        )
                    )
                )
            );
          case "tags":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id)),
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
                rule: {
                  type: "array",
                  required: field.required,
                  trigger: ["change"],
                  validator(_rule, values) {
                    if (!Array.isArray(values) || values.length === 0)
                      return field.required && !field.defaultValue
                        ? new Error("This field is required")
                        : true;

                    for (const value of values)
                      if (
                        !validateFieldType(
                          value,
                          field.children as FieldType | FieldType[]
                        )
                      )
                        return new Error(
                          "Please type a valid " +
                            (Array.isArray(field.children)
                              ? field.children.join("| ")
                              : field.children)
                        );
                    return true;
                  },
                },
              },
              () =>
                h(NSpace, () => [
                  field.defaultValue
                    ? h(NSpace, () =>
                        field.defaultValue.map((v) =>
                          h(NTag, { disabled: true }, () => t(v))
                        )
                      )
                    : null,
                  h(
                    NDynamicTags,
                    {
                      inputProps: {
                        placeholder: Array.isArray(field.children)
                          ? (field.children as string[])
                              .map(
                                (child: string) =>
                                  ({
                                    url: "https://example.com",
                                    email: "example@example.com",
                                    number: "123456",
                                  }[child] ?? "example")
                              )
                              .join(" ")
                          : {
                              url: "https://example.com",
                              email: "example@example.com",
                              number: "123456",
                            }[field.children as string] ?? "Type here",
                      },
                      value: field.defaultValue
                        ? getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          ).filter((v: any) => !field.defaultValue.includes(v))
                        : getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (absolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          ),
                      onUpdateValue: (value: any) =>
                        setProperty(
                          modelValue.value,
                          (path ?? "") +
                            (absolutePath
                              ? ""
                              : getPath(schema.value, field.id)),
                          [...value, ...field.defaultValue]
                        ),
                    },
                    {
                      trigger: ({ activate, disabled }: any) =>
                        h(
                          NButton,
                          {
                            size: "small",
                            type: "primary",
                            dashed: true,
                            disabled: disabled,
                            onClick: activate,
                          },
                          {
                            icon: () => h(NIcon, () => h(IconPlus)),
                          }
                        ),
                    }
                  ),
                ])
            );

          default:
            console.log(
              "no field:",
              getProperty(
                modelValue.value,
                (path ?? "") +
                  (absolutePath ? "" : getPath(schema.value, field.id))
              ),
              field.type
            );
            return null;
        }
      };
    watch(Showassets, async (v) => {
      assets.value = null;
      if (v)
        assets.value = (
          await $fetch<apiResponse<Asset[]>>(
            `${useRuntimeConfig().public.apiBase}${
              route.params.database ?? "inicontent"
            }/asset`
          )
        ).result;
    });

    return () => [
      h(
        NDrawer,
        {
          show: Drawer.value.show,
          "on-update:show": (v: boolean) => (Drawer.value.show = v),
          resizable: true,
          placement: Language.value === "ar" ? "left" : "right",
        },
        () =>
          h(
            NDrawerContent,
            {
              title: Drawer.value.id
                ? `${t(Drawer.value.table)} | ${Drawer.value.id}`
                : `${t("new")} ${t(Drawer.value.table)}`,
              closable: true,
              nativeScrollbar: false,
            },
            {
              footer: () =>
                h(
                  NButton,
                  {
                    round: true,
                    secondary: true,
                    type: "primary",
                    onClick: Drawer.value.id ? UpdateDrawer : CreateDrawer,
                    loading: Loading.value["Drawer"],
                  },
                  {
                    icon: () => h(NIcon, () => h(IconDeviceFloppy)),
                    default: () => (Drawer.value.id ? "UPDATE" : "CREATE"),
                  }
                ),
              default: () =>
                h(
                  NForm,
                  {
                    ref: DrawerFormRef as any,
                    model: Drawer.value.data as any,
                  },
                  () =>
                    h(LazyRenderFields, {
                      modelValue: Drawer.value.data,
                      schema:
                        database.value.tables?.find(
                          (item: any) => item.slug === Drawer.value.table
                        )?.schema ?? ([] as any),
                    })
                ),
            }
          )
      ),
      ...schema.value.map((item) => RenderField(item)),
      h(
        NDrawer,
        {
          show: Showassets.value,
          "on-update:show": (v: boolean) => (Showassets.value = v),
          defaultHeight: "50%",
          placement: "bottom",
          resizable: true,
        },
        () =>
          h(
            NDrawerContent,
            {
              id: "assets_modal",
              nativeScrollbar: false,
              closable: true,
              title: t("assets"),
            },
            () =>
              h(
                LazyAssetGrid,
                {
                  modelValue: assets.value,
                  targetID: "assets_modal",
                },
                (asset: Asset) =>
                  h(NRadio, {
                    style: {
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      zIndex: 9,
                    },
                    checked: []
                      .concat(
                        getProperty(
                          modelValue.value,
                          CurrentField.value.path,
                          []
                        ) as any
                      )
                      .includes((asset?.publicURL ?? "") as never),
                    onUpdateChecked: () => HandleSelectassets(asset.publicURL),
                  })
              )
          )
      ),
    ];
  },
});
