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
  ExternalLink,
  FileText,
} from "@vicons/tabler";
import { Buffer } from "buffer";
import { NuxtLink } from "#components";
import objectPath from "object-path";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    const route = useRoute(),
      database = useState("database");
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
        view_item: "مُعاينة العنصر",
        new: "جديد",
        deleted_at: "حُذف",
        created_at: "أُضيف",
        updated_at: "عُدِّل",
        update: "تحديث",
        create: "إنشاء",
        delete: "حذف",
        move_to_trash: "نقل لسلة المهملات",
        confirm_delete_permanently: "حذف بصفة نهائية?",
        edit: "تعديل",
        published: "المنشورة",
        trash: "سلة المهملات",
        id: "المُعرف",
        actions: "الأوامر",
        edit_schema: "تعديل الهيكل",
        search: "بحث",
        reset: "إفراغ",
        search_conditions: {
          equal_to: "يساوي",
          not_equal_to: "لا يساوي",
          greater_than: "أكبر من",
          greater_equal_to: "أكبر من او يساوي",
          less_than: "أصغر من",
          less_equal_to: "أصغر من او يساوي",
          contains: "يحتوي",
          not_contain: "لا يحتوي",
        },
        fields: {
          text: "نص",
          short_text: "نص قصير",
          long_text: "نص طويل",
          editor: "محرر نصوص",
          number: "رقم",
          password: "كلمة مرور",
          link: "رابط",
          email: "بريد",
          upload: "ملحق",
          tags: "وسوم",
          date: "تاريخ",
          toggle: "سحب",
          list: "قائمة",
          group: "مجموعة",
          table: "جدول",
        },
      },
      en: {
        view_item: "View item",
        new: "New",
        deleted_at: "Deleted at",
        created_at: "Created at",
        updated_at: "Updated at",
        update: "Update",
        create: "Create",
        delete: "Delete",
        move_to_trash: "Move to trash",
        confirm_delete_permanently: "Delete Permanently?",
        edit: "Edit",
        published: "Published",
        trash: "Trash",
        id: "ID",
        actions: "Actions",
        edit_schema: "Edit Schema",
        search: "Search",
        reset: "Reset",
        search_conditions: {
          equal_to: "Equal to",
          not_equal_to: "Not Equal to",
          greater_than: "Greater than",
          greater_equal_to: "Greater/Equal than",
          less_than: "Less than",
          less_equal_to: "Less/Equal than",
          contains: "Contains",
          not_contain: "Doesn't Contains",
        },
        fields: {
          text: "Text",
          short_text: "Short Text",
          long_text: "Long Text",
          editor: "Rich Editor",
          number: "Number",
          password: "Password",
          email: "Email",
          link: "Link",
          upload: "Upload",
          tags: "Tags",
          date: "Date",
          toggle: "Toggle",
          list: "List",
          group: "Group",
          table: "Table",
        },
      },
    });

    const RenderSchema = resolveComponent("RenderSchema"),
      RenderFields = resolveComponent("RenderFields");

    const FieldsList = [
      {
        label: t("fields.text"),
        key: "input",
        icon: () => h(NIcon, () => h(Forms)),
        children: [
          {
            label: t("fields.short_text"),
            key: "text",
            icon: () => h(NIcon, () => h(LetterCase)),
          },
          {
            label: t("fields.long_text"),
            key: "textarea",
            icon: () => h(NIcon, () => h(AlignJustified)),
          },
          {
            label: t("fields.editor"),
            key: "editor",
            icon: () => h(NIcon, () => h(Code)),
          },
          {
            label: t("fields.number"),
            key: "number",
            icon: () => h(NIcon, () => h(ListNumbers)),
          },
          {
            label: t("fields.password"),
            key: "password",
            icon: () => h(NIcon, () => h(Key)),
          },
          {
            label: t("fields.email"),
            key: "email",
            icon: () => h(NIcon, () => h(At)),
          },
          {
            label: t("fields.link"),
            key: "url",
            icon: () => h(NIcon, () => h(Link)),
          },
        ],
      },
      {
        label: t("fields.upload"),
        key: "upload",
        icon: () => h(NIcon, () => h(Upload)),
      },
      {
        label: t("fields.tags"),
        key: "tags",
        icon: () => h(NIcon, () => h(Tags)),
      },
      {
        label: t("fields.date"),
        key: "date",
        icon: () => h(NIcon, () => h(Calendar)),
      },
      {
        label: t("fields.toggle"),
        key: "boolean",
        icon: () => h(NIcon, () => h(ToggleLeft)),
      },
      {
        label: t("fields.list"),
        key: "list",
        icon: () => h(NIcon, () => h(ListDetails)),
      },
      {
        label: t("fields.group"),
        key: "group",
        icon: () => h(NIcon, () => h(BoxMultiple)),
      },
      {
        label: t("fields.table"),
        key: "table",
        icon: () => h(NIcon, () => h(Table)),
      },
    ];

    useHead({
      title: `${database.value.name} | ${
        database.value.tables.find((item) => item.slug === route.params.slug)
          .name
      } Table`,
      link: [{ rel: "icon", href: database.value.icon }],
    });
    const Loading = useState("Loading", () => ({})),
      Window = useState("Window"),
      searchInput = useState(() => null),
      searchArray = useState(() => []),
      searchField = useState(() => []),
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
          `https://api.inicontent.com/${route.params.db_slug}/${Drawer.value.table}/${Drawer.value.id}`,
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
        `TableData_${route.params.db_slug}-${route.params.slug}`,
        () =>
          $fetch(
            `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}`,
            {
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
                      (item) => item.slug === route.params.slug
                    )?.schema
                      ? database.value.tables
                          .find((item) => item.slug === route.params.slug)
                          .schema.map((item) => GetPathes(item))
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
            }
          ),
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
          `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${id}`,
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
      RenderColumn = (Column, item) => {
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
                                    .concat(objectPath.get(Column, item.image))
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
                                      objectPath.get(Column, single_label)
                                    )
                                    .join(" ")
                              ),
                          }
                        : {
                            icon: () =>
                              h(NIcon, () =>
                                h(
                                  "span",
                                  { style: { padding: "0 5px" } },
                                  item.name.charAt(0).toUpperCase()
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
                                      objectPath.get(Column, single_label)
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
                                        .concat(
                                          objectPath.get(Column, item.image)
                                        )
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
                                          objectPath.get(Column, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      item.name.charAt(0).toUpperCase()
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
                                          objectPath.get(Column, single_label)
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
                                        .concat(objectPath.get(col, item.image))
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
                                          objectPath.get(col, single_label)
                                        )
                                        .join(" ")
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      item.name.charAt(0).toUpperCase()
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
                                          objectPath.get(col, single_label)
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
                                          .concat(
                                            objectPath.get(col, item.image)
                                          )
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
                                            objectPath.get(col, single_label)
                                          )
                                          .join(" ")
                                    ),
                                }
                              : {
                                  icon: () =>
                                    h(NIcon, () =>
                                      h(
                                        "span",
                                        { style: { padding: "0 5px" } },
                                        item.name.charAt(0).toUpperCase()
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
                                            objectPath.get(col, single_label)
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
                                            objectPath.get(
                                              _item,
                                              child.name
                                                .toLowerCase()
                                                .replace(/ /g, "_")
                                                .replace(
                                                  /[^\[a-zA-Zء-ي]-_+/g,
                                                  ""
                                                )
                                            ),
                                            child
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
                              objectPath.get(
                                Column,
                                child.name
                                  .toLowerCase()
                                  .replace(/ /g, "_")
                                  .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                              ),
                              child
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
                    icon: () =>
                      h(
                        "span",
                        { style: { padding: "0 5px" } },
                        Column.charAt(0).toUpperCase()
                      ),
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
                    `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}`,
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
            title: t("id"),
            width: 100,
            key: "id",
            render: (row) =>
              h(
                NPopover,
                {},
                {
                  trigger: () =>
                    h(
                      NTag,
                      {
                        onClick: () =>
                          navigateTo(`${route.params.slug}/${row.id}`),
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
                  default: () => t("view_item"),
                }
              ),
          },
          ...(database.value.tables &&
          database.value.tables.find((item) => item.slug === route.params.slug)
            ?.schema
            ? database.value.tables.find(
                (item) => item.slug === route.params.slug
              ).schema
            : []
          ).map((item) => {
            const path = item.name
              .toLowerCase()
              .replace(/ /g, "_")
              .replace(/[^\[a-zA-Zء-ي]-_+/g, "");
            return {
              title: () =>
                h(NSpace, { align: "center" }, () => [
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
                    .find((i) => i.key === item.type)
                    ?.icon() ?? h(NIcon, () => h(Box)),
                  item.name.charAt(0).toUpperCase() +
                    item.name.slice(1).replaceAll("_", " "),
                ]),
              width:
                item.name && item.name.length > 10
                  ? item.name.length * 15
                  : 200,
              key: path,
              render: (row) => RenderColumn(row[path], item),
            };
          }),
          {
            title: () =>
              h(NSpace, () => [h(NIcon, () => h(Calendar)), t("created_at")]),
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
              h(NSpace, () => [h(NIcon, () => h(Calendar)), t("updated_at")]),
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
                title: t("deleted_at"),
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
            title: t("actions"),
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
                  h(
                    NuxtLink,
                    { to: `${route.params.slug}/${row.id}/edit` },
                    () =>
                      h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                secondary: true,
                                circle: true,
                                type: "info",
                              },
                              { icon: () => h(NIcon, () => h(Pencil)) }
                            ),
                          default: () => t("edit"),
                        }
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
                              NPopover,
                              {},
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
                                default: () => t("delete"),
                              }
                            ),
                          default: () => t("confirm_delete"),
                        }
                      )
                    : h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
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
                          default: () => t("move_to_trash"),
                        }
                      ),
                ]
              );
            },
          },
        ].filter((i) => i !== null);

    watch(ShowDeleted, () => ((pagination.value.page = 1), refreshTableData()));

    return () => [
      User.value && User.value.role === "admin"
        ? h(RenderSchema, { table: route.params.slug })
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
              placement: Language.value === "ar" ? "left" : "right",
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
                          `Edit `,
                          h(
                            NuxtLink,
                            {
                              to: `${Drawer.value.table}/${Drawer.value.id}/edit`,
                            },
                            () =>
                              h(NText, { type: "primary" }, () => [
                                Drawer.value.table.charAt(0).toUpperCase() +
                                  Drawer.value.table
                                    .slice(1)
                                    .replaceAll("_", " "),
                                h(NIcon, () => h(ExternalLink)),
                              ])
                          ),
                        ]
                      : `${t("new")} ${
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
                              Drawer.value.id ? t("update") : t("create"),
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
                        (item) => item.slug === route.params.slug
                      ).name
                    : `${database.value.name} - ${
                        database.value.tables.find(
                          (item) => item.slug === route.params.slug
                        )?.name
                      }`,
                  h(
                    NButton,
                    {
                      text: true,
                      type: ShowDeleted.value ? "default" : "primary",
                      onClick: () => (ShowDeleted.value = false),
                    },
                    () => t("published")
                  ),
                  " | ",
                  h(
                    NButton,
                    {
                      text: true,
                      type: ShowDeleted.value ? "primary" : "default",
                      onClick: () => (ShowDeleted.value = true),
                    },
                    () => t("trash")
                  ),
                ]),
              "header-extra": () =>
                h(NSpace, () => [
                  h(
                    NPopover,
                    {
                      disabled:
                        !TableData.value?.result ||
                        !database.value.tables ||
                        !database.value.tables.find(
                          (item) => item.slug === route.params.slug
                        ).schema,
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
                          NPopover,
                          {},
                          {
                            trigger: () =>
                              h(
                                NButton,
                                {
                                  disabled:
                                    !TableData.value?.result ||
                                    !database.value.tables ||
                                    !database.value.tables.find(
                                      (item) => item.slug === route.params.slug
                                    ).schema,
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
                            default: () => t("search"),
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
                                default: () => t("reset"),
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
                                default: () => t("search"),
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
                                      (item) => item.slug === route.params.slug
                                    ).schema
                                      ? database.value.tables
                                          .find(
                                            (item) =>
                                              item.slug === route.params.slug
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
                                            label: t(
                                              "search_conditions.equal_to"
                                            ),
                                            value: "=",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.not_equal_to"
                                            ),
                                            value: "!",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.greater_than"
                                            ),
                                            value: ">",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.greater_equal_to"
                                            ),
                                            value: ">=",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.less_than"
                                            ),
                                            value: "<",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.less_equal_to"
                                            ),
                                            value: "<=",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.contains"
                                            ),
                                            value: "like",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.not_contain"
                                            ),
                                            value: "not like",
                                          },
                                        ]
                                      : [
                                          {
                                            label: t(
                                              "search_conditions.equal_to"
                                            ),
                                            value: "=",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.not_equal_to"
                                            ),
                                            value: "!",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.contains"
                                            ),
                                            value: "like",
                                          },
                                          {
                                            label: t(
                                              "search_conditions.not_contain"
                                            ),
                                            value: "not like",
                                          },
                                        ]
                                    : [
                                        {
                                          label: t(
                                            "search_conditions.equal_to"
                                          ),
                                          value: "=",
                                        },
                                        {
                                          label: t(
                                            "search_conditions.not_equal_to"
                                          ),
                                          value: "!",
                                        },
                                        {
                                          label: t(
                                            "search_conditions.contains"
                                          ),
                                          value: "like",
                                        },
                                        {
                                          label: t(
                                            "search_conditions.not_contain"
                                          ),
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
                          href: `${route.params.slug}/new`,
                          onClick: (e) => e.preventDefault(),
                        },
                        () =>
                          h(
                            NPopover,
                            {},
                            {
                              trigger: () =>
                                h(
                                  NButton,
                                  {
                                    disabled:
                                      !database.value.tables ||
                                      !database.value.tables.find(
                                        (item) =>
                                          item.slug === route.params.slug
                                      ).schema,
                                    onClick: () => (
                                      (Drawer.value.table = route.params.slug),
                                      (Drawer.value.id = null),
                                      (Drawer.value.data = {}),
                                      (Drawer.value.show = true)
                                    ),
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(Plus)),
                                  }
                                ),
                              default: () => t("add_new"),
                            }
                          )
                      )
                    : h(
                        NuxtLink,
                        {
                          to:
                            !database.value.tables ||
                            !database.value.tables.find(
                              (item) => item.slug === route.params.slug
                            ).schema
                              ? null
                              : `${route.params.slug}/new`,
                        },
                        () =>
                          h(
                            NPopover,
                            {},
                            {
                              trigger: () =>
                                h(
                                  NButton,
                                  {
                                    disabled:
                                      !database.value.tables ||
                                      !database.value.tables.find(
                                        (item) =>
                                          item.slug === route.params.slug
                                      ).schema,
                                  },
                                  {
                                    icon: () => h(NIcon, () => h(Plus)),
                                  }
                                ),
                              default: () => t("add_new"),
                            }
                          )
                      ),
                  User.value && User.value.role === "admin"
                    ? h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                onClick: () => (ShowSchemaModal.value = true),
                              },
                              {
                                icon: () => h(NIcon, () => h(Settings)),
                              }
                            ),
                          default: () => t("edit_schema"),
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
