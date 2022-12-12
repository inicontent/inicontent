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
import {
  getProperty,
  setProperty,
  hasProperty,
  deleteProperty,
} from "dot-prop";

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
        if (CurrentField.value.options.single) {
          if (getProperty(single.value, CurrentField.value.path) === url)
            deleteProperty(single.value, CurrentField.value.path);
          else setProperty(single.value, CurrentField.value.path, url);
        } else {
          if (hasProperty(single.value, CurrentField.value.path)) {
            if (
              getProperty(single.value, CurrentField.value.path).includes(url)
            )
              deleteProperty(
                single.value,
                CurrentField.value.path +
                  `[${getProperty(
                    single.value,
                    CurrentField.value.path
                  ).indexOf(url)}]`
              );
            else
              setProperty(
                single.value,
                CurrentField.value.path +
                  `[${
                    getProperty(single.value, CurrentField.value.path).length
                  }]`,
                url
              );
          } else
            setProperty(single.value, `${CurrentField.value.path}[0]`, url);
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
            return options.values && options.values.length > 8
              ? h(
                  NFormItem,
                  {
                    label: name,
                    path: path ?? pathTo(Schema, key),
                    rule: {
                      required: options.required,
                      trigger: "change",
                      message: "Please select an option",
                    },
                  },
                  () =>
                    h(NSelect, {
                      value: getProperty(
                        single.value,
                        path ?? pathTo(Schema, key)
                      ),
                      onUpdateValue: (value) =>
                        setProperty(
                          single.value,
                          path ?? pathTo(Schema, key),
                          value
                        ),
                      options: options.values.map((v) => ({
                        value: v.charAt(0) === "!" ? v.substring(1) : v,
                        label: v.charAt(0) === "!" ? v.substring(1) : v,
                        disabled:
                          v.charAt(0) === "!" && User.value.role !== "admin",
                      })),
                      filterable: true,
                      multiple:
                        options.hasOwnProperty("single") &&
                        options.single === false,
                    })
                )
              : !options.hasOwnProperty("single") || options.single === true
              ? h(
                  NFormItem,
                  {
                    label: name,
                    path: path ?? pathTo(Schema, key),
                    rule: {
                      required: options.required,
                      trigger: "change",
                      message: "Please select an option",
                    },
                  },
                  () =>
                    h(
                      NRadioGroup,
                      {
                        value: getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ),
                        onUpdateValue: (value) =>
                          setProperty(
                            single.value,
                            path ?? pathTo(Schema, key),
                            value
                          ),
                      },
                      () =>
                        h(NSpace, () =>
                          options.values.map((item) =>
                            h(NRadio, {
                              value:
                                item.charAt(0) === "!"
                                  ? item.substring(1)
                                  : item,
                              label:
                                item.charAt(0) === "!"
                                  ? item.substring(1)
                                  : item,
                              disabled:
                                item.charAt(0) === "!" &&
                                User.value.role !== "admin",
                            })
                          )
                        )
                    )
                )
              : h(
                  NFormItem,
                  {
                    label: name,
                    path: path ?? pathTo(Schema, key),
                    rule: {
                      type: "array",
                      required: options.required,
                      trigger: "change",
                      message: "Please select an option",
                    },
                  },
                  () =>
                    h(
                      NCheckboxGroup,
                      {
                        value: getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ),
                        onUpdateValue: (value) =>
                          setProperty(
                            single.value,
                            path ?? pathTo(Schema, key),
                            value
                          ),
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
                              h(NCheckbox, {
                                value:
                                  item.charAt(0) === "!"
                                    ? item.substring(1)
                                    : item,
                                label:
                                  item.charAt(0) === "!"
                                    ? item.substring(1)
                                    : item,
                                disabled:
                                  item.charAt(0) === "!" &&
                                  User.value.role !== "admin",
                              })
                            )
                        )
                    )
                );
          case "tags":
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
              },
              () =>
                h(NSelect, {
                  value: getProperty(single.value, path ?? pathTo(Schema, key)),
                  onUpdateValue: (value) =>
                    setProperty(
                      single.value,
                      path ?? pathTo(Schema, key),
                      value
                    ),
                  filterable: true,
                  multiple: true,
                  tag: true,
                  showArrow: false,
                  show: false,
                })
            );
          case "table":
            return h(
              NFormItem,
              {
                path: path ?? pathTo(Schema, key),
                rule: {
                  type:
                    !options.hasOwnProperty("single") || options.single === true
                      ? "object"
                      : "array",
                  required: options.required,
                  trigger: "change",
                  message: "Please select an option",
                },
              },
              {
                label: () =>
                  h(NSpace, () => [
                    name.charAt(0).toUpperCase() +
                      name.slice(1).replaceAll("_", " "),
                    (!options.hasOwnProperty("single") ||
                      options.single === true) &&
                    hasProperty(
                      single.value,
                      (path ?? pathTo(Schema, key)) + ".id"
                    )
                      ? h(
                          NButton,
                          {
                            circle: true,
                            secondary: true,
                            size: "tiny",
                            onClick: () => {
                              Drawer.value.table = name;
                              Drawer.value.id = getProperty(
                                single.value,
                                (path ?? pathTo(Schema, key)) + ".id"
                              );
                              Drawer.value.data = getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
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
                    value: hasProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    )
                      ? !options.hasOwnProperty("single") ||
                        options.single === true
                        ? []
                            .concat(
                              getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
                              )
                            )
                            .map((i) => i.id)[0]
                        : []
                            .concat(
                              getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
                              )
                            )
                            .map((i) => i.id)
                      : null,
                    onUpdateValue: (_value, option) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        Array.isArray(option)
                          ? option.map((i) => i.raw)
                          : option.raw
                      ),
                    options: getProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    )
                      ? mergeArrayOfObjects(
                          []
                            .concat(
                              getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
                              )
                            )
                            .map((single_value) => ({
                              label: options.label
                                .map((single_label) =>
                                  getProperty(single_value, single_label)
                                )
                                .join(" "),
                              value: single_value.id,
                              image: options.image
                                ? getProperty(single_value, options.image)
                                : null,
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
                                style: {
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
                                  style: {
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
                                        style: {
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
                                          getProperty(
                                            single_result,
                                            single_label
                                          )
                                        )
                                        .join(" "),
                                      value: single_result.id,
                                      image: options.image
                                        ? Array.isArray(
                                            getProperty(
                                              single_result,
                                              options.image
                                            )
                                          )
                                          ? getProperty(
                                              single_result,
                                              `${options.image}[0]`
                                            )
                                          : getProperty(
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
                path: path ?? pathTo(Schema, key),
                rule:
                  !options.hasOwnProperty("single") || options.single === true
                    ? {
                        required: options.required,
                        trigger: "change",
                        message: "Please upload a file",
                      }
                    : {
                        type: "array",
                        required: options.required,
                        trigger: "change",
                        message: "Please upload some files",
                      },
              },
              {
                label: () =>
                  h(
                    "div",
                    {
                      style: {
                        display: "flex",
                        gap: "5px",
                      },
                    },
                    [
                      name,
                      h(
                        NPopover,
                        {
                          trigger: "click",
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
                                    ? setProperty(
                                        single.value,
                                        path ?? pathTo(Schema, key),
                                        value
                                      )
                                    : getProperty(
                                        single.value,
                                        path ?? pathTo(Schema, key)
                                      )
                                    ? setProperty(
                                        single.value,
                                        (path ?? pathTo(Schema, key)) +
                                          `[${
                                            getProperty(
                                              single.value,
                                              path ?? pathTo(Schema, key)
                                            ).length
                                          }]`,
                                        value
                                      )
                                    : setProperty(
                                        single.value,
                                        (path ?? pathTo(Schema, key)) + `[0]`,
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
                              path: path ?? pathTo(Schema, key),
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
                        setProperty(
                          single.value,
                          path ?? pathTo(Schema, key),
                          files.map((file) => file.url ?? file)
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
                      fileList: hasProperty(
                        single.value,
                        path ?? pathTo(Schema, key)
                      )
                        ? []
                            .concat(
                              getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
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
                      onRemove: ({ file }) => {
                        if (
                          !options.hasOwnProperty("single") ||
                          options.single === true
                        )
                          deleteProperty(
                            single.value,
                            path ?? pathTo(Schema, key)
                          );
                        else
                          deleteProperty(
                            single.value,
                            (path ?? pathTo(Schema, key)) +
                              `[${getProperty(
                                single.value,
                                path ?? pathTo(Schema, key)
                              ).indexOf(file.url)}]`
                          );
                        return true;
                      },
                      onFinish: ({ file, event }) => {
                        const src = JSON.parse(event.target.response).result
                          .public_url;
                        if (
                          !options.hasOwnProperty("single") ||
                          options.single === true
                        )
                          setProperty(
                            single.value,
                            path ?? pathTo(Schema, key),
                            src
                          );
                        else if (
                          hasProperty(single.value, path ?? pathTo(Schema, key))
                        )
                          setProperty(
                            single.value,
                            (path ?? pathTo(Schema, key)) +
                              `[${
                                getProperty(
                                  single.value,
                                  path ?? pathTo(Schema, key)
                                ).length
                              }]`,
                            src
                          );
                        else
                          setProperty(
                            single.value,
                            (path ?? pathTo(Schema, key)) + `[0]`,
                            src
                          );
                        file.url = src;
                        file.name = src
                          .split("/")
                          .pop()
                          .split("#")[0]
                          .split("?")[0];
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
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: options.required,
                  validator(rule, value) {
                    if (!value)
                      return options.required
                        ? new Error("This field is required")
                        : true;
                    else if (value.charAt(0) === "#") return true;
                    else if (
                      !/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(
                        value
                      )
                    )
                      return new Error("This is not a valid link");
                    return true;
                  },
                  trigger: ["input", "blur"],
                },
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "url" },
                    value: getProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        value
                      ),
                    placeholder: name,
                    clearable: true,
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
                path: path ?? pathTo(Schema, key),
                rule: {
                  type: "email",
                  required: options.required,
                  trigger: ["input", "blur"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please write something")
                      : true,
                },
              },
              () =>
                h(
                  NInput,
                  {
                    inputProps: { type: "email" },
                    options: EmailAutoComplete,
                    value: getProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        value
                      ),
                    placeholder: name,
                    clearable: true,
                  },
                  {
                    suffix: () => h(NIcon, () => h(At)),
                  }
                )
            );
          case "date":
            if (!hasProperty(single.value, path ?? pathTo(Schema, key)))
              setProperty(
                single.value,
                path ?? pathTo(Schema, key),
                Date.now() / 1000
              );
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
                rule: {
                  type: "number",
                  required: options.required,
                  trigger: ["blur", "change"],
                  message: "Please select a valid date",
                },
              },
              () =>
                h(NDatePicker, {
                  value: hasProperty(single.value, path ?? pathTo(Schema, key))
                    ? getProperty(single.value, path ?? pathTo(Schema, key)) *
                      1000
                    : Date.now(),
                  onConfirm: (e) =>
                    setProperty(
                      single.value,
                      path ?? pathTo(Schema, key),
                      e / 1000
                    ),
                  type: "datetime",
                })
            );
          case "editor":
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  message: "Please write something",
                },
              },
              () =>
                h(RichEditor, {
                  modelValue: getProperty(
                    single.value,
                    path ?? pathTo(Schema, key)
                  ),
                  "onUpdate:modelValue": (v) =>
                    setProperty(single.value, path ?? pathTo(Schema, key), v),
                })
            );
          case "textarea":
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please write something")
                      : true,
                },
              },
              () =>
                h(
                  NInput,
                  {
                    type: "textarea",
                    value: hasProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    )
                      ? getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ).toString()
                      : null,
                    onUpdateValue: (value) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        value
                      ),
                    placeholder: name,
                    showCount: true,
                    clearable: true,
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
                path: path ?? pathTo(Schema, key),
                rule: {
                  type: "number",
                  required: options.required,
                  trigger: ["blur", "change"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
              },
              () =>
                h(
                  NInputNumber,
                  {
                    value: getProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    ),
                    onUpdateValue: (value) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        value
                      ),
                    placeholder: name,
                    showButton: false,
                    clearable: true,
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
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
              },
              () =>
                h(
                  NInput,
                  {
                    value: hasProperty(
                      single.value,
                      path ?? pathTo(Schema, key)
                    )
                      ? getProperty(
                          single.value,
                          path ?? pathTo(Schema, key)
                        ).toString()
                      : null,
                    onUpdateValue: (value) =>
                      setProperty(
                        single.value,
                        path ?? pathTo(Schema, key),
                        value.toString()
                      ),
                    placeholder: name,
                    clearable: true,
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
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: options.required,
                  trigger: ["blur", "input"],
                  validator: (_rule, value) =>
                    options.required && value === null
                      ? new Error("Please type a valid number")
                      : true,
                },
              },
              () =>
                h(NInput, {
                  type: "password",
                  showPasswordOn: "click",
                  value: getProperty(single.value, path ?? pathTo(Schema, key)),
                  onUpdateValue: (value) =>
                    setProperty(
                      single.value,
                      path ?? pathTo(Schema, key),
                      value
                    ),
                  placeholder: name,
                })
            );
          case "boolean":
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
              },
              () =>
                h(NSwitch, {
                  value: getProperty(single.value, path ?? pathTo(Schema, key)),
                  onUpdateValue: (value) =>
                    setProperty(
                      single.value,
                      path ?? pathTo(Schema, key),
                      value
                    ),
                })
            );
          case "role":
            return h(
              NFormItem,
              {
                label: name,
                path: path ?? pathTo(Schema, key),
                rule: {
                  required: true,
                  trigger: "change",
                  message: "Please select an option",
                },
              },
              () =>
                h(NSelect, {
                  value: getProperty(single.value, path ?? pathTo(Schema, key)),
                  onUpdateValue: (value) =>
                    setProperty(
                      single.value,
                      path ?? pathTo(Schema, key),
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
            return h(
              NCollapse,
              {
                style: {
                  margin: "20px 0",
                },
                arrowPlacement: "right",
                accordion: true,
              },
              {
                arrow: () =>
                  options.duplicatable &&
                  (!hasProperty(single.value, path ?? pathTo(Schema, key)) ||
                    getProperty(single.value, path ?? pathTo(Schema, key))
                      .length === 0)
                    ? ""
                    : h(NIcon, () => h(ChevronRight)),
                default: () =>
                  h(
                    NCollapseItem,
                    {
                      disabled:
                        DisabledItem.value[path ?? pathTo(Schema, key)] ||
                        (options.duplicatable &&
                          (!hasProperty(
                            single.value,
                            path ?? pathTo(Schema, key)
                          ) ||
                            getProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
                            ).length === 0)),
                      title: name,
                      name: path ?? pathTo(Schema, key),
                    },
                    {
                      "header-extra": () =>
                        options.duplicatable
                          ? h(
                              NButton,
                              {
                                onmouseenter: () =>
                                  (DisabledItem.value[
                                    path ?? pathTo(Schema, key)
                                  ] = true),
                                onmouseleave: () =>
                                  (DisabledItem.value[
                                    path ?? pathTo(Schema, key)
                                  ] = false),
                                size: "small",
                                round: true,
                                onClick: () =>
                                  setProperty(
                                    single.value,
                                    (path ?? pathTo(Schema, key)) +
                                      "[" +
                                      (getProperty(
                                        single.value,
                                        path ?? pathTo(Schema, key)
                                      )?.length ?? 0) +
                                      "]",
                                    {}
                                  ),
                              },
                              {
                                icon: () => h(NIcon, () => h(Plus)),
                              }
                            )
                          : null,
                      default: () =>
                        options.duplicatable
                          ? hasProperty(
                              single.value,
                              path ?? pathTo(Schema, key)
                            )
                            ? h(
                                NCollapse,
                                {
                                  accordion: true,
                                },
                                () =>
                                  getProperty(
                                    single.value,
                                    path ?? pathTo(Schema, key)
                                  ).map((item, index) =>
                                    h(
                                      NCollapseItem,
                                      {
                                        title: name + " " + (index + 1),
                                        name:
                                          (path ?? pathTo(Schema, key)) +
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
                                                deleteProperty(
                                                  single.value,
                                                  (path ??
                                                    pathTo(Schema, key)) +
                                                    "." +
                                                    index
                                                ),
                                            },
                                            {
                                              icon: () =>
                                                h(NIcon, () => h(Trash)),
                                            }
                                          ),
                                        default: () =>
                                          options.children.map((child) =>
                                            RenderField({
                                              ...child,
                                              path:
                                                pathTo(
                                                  Schema,
                                                  child.key
                                                ).substr(
                                                  0,
                                                  pathTo(
                                                    Schema,
                                                    child.key
                                                  ).lastIndexOf(".")
                                                ) +
                                                `[${index}]` +
                                                pathTo(
                                                  Schema,
                                                  child.key
                                                ).substr(
                                                  pathTo(
                                                    Schema,
                                                    child.key
                                                  ).lastIndexOf(".")
                                                ),
                                            })
                                          ),
                                      }
                                    )
                                  )
                              )
                            : null
                          : options.children.map((child) => RenderField(child)),
                    }
                  ),
              }
            );
          default:
            console.log(getProperty(single.value, path ?? pathTo(Schema, key)));
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
        "style",
        {},
        {
          default: () => `
            .n-input-number,
            .n-date-picker {
              width: 100%;
            }`,
        }
      ),
      h(
        NDrawer,
        {
          show: Drawer.value.show,
          "on-update:show": (v) => (Drawer.value.show = v),
          resizable: true,
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
            { id: "assets_modal", nativeScrollbar: false, closable: false },
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
              default: () =>
                Array.isArray(Assets.value)
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
                            ...Assets.value.filter(
                              (Asset) =>
                                (Array.isArray(
                                  getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  )
                                ) &&
                                  getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  ).includes(Asset.public_url)) ||
                                getProperty(
                                  single.value,
                                  CurrentField.value.path
                                ) === Asset.public_url
                            ),
                            ...Assets.value.filter(
                              (Asset) =>
                                (!Array.isArray(
                                  getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  )
                                ) &&
                                  getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  ) !== Asset.public_url) ||
                                (Array.isArray(
                                  getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  )
                                ) &&
                                  !getProperty(
                                    single.value,
                                    CurrentField.value.path
                                  ).includes(Asset.public_url))
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
                                    type:
                                      (Array.isArray(
                                        getProperty(
                                          single.value,
                                          CurrentField.value.path
                                        )
                                      ) &&
                                        getProperty(
                                          single.value,
                                          CurrentField.value.path
                                        ).includes(Asset.public_url)) ||
                                      getProperty(
                                        single.value,
                                        CurrentField.value.path
                                      ) === Asset.public_url
                                        ? "success"
                                        : "error",
                                  },
                                  {
                                    icon: () =>
                                      h(NIcon, () =>
                                        h(
                                          (Array.isArray(
                                            getProperty(
                                              single.value,
                                              CurrentField.value.path
                                            )
                                          ) &&
                                            getProperty(
                                              single.value,
                                              CurrentField.value.path
                                            ).includes(Asset.public_url)) ||
                                            getProperty(
                                              single.value,
                                              CurrentField.value.path
                                            ) === Asset.public_url
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
                    ),
            }
          )
      ),
    ];
  },
});
