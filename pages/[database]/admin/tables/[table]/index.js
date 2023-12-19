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
  NDropdown,
  NProgress,
} from "naive-ui";
import {
  Check,
  X,
  Pencil,
  Trash,
  DeviceFloppy,
  Search,
  Settings,
  Plus,
  Tools,
  Minus,
  QuestionMark,
  ExternalLink,
  FileUpload,
  TableImport,
  TableExport,
  Eye,
  ChevronRight,
  ChevronLeft,
} from "@vicons/tabler";
import { get } from "object-path";
import { LazyRenderFields } from "#components";
import { isArrayOfObjects } from "inibase/utils";

export default defineComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    const route = useRoute(),
      router = useRouter(),
      database = useState("database");
    const Language = useGlobalCookie("Language");
    useLanguage({
      ar: {
        click_to_copy: "نسخ",
        text_copied: "تم نسخ النص",
        view_item: "مُعاينة العنصر",
        new: "جديد",
        deletedAt: "حُذف",
        createdAt: "أُضيف",
        updatedAt: "عُدِّل",
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
        tools: "الأدوات",
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
      },
      en: {
        click_to_copy: "Copy",
        text_copied: "Text copied to clipboard",
        view_item: "View item",
        new: "New",
        deletedAt: "Deleted at",
        createdAt: "Created at",
        updatedAt: "Updated at",
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
        edit_schema: "Edit Schemas",
        search: "Search",
        reset: "Reset",
        tools: "Tools",
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
      },
    });

    const Loading = useState("Loading", () => ({})),
      Window = useState("Window"),
      searchInput = useState(() => route.query.search ?? null),
      searchArray = useState(() =>
        route.query.search
          ? JSON.parse(route.query.search).filter(
              (searchItem) => !["deletedAt"].includes(searchItem[0])
            )
          : []
      ),
      searchField = useState(() => []),
      ShowDeleted = useState(() =>
        route.query.hasOwnProperty("show_deleted") ? true : false
      );
    Loading.value["TableData"] = false;
    Loading.value["DrawerContent"] = false;
    Loading.value["Drawer"] = {};

    const user = useState("user"),
      message = useMessage(),
      ImportInput = ref(),
      UploadProgress = ref(null),
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
          `/api/${route.params.database}/${Drawer.value.table}/${Drawer.value.id}`,
          {
            transform: (res) => (Drawer.value.data = res.result),
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
              `/api/${route.params.database}/${Drawer.value.table}/${Drawer.value.id}`,
              {
                method: "PUT",
                body: Drawer.value.data,
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
              `/api/${route.params.database}/${Drawer.value.table}`,
              {
                method: "POST",
                body: Drawer.value.data,

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
        page: route.query.page ? Number(route.query.page) : 1,
        pageCount: 1,
        showSizePicker: true,
        pageSize: route.query.per_page ? Number(route.query.per_page) : 15,
        pageSizes: [15, 30, 60, 100, 500],
        prefix: ({ itemCount }) => itemCount,
        onChange: async (currentPage) => {
          pagination.value.page = currentPage;
          let { page, ...Query } = route.query;
          if (currentPage !== 1) Query = { ...Query, page: currentPage };
          router.push({ query: Query });
          return refreshTableData();
        },
        onUpdatePageSize: async (pageSize) => {
          let OLD_pageSize = JSON.parse(
            JSON.stringify(pagination.value.pageSize)
          );
          pagination.value.pageSize = pageSize;
          let { per_page, page, ...Query } = route.query;
          if (pageSize !== 15) {
            pagination.value.page = Math.round(
              OLD_pageSize < pageSize
                ? page / (pageSize / OLD_pageSize)
                : page * (pageSize / OLD_pageSize)
            );
            Query = {
              ...Query,
              per_page: pageSize,
              page: pagination.value.page,
            };
          }
          router.push({ query: Query });
          return refreshTableData();
        },
      }),
      { data: TableData, refresh: refreshTableData } = await useLazyAsyncData(
        `TableData_${route.params.database}-${route.params.table}`,
        () =>
          $fetch(`/api/${route.params.database}/${route.params.table}`, {
            onRequest: () => (Loading.value["TableData"] = true),
            params: {
              _options: JSON.stringify({
                page: pagination.value.page,
                per_page: pagination.value.pageSize,
                columns: [],
              }),
              _where: searchInput.value
                ? ShowDeleted.value
                  ? JSON.stringify({
                      ...searchInput.value,
                      deletedAt: ">0",
                    })
                  : JSON.stringify(searchInput.value)
                : ShowDeleted.value
                ? JSON.stringify({ deletedAt: ">0" })
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
          `/api/${route.params.database}/${route.params.table}/${id}`,
          {
            method: "DELETE",
          }
        );
        TableData.value.result = TableData.value.result.filter(
          (item) => item.id !== id
        );
        pagination.value.itemCount--;
        message.success("Deleted Successfully");
        Loading.value["TableData"] = false;
      },
      RenderSchema = (value, item) => {
        if (value === null || value === undefined)
          switch (item.type) {
            case "boolean":
              return h(
                NIconWrapper,
                {
                  color: "red",
                  borderRadius: 50,
                  size: 18,
                },
                () =>
                  h(
                    NIcon,
                    {
                      size: 16,
                    },
                    () => h(X)
                  )
              );
            case "array":
              return h(
                NButton,
                {
                  circle: true,
                },
                {
                  default: () =>
                    h(NText, { depth: 3 }, { default: () => "[--]" }),
                }
              );
            case "object":
              return h(
                NButton,
                {
                  circle: true,
                },
                {
                  default: () =>
                    h(NText, { depth: 3 }, { default: () => "{--}" }),
                }
              );
            default:
              return h(NText, { depth: 3 }, () => "--");
          }
        else
          switch (item.type) {
            case "id":
              return h(
                NPopover,
                {},
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        size: "small",
                        onClick: () => (
                          navigator.clipboard.writeText(value),
                          message.success(t("text_copied"))
                        ),
                        secondary: true,
                        round: true,
                      },
                      () =>
                        h(
                          NEllipsis,
                          { tooltip: false, style: "max-width:50px" },
                          () => value
                        )
                    ),
                  default: () => t("click_to_copy"),
                }
              );
            case "table":
              return item.single === true
                ? Window.value.width >= 700
                  ? h(
                      NButton,
                      {
                        onClick: () => (
                          (Drawer.value.id = [].concat(value)[0].id),
                          (Drawer.value.table = item.key),
                          (Drawer.value.data = {}),
                          LoadDrawer()
                        ),
                        loading:
                          Loading.value["Drawer"][
                            `${item.key}_${[].concat(value)[0].id}`
                          ],
                        size: "small",
                        round: true,
                      },
                      item.image
                        ? {
                            icon: () =>
                              h(NIcon, () => {
                                const img = []
                                  .concat(get(value, item.image))
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
                                  )[0];
                                return img
                                  ? h(NAvatar, {
                                      style: {
                                        width: "18px",
                                        height: "18px",
                                      },
                                      round: true,
                                      src: img,
                                    })
                                  : h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      item.key.charAt(0).toUpperCase()
                                    );
                              }),
                            default: () =>
                              h(
                                NEllipsis,
                                {
                                  tooltip: true,
                                  style: {
                                    maxWidth:
                                      (item.key && item.key.length > 10
                                        ? item.key.length * 12
                                        : 120) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    ? item.label
                                        .map((single_label) =>
                                          get(value, single_label)
                                        )
                                        .join(" ")
                                    : value.id
                              ),
                          }
                        : {
                            icon: () =>
                              h(NIcon, () =>
                                h(
                                  "span",
                                  { style: { padding: "0 5px" } },
                                  item.key.charAt(0).toUpperCase()
                                )
                              ),
                            default: () =>
                              h(
                                NEllipsis,
                                {
                                  tooltip: true,
                                  style: {
                                    maxWidth:
                                      (item.key && item.key.length > 10
                                        ? item.key.length * 12
                                        : 120) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    ? item.label
                                        .map((single_label) =>
                                          get(value, single_label)
                                        )
                                        .join(" ")
                                    : value.id
                              ),
                          }
                    )
                  : h(
                      NButton,
                      {
                        onClick: () =>
                          navigateTo(
                            `/${route.params.database}/admin/tables/${
                              item.key
                            }/${[].concat(value)[0].id}`
                          ),
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
                                    .concat(get(value, item.image))
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
                                      (item.key && item.key.length > 10
                                        ? item.key.length * 12
                                        : 120) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    ? item.label
                                        .map((single_label) =>
                                          get(value, single_label)
                                        )
                                        .join(" ")
                                    : [].concat(value)[0].id
                              ),
                          }
                        : {
                            icon: () =>
                              h(NIcon, () =>
                                h(
                                  "span",
                                  { style: { padding: "0 5px" } },
                                  item.key.charAt(0).toUpperCase()
                                )
                              ),
                            default: () =>
                              h(
                                NEllipsis,
                                {
                                  tooltip: true,
                                  style: {
                                    maxWidth:
                                      (item.key && item.key.length > 10
                                        ? item.key.length * 12
                                        : 120) + "px",
                                  },
                                },
                                () =>
                                  item.label
                                    ? item.label
                                        .map((single_label) =>
                                          get(value, single_label)
                                        )
                                        .join(" ")
                                    : [].concat(value)[0].id
                              ),
                          }
                    )
                : [].concat(value).map((col) =>
                    Window.value.width >= 700
                      ? h(
                          NButton,
                          {
                            onClick: () => (
                              (Drawer.value.id = col.id),
                              (Drawer.value.table = item.key),
                              (Drawer.value.data = {}),
                              LoadDrawer()
                            ),
                            loading:
                              Loading.value["Drawer"][`${item.key}_${col.id}`],
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
                                        .concat(get(col, item.image))
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
                                          (item.key && item.key.length > 10
                                            ? item.key.length * 12
                                            : 120) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        ? item.label
                                            .map((single_label) =>
                                              get(col, single_label)
                                            )
                                            .join(" ")
                                        : col.id
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      item.key.charAt(0).toUpperCase()
                                    )
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.key && item.key.length > 10
                                            ? item.key.length * 12
                                            : 120) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        ? item.label
                                            .map((single_label) =>
                                              get(col, single_label)
                                            )
                                            .join(" ")
                                        : col.id
                                  ),
                              }
                        )
                      : h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${route.params.database}/admin/tables/${item.key}/${col.id}`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${route.params.database}/admin/tables/${item.key}/${col.id}`
                              )
                            ),
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
                                        .concat(get(col, item.image))
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
                                          (item.key && item.key.length > 10
                                            ? item.key.length * 12
                                            : 120) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        ? item.label
                                            .map((single_label) =>
                                              get(col, single_label)
                                            )
                                            .join(" ")
                                        : col.id
                                  ),
                              }
                            : {
                                icon: () =>
                                  h(NIcon, () =>
                                    h(
                                      "span",
                                      { style: { padding: "0 5px" } },
                                      item.key.charAt(0).toUpperCase()
                                    )
                                  ),
                                default: () =>
                                  h(
                                    NEllipsis,
                                    {
                                      tooltip: true,
                                      style: {
                                        maxWidth:
                                          (item.key && item.key.length > 10
                                            ? item.key.length * 12
                                            : 120) + "px",
                                      },
                                    },
                                    () =>
                                      item.label
                                        ? item.label
                                            .map((single_label) =>
                                              get(col, single_label)
                                            )
                                            .join(" ")
                                        : col.id
                                  ),
                              }
                        )
                  );
            case "email":
              return h(
                NA,
                { href: `mailto:${value}`, target: "_blank" },
                {
                  default: () =>
                    h(
                      NEllipsis,
                      {
                        tooltip: true,
                        style: {
                          maxWidth:
                            (item.key && item.key.length > 10
                              ? item.key.length * 12
                              : 120) + "px",
                        },
                      },
                      () =>
                        h(
                          NA,
                          { href: `mailto:${value}`, target: "_blank" },
                          () => value
                        )
                    ),
                }
              );
            case "password":
              return h(
                NEllipsis,
                {
                  tooltip: false,
                  style: {
                    maxWidth:
                      (item.key && item.key.length > 10
                        ? item.key.length * 12
                        : 120) + "px",
                  },
                },
                () => Array.from(Array(value.length), () => "•")
              );
            case "boolean":
              return h(
                NIconWrapper,
                {
                  color: value === true ? "green" : "red",
                  borderRadius: 50,
                  size: 18,
                },
                () =>
                  h(
                    NIcon,
                    {
                      size: 16,
                    },
                    () => h(value === true ? Check : X)
                  )
              );
            case "url":
              return h(
                NA,
                { href: value, target: "_blank" },
                {
                  default: () =>
                    h(
                      NEllipsis,
                      {
                        tooltip: true,
                        style: {
                          maxWidth:
                            (item.key && item.key.length > 10
                              ? item.key.length * 12
                              : 120) + "px",
                        },
                      },
                      () =>
                        h(NA, { href: value, target: "_blank" }, () => value)
                    ),
                }
              );
            case "color":
              return h(
                NTag,
                {
                  round: true,
                  style: {
                    backgroundColor: value,
                  },
                },
                () =>
                  h(
                    NText,
                    { style: { mixBlendMode: "difference" } },
                    () => value
                  )
              );
            case "list":
            case "tags":
              return h(NSpace, () =>
                [].concat(value).map((_value) =>
                  h(
                    NTag,
                    {
                      bordered: false,
                    },
                    () =>
                      item.subtype
                        ? RenderSchema(_value, { ...item, type: item.subtype })
                        : h(
                            NEllipsis,
                            {
                              tooltip: false,
                              style: {
                                maxWidth:
                                  (item.key && item.key.length > 10
                                    ? item.key.length * 12
                                    : 120) + "px",
                              },
                            },
                            () => _value
                          )
                  )
                )
              );
            case "html":
              return h(
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
                  default: () => h("div", { innerHTML: value }),
                }
              );
            case "date":
              return h(
                NPopover,
                {},
                {
                  trigger: () =>
                    h(NTime, {
                      time: Number(value),
                      type: "relative",
                    }),
                  default: () =>
                    h(NTime, {
                      time: Number(value),
                    }),
                }
              );
            case "upload":
              return [].concat(value).length === 1
                ? [].concat(value).map((link) =>
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
                      : h(NIcon, () => h(FileUpload))
                  )
                : h(NImageGroup, () =>
                    h(NSpace, { align: "center" }, () =>
                      [].concat(value).length > 3
                        ? [
                            ...[]
                              .concat(value)
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
                                  : h(NIcon, () => h(FileUpload))
                              ),
                            `+${[].concat(value).length - 3}`,
                          ]
                        : [].concat(value).map((link) =>
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
                              : h(NIcon, () => h(FileUpload))
                          )
                    )
                  );
            case "role":
              return h(
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
                            (item.key && item.key.length > 10
                              ? item.key.length * 12
                              : 120) + "px",
                        },
                      },
                      () => t(value)
                    ),
                  icon: () =>
                    h(
                      "span",
                      { style: { padding: "0 5px" } },
                      value.charAt(0).toUpperCase()
                    ),
                }
              );
            case "string":
              if (item.subtype)
                return RenderSchema(value, { ...item, type: item.subtype });
              else return RenderSchema(value, { ...item, type: "text" });
            case "array":
              if (!item.children) throw new Error("no children");
              if (!isArrayOfObjects(item.children))
                return RenderSchema(value, { ...item, type: "tags" });
              return h(
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
                      { default: () => `[...]` }
                    ),
                  default: () =>
                    h(
                      NCollapse,
                      { accordion: true, arrowPlacement: "right" },
                      () =>
                        [].concat(value).map((_item, index) =>
                          h(
                            NCollapseItem,
                            {
                              title: `${item.key} ${index + 1}`,
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
                                      h("strong", `${t(child.key)}:`),
                                      RenderSchema(
                                        get(_item, child.slug),
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
              );
            case "object":
              return h(
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
                          h("strong", `${child.key}:`),
                          RenderSchema(get(value, child.slug), child),
                        ])
                      )
                    ),
                }
              );
            default:
              return value
                ? h(
                    NEllipsis,
                    {
                      tooltip: false,
                      style: {
                        maxWidth:
                          (item.key && item.key.length > 10
                            ? item.key.length * 12
                            : 120) + "px",
                      },
                    },
                    () => value
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
                label: t("delete"),
                key: "delete",
                disabled: checkedRowKeys.value.length === 0,
                icon: () => h(NIcon, () => h(Trash)),
                onSelect: async () => {
                  Loading.value["TableData"] = true;
                  await useFetch(
                    `/api/${route.params.database}/${route.params.table}`,
                    {
                      method: "DELETE",
                      body: checkedRowKeys.value,
                    }
                  );
                  message.success("Deleted Successfully");
                  await refreshTableData();
                },
              },
            ],
          },
          ...(database.value.tables
            ? database.value.tables.find(
                (item) => item.slug === route.params.table
              )?.schema ?? []
            : []
          ).map((item) => ({
            title: () =>
              h(NSpace, { align: "center" }, () => [
                FieldsList.flatMap(({ label, key, icon, children }) => [
                  { label, key, icon },
                  ...(children ?? []),
                ])
                  .find(({ key }) =>
                    item.subtype ? key === item.subtype : key === item.type
                  )
                  ?.icon() ?? h(NIcon, () => h(QuestionMark)),
                t(item.key),
              ]),
            width:
              item.key && item.key.length > 10 ? item.key.length * 12 : 120,
            key: item.key,
            render: (row) => RenderSchema(row[item.key], item),
          })),
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
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${route.params.database}/admin/tables/${route.params.table}/${row.id}`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${route.params.database}/admin/tables/${route.params.table}/${row.id}`
                              )
                            ),
                            secondary: true,
                            circle: true,
                            type: "primary",
                          },
                          { icon: () => h(NIcon, () => h(Eye)) }
                        ),
                      default: () => t("view_item"),
                    }
                  ),
                  h(
                    NPopover,
                    {},
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            tag: "a",
                            href: `/${route.params.database}/admin/tables/${route.params.table}/${row.id}/edit`,
                            onClick: (e) => (
                              e.preventDefault(),
                              navigateTo(
                                `/${route.params.database}/admin/tables/${route.params.table}/${row.id}/edit`
                              )
                            ),
                            secondary: true,
                            circle: true,
                            type: "info",
                          },
                          { icon: () => h(NIcon, () => h(Pencil)) }
                        ),
                      default: () => t("edit"),
                    }
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
                                    {
                                      icon: () => h(NIcon, () => h(Trash)),
                                    }
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

    watch(searchInput, (v) => {
      const { search, ...Query } = route.query;
      return v
        ? router.push({
            query: {
              ...(Query ?? {}),
              search: v,
            },
          })
        : router.push({
            query: Query ?? {},
          });
    });

    watch(ShowDeleted, (v) => {
      pagination.value.page = 1;
      const { show_deleted, ...Query } = route.query;
      v
        ? router.push({ query: { ...Query, show_deleted: null } })
        : router.push({ query: Query ?? {} });
      return refreshTableData();
    });

    useHead({
      title: `${database.value.slug} | ${t(
        database.value.tables.find((item) => item.slug === route.params.table)
          .slug
      )} ${t("Table")}`,
      link: [{ rel: "icon", href: database.value.icon }],
    });

    return () => [
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
                          t("edit"),
                          " ",
                          h(
                            NText,
                            {
                              tag: "a",
                              href: `/${route.params.database}/admin/tables/${Drawer.value.table}/${Drawer.value.id}/edit`,
                              onClick: (e) => (
                                e.preventDefault(),
                                navigateTo(
                                  `/${route.params.database}/admin/tables/${Drawer.value.table}/${Drawer.value.id}/edit`
                                )
                              ),
                              style: {
                                cursor: "pointer",
                              },
                              type: "primary",
                            },
                            () => [
                              t(Drawer.value.table),
                              h(NIcon, () => h(ExternalLink)),
                            ]
                          ),
                        ]
                      : [t("new"), " ", t(Drawer.value.table)],
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
                                        ? ChevronRight
                                        : ChevronLeft
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
                        h(LazyRenderFields, {
                          modelValue: Drawer.value.data,
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
              headerStyle: { paddingRight: 0, paddingLeft: 0 },
              contentStyle: "padding: 0",
              bordered: false,
            },
            {
              header: () =>
                h(NSpace, () => [
                  t(
                    database.value.tables.find(
                      (item) => item.slug === route.params.table
                    )?.slug
                  ) ?? "--",
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
                  h("input", {
                    style: { display: "none" },
                    ref: ImportInput,
                    type: "file",
                    accept: ".json,.csv,.xml",
                    onChange: async (e) => {
                      const reader = new FileReader();
                      reader.addEventListCheckener("load", async (event) => {
                        try {
                          let items,
                            chunkSize = 500;
                          switch (e.target.files[0].type) {
                            case "application/json":
                              items = JSON.parse(event.target.result);
                              break;
                          }
                          if (items && items.length > 0) {
                            UploadProgress.value = 0;
                            let newItems = [
                              ...Array(Math.ceil(items.length / chunkSize)),
                            ].map((_, index) => index);
                            for await (const index of newItems) {
                              const { data } = await useFetch(
                                `/api/${route.params.database}/${route.params.table}`,
                                {
                                  method: "POST",
                                  body: items.splice(0, chunkSize),
                                }
                              );
                              if (
                                data.value &&
                                data.value.result &&
                                data.value.result.length > 0
                              ) {
                                UploadProgress.value =
                                  ((index + 1) * 100) / newItems.length;
                                if (UploadProgress.value === 100) {
                                  message.success(data.value.message.en);
                                  setTimeout(
                                    () => (UploadProgress.value = null),
                                    1500
                                  );
                                }
                              } else message.error(data.value.message.en);
                            }
                            refreshTableData();
                          } else message.error("File not valid");
                        } catch (error) {
                          console.log(error);
                        }
                        e.target.value = null;
                      });
                      reader.readAsText(e.target.files[0]);
                    },
                  }),
                  h(
                    NPopover,
                    {
                      disabled:
                        !searchInput.value &&
                        (!TableData.value?.result ||
                          !database.value.tables ||
                          !database.value.tables.find(
                            (item) => item.slug === route.params.table
                          ).schema),
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
                                    !searchInput.value &&
                                    (!TableData.value?.result ||
                                      !database.value.tables ||
                                      !database.value.tables.find(
                                        (item) =>
                                          item.slug === route.params.table
                                      ).schema),
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
                                      (item) => item.slug === route.params.table
                                    ).schema
                                      ? database.value.tables
                                          .find(
                                            (item) =>
                                              item.slug === route.params.table
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
                  h(
                    NDropdown,
                    {
                      options: [
                        {
                          icon: () => h(NIcon, () => h(TableImport)),
                          label: t("import"),
                          key: "import",
                        },
                        {
                          icon: () => h(NIcon, () => h(TableExport)),
                          label: t("export"),
                          key: "export",
                          disabled: !TableData.value?.result,
                          children: [
                            {
                              label: t("export_current_data"),
                              key: "export_current_data",
                            },
                            {
                              label: t("export_all_data"),
                              key: "export_all_data",
                            },
                          ],
                        },
                      ],
                      trigger: "click",
                      onSelect: (v) => {
                        switch (v) {
                          case "import":
                            ImportInput.value.click();
                            break;
                          case "export_current_data":
                            break;
                          case "export_all_data":
                            break;
                        }
                      },
                    },
                    () =>
                      h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
                              NButton,
                              { disabled: UploadProgress.value !== null },
                              {
                                icon: () =>
                                  UploadProgress.value !== null
                                    ? h(NProgress, {
                                        type: "circle",
                                        showIndicator: false,
                                        status:
                                          UploadProgress.value < 100
                                            ? "warning"
                                            : "success",
                                        percentage: UploadProgress.value,
                                        strokeWidth: 20,
                                      })
                                    : h(NIcon, () => h(Tools)),
                              }
                            ),
                          default: () => t("tools"),
                        }
                      )
                  ),
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
                                (item) => item.slug === route.params.table
                              ).schema,
                            tag: "a",
                            href:
                              !database.value.tables ||
                              !database.value.tables.find(
                                (item) => item.slug === route.params.table
                              ).schema
                                ? null
                                : `/${route.params.database}/admin/tables/${route.params.table}/new`,
                            onClick: (e) => (
                              e.preventDefault(),
                              Window.value.width >= 700
                                ? ((Drawer.value.table = route.params.table),
                                  (Drawer.value.id = null),
                                  (Drawer.value.data = {}),
                                  (Drawer.value.show = true))
                                : navigateTo(
                                    !database.value.tables ||
                                      !database.value.tables.find(
                                        (item) =>
                                          item.slug === route.params.table
                                      ).schema
                                      ? null
                                      : `/${route.params.database}/admin/tables/${route.params.table}/new`
                                  )
                            ),
                          },
                          {
                            icon: () => h(NIcon, () => h(Plus)),
                          }
                        ),
                      default: () => t("add_new"),
                    }
                  ),
                  user.value.role === "admin"
                    ? h(
                        NPopover,
                        {},
                        {
                          trigger: () =>
                            h(
                              NButton,
                              {
                                tag: "a",
                                href: `/${route.params.database}/admin/tables/${route.params.table}/settings`,
                                onClick: (e) => (
                                  e.preventDefault(),
                                  navigateTo(
                                    `/${route.params.database}/admin/tables/${route.params.table}/settings`
                                  )
                                ),
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
              default: () => {
                const columns = GenerateColumns();
                return h(NDataTable, {
                  scrollX: columns.reduce((accumulator, value) => {
                    return accumulator + (value.width ?? 0);
                  }, 40),
                  resizable: true,
                  id: "DataTable",
                  remote: true,
                  ref: TableDataRef,
                  columns: columns,
                  data: TableData.value?.result || [],
                  loading: Loading.value["TableData"],
                  pagination: pagination.value,
                  rowKey: (row) => row.id,
                  checkedRowKeys: checkedRowKeys.value,
                  "on-update:checked-row-keys": (keys) =>
                    (checkedRowKeys.value = keys),
                  "on-update:sorter": (sorter) => console.log(sorter),
                });
              },
            }
          )
        : null,
    ];
  },
});
