import {
  NDataTable,
  NCard,
  NA,
  NIcon,
  NIconWrapper,
  NTag,
  NTime,
  NSpace,
  NText,
  NPopover,
  NImageGroup,
  NImage,
  NButton,
  NEllipsis,
  NPopconfirm,
  useMessage,
  NCollapse,
  NCollapseItem,
  NAvatar,
  NDrawer,
  NDrawerContent,
  NForm,
  NInputGroup,
  NInput,
  NDatePicker,
  NSelect,
} from "naive-ui";
import {
  Check,
  X,
  Pencil,
  Table,
  Trash,
  DeviceFloppy,
  Key,
  Search,
  Settings,
  Plus,
  Minus,
  Forms,
  AlignJustified,
  ListNumbers,
  At,
  Link,
  Upload,
  Tags,
  Calendar,
  ToggleLeft,
  BoxMultiple,
  LetterCase,
  Code,
  ListDetails,
  Box,
  ArrowBarRight,
  ArrowBarLeft,
  User as UserIcon,
  FileText,
  LetterA,
  LetterB,
  LetterC,
  LetterD,
  LetterE,
  LetterF,
  LetterG,
  LetterH,
  LetterI,
  LetterJ,
  LetterK,
  LetterL,
  LetterM,
  LetterN,
  LetterO,
  LetterP,
  LetterQ,
  LetterR,
  LetterS,
  LetterT,
  LetterU,
  LetterV,
  LetterW,
  LetterX,
  LetterY,
  LetterZ,
} from "@vicons/tabler";
import { Buffer } from "buffer";
import { NuxtLink } from "#components";
import { getProperty } from "dot-prop";

export default defineComponent({
  props: {
    db: {
      type: String,
      default: "",
    },
    table: {
      type: String,
      default: "",
    },
  },
  setup: async (props) => {
    const RenderSchema = resolveComponent("RenderSchema"),
      RenderFields = resolveComponent("RenderFields");

    const LettersIcons = {
        a: LetterA,
        b: LetterB,
        c: LetterC,
        d: LetterD,
        e: LetterE,
        f: LetterF,
        g: LetterG,
        h: LetterH,
        i: LetterI,
        j: LetterJ,
        k: LetterK,
        l: LetterL,
        m: LetterM,
        n: LetterN,
        o: LetterO,
        p: LetterP,
        q: LetterQ,
        r: LetterR,
        s: LetterS,
        t: LetterT,
        u: LetterU,
        v: LetterV,
        w: LetterW,
        x: LetterX,
        y: LetterY,
        z: LetterZ,
      },
      FieldsList = [
        {
          label: "Text",
          key: "input",
          icon: () => h(NIcon, () => h(Forms)),
          children: [
            {
              label: "Short Text",
              key: "text",
              icon: () => h(NIcon, () => h(LetterCase)),
            },
            {
              label: "Long Text",
              key: "textarea",
              icon: () => h(NIcon, () => h(AlignJustified)),
            },
            {
              label: "Rich Editor",
              key: "editor",
              icon: () => h(NIcon, () => h(Code)),
            },
            {
              label: "Number",
              key: "number",
              icon: () => h(NIcon, () => h(ListNumbers)),
            },
            {
              label: "Password",
              key: "password",
              icon: () => h(NIcon, () => h(Key)),
            },
            {
              label: "Email",
              key: "email",
              icon: () => h(NIcon, () => h(At)),
            },
            {
              label: "Link",
              key: "url",
              icon: () => h(NIcon, () => h(Link)),
            },
          ],
        },
        {
          label: "Upload",
          key: "upload",
          icon: () => h(NIcon, () => h(Upload)),
        },
        {
          label: "Tags",
          key: "tags",
          icon: () => h(NIcon, () => h(Tags)),
        },
        {
          label: "Date",
          key: "date",
          icon: () => h(NIcon, () => h(Calendar)),
        },
        {
          label: "Toggle",
          key: "boolean",
          icon: () => h(NIcon, () => h(ToggleLeft)),
        },
        {
          label: "List",
          key: "list",
          icon: () => h(NIcon, () => h(ListDetails)),
        },
        {
          label: "Group",
          key: "group",
          icon: () => h(NIcon, () => h(BoxMultiple)),
        },
        {
          label: "Table",
          key: "table",
          icon: () => h(NIcon, () => h(Table)),
        },
      ];

    const Loading = useState("Loading", () => ({})),
      Window = useState("Window"),
      searchInput = useState(() => null),
      searchArray = useState(() => []),
      searchField = useState(() => []),
      database = useState("database"),
      ShowSchemaModal = useState("ShowSchemaModal", () => false),
      ShowDeleted = useState(() => false);
    Loading.value["TableData"] = false;
    Loading.value["DrawerContent"] = false;
    Loading.value["Drawer"] = {};
    const User = useState("User"),
      message = useMessage(),
      DrawerFormRef = useState(() => null),
      Drawer = useState("Drawer", () => ({
        show: false,
        id: null,
        table: null,
        data: {},
      })),
      LoadDrawer = async () => {
        Loading.value["Drawer"] = {
          ...Loading.value["Drawer"],
          [`${Drawer.value.table}_${Drawer.value.id}`]: true,
        };
        await useFetch(
          `https://api.inicontent.com/${props.db}/${Drawer.value.table}/${Drawer.value.id}`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            transform: (res) => (Drawer.value.data = res.result),
            initialCache: false,
          }
        );
        Loading.value["Drawer"] = {
          ...Loading.value["Drawer"],
          [`${Drawer.value.table}_${Drawer.value.id}`]: false,
        };
        Drawer.value.show = true;
      },
      UpdateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["DrawerContent"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/${props.db}/${Drawer.value.table}/${Drawer.value.id}!`,
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
              Loading.value["DrawerContent"] = false;
              Drawer.value.show = false;
              Drawer.value.data = {};
              return refreshTableData();
            } else message.error(data.value.message.en);
            Loading.value["DrawerContent"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      CreateDrawer = async () => {
        DrawerFormRef.value?.validate(async (errors) => {
          if (!errors) {
            Loading.value["DrawerContent"] = true;
            const { data } = await useFetch(
              `https://api.inicontent.com/${props.db}/${Drawer.value.table}`,
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
              Loading.value["DrawerContent"] = false;
              Drawer.value.show = false;
              TableData.value.result.unshift(data.value.result);
              Drawer.value.data = {};
            } else message.error(data.value.message.en);
            Loading.value["DrawerContent"] = false;
          } else message.error("The inputs are Invalid");
        });
      },
      TableDataRef = useState(() => null),
      checkedRowKeys = useState(() => []),
      pagination = ref({
        page: 1,
        pageCount: 1,
        showSizePicker: true,
        pageSize: 15,
        pageSizes: [15, 30, 60, 100],
        prefix: ({ itemCount }) => itemCount,
        onChange: async (currentPage) => (
          (pagination.value.page = currentPage), refreshTableData()
        ),
        onUpdatePageSize: async (pageSize) => (
          (pagination.value.pageSize = pageSize), refreshTableData()
        ),
      }),
      { data: TableData, refresh: refreshTableData } = await useLazyAsyncData(
        `TableData_${props.db}-${props.table}`,
        () =>
          $fetch(`https://api.inicontent.com/${props.db}/${props.table}`, {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            onRequest: () => (Loading.value["TableData"] = true),
            params: {
              _options: JSON.stringify({
                page: pagination.value.page,
                per_page: pagination.value.pageSize,
                show_deleted: ShowDeleted.value,
                columns:
                  database.value.tables &&
                  database.value.tables.find(
                    (item) => item.slug === props.table
                  )?.schema
                    ? database.value.tables
                        .find((item) => item.slug === props.table)
                        .schema.map((item, _index, schema) =>
                          GetPathes(schema, item)
                        )
                        .flat(Infinity)
                    : [],
              }),
              _where: searchInput.value
                ? ShowDeleted.value
                  ? JSON.stringify(
                      JSON.parse(searchInput.value).push([
                        ["deleted_at", ">", "0"],
                      ])
                    )
                  : searchInput.value
                : ShowDeleted.value
                ? JSON.stringify(["deleted_at", ">", "0"])
                : null,
            },
          }),
        {
          transform: (res) => {
            Loading.value["TableData"] = false;
            if (res.options.total < res.options.per_page)
              pagination.value.showSizePicker = false;
            pagination.value.pageCount = res.options.total_pages;
            pagination.value.itemCount = res.options.total;
            return res;
          },
        }
      ),
      DELETE = async (id) => {
        Loading.value["TableData"] = true;
        await useFetch(
          `https://api.inicontent.com/${props.db}/${props.table}/${id}`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            method: "DELETE",
            initialCache: false,
          }
        );
        TableData.value.result = TableData.value.result.filter(
          (item) => item.id !== id
        );
        pagination.value.itemCount--;
        message.success("Deleted Successfully");
        Loading.value["TableData"] = false;
      },
      RenderColumn = (Column, item, row) => {
        switch (item.type) {
          case "table":
            return Column &&
              ((Array.isArray(Column) &&
                Column.filter((i) => i.id).length > 0) ||
                Column.id)
              ? !item.hasOwnProperty("single") || item.single
                ? Window.value.width >= 700
                  ? h(
                      NButton,
                      {
                        onClick: () => (
                          (Drawer.value.id = [].concat(Column)[0].id),
                          (Drawer.value.table = item.name),
                          (Drawer.value.data = {}),
                          LoadDrawer()
                        ),
                        loading:
                          Loading.value["Drawer"][
                            `${item.name}_${[].concat(Column)[0].id}`
                          ],
                        size: "small",
                        round: true,
                      },
                      item.image
                        ? {
                            icon: () =>
                              h(NIcon, () =>
                                h(NAvatar, {
                                  style: {
                                    width: "18px",
                                    height: "18px",
                                  },
                                  round: true,
                                  src: []
                                    .concat(getProperty(Column, item.image))
                                    .map((link) =>
                                      link &&
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
                                        ? `${link}?fit=18`
                                        : link
                                    )[0],
                                })
                              ),
                            default: () =>
                              h(
                                NEllipsis,
                                {
                                  tooltip: true,
                                  style: {
                                    maxWidth:
                                      (item.name && item.name.length > 10
                                        ? item.name.length * 15
                                        : 150) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    .map((single_label) =>
                                      getProperty(Column, single_label)
                                    )
                                    .join(" ")
                              ),
                          }
                        : {
                            icon: () =>
                              h(NIcon, () =>
                                h(LettersIcons[item.name.charAt(0)] ?? Table)
                              ),
                            default: () =>
                              h(
                                NEllipsis,
                                {
                                  tooltip: true,
                                  style: {
                                    maxWidth:
                                      (item.name && item.name.length > 10
                                        ? item.name.length * 15
                                        : 150) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    .map((single_label) =>
                                      getProperty(Column, single_label)
                                    )
                                    .join(" ")
                              ),
                          }
                    )
                  : h(
                      NuxtLink,
                      { to: `${item.name}/${[].concat(Column)[0].id}` },
                      () =>
                        h(
                          NButton,
                          {
                            size: "small",
                            round: true,
                          },
                          item.image
                            ? {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(NAvatar, {
                                      style: {
                                        width: "18px",
                                        height: "18px",
                                      },
                                      round: true,
                                      src: []
                                        .concat(getProperty(Column, item.image))
                                        .map((link) =>
                                          link &&
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
                                            ? `${link}?fit=18`
                                            : link
                                        )[0],
                                    })
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.name && item.name.length > 10
                                            ? item.name.length * 15
                                            : 150) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        .map((single_label) =>
                                          getProperty(Column, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      LettersIcons[item.name.charAt(0)] ?? Table
                                    )
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.name && item.name.length > 10
                                            ? item.name.length * 15
                                            : 150) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        .map((single_label) =>
                                          getProperty(Column, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                        )
                    )
                : [].concat(Column).map((col) =>
                    Window.value.width >= 700
                      ? h(
                          NButton,
                          {
                            onClick: () => (
                              (Drawer.value.id = col.id),
                              (Drawer.value.table = item.name),
                              (Drawer.value.data = {}),
                              LoadDrawer()
                            ),
                            loading:
                              Loading.value["Drawer"][`${item.name}_${col.id}`],
                            size: "small",
                            round: true,
                          },
                          item.image
                            ? {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(NAvatar, {
                                      style: {
                                        width: "18px",
                                        height: "18px",
                                      },
                                      round: true,
                                      src: []
                                        .concat(getProperty(col, item.image))
                                        .map((link) =>
                                          link &&
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
                                            ? `${link}?fit=18`
                                            : link
                                        )[0],
                                    })
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.name && item.name.length > 10
                                            ? item.name.length * 15
                                            : 150) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        .map((single_label) =>
                                          getProperty(col, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      LettersIcons[item.name.charAt(0)] ?? Table
                                    )
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.name && item.name.length > 10
                                            ? item.name.length * 15
                                            : 150) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        .map((single_label) =>
                                          getProperty(col, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                        )
                      : h(NuxtLink, { to: `${item.name}/${col.id}` }, () =>
                          h(
                            NButton,
                            {
                              size: "small",
                              round: true,
                            },
                            item.image
                              ? {
                                  icon: () =>
                                    h(NIcon, () =>
                                      h(NAvatar, {
                                        style: {
                                          width: "18px",
                                          height: "18px",
                                        },
                                        round: true,
                                        src: []
                                          .concat(getProperty(col, item.image))
                                          .map((link) =>
                                            link &&
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
                                              ? `${link}?fit=18`
                                              : link
                                          )[0],
                                      })
                                    ),
                                  default: () =>
                                    h(
                                      NEllipsis,
                                      {
                                        tooltip: true,
                                        style: {
                                          maxWidth:
                                            (item.name && item.name.length > 10
                                              ? item.name.length * 15
                                              : 150) + "px",
                                        },
                                      },
                                      () =>
                                        item.label
                                          .map((single_label) =>
                                            getProperty(col, single_label)
                                          )
                                          .join(" ")
                                    ),
                                }
                              : {
                                  icon: () =>
                                    h(NIcon, () =>
                                      h(
                                        LettersIcons[item.name.charAt(0)] ??
                                          Table
                                      )
                                    ),
                                  default: () =>
                                    h(
                                      NEllipsis,
                                      {
                                        tooltip: true,
                                        style: {
                                          maxWidth:
                                            (item.name && item.name.length > 10
                                              ? item.name.length * 15
                                              : 150) + "px",
                                        },
                                      },
                                      () =>
                                        item.label
                                          .map((single_label) =>
                                            getProperty(col, single_label)
                                          )
                                          .join(" ")
                                    ),
                                }
                          )
                        )
                  )
              : h(NText, { depth: 3 }, () => "--");
          case "email":
            return Column
              ? h(
                  NA,
                  { href: `mailto:${Column}`, target: "_blank" },
                  {
                    default: () =>
                      h(
                        NEllipsis,
                        {
                          tooltip: true,
                          style: {
                            maxWidth:
                              (item.name && item.name.length > 10
                                ? item.name.length * 15
                                : 150) + "px",
                          },
                        },
                        () => Column
                      ),
                  }
                )
              : h(NText, { depth: 3 }, () => "--");
          case "password":
            return Column
              ? h(
                  NEllipsis,
                  {
                    tooltip: false,
                    style: {
                      maxWidth:
                        (item.name && item.name.length > 10
                          ? item.name.length * 15
                          : 150) + "px",
                    },
                  },
                  () => Array.from(Array(Column.length), () => "•")
                )
              : h(NText, { depth: 3 }, () => "--");
          case "date":
            return Column
              ? h(NTime, {
                  time: Column,
                  unix: true,
                })
              : h(NText, { depth: 3 }, () => "--");
          case "boolean":
            return h(
              NIconWrapper,
              {
                color: Column ? "green" : "red",
                borderRadius: 50,
                size: 18,
              },
              () =>
                h(
                  NIcon,
                  {
                    size: 16,
                  },
                  () => h(Column ? Check : X)
                )
            );
          case "url":
            return Column
              ? h(
                  NA,
                  { href: Column, target: "_blank" },
                  {
                    default: () =>
                      h(
                        NEllipsis,
                        {
                          tooltip: true,
                          style: {
                            maxWidth:
                              (item.name && item.name.length > 10
                                ? item.name.length * 15
                                : 150) + "px",
                          },
                        },
                        () => Column
                      ),
                  }
                )
              : h(NText, { depth: 3 }, () => "--");
          case "list":
          case "tags":
            return Column
              ? h(NSpace, () =>
                  [].concat(Column).map((item) =>
                    h(
                      NTag,
                      {
                        bordered: false,
                      },
                      {
                        default: () =>
                          h(
                            NEllipsis,
                            {
                              tooltip: false,
                              style: {
                                maxWidth:
                                  (item.name && item.name.length > 10
                                    ? item.name.length * 15
                                    : 150) + "px",
                              },
                            },
                            () => item
                          ),
                      }
                    )
                  )
                )
              : h(NText, { depth: 3 }, () => "--");
          case "editor":
            return Column
              ? h(
                  NPopover,
                  {
                    style: {
                      maxHeight: "240px",
                      maxWidth: "300px",
                    },
                    trigger: "click",
                    scrollable: true,
                  },
                  {
                    trigger: () =>
                      h(
                        NButton,
                        {
                          circle: true,
                        },
                        {
                          default: () =>
                            h(NText, { depth: 3 }, { default: () => "..." }),
                        }
                      ),
                    default: () => h("div", { innerHTML: Column }),
                  }
                )
              : h(NText, { depth: 3 }, () => "--");
          case "date":
            return Column
              ? h(NTime, {
                  time: Column,
                  unix: true,
                  type: "relative",
                })
              : h(NText, { depth: 3 }, () => "--");
          case "upload":
            return Column
              ? [].concat(Column).length === 1
                ? [].concat(Column).map((link) =>
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
                          src:
                            link && link.includes("cdn.inicontent")
                              ? `${link}?fit=32`
                              : link,
                          previewSrc: link,
                          width: 32,
                        })
                      : h(NIcon, () => h(FileText))
                  )
                : h(NImageGroup, () =>
                    h(NSpace, { align: "center" }, () =>
                      [].concat(Column).length > 3
                        ? [
                            ...[]
                              .concat(Column)
                              .slice(0, 3)
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
                                      src:
                                        link && link.includes("cdn.inicontent")
                                          ? `${link}?fit=32`
                                          : link,
                                      previewSrc: link,
                                      width: 32,
                                    })
                                  : h(NIcon, () => h(FileText))
                              ),
                            `+${[].concat(Column).length - 3}`,
                          ]
                        : [].concat(Column).map((link) =>
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
                                  src:
                                    link && link.includes("cdn.inicontent")
                                      ? `${link}?fit=32`
                                      : link,
                                  previewSrc: link,
                                  width: 32,
                                })
                              : h(NIcon, () => h(FileText))
                          )
                    )
                  )
              : h(NText, { depth: 3 }, () => "--");
          case "group":
            return item.duplicatable
              ? Column && Column.length > 0
                ? h(
                    NPopover,
                    {
                      trigger: "click",
                      scrollable: true,
                      style: {
                        maxHeight: "240px",
                      },
                    },
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            circle: true,
                          },
                          { default: () => "[...]" }
                        ),
                      default: () =>
                        h(
                          NCollapse,
                          { accordion: true, arrowPlacement: "right" },
                          () =>
                            [].concat(Column).map((_item, index) =>
                              h(
                                NCollapseItem,
                                {
                                  title: `${item.name} ${index + 1}`,
                                },
                                () =>
                                  h(NSpace, { vertical: true }, () =>
                                    item.children.map((child) =>
                                      h(
                                        NSpace,
                                        {
                                          align: "center",
                                        },
                                        () => [
                                          h("strong", `${child.name}:`),
                                          RenderColumn(
                                            getProperty(
                                              row,
                                              pathTo(
                                                database.value.tables &&
                                                  database.value.tables.find(
                                                    (item) =>
                                                      item.slug === props.table
                                                  ).schema
                                                  ? database.value.tables.find(
                                                      (item) =>
                                                        item.slug ===
                                                        props.table
                                                    ).schema
                                                  : [],
                                                child.key
                                              )
                                                .split(".")
                                                .slice(0, -1)
                                                .join(".") +
                                                `[${index}]` +
                                                pathTo(
                                                  database.value.tables &&
                                                    database.value.tables.find(
                                                      (item) =>
                                                        item.slug ===
                                                        props.table
                                                    ).schema
                                                    ? database.value.tables.find(
                                                        (item) =>
                                                          item.slug ===
                                                          props.table
                                                      ).schema
                                                    : [],
                                                  child.key
                                                )
                                                  .split(".")
                                                  .pop()
                                            ),
                                            child,
                                            row
                                          ),
                                        ]
                                      )
                                    )
                                  )
                              )
                            )
                        ),
                    }
                  )
                : h(
                    NButton,
                    {
                      circle: true,
                    },
                    {
                      default: () =>
                        h(NText, { depth: 3 }, { default: () => "[--]" }),
                    }
                  )
              : h(
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
                        },
                        { default: () => "{...}" }
                      ),
                    default: () =>
                      h(NSpace, { vertical: true }, () =>
                        item.children.map((child) =>
                          h(NSpace, { align: "center", inline: true }, () => [
                            h("strong", `${child.name}:`),
                            RenderColumn(
                              getProperty(
                                row,
                                pathTo(
                                  database.value.tables &&
                                    database.value.tables.find(
                                      (item) => item.slug === props.table
                                    ).schema
                                    ? database.value.tables.find(
                                        (item) => item.slug === props.table
                                      ).schema
                                    : [],
                                  child.key
                                )
                              ),
                              child,
                              row
                            ),
                          ])
                        )
                      ),
                  }
                );
          case "role":
            return Column
              ? h(
                  NTag,
                  { round: true, bordered: false },
                  {
                    default: () =>
                      h(
                        NEllipsis,
                        {
                          tooltip: false,
                          style: {
                            maxWidth:
                              (item.name && item.name.length > 10
                                ? item.name.length * 15
                                : 150) + "px",
                          },
                        },
                        () =>
                          Column.charAt(0).toUpperCase() +
                          Column.slice(1).replaceAll("_", " ")
                      ),
                    icon: () => h(NIcon, () => h(UserIcon)),
                  }
                )
              : h(NText, { depth: 3 }, () => "--");
          default:
            return Column
              ? h(
                  NEllipsis,
                  {
                    tooltip: false,
                    style: {
                      maxWidth:
                        (item.name && item.name.length > 10
                          ? item.name.length * 15
                          : 150) + "px",
                    },
                  },
                  () => Column
                )
              : h(NText, { depth: 3 }, () => "--");
        }
      },
      GenerateColumns = () =>
        [
          {
            type: "selection",
            fixed: "left",
            options: [
              {
                label: "Delete",
                key: "delete",
                disabled: checkedRowKeys.value.length === 0,
                icon: () => h(NIcon, () => h(Trash)),
                onSelect: async () => {
                  Loading.value["TableData"] = true;
                  await useFetch(
                    `https://api.inicontent.com/${props.db}/${props.table}`,
                    {
                      headers: {
                        Authorization:
                          "Basic " +
                          Buffer.from(
                            `${User.value.username}:${User.value.password}`
                          ).toString("base64"),
                      },
                      method: "DELETE",
                      body: checkedRowKeys.value,
                      initialCache: false,
                    }
                  );
                  message.success("Deleted Successfully");
                  await refreshTableData();
                },
              },
            ],
          },
          {
            title: "ID",
            width: 100,
            key: "id",
            render: (row) =>
              h(
                NTag,
                {
                  onClick: () => navigateTo(`${props.table}/${row.id}`),
                  bordered: false,
                  round: true,
                  style: "cursor: pointer",
                },
                () =>
                  h(
                    NEllipsis,
                    { tooltip: false, style: "max-width:50px" },
                    () => row.id
                  )
              ),
          },
          ...(database.value.tables &&
          database.value.tables.find((item) => item.slug === props.table)
            ?.schema
            ? database.value.tables.find((item) => item.slug === props.table)
                .schema
            : []
          ).map((item) => {
            const path = item.name
              .toLowerCase()
              .replace(/ /g, "_")
              .replace(/[^\[a-zA-Zء-ي]-_+/g, "");
            return {
              title: () =>
                h(NSpace, () => [
                  FieldsList.flatMap((i) =>
                    i.children
                      ? [
                          {
                            label: i.label,
                            key: i.key,
                            icon: i.icon,
                          },
                          ...i.children,
                        ]
                      : i
                  )
                    .filter((i) => i.key === item.type)[0]
                    ?.icon() ?? h(NIcon, () => h(Box)),
                  item.name.charAt(0).toUpperCase() +
                    item.name.slice(1).replaceAll("_", " "),
                ]),
              width:
                item.name && item.name.length > 10
                  ? item.name.length * 15
                  : 200,
              key: path,
              render: (row) => RenderColumn(row[path], item, row),
            };
          }),
          {
            title: () =>
              h(NSpace, () => [h(NIcon, () => h(Calendar)), "Created at"]),
            width: 150,
            key: "created_at",
            render: (row) =>
              row["created_at"]
                ? h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(NTime, {
                          time: row["created_at"],
                          unix: true,
                          type: "relative",
                        }),
                      default: () =>
                        h(NTime, {
                          time: row["created_at"],
                          unix: true,
                        }),
                    }
                  )
                : h(NText, { depth: 3 }, () => "--"),
          },
          {
            title: () =>
              h(NSpace, () => [h(NIcon, () => h(Calendar)), "Updated at"]),
            width: 150,
            key: "updated_at",
            render: (row) =>
              row["updated_at"]
                ? h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(NTime, {
                          time: row["updated_at"],
                          unix: true,
                          type: "relative",
                        }),
                      default: () =>
                        h(NTime, {
                          time: row["updated_at"],
                          unix: true,
                        }),
                    }
                  )
                : h(NText, { depth: 3 }, () => "--"),
          },
          ShowDeleted.value
            ? {
                title: "Deleted at",
                width: 150,
                key: "deleted_at",
                render: (row) =>
                  row["deleted_at"]
                    ? h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(NTime, {
                              time: row["deleted_at"],
                              unix: true,
                              type: "relative",
                            }),
                          default: () =>
                            h(NTime, {
                              time: row["deleted_at"],
                              unix: true,
                            }),
                        }
                      )
                    : h(NText, { depth: 3 }, () => "--"),
              }
            : null,
          {
            title: "Actions",
            fixed: Window.value.width > 400 ? "right" : false,
            align: "center",
            width: 150,
            key: "actions",
            render(row) {
              return h(
                NSpace,
                {
                  justify: "center",
                },
                () => [
                  h(NuxtLink, { to: `${props.table}/${row.id}/edit` }, () =>
                    h(
                      NButton,
                      {
                        secondary: true,
                        circle: true,
                        type: "info",
                      },
                      { icon: () => h(NIcon, () => h(Pencil)) }
                    )
                  ),
                  ShowDeleted.value
                    ? h(
                        NPopconfirm,
                        {
                          onPositiveClick: () => DELETE(row.id),
                        },
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                strong: true,
                                secondary: true,
                                circle: true,
                                type: "error",
                              },
                              { icon: () => h(NIcon, () => h(Trash)) }
                            ),
                          default: () => "Delete Permanently",
                        }
                      )
                    : h(
                        NButton,
                        {
                          strong: true,
                          secondary: true,
                          circle: true,
                          type: "error",
                          onClick: () => DELETE(row.id),
                        },
                        { icon: () => h(NIcon, () => h(Trash)) }
                      ),
                ]
              );
            },
          },
        ].filter((i) => i !== null);

    watch(ShowDeleted, () => ((pagination.value.page = 1), refreshTableData()));

    return () => [
      User.value && User.value.role === "admin"
        ? h(RenderSchema, { table: props.table })
        : null,
      Window.value.width >= 700
        ? h(
            NDrawer,
            {
              show: Drawer.value.show,
              "on-update:show": (v) => (Drawer.value.show = v),
              width:
                Window.value.width < 700
                  ? window.screen.width
                  : Drawer.value.width ?? 251,
              "on-update:width": (w) => (Drawer.value.width = w),
              resizable: true,
            },
            () =>
              h(
                NDrawerContent,
                {
                  closable: true,
                  nativeScrollbar: false,
                },
                {
                  header: () =>
                    Drawer.value.id
                      ? [
                          `${
                            Drawer.value.table.charAt(0).toUpperCase() +
                            Drawer.value.table.slice(1).replaceAll("_", " ")
                          } | `,
                          h(
                            NuxtLink,
                            { to: `${Drawer.value.table}/${Drawer.value.id}` },
                            () =>
                              h(
                                NText,
                                { type: "primary" },
                                () => Drawer.value.id
                              )
                          ),
                        ]
                      : `New ${
                          Drawer.value.table.charAt(0).toUpperCase() +
                          Drawer.value.table.slice(1).replaceAll("_", " ")
                        }`,
                  footer: () =>
                    h(
                      NSpace,
                      {
                        style: {
                          width: "100%",
                        },
                        justify:
                          Window.value.width >= 700 ? "space-between" : "end",
                      },
                      () => [
                        Window.value.width >= 700
                          ? h(
                              NButton,
                              {
                                round: true,
                                secondary: true,
                                type: "info",
                                onClick: () =>
                                  (Drawer.value.width =
                                    Drawer.value.width >=
                                    window.screen.width / 2
                                      ? 251
                                      : window.screen.width - 2),
                              },
                              {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      Drawer.value.width >=
                                        window.screen.width / 2
                                        ? ArrowBarRight
                                        : ArrowBarLeft
                                    )
                                  ),
                              }
                            )
                          : null,
                        h(
                          NButton,
                          {
                            round: true,
                            secondary: true,
                            type: "primary",
                            onClick: Drawer.value.id
                              ? UpdateDrawer
                              : CreateDrawer,
                            loading: Loading.value["DrawerContent"],
                          },
                          {
                            icon: () => h(NIcon, () => h(DeviceFloppy)),
                            default: () =>
                              Drawer.value.id ? "UPDATE" : "CREATE",
                          }
                        ),
                      ]
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
                          "onUpdate:modelValue": (v) => (Drawer.value.data = v),
                          schema: database.value.tables.find(
                            (item) => item.slug === Drawer.value.table
                          ).schema,
                        })
                    ),
                }
              )
          )
        : null,
      database.value
        ? h(
            NCard,
            {
              style: {
                background: "none",
              },
              contentStyle: "padding: 0",
              bordered: false,
            },
            {
              header: () =>
                h(NSpace, () => [
                  Window.value.width < 700
                    ? database.value.tables.find(
                        (item) => item.slug === props.table
                      ).name
                    : `${database.value.name} - ${
                        database.value.tables.find(
                          (item) => item.slug === props.table
                        )?.name
                      }`,
                  h(
                    NButton,
                    {
                      text: true,
                      type: ShowDeleted.value ? "default" : "primary",
                      onClick: () => (ShowDeleted.value = false),
                    },
                    () => "Published"
                  ),
                  " | ",
                  h(
                    NButton,
                    {
                      text: true,
                      type: ShowDeleted.value ? "primary" : "default",
                      onClick: () => (ShowDeleted.value = true),
                    },
                    () => "Trash"
                  ),
                ]),
              "header-extra": () =>
                h(NSpace, () => [
                  h(
                    NPopover,
                    {
                      style: {
                        maxHeight: "240px",
                        width: Window.value.width < 700 ? "300px" : "500px",
                      },
                      placement: "bottom-end",
                      trigger: "click",
                      scrollable: true,
                    },
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            onClick: () => {
                              if (
                                !searchArray.value ||
                                searchArray.value.length === 0
                              )
                                searchArray.value = [[null, "=", null]];
                            },
                          },
                          {
                            icon: () => h(NIcon, () => h(Search)),
                          }
                        ),
                      footer: () =>
                        h(NSpace, { justify: "space-between" }, () => [
                          h(NSpace, {}, () => [
                            searchArray.value && searchArray.value.length > 1
                              ? h(
                                  NButton,
                                  {
                                    onClick: () => searchArray.value.splice(-1),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(Minus)),
                                  }
                                )
                              : null,
                            h(
                              NButton,
                              {
                                onClick: () =>
                                  searchArray.value.push([null, "=", null]),
                              },
                              {
                                icon: () => h(NIcon, () => h(Plus)),
                              }
                            ),
                          ]),
                          h(NSpace, {}, () => [
                            h(
                              NButton,
                              {
                                disabled: searchInput.value === null,
                                loading: Loading.value["TableData"],
                                onClick: () => (
                                  (searchArray.value = [[null, "=", null]]),
                                  (searchInput.value = null),
                                  refreshTableData()
                                ),
                              },
                              {
                                icon: () => h(NIcon, () => h(X)),
                                default: () => "Reset",
                              }
                            ),
                            h(
                              NButton,
                              {
                                loading: Loading.value["TableData"],
                                onClick: () => (
                                  (searchInput.value =
                                    searchArray.value &&
                                    searchArray.value.length > 0
                                      ? JSON.stringify(searchArray.value)
                                      : null),
                                  refreshTableData()
                                ),
                              },
                              {
                                icon: () => h(NIcon, () => h(Search)),
                                default: () => "Search",
                              }
                            ),
                          ]),
                        ]),
                      default: () =>
                        h(
                          NSpace,
                          {
                            itemStyle: {
                              width: "100%",
                            },
                          },
                          () =>
                            searchArray.value.map((item, index) =>
                              h(NInputGroup, () => [
                                h(NSelect, {
                                  tag: true,
                                  filterable: true,
                                  value: searchArray.value[index][0],
                                  onUpdateValue: (v, option) => (
                                    (searchField.value[index] = option.ty),
                                    (searchArray.value[index][0] = v)
                                  ),
                                  options:
                                    database.value.tables &&
                                    database.value.tables.find(
                                      (item) => item.slug === props.table
                                    ).schema
                                      ? database.value.tables
                                          .find(
                                            (item) => item.slug === props.table
                                          )
                                          .schema.map((item, _index, schema) =>
                                            GenerateSearchInOptions(
                                              schema,
                                              item
                                            )
                                          )
                                          .flat(Infinity)
                                      : [],
                                  style: {
                                    width: "33.33%",
                                  },
                                }),
                                h(NSelect, {
                                  filterable: true,
                                  defaultValue: "=",
                                  value: searchArray.value[index][1],
                                  onUpdateValue: (v) =>
                                    (searchArray.value[index][1] = v),
                                  options: searchField.value[index]
                                    ? ["date", "number"].includes(
                                        searchField.value[index]
                                      )
                                      ? [
                                          {
                                            label: "Equal to",
                                            value: "=",
                                          },
                                          {
                                            label: "Not Equal to",
                                            value: "!",
                                          },
                                          {
                                            label: "Greater than",
                                            value: ">",
                                          },
                                          {
                                            label: "Greater/Equal to",
                                            value: ">=",
                                          },
                                          {
                                            label: "Less than",
                                            value: "<",
                                          },
                                          {
                                            label: "Less/Equal to",
                                            value: "<=",
                                          },
                                          {
                                            label: "Like",
                                            value: "like",
                                          },
                                          {
                                            label: "Not Like",
                                            value: "not like",
                                          },
                                        ]
                                      : [
                                          {
                                            label: "Equal to",
                                            value: "=",
                                          },
                                          {
                                            label: "Not Equal to",
                                            value: "!",
                                          },
                                          {
                                            label: "Like",
                                            value: "like",
                                          },
                                          {
                                            label: "Not Like",
                                            value: "not like",
                                          },
                                        ]
                                    : [
                                        {
                                          label: "Equal to",
                                          value: "=",
                                        },
                                        {
                                          label: "Not Equal to",
                                          value: "!",
                                        },
                                        {
                                          label: "Like",
                                          value: "like",
                                        },
                                        {
                                          label: "Not Like",
                                          value: "not like",
                                        },
                                      ],
                                  style: {
                                    width: "33.33%",
                                  },
                                }),
                                (() => {
                                  switch (searchField.value[index] ?? null) {
                                    case "date":
                                      return h(NDatePicker, {
                                        value: searchArray.value[index][2]
                                          ? searchArray.value[index][2] * 1000
                                          : Date.now(),
                                        onConfirm: (e) => (
                                          (searchArray.value[index][2] =
                                            e / 1000),
                                          (searchInput.value =
                                            searchArray.value &&
                                            searchArray.value.length > 0
                                              ? JSON.stringify(
                                                  searchArray.value
                                                )
                                              : null),
                                          refreshTableData()
                                        ),
                                        type: "datetime",
                                      });
                                    default:
                                      return h(NInput, {
                                        onKeyup: (e) =>
                                          e.code === "Enter" &&
                                          ((searchInput.value =
                                            searchArray.value &&
                                            searchArray.value.length > 0
                                              ? JSON.stringify(
                                                  searchArray.value
                                                )
                                              : null),
                                          refreshTableData()),
                                        value: searchArray.value[index][2],
                                        onUpdateValue: (v) =>
                                          (searchArray.value[index][2] = v),
                                        style: {
                                          width: "33.33%",
                                        },
                                      });
                                  }
                                })(),
                              ])
                            )
                        ),
                    }
                  ),
                  Window.value.width >= 700
                    ? h(
                        NA,
                        {
                          href: `${props.table}/new`,
                          onClick: (event) => (
                            event.preventDefault(),
                            (Drawer.value.table = props.table),
                            (Drawer.value.id = null),
                            (Drawer.value.data = {}),
                            (Drawer.value.show = true)
                          ),
                        },
                        () =>
                          h(
                            NButton,
                            {},
                            {
                              icon: () => h(NIcon, () => h(Plus)),
                            }
                          )
                      )
                    : h(NuxtLink, { to: `${props.table}/new` }, () =>
                        h(
                          NButton,
                          {},
                          {
                            icon: () => h(NIcon, () => h(Plus)),
                          }
                        )
                      ),
                  User.value && User.value.role === "admin"
                    ? h(
                        NButton,
                        {
                          onClick: () => (ShowSchemaModal.value = true),
                        },
                        {
                          icon: () => h(NIcon, () => h(Settings)),
                        }
                      )
                    : null,
                ]),
              default: () =>
                h(NDataTable, {
                  scrollX: GenerateColumns().reduce((accumulator, value) => {
                    return accumulator + value.width;
                  }, 1000),
                  id: "DataTable",
                  remote: true,
                  ref: TableDataRef,
                  columns: GenerateColumns(),
                  data: TableData.value?.result || [],
                  loading: Loading.value["TableData"],
                  pagination: pagination.value,
                  rowKey: (row) => row.id,
                  checkedRowKeys: checkedRowKeys.value,
                  "on-update:checked-row-keys": (keys) =>
                    (checkedRowKeys.value = keys),
                  maxHeight: 350,
                }),
            }
          )
        : null,
    ];
  },
});
