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
  NScrollbar,
  NDataTable,
  NDynamicTags,
  useMessage,
} from "naive-ui";
import {
  Pencil,
  Plus,
  Trash,
  ChevronRight,
  Upload,
  AlignJustified,
  Link,
  At,
  ListNumbers,
  LetterCase,
  Books,
  Check,
  X,
  FileText,
  DeviceFloppy,
} from "@vicons/tabler";
import { Buffer } from "buffer";
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
    const RichEditor = resolveComponent("RichEditor"),
      RenderFields = resolveComponent("RenderFields");
    const Loading = useState("Loading");
    Loading.value["Drawer"] = false;
    const single = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      }),
      message = useMessage(),
      database = useState("database"),
      Schema = props.schema,
      route = useRoute(),
      User = useState("User"),
      OPTIONS = ref({}),
      DisabledItem = ref([]),
      DrawerFormRef = ref(null),
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
            const { data } = await useFetch(
              `https://api.inicontent.com/${route.params.db_slug}/${Drawer.value.table}/${Drawer.value.id}!`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "PUT",
                body: Drawer.value.data,
                initialCache: false,
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
            const { data } = await useFetch(
              `https://api.inicontent.com/${route.params.db_slug}/${Drawer.value.table}`,
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Buffer.from(
                      `${User.value.username}:${User.value.password}`
                    ).toString("base64"),
                },
                method: "POST",
                body: Drawer.value.data,
                initialCache: false,
                transform: (res) => {
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
      CurrentField = ref(null),
      ShowAssets = ref(false),
      Assets = ref(null),
      HandleSelectAssets = (url) => {
        if (
          !CurrentField.value.options.hasOwnProperty("single") ||
          CurrentField.value.options.single === true
        ) {
          if (objectPath.get(single.value, CurrentField.value.path) === url)
            objectPath.del(single.value, CurrentField.value.path);
          else objectPath.set(single.value, CurrentField.value.path, url);
        } else {
          if (
            objectPath.has(single.value, CurrentField.value.path) &&
            objectPath.get(single.value, CurrentField.value.path).includes(url)
          )
            objectPath.del(
              single.value,
              CurrentField.value.path +
                `.${objectPath
                  .get(single.value, CurrentField.value.path)
                  .indexOf(url)}`
            );
          else objectPath.push(single.value, CurrentField.value.path, url);
        }
      },
      EmailAutoComplete = () =>
        ["@gmail.com", "@outlook.com", "@hotmail.com", "@hotmail.fr"].map(
          (suffix) => {
            const prefix = model.value.autoCompleteValue.split("@")[0];
            return {
              label: prefix + suffix,
              value: prefix + suffix,
            };
          }
        ),
      mergeArrayOfObjects = (original, newdata, selector = "id") => {
        newdata.forEach((dat) => {
          const foundIndex = original.findIndex(
            (ori) => ori[selector] == dat[selector]
          );
          if (foundIndex >= 0) original.splice(foundIndex, 1, dat);
          else original.push(dat);
        });

        return original;
      },
      RenderField = ({ name, key, path, type, ...options }) => {
        switch (type) {
          case "list":
            if (
              !objectPath.has(
                single.value,
                (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
              ) &&
              options.default_value
            )
              objectPath.set(
                single.value,
                (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                options.default_value
              );
            return options.values && options.values.length > 8
              ? h(
                  NFormItem,
                  {
                    label: name,
                    path:
                      (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                    rule: {
                      required: options.required,
                      trigger: ["input", "blur"],
                      message: "Please select an option",
                    },
                    ...(options.label_props ?? {}),
                  },
                  () =>
                    h(NSelect, {
                      value: objectPath.get(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      ),
                      onUpdateValue: (value) =>
                        objectPath.set(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                          value
                        ),
                      options: options.values.map((item) =>
                        typeof item === "object" && item.label && item.value
                          ? item
                          : {
                              value: item,
                              label: item,
                            }
                      ),
                      filterable: true,
                      multiple:
                        options.hasOwnProperty("single") &&
                        options.single === false,
                      ...(options.input_props ?? {}),
                      ...(options.callback
                        ? options.callback(
                            objectPath.get(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            ),
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )
                        : {}),
                    })
                )
              : !options.hasOwnProperty("single") || options.single === true
              ? h(
                  NFormItem,
                  {
                    label: name,
                    path:
                      (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                    rule: {
                      required: options.required,
                      trigger: ["input", "blur"],
                      message: "Please select an option",
                    },
                    ...(options.label_props ?? {}),
                  },
                  () =>
                    h(
                      NRadioGroup,
                      {
                        value: objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ),
                        onUpdateValue: (value) =>
                          objectPath.set(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                            value
                          ),
                        ...(options.input_props ?? {}),
                        ...(options.callback
                          ? options.callback(
                              objectPath.get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              ),
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            )
                          : {}),
                      },
                      () =>
                        h(NSpace, {}, () =>
                          options.values.map((item) =>
                            h(
                              NRadio,
                              typeof item === "object" &&
                                item.label &&
                                item.value
                                ? item
                                : {
                                    value: item,
                                    label: item,
                                  }
                            )
                          )
                        )
                    )
                )
              : h(
                  NFormItem,
                  {
                    label: name,
                    path:
                      (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                    rule: {
                      type: "array",
                      required: options.required,
                      trigger: ["input", "blur"],
                      message: "Please select an option",
                    },
                    ...(options.label_props ?? {}),
                  },
                  () =>
                    h(
                      NCheckboxGroup,
                      {
                        value: objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ),
                        onUpdateValue: (value) =>
                          objectPath.set(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                            value
                          ),
                        ...(options.input_props ?? {}),
                        ...(options.callback
                          ? options.callback(
                              objectPath.get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              ),
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            )
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
                            options.values.map((item) =>
                              h(
                                NCheckbox,
                                typeof item === "object" &&
                                  item.label &&
                                  item.value
                                  ? item
                                  : {
                                      value: item,
                                      label: item,
                                    }
                              )
                            )
                        )
                    )
                );
          case "tags":
            if (options.default_value)
              [].concat(options.default_value).forEach(
                (value) =>
                  !objectPath
                    .get(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      []
                    )
                    .includes(value) &&
                  objectPath.push(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                    value
                  )
              );
            return h(
              NFormItem,
              {
                label: name,
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                ...(options.label_props ?? {}),
                rule: {
                  type: "array",
                  required: options.required,
                  trigger: ["input", "blur"],
                  validator(rule, value) {
                    if (!value && options.required)
                      return new Error("This field is required");
                    switch (options.content_type) {
                      case "url":
                        try {
                          if (value.charAt(0) === "#") return true;
                          new URL(value);
                        } catch (e) {
                          return new Error("This is not a valid link");
                        }
                        break;
                      case "email":
                        return new RegExp(
                          "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
                        ).test(value);
                      default:
                        break;
                    }
                    return true;
                  },
                },
              },
              () =>
                h(
                  NDynamicTags,
                  {
                    value: objectPath.get(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    ),
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value
                      ),
                    renderTag: (tag, index) =>
                      h(
                        NTag,
                        {
                          type:
                            options.default_value &&
                            [].concat(options.default_value).includes(tag)
                              ? "primary"
                              : "default",
                          disabled:
                            options.default_value &&
                            [].concat(options.default_value).includes(tag),
                          closable:
                            !options.default_value ||
                            ![].concat(options.default_value).includes(tag),
                          onClose: () =>
                            objectPath.del(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                                `.${index}`
                            ),
                        },
                        {
                          default: () => tag,
                        }
                      ),
                  },
                  {
                    trigger: ({ activate, disabled }) =>
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
          case "table":
            return h(
              NFormItem,
              {
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  type:
                    !options.hasOwnProperty("single") || options.single === true
                      ? "object"
                      : "array",
                  required: options.required,
                  trigger: ["input", "blur"],
                  message: "Please select an option",
                },
                ...(options.label_props ?? {}),
              },
              {
                label: () =>
                  h(NSpace, {}, () => [
                    name.charAt(0).toUpperCase() +
                      name.slice(1).replaceAll("_", " "),
                    (!options.hasOwnProperty("single") ||
                      options.single === true) &&
                    objectPath.has(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                        ".id"
                    )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => {
                              Drawer.value.table = name;
                              Drawer.value.id = objectPath.get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "") +
                                  ".id"
                              );
                              Drawer.value.data = objectPath.get(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              );
                              Drawer.value.show = true;
                            },
                          },
                          { icon: () => h(NIcon, () => h(Pencil)) }
                        )
                      : null,
                    options.hasOwnProperty("allow_create") &&
                    options.allow_create === true
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => (
                              (Drawer.value.table = name),
                              (Drawer.value.show = true)
                            ),
                          },
                          { icon: () => h(NIcon, () => h(Plus)) }
                        )
                      : null,
                  ]),
                default: () =>
                  h(NSelect, {
                    value: objectPath.has(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    )
                      ? !options.hasOwnProperty("single") ||
                        options.single === true
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
                            .map((i) => i.id)[0]
                        : []
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
                            .map((i) => i.id)
                      : null,
                    onUpdateValue: (_value, option) =>
                      objectPath.set(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        Array.isArray(option)
                          ? option.map((i) => i.raw)
                          : option.raw
                      ),
                    options: objectPath.get(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    )
                      ? mergeArrayOfObjects(
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
                            .map((single_value) => ({
                              label: options.label
                                .map((single_label) =>
                                  objectPath.get(single_value, single_label)
                                )
                                .join(" "),
                              value: single_value.id,
                              image: objectPath.get(
                                single_value,
                                options.image,
                                null
                              ),
                              raw: single_value,
                            })),
                          OPTIONS.value ? OPTIONS.value[name] ?? [] : []
                        )
                      : OPTIONS.value
                      ? OPTIONS.value[name]
                      : [],
                    remote: true,
                    clearable: true,
                    filterable: true,
                    loading: Loading.value[`options_${name}`],
                    multiple:
                      !options.hasOwnProperty("single") ||
                      (options.single === true) === false,
                    renderLabel: options.image
                      ? (option) =>
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
                                    ].includes(link.split(".").pop())
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
                    renderTag: options.image
                      ? !options.hasOwnProperty("single") ||
                        options.single === true
                        ? ({ option }) =>
                            h(
                              "div",
                              {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                },
                              },
                              [
                                h(NAvatar, {
                                  src: []
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
                                      ].includes(link.split(".").pop())
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
                                    [
                                      h(NAvatar, {
                                        src: []
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
                                            ].includes(link.split(".").pop())
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
                        Loading.value[`options_${name}`] = true;
                        OPTIONS.value[name] = (
                          await useFetch(
                            `https://api.inicontent.com/${route.params.db_slug}/${name}`,
                            {
                              headers:
                                User.value &&
                                User.value.username &&
                                User.value.password
                                  ? {
                                      Authorization:
                                        "Basic " +
                                        Buffer.from(
                                          `${User.value.username}:${User.value.password}`
                                        ).toString("base64"),
                                    }
                                  : {},
                              params: {
                                _where: JSON.stringify(
                                  options.search
                                    .flatMap((search) => [
                                      [search, "like", v],
                                      "OR",
                                    ])
                                    .slice(0, -1)
                                ),
                              },
                              transform: (res) =>
                                res.result
                                  ? res.result.map((single_result) => ({
                                      label: options.label
                                        .map((single_label) =>
                                          objectPath.get(
                                            single_result,
                                            single_label
                                          )
                                        )
                                        .join(" "),
                                      value: single_result.id,
                                      image: options.image
                                        ? Array.isArray(
                                            objectPath.get(
                                              single_result,
                                              options.image
                                            )
                                          )
                                          ? objectPath.get(
                                              single_result,
                                              `${options.image}[0]`
                                            )
                                          : objectPath.get(
                                              single_result,
                                              options.image
                                            )
                                        : null,
                                      raw: single_result,
                                    }))
                                  : [],
                              initialCache: false,
                            }
                          )
                        ).data.value;
                        Loading.value[`options_${name}`] = false;
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
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule:
                  !options.hasOwnProperty("single") || options.single === true
                    ? {
                        required: options.required,
                        trigger: ["input", "blur"],
                        message: "This field is required",
                      }
                    : {
                        type: "array",
                        required: options.required,
                        trigger: ["input", "blur"],
                        message: "This field is required",
                      },
                ...(options.label_props ?? {}),
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
                      name,
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
                                  !options.hasOwnProperty("single") ||
                                  options.single === true
                                    ? objectPath.set(
                                        single.value,
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                                        value
                                      )
                                    : objectPath.push(
                                        single.value,
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
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
                                (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                              options,
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
                      // defaultUpload: true,
                      // withCredentials: true,
                      "on-update:file-list": (files) =>
                        files.map((file) => file.url ?? file)[0]
                          ? objectPath.set(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                              !options.hasOwnProperty("single") ||
                                options.single === true
                                ? files.map((file) => file.url ?? file)[0]
                                : files.map((file) => file.url ?? file)
                            )
                          : objectPath.del(
                              single.value,
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            ),
                      max:
                        !options.hasOwnProperty("single") ||
                        options.single === true
                          ? 1
                          : undefined,
                      multiple:
                        options.hasOwnProperty("single") &&
                        options.single === false,
                      accept: options.accept ? options.accept.join(",") : "*",
                      action: `https://api.inicontent.com/${route.params.db_slug}/assets`,
                      headers:
                        User.value && User.value.username && User.value.password
                          ? {
                              Authorization:
                                "Basic " +
                                Buffer.from(
                                  `${User.value.username}:${User.value.password}`
                                ).toString("base64"),
                            }
                          : undefined,
                      fileList: objectPath.has(
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
                            .map((src) =>
                              typeof src === "object"
                                ? src
                                : {
                                    id: src
                                      .split("/")
                                      .pop()
                                      .split("#")[0]
                                      .split("?")[0],
                                    name: src
                                      .split("/")
                                      .pop()
                                      .split("#")[0]
                                      .split("?")[0],
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
                                      ].includes(src.split(".").pop())
                                        ? `${src}?fit=${
                                            !options.hasOwnProperty("single") ||
                                            options.single
                                              ? 32
                                              : 94
                                          }`
                                        : null,
                                  }
                            )
                        : undefined,
                      onFinish: ({ file, event }) => {
                        const response = JSON.parse(
                          event.target.response
                        ).result;
                        file.url = response.public_url;
                        file.name = response.name;
                        return file;
                      },
                      onPreview: ({ url }) =>
                        window.open(url, "_blank").focus(),
                      listType:
                        !options.hasOwnProperty("single") ||
                        options.single === true
                          ? "image"
                          : "image-card",
                    },
                    () =>
                      !options.hasOwnProperty("single") ||
                      options.single === true
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
          case "url":
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: options.required,
                  validator(rule, value) {
                    if (!value && options.required)
                      return new Error("This field is required");
                    try {
                      if (value.charAt(0) === "#") return true;
                      new URL(value);
                    } catch (e) {
                      return new Error("This is not a valid link");
                    }
                    return true;
                  },
                  trigger: ["input", "blur"],
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "url" },
                    value: objectPath.get(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    ),
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        options.absolute_path
                          ? options.absolute_path
                          : (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value
                      ),
                    placeholder: name,
                    clearable: true,
                    ...(options.input_props ?? {}),
                    ...(options.callback
                      ? options.callback(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          ),
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      : {}),
                  },
                  {
                    suffix: () => h(NIcon, () => h(Link)),
                  }
                )
            );
          case "email":
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  type: "email",
                  required: options.required,
                  trigger: ["input", "blur"],
                  validator: (_rule, value) =>
                    options.required && !value
                      ? new Error("This field is required")
                      : new RegExp(
                          "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
                        ).test(value),
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "email" },
                    options: EmailAutoComplete,
                    value: objectPath.get(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    ),
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        options.absolute_path
                          ? options.absolute_path
                          : (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value
                      ),
                    placeholder: name,
                    clearable: true,
                    ...(options.input_props ?? {}),
                    ...(options.callback
                      ? options.callback(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          ),
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      : {}),
                  },
                  {
                    suffix: () => h(NIcon, () => h(At)),
                  }
                )
            );
          case "date":
            if (
              !objectPath.has(
                single.value,
                options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
              )
            )
              objectPath.set(
                single.value,
                options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                Date.now() / 1000
              );
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  type: "number",
                  required: options.required,
                  trigger: ["blur", "change"],
                  message: "Please select a valid date",
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(NDatePicker, {
                  value:
                    objectPath.get(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      Date.now() / 1000
                    ) * 1000,
                  onConfirm: (e) =>
                    objectPath.set(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      e / 1000
                    ),
                  type: "datetime",
                  ...(options.input_props ?? {}),
                  ...(options.callback
                    ? options.callback(
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ),
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                    : {}),
                })
            );
          case "editor":
            return h(
              NFormItem,
              {
                label: name,
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  message: "Please write something",
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(RichEditor, {
                  modelValue: objectPath.get(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  ),
                  "onUpdate:modelValue": (v) =>
                    objectPath.set(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      v
                    ),
                  ...(options.input_props ?? {}),
                  ...(options.callback
                    ? options.callback(
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ),
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                    : {}),
                })
            );
          case "textarea":
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(
                  NInput,
                  {
                    type: "textarea",
                    value: objectPath.has(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    )
                      ? objectPath
                          .get(
                            single.value,
                            options.absolute_path
                              ? options.absolute_path
                              : (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )
                          .toString()
                      : null,
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        options.absolute_path
                          ? options.absolute_path
                          : (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value
                      ),
                    placeholder: name,
                    showCount: true,
                    clearable: true,
                    ...(options.input_props ?? {}),
                    ...(options.callback
                      ? options.callback(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          ),
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      : {}),
                  },
                  {
                    suffix: () => h(NIcon, () => h(AlignJustified)),
                  }
                )
            );
          case "number":
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  type: "number",
                  required: options.required,
                  trigger: ["blur", "change"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(
                  NInputNumber,
                  {
                    value: objectPath.get(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    ),
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        options.absolute_path
                          ? options.absolute_path
                          : (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value
                      ),
                    placeholder: name,
                    showButton: false,
                    clearable: true,
                    ...(options.input_props ?? {}),
                    ...(options.callback
                      ? options.callback(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          ),
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      : {}),
                  },
                  {
                    suffix: () => h(NIcon, () => h(ListNumbers)),
                  }
                )
            );
          case "text":
            return h(
              NFormItem,
              {
                label: name,
                path: options.absolute_path
                  ? options.absolute_path
                  : (path ?? "") +
                    name
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(
                  NInput,
                  {
                    value: objectPath.get(
                      single.value,
                      options.absolute_path
                        ? options.absolute_path
                        : (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                    ),
                    onUpdateValue: (value) =>
                      objectPath.set(
                        single.value,
                        options.absolute_path
                          ? options.absolute_path
                          : (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        value.toString()
                      ),
                    placeholder: name,
                    clearable: true,
                    ...(options.input_props ?? {}),
                    ...(options.callback
                      ? options.callback(
                          objectPath.get(
                            single.value,
                            (path ?? "") +
                              name
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          ),
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        )
                      : {}),
                  },
                  {
                    suffix: () => h(NIcon, () => h(LetterCase)),
                  }
                )
            );
          case "password":
            return h(
              NFormItem,
              {
                label: name,
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && !value
                      ? new Error("This field is required")
                      : true,
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(NInput, {
                  type: "password",
                  showPasswordOn: "click",
                  value: objectPath.get(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  ),
                  onUpdateValue: (value) =>
                    objectPath.set(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      value
                    ),
                  placeholder: name,
                  ...(options.input_props ?? {}),
                  ...(options.callback
                    ? options.callback(
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ),
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                    : {}),
                })
            );
          case "boolean":
            return h(
              NFormItem,
              {
                labelPlacement: "left",
                label: name,
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                ...(options.label_props ?? {}),
              },
              () =>
                h(NSwitch, {
                  value: objectPath.get(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  ),
                  onUpdateValue: (value) =>
                    objectPath.set(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      value
                    ),
                })
            );
          case "role":
            return h(
              NFormItem,
              {
                label: name,
                path:
                  (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                rule: {
                  required: true,
                  trigger: ["input", "blur"],
                  message: "Please select an option",
                },
                ...(options.label_props ?? {}),
              },
              () =>
                h(NSelect, {
                  value: objectPath.get(
                    single.value,
                    (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                  ),
                  onUpdateValue: (value) =>
                    objectPath.set(
                      single.value,
                      (path ?? "") +
                        name
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      value
                    ),
                  options: [
                    "admin",
                    "user",
                    ...(database.value.roles ?? []),
                  ].map((v) => ({
                    label:
                      v.charAt(0).toUpperCase() +
                      v.slice(1).replaceAll("_", " "),
                    value: v,
                  })),
                })
            );
          case "group":
            return options.collapsible === false &&
              options.duplicatable !== true
              ? h(
                  NFormItem,
                  {
                    label: name,
                    path:
                      (path ?? "") +
                      name
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                    ...(options.label_props ?? {}),
                  },
                  () =>
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
                )
              : h(
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
                      options.duplicatable == true &&
                      (!objectPath.has(
                        single.value,
                        (path ?? "") +
                          name
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      ) ||
                        objectPath.get(
                          single.value,
                          (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                        ).length === 0)
                        ? ""
                        : h(NIcon, () => h(ChevronRight)),
                    default: () =>
                      h(
                        NCollapseItem,
                        {
                          displayDirective: "show",
                          disabled:
                            DisabledItem.value[
                              (path ?? "") +
                                name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            ] ||
                            (options.duplicatable === true &&
                              (!objectPath.has(
                                single.value,
                                (path ?? "") +
                                  name
                                    .toLowerCase()
                                    .replace(/ /g, "_")
                                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              ) ||
                                objectPath.get(
                                  single.value,
                                  (path ?? "") +
                                    name
                                      .toLowerCase()
                                      .replace(/ /g, "_")
                                      .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                ).length === 0)),
                          title: name,
                          name:
                            (path ?? "") +
                            name
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                        },
                        {
                          "header-extra": () =>
                            options.duplicatable === true
                              ? h(
                                  NButton,
                                  {
                                    onmouseenter: () =>
                                      (DisabledItem.value[
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                      ] = true),
                                    onmouseleave: () =>
                                      (DisabledItem.value[
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                      ] = false),
                                    size: "small",
                                    round: true,
                                    onClick: () =>
                                      objectPath.push(
                                        single.value,
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                                        {}
                                      ),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(Plus)),
                                  }
                                )
                              : null,
                          default: () =>
                            options.duplicatable == true
                              ? objectPath.has(
                                  single.value,
                                  (path ?? "") +
                                    name
                                      .toLowerCase()
                                      .replace(/ /g, "_")
                                      .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                )
                                ? options.children.filter(
                                    (child) =>
                                      (child.type === "group" &&
                                        child.duplicatable === true) ||
                                      child.type === "editor"
                                  ).length > 0
                                  ? h(
                                      NCollapse,
                                      {
                                        displayDirective: "show",
                                        accordion: true,
                                      },
                                      () =>
                                        objectPath
                                          .get(
                                            single.value,
                                            (path ?? "") +
                                              name
                                                .toLowerCase()
                                                .replace(/ /g, "_")
                                                .replace(
                                                  /[^\[a-zA-Zء-ي]-_+/g,
                                                  ""
                                                )
                                          )
                                          .map((item, index) =>
                                            h(
                                              NCollapseItem,
                                              {
                                                displayDirective: "show",
                                                title: name + " " + (index + 1),
                                                name:
                                                  (path ?? "") +
                                                  name
                                                    .toLowerCase()
                                                    .replace(/ /g, "_")
                                                    .replace(
                                                      /[^\[a-zA-Zء-ي]-_+/g,
                                                      ""
                                                    ) +
                                                  "." +
                                                  index,
                                              },
                                              {
                                                "header-extra": () =>
                                                  h(
                                                    NButton,
                                                    {
                                                      quaternary: true,
                                                      circle: true,
                                                      type: "error",
                                                      onClick: () =>
                                                        objectPath.del(
                                                          single.value,
                                                          (path ?? "") +
                                                            name
                                                              .toLowerCase()
                                                              .replace(
                                                                / /g,
                                                                "_"
                                                              )
                                                              .replace(
                                                                /[^\[a-zA-Zء-ي]-_+/g,
                                                                ""
                                                              ) +
                                                            `.${index}`
                                                        ),
                                                    },
                                                    {
                                                      icon: () =>
                                                        h(NIcon, () =>
                                                          h(Trash)
                                                        ),
                                                    }
                                                  ),
                                                default: () =>
                                                  options.children.map(
                                                    (child) =>
                                                      RenderField({
                                                        ...child,
                                                        ...(options.callback
                                                          ? options.callback(
                                                              item,
                                                              (path ?? "") +
                                                                name
                                                                  .toLowerCase()
                                                                  .replace(
                                                                    / /g,
                                                                    "_"
                                                                  )
                                                                  .replace(
                                                                    /[^\[a-zA-Zء-ي]-_+/g,
                                                                    ""
                                                                  ) +
                                                                `.${index}`
                                                            )
                                                          : {}),
                                                        ...(options.disabled_items
                                                          ? {
                                                              callback: (
                                                                value,
                                                                path
                                                              ) =>
                                                                path.split(
                                                                  "."
                                                                )[1] &&
                                                                options.disabled_items.includes(
                                                                  path.split(
                                                                    "."
                                                                  )[1]
                                                                )
                                                                  ? {
                                                                      disabled: true,
                                                                    }
                                                                  : {},
                                                            }
                                                          : {}),
                                                        path:
                                                          (path ?? "") +
                                                          name
                                                            .toLowerCase()
                                                            .replace(/ /g, "_")
                                                            .replace(
                                                              /[^\[a-zA-Zء-ي]-_+/g,
                                                              ""
                                                            ) +
                                                          `.${index}.`,
                                                      })
                                                  ),
                                              }
                                            )
                                          )
                                    )
                                  : h(NDataTable, {
                                      columns: [
                                        ...options.children.map((child) => ({
                                          width:
                                            child.name && child.name.length > 10
                                              ? child.name.length * 15
                                              : 200,
                                          title: () => [
                                            child.name,
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
                                          key: (
                                            (path ?? "") +
                                            name +
                                            `.${child.name}`
                                          )
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                                          render: (item, index) =>
                                            RenderField({
                                              ...child,
                                              ...(options.callback
                                                ? options.callback(
                                                    item,
                                                    (path ?? "") +
                                                      name
                                                        .toLowerCase()
                                                        .replace(/ /g, "_")
                                                        .replace(
                                                          /[^\[a-zA-Zء-ي]-_+/g,
                                                          ""
                                                        ) +
                                                      `.${index}`
                                                  )
                                                : {}),
                                              ...(options.disabled_items &&
                                              options.disabled_items.includes(
                                                index
                                              )
                                                ? [
                                                    ...options.disabled_items,
                                                    {
                                                      input_props: {
                                                        disabled: true,
                                                      },
                                                    },
                                                  ]
                                                : {}),
                                              label_props: {
                                                showLabel: false,
                                              },
                                              path:
                                                (path ?? "") +
                                                name
                                                  .toLowerCase()
                                                  .replace(/ /g, "_")
                                                  .replace(
                                                    /[^\[a-zA-Zء-ي]-_+/g,
                                                    ""
                                                  ) +
                                                `.${index}.`,
                                              collapsible: false,
                                            }),
                                        })),
                                        {
                                          title: "Actions",
                                          fixed: "right",
                                          align: "center",
                                          width: 100,
                                          key: "actions",
                                          render(row, index) {
                                            return h(
                                              NButton,
                                              {
                                                disabled:
                                                  options.disabled_items &&
                                                  options.disabled_items.includes(
                                                    index
                                                  ),
                                                strong: true,
                                                secondary: true,
                                                circle: true,
                                                type: "error",
                                                onClick() {
                                                  objectPath.del(
                                                    single.value,
                                                    (path ?? "") +
                                                      name
                                                        .toLowerCase()
                                                        .replace(/ /g, "_")
                                                        .replace(
                                                          /[^\[a-zA-Zء-ي]-_+/g,
                                                          ""
                                                        ) +
                                                      `.${index}`
                                                  );
                                                },
                                              },
                                              {
                                                icon: () =>
                                                  h(NIcon, () => h(Trash)),
                                              }
                                            );
                                          },
                                        },
                                      ],
                                      data: objectPath.get(
                                        single.value,
                                        (path ?? "") +
                                          name
                                            .toLowerCase()
                                            .replace(/ /g, "_")
                                            .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                                      ),
                                      scrollX: options.children.reduce(
                                        (accumulator, child) => {
                                          return (
                                            accumulator +
                                            (child.name &&
                                            child.name.length > 10
                                              ? child.name.length * 15
                                              : 200)
                                          );
                                        },
                                        100
                                      ),
                                    })
                                : null
                              : options.children.map((child) =>
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
                                ),
                        }
                      ),
                  }
                );
          default:
            console.log(
              objectPath.get(
                single.value,
                (path ?? "") +
                  name
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
              )
            );
            return null;
        }
      };
    watch(ShowAssets, async (v) => {
      Assets.value = null;
      if (v)
        Assets.value = (
          await useFetch(
            `https://api.inicontent.com/${route.params.db_slug}/assets`,
            {
              headers:
                User.value && User.value.username && User.value.password
                  ? {
                      Authorization:
                        "Basic " +
                        Buffer.from(
                          `${User.value.username}:${User.value.password}`
                        ).toString("base64"),
                    }
                  : {},
              transform: (res) => res.result,
              initialCache: false,
            }
          )
        ).data.value;
    });

    return () => [
      h(
        NDrawer,
        {
          show: Drawer.value.show,
          "on-update:show": (v) => (Drawer.value.show = v),
          resizable: true,
          placement: Language.value === "ar" ? "left" : "right",
        },
        () =>
          h(
            NDrawerContent,
            {
              title: Drawer.value.id
                ? `${
                    Drawer.value.table.charAt(0).toUpperCase() +
                    Drawer.value.table.slice(1).replaceAll("_", " ")
                  } | ${Drawer.value.id}`
                : `New ${
                    Drawer.value.table.charAt(0).toUpperCase() +
                    Drawer.value.table.slice(1).replaceAll("_", " ")
                  }`,
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
                    h(RenderFields, {
                      modelValue: Drawer.value.data,
                      schema: database.value.tables.find(
                        (item) => item.slug === Drawer.value.table
                      ).schema,
                    })
                ),
            }
          )
      ),
      h(NScrollbar, { xScrollable: true }, () =>
        Schema.map((item) => RenderField(item))
      ),
      h(
        NDrawer,
        {
          show: ShowAssets.value,
          "on-update:show": (v) => (ShowAssets.value = v),
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
                            ...Assets.value.filter((Asset) =>
                              []
                                .concat(
                                  objectPath.get(
                                    single.value,
                                    CurrentField.value.path
                                  )
                                )
                                .includes(Asset.public_url)
                            ),
                            ...Assets.value.filter(
                              (Asset) =>
                                ![]
                                  .concat(
                                    objectPath.get(
                                      single.value,
                                      CurrentField.value.path
                                    )
                                  )
                                  .includes(Asset.public_url)
                            ),
                          ].map((Asset) =>
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
                                        objectPath.get(
                                          single.value,
                                          CurrentField.value.path
                                        )
                                      )
                                      .includes(Asset.public_url)
                                      ? "success"
                                      : "error",
                                  },
                                  {
                                    icon: () =>
                                      h(NIcon, () =>
                                        h(
                                          []
                                            .concat(
                                              objectPath.get(
                                                single.value,
                                                CurrentField.value.path
                                              )
                                            )
                                            .includes(Asset.public_url)
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
                                            h(FileText, {
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
