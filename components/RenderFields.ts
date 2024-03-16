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
  NRadioGroup,
  NRadio,
  NCheckbox,
  NCheckboxGroup,
  NDrawer,
  NDrawerContent,
  NSelect,
  NAvatar,
  NTag,
  NCard,
  NDataTable,
  NDynamicTags,
  useMessage,
  NColorPicker,
  NAutoComplete,
  NTooltip,
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
} from "@tabler/icons-vue";
import {
  isArrayOfObjects,
  isURL,
  isEmail,
  validateFieldType,
  deepMerge,
} from "inibase/utils";
import { LazyRichEditor, LazyRenderFields, LazyAssetCard } from "#components";
import type { FieldType } from "inibase";
import { getProperty, setProperty, deleteProperty, hasProperty } from "inidot";
import Inison from "inison";

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
      en: {},
    });
    const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
    Loading.value["Drawer"] = false;
    const modelValue = toRef(props, "modelValue"),
      message = useMessage(),
      database = useState<Database>("database"),
      schema = toRef(props, "schema"),
      route = useRoute(),
      OPTIONS = ref<any>({}),
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
            const data = await $fetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}${
                route.params.database ?? "inicontent"
              }/${Drawer.value.table}/${Drawer.value.id}`,
              {
                method: "PUT",
                body: Drawer.value.data,
              }
            );
            if (!data.result) return message.error(t("error"));

            if (data.result && data.result.id) {
              message.success(data.message);
              Loading.value["Drawer"] = false;
              Drawer.value.show = false;
              Drawer.value.data = {};
            } else message.error(data.message);
            Loading.value["Drawer"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      CreateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["Drawer"] = true;
            const data = await $fetch<apiResponse>(
              `${useRuntimeConfig().public.apiBase}${
                route.params.database ?? "inicontent"
              }/${Drawer.value.table}`,
              {
                method: "POST",
                body: Drawer.value.data,
              }
            );
            if (!data.result) return message.error(t("error"));

            if (data.result && data.result.id) {
              message.success(data.message);
              Loading.value["Drawer"] = false;
              Drawer.value.show = false;
              Drawer.value.data = {};
            } else message.error(data.message);
            Loading.value["Drawer"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      CurrentField: any = ref(null),
      showAssetsModal = ref(false),
      handleSelectAssets = (url?: string) => {
        if (!url) return;
        const currentFieldValue = getProperty(
          modelValue.value,
          CurrentField.value.path
        );

        if (!CurrentField.value.isArray) {
          if (currentFieldValue === url)
            deleteProperty(modelValue.value, CurrentField.value.path);
          else setProperty(modelValue.value, CurrentField.value.path, url);
        } else {
          if (currentFieldValue) {
            if (Array.isArray(currentFieldValue)) {
              if (currentFieldValue.includes(url))
                deleteProperty(
                  modelValue.value,
                  `${CurrentField.value.path}.${currentFieldValue.indexOf(url)}`
                );
              else
                setProperty(
                  modelValue.value,
                  `${CurrentField.value.path}.${currentFieldValue.length}`,
                  url
                );
            } else {
              if (currentFieldValue === url)
                deleteProperty(modelValue.value, `${CurrentField.value.path}`);
              else
                setProperty(modelValue.value, `${CurrentField.value.path}`, [
                  url,
                ]);
            }
          } else
            setProperty(modelValue.value, `${CurrentField.value.path}`, [url]);
        }
      },
      RenderField = (
        field: Field,
        path?: string,
        isAbsolutePath?: boolean
      ): any => {
        if (
          field.defaultValue &&
          !hasProperty(
            modelValue.value,
            (path ?? "") +
              (isAbsolutePath ? "" : getPath(schema.value, field.id))
          )
        )
          setProperty(
            modelValue.value,
            (path ?? "") +
              (isAbsolutePath ? "" : getPath(schema.value, field.id)),
            field.defaultValue
          );

        if (
          field.subType &&
          ((Array.isArray(field.type) && field.type.includes("array")) ||
            (typeof field.type === "string" && field.type === "array"))
        )
          field.isArray = true;

        let deletectedFieldType = field.subType ?? field.type;
        if (
          Array.isArray(deletectedFieldType) &&
          hasProperty(
            modelValue.value,
            (path ?? "") +
              (isAbsolutePath ? "" : getPath(schema.value, field.id))
          )
        )
          deletectedFieldType = getField(
            field.subType ?? field.type,
            getProperty(
              modelValue.value,
              (path ?? "") +
                (isAbsolutePath ? "" : getPath(schema.value, field.id))
            )
          ).key;
        switch (deletectedFieldType) {
          case "string":
            return RenderField(
              {
                ...field,
                type: "text",
              },
              path,
              isAbsolutePath
            );
          case "role":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  options:
                    database.value.roles?.map(({ name, id }) => ({
                      label: t(name),
                      value: id,
                    })) ?? [],
                })
            );
          case "id":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      ""
                    )?.toString(),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        value
                      ),
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (isAbsolutePath
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
              NCollapse,
              {
                displayDirective: "show",
                style: {
                  margin: "0 0 20px",
                },
                arrowPlacement: "right",
                triggerAreas: ["main", "arrow"],
                accordion: true,
              },
              () =>
                h(
                  NCollapseItem,
                  {
                    title: t(field.key),
                    name:
                      (path ?? "") +
                      (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                  },
                  () =>
                    h(
                      "div",
                      {
                        style: {
                          padding: "0 0 0 10px",
                        },
                      },
                      (field.children as Schema).map((child: any) =>
                        RenderField(child, path, isAbsolutePath)
                      )
                    )
                )
            );
          case "array":
            if (!field.children) throw new Error("no children");
            if (field.subType)
              return RenderField(
                {
                  ...field,
                  type: field.subType,
                  isArray: true,
                } as Field,
                path,
                isAbsolutePath
              );
            else if (!isArrayOfObjects(field.children))
              return RenderField(
                {
                  ...field,
                  type: "tags",
                  isArray: true,
                } as Field,
                path,
                isAbsolutePath
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
                        margin: "0 0 20px",
                      },
                      arrowPlacement: "right",
                      triggerAreas: ["main", "arrow"],
                      accordion: true,
                    },
                    {
                      arrow: () =>
                        !hasProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        ) ||
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
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
                              !hasProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id))
                              ) ||
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )?.length === 0,
                            title: t(field.key),
                            name:
                              (path ?? "") +
                              (isAbsolutePath
                                ? ""
                                : getPath(schema.value, field.id)),
                          },
                          {
                            "header-extra": () =>
                              h(
                                NButton,
                                {
                                  size: "small",
                                  round: true,
                                  onClick: () =>
                                    setProperty(
                                      modelValue.value,
                                      `${
                                        (path ?? "") +
                                        (isAbsolutePath
                                          ? ""
                                          : getPath(schema.value, field.id))
                                      }.${
                                        getProperty(
                                          modelValue.value,
                                          (path ?? "") +
                                            (isAbsolutePath
                                              ? ""
                                              : getPath(
                                                  schema.value,
                                                  field.id
                                                )),
                                          []
                                        )?.length ?? 0
                                      }`,
                                      field.onCreate
                                        ? field.onCreate instanceof Function
                                          ? field.onCreate(
                                              getProperty(
                                                modelValue.value,
                                                (path ?? "") +
                                                  (isAbsolutePath
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
                                      (isAbsolutePath
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
                                          (isAbsolutePath
                                            ? ""
                                            : getPath(schema.value, field.id)) +
                                          `.${index}`,
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
                                                    (isAbsolutePath
                                                      ? ""
                                                      : getPath(
                                                          schema.value,
                                                          field.id
                                                        )) +
                                                    `.${index}`
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
                                                  (isAbsolutePath
                                                    ? ""
                                                    : getPath(
                                                        schema.value,
                                                        field.id
                                                      )) +
                                                  `.${index}.${child.key}`,
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
                      contentStyle: {
                        paddingLeft: 0,
                        paddingRight: 0,
                      },
                      headerStyle: {
                        paddingTop: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                      },
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
                                onClick() {
                                  const currentFieldValue = getProperty(
                                    modelValue.value,
                                    (path ?? "") +
                                      (isAbsolutePath
                                        ? ""
                                        : getPath(schema.value, field.id))
                                  );
                                  if (currentFieldValue)
                                    if (Array.isArray(currentFieldValue))
                                      setProperty(
                                        modelValue.value,
                                        `${
                                          (path ?? "") +
                                          (isAbsolutePath
                                            ? ""
                                            : getPath(schema.value, field.id))
                                        }.${currentFieldValue.length}`,
                                        field.onCreate
                                          ? field.onCreate instanceof Function
                                            ? field.onCreate(
                                                currentFieldValue.length
                                              )
                                            : field.onCreate
                                          : {}
                                      );
                                    else
                                      setProperty(
                                        modelValue.value,
                                        `${
                                          (path ?? "") +
                                          (isAbsolutePath
                                            ? ""
                                            : getPath(schema.value, field.id))
                                        }`,
                                        [
                                          field.onCreate
                                            ? field.onCreate instanceof Function
                                              ? field.onCreate(0)
                                              : field.onCreate
                                            : {},
                                        ]
                                      );
                                  else
                                    setProperty(
                                      modelValue.value,
                                      `${
                                        (path ?? "") +
                                        (isAbsolutePath
                                          ? ""
                                          : getPath(schema.value, field.id))
                                      }`,
                                      [
                                        field.onCreate
                                          ? field.onCreate instanceof Function
                                            ? field.onCreate(0)
                                            : field.onCreate
                                          : {},
                                      ]
                                    );
                                },
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
                                (isAbsolutePath
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
                                      style: {
                                        marginTop: "24px",
                                      },
                                      showLabel: false,
                                    },
                                    isArray: true,
                                    isTable: true,
                                  },
                                  (path ?? "") +
                                    (isAbsolutePath
                                      ? ""
                                      : getPath(schema.value, field.id)) +
                                    `.${index}.${child.key}`,
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
                                                    (isAbsolutePath
                                                      ? ""
                                                      : getPath(
                                                          schema.value,
                                                          field.id
                                                        )) +
                                                    `.${index}`
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
                              (isAbsolutePath
                                ? ""
                                : getPath(schema.value, field.id)),
                            []
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: !field.isArray ? "object" : "array",
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
                            (isAbsolutePath
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
                    !field.isArray &&
                    hasProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath
                          ? ""
                          : getPath(schema.value, field.id)) +
                        ".id"
                    )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => {
                              Drawer.value.table = field.table;
                              Drawer.value.id = getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)) +
                                  ".id"
                              );
                              Drawer.value.data = getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id))
                              );
                              Drawer.value.show = true;
                            },
                          },
                          { icon: () => h(NIcon, () => h(IconPencil)) }
                        )
                      : null,
                    database.value.tables
                      ?.find(({ slug }) => slug === field.table)
                      ?.allowedMethods?.includes("c")
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => (
                              (Drawer.value.table = field.table),
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    )
                      ? !field.isArray
                        ? []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )
                            )
                            .map((i: any) => i.id)[0]
                        : []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )
                            )
                            .map((i: any) => i.id)
                      : null,
                    onUpdateValue: (_value, option: any) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        Array.isArray(option)
                          ? option.map((i: any) => i.raw)
                          : option.raw
                      ),
                    options: getProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    )
                      ? deepMerge(
                          []
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )
                            )
                            .map((single_value: any) => ({
                              label: renderLabel(
                                database.value.tables?.find(
                                  ({ slug }) => slug === field.table
                                )?.label,
                                database.value.tables?.find(
                                  ({ slug }) => slug === field.table
                                )?.schema,
                                single_value
                              ),
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
                    multiple: !!field.isArray,
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
                                    link.includes("inicontent") &&
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
                        ? !field.isArray
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
                                      link.includes("inicontent") &&
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
                                            link.includes("inicontent") &&
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
                        : option.label,
                    onSearch: async (v) => {
                      if (v.length > 3) {
                        Loading.value[`options_${field.key}`] = true;
                        OPTIONS.value[field.key] =
                          (
                            await $fetch<apiResponse>(
                              `${useRuntimeConfig().public.apiBase}${
                                route.params.database ?? "inicontent"
                              }/${field.table}`,
                              {
                                params: {
                                  where: Inison.stringify({
                                    or:
                                      field.searchIn?.reduce(
                                        (result, searchKey) => {
                                          Object.assign(result, {
                                            [searchKey]: `*%${v}%`,
                                          });
                                          return result;
                                        },
                                        {}
                                      ) ?? "",
                                  }),
                                },
                              }
                            )
                          ).result?.map((single_result: any) => ({
                            label: renderLabel(
                              database.value.tables?.find(
                                ({ slug }) => slug === field.table
                              )?.label,
                              database.value.tables?.find(
                                ({ slug }) => slug === field.table
                              )?.schema,
                              single_result
                            ),
                            value: single_result.id,
                            image: field.image
                              ? Array.isArray(
                                  getProperty(single_result, field.image)
                                )
                                ? getProperty(
                                    single_result,
                                    `${field.image}[0]`
                                  )
                                : getProperty(single_result, field.image)
                              : null,
                            raw: single_result,
                          })) ?? [];
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                rule: !field.isArray
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
                            (isAbsolutePath
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
                                onUpdateValue: (url) => (
                                  (CurrentField.value = {
                                    path:
                                      (path ?? "") +
                                      (isAbsolutePath
                                        ? ""
                                        : getPath(schema.value, field.id)),
                                    ...field,
                                  }),
                                  handleSelectAssets(url)
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
                        NTooltip,
                        {},
                        {
                          trigger: () =>
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
                                      (isAbsolutePath
                                        ? ""
                                        : getPath(schema.value, field.id)),
                                    ...field,
                                  }),
                                  (showAssetsModal.value = true)
                                ),
                              },
                              { icon: () => h(NIcon, () => h(IconBooks)) }
                            ),
                          default: () => t("gallery"),
                        }
                      ),
                    ]
                  ),
                default: () =>
                  h(
                    NUpload,
                    {
                      directoryDnd: true,
                      onUpdateFileList: (files) =>
                        files.every((file) => !file)
                          ? deleteProperty(
                              modelValue.value,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          : setProperty(
                              modelValue.value,
                              (path ?? "") +
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id)),
                              !field.isArray
                                ? files
                                    .filter((file) => file)
                                    .map((file) => file.url)[0]
                                : files
                                    .filter((file) => file)
                                    .map((file) => file.url)
                            ),
                      max: !field.isArray ? 1 : undefined,
                      multiple: !!field.isArray,
                      accept: field.accept
                        ? generateAcceptedFileType(field.accept)
                        : undefined,
                      action: `${useRuntimeConfig().public.apiBase}${
                        database.value.slug ?? "inicontent"
                      }/asset`,
                      fileList: hasProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id))
                      )
                        ? ([]
                            .concat(
                              getProperty(
                                modelValue.value,
                                (path ?? "") +
                                  (isAbsolutePath
                                    ? ""
                                    : getPath(schema.value, field.id)),
                                []
                              )
                            )
                            .filter((src) => src)
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
                                      src.includes("inicontent") &&
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
                        url && !!field.isArray
                          ? window.open(url, "blank")?.focus() ?? undefined
                          : undefined,
                      listType: !field.isTable ? "image" : "image-card",
                    },
                    () =>
                      !field.isTable
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
                        : h(
                            NSpace,
                            {
                              inline: true,
                              align: "center",
                              size: "small",
                            },
                            () => [
                              h(
                                NButton,
                                {
                                  circle: true,
                                  strong: true,
                                  secondary: true,
                                  size: "tiny",
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconPlus)),
                                }
                              ),
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
                                        onClick: (e) => (
                                          e.preventDefault(),
                                          e.stopPropagation()
                                        ),
                                      },
                                      {
                                        icon: () => h(NIcon, () => h(IconLink)),
                                      }
                                    ),
                                  default: () =>
                                    h(
                                      NInput,
                                      {
                                        inputProps: { type: "url" },
                                        onUpdateValue: (url) => (
                                          (CurrentField.value = {
                                            path:
                                              (path ?? "") +
                                              (isAbsolutePath
                                                ? ""
                                                : getPath(
                                                    schema.value,
                                                    field.id
                                                  )),
                                            ...field,
                                          }),
                                          handleSelectAssets(url)
                                        ),
                                        placeholder: "Link",
                                        clearable: true,
                                      },
                                      {
                                        suffix: () =>
                                          h(NIcon, () => h(IconLink)),
                                      }
                                    ),
                                }
                              ),
                              h(
                                NTooltip,
                                {},
                                {
                                  trigger: () =>
                                    h(
                                      NButton,
                                      {
                                        circle: true,
                                        strong: true,
                                        secondary: true,
                                        size: "tiny",
                                        onClick: (e) => (
                                          (e.preventDefault(),
                                          e.stopPropagation(),
                                          (CurrentField.value = {
                                            path:
                                              (path ?? "") +
                                              (isAbsolutePath
                                                ? ""
                                                : getPath(
                                                    schema.value,
                                                    field.id
                                                  )),
                                            ...field,
                                          })),
                                          (showAssetsModal.value = true)
                                        ),
                                      },
                                      {
                                        icon: () =>
                                          h(NIcon, () => h(IconBooks)),
                                      }
                                    ),
                                  default: () => t("gallery"),
                                }
                              ),
                            ]
                          )
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
                  }
                )
            );
          case "date":
            if (
              !hasProperty(
                modelValue.value,
                (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id))
              ) &&
              field.required
            )
              setProperty(
                modelValue.value,
                (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                Date.now()
              );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  )
                    ? Number(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      )
                    : null,
                  onConfirm: (e: number) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      e
                    ),
                  type: "datetime",
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  "onUpdate:modelValue.value": (v: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      v
                    ),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
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
                                (isAbsolutePath
                                  ? ""
                                  : getPath(schema.value, field.id))
                            )
                          ) ?? {}
                        : field.inputProps
                      : {}),
                  },
                  {
                    suffix: getField(
                      field.subType ?? field.type,
                      getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        ""
                      )
                    ).icon,
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id))
              ) !== undefined &&
              getProperty(
                modelValue.value,
                (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id))
              ) !== ""
            ) {
              alreadyRun.value = true;
              setProperty(
                modelValue.value,
                (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                undefined
              );
            }

            return h(
              NFormItem,
              {
                label: t(field.key),
                path:
                  (path ?? "") +
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  required: field.required && !alreadyRun.value,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    field.required && !alreadyRun.value && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  placeholder: t(field.key),
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
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
                      (isAbsolutePath ? "" : getPath(schema.value, field.id))
                  ),
                  onUpdateValue: (value) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                rule: {
                  type: !!field.isArray ? "array" : "any",
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
                            (isAbsolutePath
                              ? ""
                              : getPath(schema.value, field.id))
                        )
                      ) ?? {}
                    : field.labelProps
                  : {}),
              },
              () =>
                h(NSelect, {
                  value: field.isArray
                    ? getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id))
                      )?.map(String)
                    : getProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id))
                      )?.toString(),
                  onUpdateValue: (value: any) =>
                    setProperty(
                      modelValue.value,
                      (path ?? "") +
                        (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                      value
                    ),
                  options: field.values?.map((value: any) => ({
                    value: value,
                    label: t(value),
                  })),
                  filterable: true,
                  multiple: !!field.isArray,
                  ...(field.inputProps
                    ? field.inputProps instanceof Function
                      ? field.inputProps(
                          getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
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
                            (isAbsolutePath
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
                        (isAbsolutePath ? "" : getPath(schema.value, field.id))
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        modelValue.value,
                        (path ?? "") +
                          (isAbsolutePath
                            ? ""
                            : getPath(schema.value, field.id)),
                        value
                      ),
                    ...(field.inputProps
                      ? field.inputProps instanceof Function
                        ? field.inputProps(
                            getProperty(
                              modelValue.value,
                              (path ?? "") +
                                (isAbsolutePath
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id)),
                ...(field.labelProps
                  ? field.labelProps instanceof Function
                    ? field.labelProps(
                        getProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
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
                        field.defaultValue.map((v: any) =>
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
                              .join("|")
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
                              (isAbsolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          ).filter((v: any) => !field.defaultValue.includes(v))
                        : getProperty(
                            modelValue.value,
                            (path ?? "") +
                              (isAbsolutePath
                                ? ""
                                : getPath(schema.value, field.id))
                          ),
                      onUpdateValue: (value: any) =>
                        setProperty(
                          modelValue.value,
                          (path ?? "") +
                            (isAbsolutePath
                              ? ""
                              : getPath(schema.value, field.id)),
                          field.defaultValue
                            ? [...value, ...[].concat(field.defaultValue)]
                            : value
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
                  (isAbsolutePath ? "" : getPath(schema.value, field.id))
              ),
              field.type
            );
            return null;
        }
      };

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
          show: showAssetsModal.value,
          "on-update:show": (v: boolean) => (showAssetsModal.value = v),
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
              bodyContentStyle: {
                padding: 0,
              },
            },
            () =>
              h(
                LazyAssetCard,
                //@ts-ignore
                {
                  targetID: "assets_modal",
                },
                (asset: Asset) =>
                  asset.type !== "folder"
                    ? h(NRadio, {
                        checked: []
                          .concat(
                            getProperty(
                              modelValue.value,
                              CurrentField.value.path,
                              []
                            )
                          )
                          .includes((asset?.publicURL ?? "") as never),
                        onUpdateChecked: () =>
                          handleSelectAssets(asset.publicURL),
                      })
                    : null
              )
          )
      ),
    ];
  },
});
