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
  Pencil,
  Plus,
  Trash,
  ChevronRight,
  Upload,
  Link,
  Books,
  Check,
  X,
  DeviceFloppy,
  QuestionMark,
} from "@vicons/tabler";
import {
  isArrayOfObjects,
  isURL,
  isEmail,
  validateFieldType,
  deepMerge,
} from "inibase/utils";
import { get, set, has, del, push } from "object-path";
import { LazyRichEditor, LazyRenderFields } from "#components";
export default defineNuxtComponent({
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
    const Loading = <any>useState("Loading");
    Loading.value["Drawer"] = false;
    const modelValue = toRef(props, "modelValue"),
      message = useMessage(),
      database = <any>useState("database"),
      schema = <any>toRef(props, "schema"),
      route = useRoute(),
      user = <any>useState("user"),
      OPTIONS = <any>ref({}),
      DisabledItem = <any>ref({}),
      DrawerFormRef = ref<FormInst | null>(null),
      Drawer = ref({
        show: false,
        id: null,
        table: null,
        data: {},
      }),
      UpdateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["Drawer"] = true;
            const { data }: any = await useFetch(
              `/api/${route.params.database ?? "inicontent"}/${
                Drawer.value.table
              }/${Drawer.value.id}`,
              {
                method: "PUT",
                body: Drawer.value.data,
              }
            );
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
            const { data }: any = await useFetch(
              `/api/${route.params.database ?? "inicontent"}/${
                Drawer.value.table
              }`,
              {
                method: "POST",
                body: Drawer.value.data,
                transform: (res: any) => {
                  if (res.result) res.result = [].concat(res.result)[0];
                  return res;
                },
              }
            );
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
      ShowAssets = ref(false),
      Assets: any = ref(null),
      HandleSelectAssets = (url: string) => {
        if (
          !CurrentField.value.options.hasOwnProperty("single") ||
          CurrentField.value.options.single === true
        ) {
          if (get(modelValue.value, CurrentField.value.path) === url)
            del(modelValue.value, CurrentField.value.path);
          else set(modelValue.value, CurrentField.value.path, url);
        } else {
          if (
            has(modelValue.value, CurrentField.value.path) &&
            get(modelValue.value, CurrentField.value.path).includes(url)
          )
            del(
              modelValue.value,
              CurrentField.value.path +
                `.${get(modelValue.value, CurrentField.value.path).indexOf(
                  url
                )}`
            );
          else push(modelValue.value, CurrentField.value.path, url);
        }
      },
      RenderField = (field: any, path?: string): any => {
        switch (field.type) {
          case "string":
            if (field.subtype)
              return RenderField(
                {
                  ...field,
                  type: field.subtype,
                },
                path
              );
            else
              return RenderField(
                {
                  ...field,
                  type: "text",
                },
                path
              );
          case "role":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: true,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NSelect, {
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  onUpdateValue: (value) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
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
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "text":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "textarea":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    field.required && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    type: "textarea",
                    rows: field.is_table ? 1 : 3,
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value.toString()
                      ),
                    placeholder: t(field.key),
                    showCount: true,
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "radio":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NRadioGroup,
                  {
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
                      ),
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  () =>
                    h(NSpace, {}, () =>
                      field.values.map((value: any) =>
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
                path: (path ?? "") + getPath(schema.value, field.id),
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () => field.children.map((child: any) => RenderField(child, path))
            );
          case "array":
            if (!field.children) throw new Error("no children");
            if (field.subtype)
              return RenderField(
                {
                  ...field,
                  type: field.subtype,
                  single: false,
                },
                path
              );
            else if (!isArrayOfObjects(field.children))
              return RenderField(
                {
                  ...field,
                  type: "tags",
                  single: false,
                },
                path
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
                        !has(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        ) ||
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        ).length === 0
                          ? ""
                          : h(NIcon, () => h(ChevronRight)),
                      default: () =>
                        h(
                          NCollapseItem,
                          {
                            displayDirective: "show",
                            disabled:
                              DisabledItem.value[
                                (path ?? "") + getPath(schema.value, field.id)
                              ] ||
                              !has(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              ) ||
                              get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              ).length === 0,
                            title: t(field.key),
                            name:
                              (path ?? "") + getPath(schema.value, field.id),
                          },
                          {
                            "header-extra": () =>
                              h(
                                NButton,
                                {
                                  onmouseleave: () =>
                                    (DisabledItem.value[
                                      (path ?? "") +
                                        getPath(schema.value, field.id)
                                    ] = false),
                                  size: "small",
                                  round: true,
                                  onClick: () => (
                                    (DisabledItem.value[
                                      (path ?? "") +
                                        getPath(schema.value, field.id)
                                    ] = true),
                                    setTimeout(
                                      () =>
                                        (DisabledItem.value[
                                          path ??
                                            getPath(schema.value, field.id)
                                        ] = false),
                                      1
                                    ),
                                    push(
                                      modelValue.value,
                                      (path ?? "") +
                                        getPath(schema.value, field.id),
                                      field.onCreate
                                        ? (field.onCreate instanceof Function
                                            ? field.onCreate()
                                            : field.onCreate) ?? {}
                                        : {}
                                    )
                                  ),
                                },
                                {
                                  icon: () => h(NIcon, () => h(Plus)),
                                }
                              ),
                            default: () =>
                              has(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              )
                                ? h(
                                    NCollapse,
                                    {
                                      displayDirective: "show",
                                      accordion: true,
                                    },
                                    () =>
                                      get(
                                        modelValue.value,
                                        path ?? getPath(schema.value, field.id)
                                      ).map((item: any, index: number) =>
                                        h(
                                          NCollapseItem,
                                          {
                                            displayDirective: "show",
                                            title: t(field.key) + " " + index,
                                            name:
                                              (path ??
                                                getPath(
                                                  schema.value,
                                                  field.id
                                                )) +
                                              "." +
                                              index,
                                          },
                                          {
                                            "header-extra": () =>
                                              h(
                                                NButton,
                                                {
                                                  disabled:
                                                    field.disabled_items &&
                                                    field.disabled_items.includes(
                                                      index
                                                    ),
                                                  quaternary: true,
                                                  circle: true,
                                                  type: "error",
                                                  onClick: () =>
                                                    del(
                                                      modelValue.value,
                                                      (path ??
                                                        getPath(
                                                          schema.value,
                                                          field.id
                                                        )) + `.${index}`
                                                    ),
                                                },
                                                {
                                                  icon: () =>
                                                    h(NIcon, () => h(Trash)),
                                                }
                                              ),
                                            default: () =>
                                              field.children.map((child: any) =>
                                                RenderField(
                                                  {
                                                    ...child,
                                                    ...(field.disabled_items
                                                      ? {
                                                          input_props: {
                                                            disabled:
                                                              field.disabled_items &&
                                                              field.disabled_items.includes(
                                                                index
                                                              ),
                                                          },
                                                        }
                                                      : {}),
                                                  },
                                                  (path ??
                                                    getPath(
                                                      schema.value,
                                                      field.id
                                                    )) +
                                                    "." +
                                                    index +
                                                    "." +
                                                    child.key
                                                )
                                              ),
                                          }
                                        )
                                      )
                                  )
                                : null,
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
                                  push(
                                    modelValue.value,
                                    (path ?? "") +
                                      getPath(schema.value, field.id),
                                    {}
                                  ),
                              },
                              {
                                icon: () => h(NIcon, () => h(Plus)),
                              }
                            ),
                      default: () =>
                        h(NDataTable, {
                          columns: [
                            ...field.children.map((child: any) => ({
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
                                getPath(schema.value, field.id) +
                                `.${child.key}`,
                              render: (item: any, index: number) =>
                                RenderField(
                                  {
                                    ...child,
                                    ...(field.disabled_items &&
                                    field.disabled_items.includes(index)
                                      ? {
                                          input_props: {
                                            disabled: true,
                                          },
                                        }
                                      : {}),
                                    label_props: {
                                      showLabel: false,
                                    },
                                  },
                                  (path ?? "") +
                                    getPath(schema.value, field.id) +
                                    "." +
                                    index +
                                    "." +
                                    child.key
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
                                  render(row, index) {
                                    return h(
                                      NPopover,
                                      {},
                                      {
                                        trigger: () =>
                                          h(
                                            NButton,
                                            {
                                              disabled:
                                                field.disabled_items &&
                                                field.disabled_items.includes(
                                                  index
                                                ),
                                              strong: true,
                                              secondary: true,
                                              circle: true,
                                              type: "error",
                                              onClick() {
                                                del(
                                                  modelValue.value,
                                                  (path ??
                                                    getPath(
                                                      schema.value,
                                                      field.id
                                                    )) + `.${index}`
                                                );
                                              },
                                            },
                                            {
                                              icon: () =>
                                                h(NIcon, () => h(Trash)),
                                            }
                                          ),
                                        default: () => t("delete"),
                                      }
                                    );
                                  },
                                },
                          ],
                          data: get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          ),
                          scrollX: field.children.reduce(
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
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  type: field.single === true ? "object" : "array",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              {
                label: () =>
                  h(NSpace, {}, () => [
                    t(field.key),
                    field.single === true &&
                    has(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id) + ".id"
                    )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => {
                              Drawer.value.table = field.key;
                              Drawer.value.id = get(
                                modelValue.value,
                                (path ?? "") +
                                  getPath(schema.value, field.id) +
                                  ".id"
                              );
                              Drawer.value.data = get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              );
                              Drawer.value.show = true;
                            },
                          },
                          { icon: () => h(NIcon, () => h(Pencil)) }
                        )
                      : null,
                    user.value.role === "admin" ||
                    database.value.tables
                      ?.find((table: any) => table.slug === field.key)
                      ?.allowed_methods.find(
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
                          { icon: () => h(NIcon, () => h(Plus)) }
                        )
                      : null,
                  ]),
                default: () =>
                  h(NSelect, {
                    value: has(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    )
                      ? field.single === true
                        ? []
                            .concat(
                              get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              )
                            )
                            .map((i: any) => i.id)[0]
                        : []
                            .concat(
                              get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              )
                            )
                            .map((i: any) => i.id)
                      : null,
                    onUpdateValue: (_value, option: any) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        Array.isArray(option)
                          ? option.map((i: any) => i.raw)
                          : option.raw
                      ),
                    options: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    )
                      ? deepMerge(
                          []
                            .concat(
                              get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              )
                            )
                            .map((single_value: any) => ({
                              label: field.label
                                .map((single_label: any) =>
                                  t(get(single_value, single_label))
                                )
                                .join(" "),
                              value: single_value.id,
                              image: get(single_value, field.image, null),
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
                    renderTag: field.image
                      ? field.single === true
                        ? ({ option }: any) =>
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
                        : ({ option, handleClose }) => {
                            return h(
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
                            );
                          }
                      : undefined,
                    onSearch: async (v) => {
                      if (v.length > 3) {
                        Loading.value[`options_${field.key}`] = true;
                        OPTIONS.value[field.key] = (
                          await useFetch(
                            `/api/${route.params.database ?? "inicontent"}/${
                              field.key
                            }`,
                            {
                              params: {
                                _where: JSON.stringify(
                                  field.search
                                    .flatMap((search: any) => [
                                      [search, "like", v],
                                      "OR",
                                    ])
                                    .slice(0, -1)
                                ),
                              },
                              transform: (res: any) =>
                                res.result
                                  ? res.result.map((single_result: any) => ({
                                      label: field.label
                                        .map((single_label: any) =>
                                          t(get(single_result, single_label))
                                        )
                                        .join(" "),
                                      value: single_result.id,
                                      image: field.image
                                        ? Array.isArray(
                                            get(single_result, field.image)
                                          )
                                          ? get(
                                              single_result,
                                              `${field.image}[0]`
                                            )
                                          : get(single_result, field.image)
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
                path: (path ?? "") + getPath(schema.value, field.id),
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
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
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
                              { icon: () => h(NIcon, () => h(Link)) }
                            ),
                          default: () =>
                            h(
                              NInput,
                              {
                                inputProps: { type: "url" },
                                onUpdateValue: (value) =>
                                  field.single === true
                                    ? set(
                                        modelValue.value,
                                        (path ?? "") +
                                          getPath(schema.value, field.id),
                                        value
                                      )
                                    : push(
                                        modelValue.value,
                                        (path ?? "") +
                                          getPath(schema.value, field.id),
                                        value
                                      ),
                                placeholder: "Link",
                                clearable: true,
                              },
                              {
                                suffix: () => h(NIcon, () => h(Link)),
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
                                (path ?? "") + getPath(schema.value, field.id),
                              field,
                            }),
                            (ShowAssets.value = true)
                          ),
                        },
                        { icon: () => h(NIcon, () => h(Books)) }
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
                          ? set(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id),
                              field.single === true
                                ? files.map((file: any) => file.url ?? file)[0]
                                : files.map((file: any) => file.url ?? file)
                            )
                          : del(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            ),
                      max: field.single === true ? 1 : undefined,
                      multiple: field.single === false,
                      accept: field.accept ? field.accept.join(",") : "*",
                      action: `/api/${
                        database.value.slug ?? "inicontent"
                      }/asset`,
                      fileList: has(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id)
                      )
                        ? ([]
                            .concat(
                              get(
                                modelValue.value,
                                (path ?? "") + getPath(schema.value, field.id)
                              )
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
                          file.url = response.public_url;
                          file.name = response.name;
                          return file;
                        } else return file;
                      },
                      onPreview: ({ url }) =>
                        url
                          ? window.open(url, "blank")?.focus() ?? undefined
                          : undefined,
                      listType:
                        field.single === true && field.is_table !== true
                          ? "image"
                          : "image-card",
                    },
                    () =>
                      field.single === true && field.is_table !== true
                        ? h(NUploadDragger, () => [
                            h(
                              "div",
                              {
                                style: {
                                  marginBottom: "12px",
                                },
                              },
                              h(NIcon, { size: 48, depth: 3 }, () => h(Upload))
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
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: "change",
                  message: "This field is required",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NColorPicker, {
                  modes: ["hex"],
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  onUpdateValue: (value: any) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      value
                    ),
                  ...(field.input_props
                    ? field.input_props instanceof Function
                      ? field.input_props(
                          get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          )
                        ) ?? {}
                      : field.input_props
                    : {}),
                })
            );
          case "url":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  validator(rule, value) {
                    if (!value)
                      return field.required
                        ? new Error("This field is required")
                        : true;
                    if (!isURL(value))
                      return new Error("Please type a valid link");
                  },
                  trigger: "change",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "url" },
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "email":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
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
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
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
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )?.split("@")[0] ?? "";
                      return {
                        label: prefix + suffix,
                        value: prefix + suffix,
                      };
                    }),
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
                      ),
                    placeholder: t(field.key),
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "date":
            if (
              !has(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id)
              ) &&
              field.required
            )
              set(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id),
                Date.now()
              );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  type: "number",
                  required: field.required,
                  trigger: ["blur", "change"],
                  message: "Please select a valid date",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NDatePicker, {
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  )
                    ? Number(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      )
                    : null,
                  onConfirm: (e: number) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      e
                    ),
                  type: "datetime",
                  ...(field.input_props
                    ? field.input_props instanceof Function
                      ? field.input_props(
                          get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          )
                        ) ?? {}
                      : field.input_props
                    : {}),
                })
            );
          case "html":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required: field.required,
                  trigger: ["blur", "input"],
                  message: "Please write something",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(LazyRichEditor, {
                  modelValue: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  "onUpdate:modelValue.value": (v: any) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      v
                    ),
                  ...(field.input_props
                    ? field.input_props instanceof Function
                      ? field.input_props(
                          get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          )
                        ) ?? {}
                      : field.input_props
                    : {}),
                })
            );
          case "number":
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  type: "number",
                  required: field.required,
                  trigger: ["blur", "change"],
                  validator: (_rule, value) =>
                    field.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NInputNumber,
                  {
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
                      ),
                    placeholder: t(field.key),
                    showButton: false,
                    clearable: true,
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
                      : {}),
                  },
                  {
                    suffix: () =>
                      FieldsList()
                        .flatMap(({ label, key, icon, children }) => [
                          { label, key, icon },
                          ...(children ?? []),
                        ])
                        .find(({ key }) =>
                          field.subtype
                            ? key === field.subtype
                            : key === field.type
                        )
                        ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                  }
                )
            );
          case "password":
            const alreadyRun = useState("alreadyRun", () => false);

            if (
              !alreadyRun.value &&
              get(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id)
              ) !== undefined
            ) {
              alreadyRun.value = true;
              set(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id),
                undefined
              );
            }
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  required:
                    !get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ) && field.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    !get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ) &&
                    field.required &&
                    !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NInput, {
                  type: "password",
                  showPasswordOn: "click",
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  onUpdateValue: (value: any) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      value
                    ),
                  placeholder: t(field.key),
                  ...(field.input_props
                    ? field.input_props instanceof Function
                      ? field.input_props(
                          get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          )
                        ) ?? {}
                      : field.input_props
                    : {}),
                })
            );
          case "boolean":
            return h(
              NFormItem,
              {
                labelPlacement: "left",
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NSwitch, {
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  onUpdateValue: (value) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      value
                    ),
                })
            );
          case "list":
            if (
              !has(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id)
              ) &&
              field.default_value
            )
              set(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id),
                field.default_value
              );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  type: field.single === false ? "array" : "any",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(NSelect, {
                  defaultValue: field.default_value ?? [],
                  value: get(
                    modelValue.value,
                    (path ?? "") + getPath(schema.value, field.id)
                  ),
                  onUpdateValue: (value: any) =>
                    set(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      value
                    ),
                  options: field.values.map((value: any) => ({
                    value: value,
                    label: t(value),
                  })),
                  filterable: true,
                  multiple: field.single === false,
                  ...(field.input_props
                    ? field.input_props instanceof Function
                      ? field.input_props(
                          get(
                            modelValue.value,
                            (path ?? "") + getPath(schema.value, field.id)
                          )
                        ) ?? {}
                      : field.input_props
                    : {}),
                })
            );
          case "checkbox":
            if (
              !has(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id)
              ) &&
              field.default_value
            )
              set(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id),
                field.default_value
              );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                rule: {
                  type: "array",
                  required: field.required,
                  trigger: "change",
                  message: "Please select an option",
                },
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
              },
              () =>
                h(
                  NCheckboxGroup,
                  {
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
                      ),
                    ...(field.input_props
                      ? field.input_props instanceof Function
                        ? field.input_props(
                            get(
                              modelValue.value,
                              (path ?? "") + getPath(schema.value, field.id)
                            )
                          ) ?? {}
                        : field.input_props
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
                        field.values.map((value: any) =>
                          h(NCheckbox, {
                            value: value,
                            label: t(value),
                          })
                        )
                    )
                )
            );
          case "tags":
            if (field.default_value)
              []
                .concat(field.default_value)
                .forEach(
                  (value) =>
                    !get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      []
                    ).includes(value) &&
                    push(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id),
                      value
                    )
                );
            return h(
              NFormItem,
              {
                label: t(field.key),
                path: (path ?? "") + getPath(schema.value, field.id),
                ...(field.label_props
                  ? field.label_props instanceof Function
                    ? field.label_props(
                        get(
                          modelValue.value,
                          (path ?? "") + getPath(schema.value, field.id)
                        )
                      ) ?? {}
                    : field.label_props
                  : {}),
                rule: {
                  type: "array",
                  required: field.required,
                  trigger: ["change"],
                  validator(rule, values) {
                    if (!Array.isArray(values) || values.length === 0)
                      return field.required
                        ? new Error("This field is required")
                        : true;
                    for (const value of values)
                      if (!validateFieldType(value, field.children))
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
                h(
                  NDynamicTags,
                  {
                    inputProps: {
                      placeholder: Array.isArray(field.children)
                        ? field.children
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
                    defaultValue: field.default_value ?? [],
                    value: get(
                      modelValue.value,
                      (path ?? "") + getPath(schema.value, field.id)
                    ),
                    onUpdateValue: (value: any) =>
                      set(
                        modelValue.value,
                        (path ?? "") + getPath(schema.value, field.id),
                        value
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
                          icon: () => h(NIcon, () => h(Plus)),
                        }
                      ),
                  }
                )
            );

          default:
            console.log(
              get(
                modelValue.value,
                (path ?? "") + getPath(schema.value, field.id)
              ),
              field.type
            );
            return null;
        }
      };
    watch(ShowAssets, async (v) => {
      Assets.value = null;
      if (v)
        Assets.value = (
          await useFetch(
            `/api/${route.params.database ?? "inicontent"}/asset`,
            {
              transform: (res: any) => res.result,
            }
          )
        ).data.value;
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
                : `New ${t(Drawer.value.table)}`,
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
                    loading: Loading["Drawer"],
                  },
                  {
                    icon: () => h(NIcon, () => h(DeviceFloppy)),
                    default: () => (Drawer.value.id ? "UPDATE" : "CREATE"),
                  }
                ),
              default: () =>
                h(
                  NForm,
                  {
                    ref: DrawerFormRef,
                    model: Drawer.value.data,
                  },
                  () =>
                    h(LazyRenderFields, {
                      modelValue: Drawer.value.data,
                      schema: database.value.tables.find(
                        (item: any) => item.slug === Drawer.value.table
                      ).schema,
                    })
                ),
            }
          )
      ),
      ...schema.value.map((item: any) => RenderField(item)),
      h(
        NDrawer,
        {
          show: ShowAssets.value,
          "on-update:show": (v: boolean) => (ShowAssets.value = v),
          defaultHeight: "50%",
          placement: "bottom",
          resizable: true,
        },
        () =>
          h(
            NDrawerContent,
            { id: "assets_modal", nativeScrollbar: false, closable: true },
            {
              header: () => [
                "Assets",
                Array.isArray(Assets.value)
                  ? h(NP, { depth: 3 }, () => "Click on the icon to select")
                  : h(NSkeleton, {
                      text: true,
                      style: {
                        borderRadius: "15px",
                        marginTop: "5px",
                      },
                    }),
              ],
              default: () => {
                return Array.isArray(Assets.value)
                  ? h(NImageGroup, () =>
                      h(
                        NGrid,
                        {
                          xGap: "12px",
                          yGap: "12px",
                          cols: "3 300:4 500:6 650:8 900:10 1000:16",
                        },
                        () =>
                          [
                            ...Assets.value.filter((Asset: any) =>
                              []
                                .concat(
                                  get(modelValue.value, CurrentField.value.path)
                                )
                                .includes((Asset?.public_url ?? "") as never)
                            ),
                            ...Assets.value.filter(
                              (Asset: any) =>
                                ![]
                                  .concat(
                                    get(
                                      modelValue.value,
                                      CurrentField.value.path
                                    )
                                  )
                                  .includes((Asset?.public_url ?? "") as never)
                            ),
                          ].map((Asset: any) =>
                            h(
                              NGi,
                              {
                                style: {
                                  position: "relative",
                                  display: "flex",
                                },
                              },
                              () => [
                                h(
                                  NButton,
                                  {
                                    circle: true,
                                    size: "tiny",
                                    style: {
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      zIndex: 9,
                                    },
                                    onClick: () =>
                                      HandleSelectAssets(Asset.public_url),
                                    type: []
                                      .concat(
                                        get(
                                          modelValue.value,
                                          CurrentField.value.path
                                        )
                                      )
                                      .includes(
                                        (Asset?.public_url ?? "") as never
                                      )
                                      ? "success"
                                      : "error",
                                  },
                                  {
                                    icon: () =>
                                      h(NIcon, () =>
                                        h(
                                          []
                                            .concat(
                                              get(
                                                modelValue.value,
                                                CurrentField.value.path
                                              )
                                            )
                                            .includes(
                                              (Asset?.public_url ?? "") as never
                                            )
                                            ? Check
                                            : X
                                        )
                                      ),
                                  }
                                ),
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
                                      style: {
                                        height: "100%",
                                        width: "100%",
                                        minHeight: "60px",
                                        borderRadius: "15px",
                                      },
                                      intersectionObserverOptions: {
                                        root: "#assets_modal",
                                      },
                                      lazy: true,
                                      src: `${Asset.public_url}?fit=60`,
                                      previewSrc: Asset.public_url,
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
                                            href: Asset.public_url,
                                            target: "_blank",
                                          },
                                          () =>
                                            h(Upload, {
                                              style: {
                                                width: "100%",
                                                height: "100%",
                                              },
                                            })
                                        )
                                    ),
                              ]
                            )
                          )
                      )
                    )
                  : h(
                      NGrid,
                      {
                        xGap: "12px",
                        yGap: "12px",
                        cols: "3 300:4 500:6 650:8 900:10 1000:16",
                      },
                      () =>
                        [...Array(20).keys()].map(() =>
                          h(NGi, () =>
                            h(NSkeleton, {
                              style: {
                                width: "100%",
                                height: "100%",
                                minHeight: "60px",
                                borderRadius: "15px",
                              },
                            })
                          )
                        )
                    );
              },
            }
          )
      ),
    ];
  },
});
