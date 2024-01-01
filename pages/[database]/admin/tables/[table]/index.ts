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
  IconCheck,
  IconX,
  IconPencil,
  IconTrash,
  IconDeviceFloppy,
  IconSearch,
  IconSettings,
  IconPlus,
  IconTools,
  IconMinus,
  IconQuestionMark,
  IconExternalLink,
  IconFileUpload,
  IconTableImport,
  IconTableExport,
  IconEye,
  IconChevronRight,
  IconChevronLeft,
  IconSwitchHorizontal,
} from "@tabler/icons-vue";
import { deleteProperty, getProperty, setProperty } from "dot-prop";
import { LazyRenderFields } from "#components";
import { isArrayOfObjects, FormatObjectCriteriaValue } from "inibase/utils";
import { type Database, type User } from "@/types";
export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    const route = useRoute(),
      router = useRouter(),
      database = useState<Database>("database");
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

    const parseSearchInput = (search: any) => {
      let RETURN: any = {};
      Object.entries(search).forEach(([condition, items]) => {
        if (!RETURN[condition]) RETURN[condition] = [];
        Object.entries(items).forEach(([key, value]) => {
          if (["and", "or"].includes(key))
            RETURN[condition].push({ [key]: parseSearchInput(value) });
          else
            RETURN[condition].push([key, ...FormatObjectCriteriaValue(value)]);
        });
      });
      return RETURN;
    };

    const Loading = useState<Record<string, boolean>>("Loading", () => ({})),
      Window = useState<any>("Window"),
      searchInput = useState<any>("searchInput"),
      searchArray = useState<{
        and?: [string | null, string, any][];
        or?: [string | null, string, any][];
      }>("searchArray"),
      searchField = useState<any>(() => []),
      ShowDeleted = useState<any>(() =>
        route.query.hasOwnProperty("show_deleted") ? true : false
      ),
      DisabledItem = useState<boolean[]>(() => []);
    searchInput.value = route.query.search ?? null;
    searchArray.value = route.query.search
      ? parseSearchInput(JSON.parse(route.query.search as string))
      : { and: [[null, "=", null]] };
    Loading.value["TableData"] = false;
    Loading.value["DrawerContent"] = false;
    Loading.value["Drawer"] = false;

    const user = useState<User | any>("user"),
      message = useMessage(),
      ImportInput = ref(),
      UploadProgress = ref<any>(null),
      DrawerFormRef = useState(() => null),
      Drawer = useState<{
        show: boolean;
        id: null | string;
        table: null | string;
        data: any;
        width: number;
      }>("Drawer", () => ({
        show: false,
        id: null,
        table: null,
        data: {},
        width: 251,
      })),
      LoadDrawer = async () => {
        Loading.value[`Drawer_${Drawer.value.table}_${Drawer.value.id}`] = true;
        await useFetch(
          `/api/${route.params.database}/${Drawer.value.table}/${Drawer.value.id}`,
          {
            transform: (res: any) => (Drawer.value.data = res.result),
          }
        );
        Loading.value[`Drawer_${Drawer.value.table}_${Drawer.value.id}`] =
          false;
        Drawer.value.show = true;
      },
      UpdateDrawer = async () => {
        (DrawerFormRef.value as any)?.validate(async (errors: any) => {
          if (!errors) {
            Loading.value["DrawerContent"] = true;
            const { data }: any = await useFetch(
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
        (DrawerFormRef.value as any)?.validate(async (errors: any) => {
          if (!errors) {
            Loading.value["DrawerContent"] = true;
            const { data } = await useFetch(
              `/api/${route.params.database}/${Drawer.value.table}`,
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
        itemCount: 0,
        pageSizes: [15, 30, 60, 100, 500],
        prefix: ({ itemCount }: any) => itemCount,
        onChange: async (currentPage: number) => {
          pagination.value.page = currentPage;
          let { page, ...Query }: any = route.query;
          if (currentPage !== 1) Query = { ...Query, page: currentPage };
          router.push({ query: Query });
          return refreshTableData();
        },
        onUpdatePageSize: async (pageSize: number) => {
          let OLD_pageSize = JSON.parse(
            JSON.stringify(pagination.value.pageSize)
          );
          pagination.value.pageSize = pageSize;
          let { per_page, page, ...Query }: any = route.query;
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
      { data: TableData, refresh: refreshTableData }: any = await useLazyFetch(
        `/api/${route.params.database}/${route.params.table}`,
        {
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
                    ...JSON.parse(searchInput.value),
                    deletedAt: ">0",
                  })
                : searchInput.value
              : ShowDeleted.value
              ? JSON.stringify({ deletedAt: ">0" })
              : null,
          },
          transform: (res: any) => {
            Loading.value["TableData"] = false;
            if (res.options.total < res.options.per_page)
              pagination.value.showSizePicker = false;
            pagination.value.pageCount = res.options.total_pages;
            pagination.value.itemCount = res.options.total;
            return res;
          },
        }
      ),
      DELETE = async (id: any) => {
        Loading.value["TableData"] = true;
        await useFetch(
          `/api/${route.params.database}/${route.params.table}/${id}`,
          {
            method: "DELETE",
          }
        );
        TableData.value.result = TableData.value.result.filter(
          (item: { id: any }) => item.id !== id
        );
        pagination.value.itemCount--;
        message.success("Deleted Successfully");
        Loading.value["TableData"] = false;
      },
      RenderSchema = (value: any, item: any): any => {
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
                    () => h(IconX)
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
                          (Drawer.value.id = ([].concat(value)[0] as any).id),
                          (Drawer.value.table = item.key),
                          (Drawer.value.data = {}),
                          LoadDrawer()
                        ),
                        loading:
                          Loading.value[
                            `Drawer_${item.key}_${
                              ([].concat(value)[0] as any).id
                            }`
                          ],
                        size: "small",
                        round: true,
                      },
                      item.image
                        ? {
                            icon: () =>
                              h(NIcon, () => {
                                const img = []
                                  .concat(
                                    getProperty(value, item.image, []) as any
                                  )
                                  .map((link: string) =>
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
                                    ].includes(link.split(".").pop() ?? "")
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
                                        .map((single_label: any) =>
                                          getProperty(value, single_label)
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
                                        .map((single_label: any) =>
                                          getProperty(value, single_label)
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
                            }/${([].concat(value)[0] as any).id}`
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
                                    .concat(
                                      getProperty(value, item.image, []) as any
                                    )
                                    .map((link: string) =>
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
                                      ].includes(link.split(".").pop() ?? "")
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
                                        .map((single_label: any) =>
                                          getProperty(value, single_label)
                                        )
                                        .join(" ")
                                    : ([].concat(value)[0] as any).id
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
                                        .map((single_label: any) =>
                                          getProperty(value, single_label)
                                        )
                                        .join(" ")
                                    : ([].concat(value)[0] as any).id
                              ),
                          }
                    )
                : [].concat(value).map((col: any) =>
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
                              Loading.value[`Drawer_${item.key}_${col.id}`],
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
                                          getProperty(
                                            col,
                                            item.image,
                                            []
                                          ) as any
                                        )
                                        .map((link: string) =>
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
                                          ].includes(
                                            link.split(".").pop() ?? ""
                                          )
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
                                            .map((single_label: any) =>
                                              getProperty(col, single_label)
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
                                            .map((single_label: any) =>
                                              getProperty(col, single_label)
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
                                        .concat(
                                          getProperty(
                                            col,
                                            item.image,
                                            []
                                          ) as any
                                        )
                                        .map((link: string) =>
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
                                          ].includes(
                                            link.split(".").pop() ?? ""
                                          )
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
                                            .map((single_label: any) =>
                                              getProperty(col, single_label)
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
                                            .map((single_label: any) =>
                                              getProperty(col, single_label)
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
                    () => h(value === true ? IconCheck : IconX)
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
                      item.subType
                        ? RenderSchema(_value, { ...item, type: item.subType })
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
                ? [].concat(value).map((link: string) =>
                    [
                      "png",
                      "jpg",
                      "jpeg",
                      "ico",
                      "webp",
                      "svg",
                      "gif",
                    ].includes(link.split(".").pop() ?? "")
                      ? h(NImage, {
                          src:
                            link && link.includes("cdn.inicontent")
                              ? `${link}?fit=32`
                              : link,
                          previewSrc: link,
                          width: 32,
                        })
                      : h(NIcon, () => h(IconFileUpload))
                  )
                : h(NImageGroup, () =>
                    h(NSpace, { align: "center" }, () =>
                      [].concat(value).length > 3
                        ? [
                            ...[]
                              .concat(value)
                              .slice(0, 3)
                              .map((link: string) =>
                                [
                                  "png",
                                  "jpg",
                                  "jpeg",
                                  "ico",
                                  "webp",
                                  "svg",
                                  "gif",
                                ].includes(link.split(".").pop() ?? "")
                                  ? h(NImage, {
                                      src:
                                        link && link.includes("cdn.inicontent")
                                          ? `${link}?fit=32`
                                          : link,
                                      previewSrc: link,
                                      width: 32,
                                    })
                                  : h(NIcon, () => h(IconFileUpload))
                              ),
                            `+${[].concat(value).length - 3}`,
                          ]
                        : [].concat(value).map((link: string) =>
                            [
                              "png",
                              "jpg",
                              "jpeg",
                              "ico",
                              "webp",
                              "svg",
                              "gif",
                            ].includes(link.split(".").pop() ?? "")
                              ? h(NImage, {
                                  src:
                                    link && link.includes("cdn.inicontent")
                                      ? `${link}?fit=32`
                                      : link,
                                  previewSrc: link,
                                  width: 32,
                                })
                              : h(NIcon, () => h(IconFileUpload))
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
              if (item.subType)
                return RenderSchema(value, { ...item, type: item.subType });
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
                                item.children.map(
                                  (child: { key: string | null; slug: any }) =>
                                    h(
                                      NSpace,
                                      {
                                        align: "center",
                                      },
                                      () => [
                                        h("strong", `${t(child.key)}:`),
                                        RenderSchema(
                                          getProperty(_item, child.slug),
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
                      item.children.map((child: { key: any; slug: any }) =>
                        h(NSpace, { align: "center", inline: true }, () => [
                          h("strong", `${child.key}:`),
                          RenderSchema(getProperty(value, child.slug), child),
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
                icon: () => h(NIcon, () => h(IconTrash)),
                onSelect: async () => {
                  Loading.value["TableData"] = true;
                  await useFetch(
                    `/api/${route.params.database}/${route.params.table}`,
                    {
                      method: "DELETE",
                      body: checkedRowKeys.value,
                    } as any
                  );
                  message.success("Deleted Successfully");
                  await refreshTableData();
                },
              },
            ],
          },
          ...(database.value.tables
            ? database.value.tables?.find(
                ({ slug }) => slug === route.params.table
              )?.schema ?? []
            : []
          ).map((item: any) => ({
            title: () =>
              h(NSpace, { align: "center" }, () => [
                FieldsList()
                  .flatMap(({ label, key, icon, children }) => [
                    { label, key, icon },
                    ...(children ?? []),
                  ])
                  .find(({ key }) =>
                    item.subType ? key === item.subType : key === item.type
                  )
                  ?.icon() ?? h(NIcon, () => h(IconQuestionMark)),
                t(item.key),
              ]),
            width:
              item.key && item.key.length > 10 ? item.key.length * 12 : 120,
            key: item.key,
            render: (row: { [x: string]: any }) =>
              RenderSchema(row[item.key], item),
          })),
          {
            title: t("actions"),
            fixed: Window.value.width > 400 ? "right" : false,
            align: "center",
            width: 150,
            key: "actions",
            render(row: { id: any }) {
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
                          { icon: () => h(NIcon, () => h(IconEye)) }
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
                          { icon: () => h(NIcon, () => h(IconPencil)) }
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
                                      icon: () => h(NIcon, () => h(IconTrash)),
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
                              { icon: () => h(NIcon, () => h(IconTrash)) }
                            ),
                          default: () => t("move_to_trash"),
                        }
                      ),
                ]
              );
            },
          },
        ].filter((i) => i !== null),
      RenderSearch = (path?: string) =>
        h(NCollapse, () =>
          Object.entries(
            getProperty(searchArray.value, path ?? "") ?? searchArray.value
          ).map(([condition, items]: any, index) =>
            h(
              NCollapseItem,
              {
                title: t(condition),
                disabled: DisabledItem.value[index],
              },
              {
                "header-extra": () =>
                  h(NSpace, {}, () => [
                    h(
                      NDropdown,
                      {
                        options: [
                          {
                            key: "and",
                            label: t("and"),
                          },
                          {
                            key: "or",
                            label: t("or"),
                          },
                        ],
                        style: {
                          maxHeight: "200px",
                        },
                        scrollable: true,
                        onSelect: (selected_condition) =>
                          setProperty(
                            searchArray.value,
                            `${path ? `${path}.` : ""}${condition}[${
                              items.length
                            }]`,
                            { [selected_condition]: [[null, "=", null]] }
                          ),
                      },
                      () =>
                        h(
                          NButton,
                          {
                            onClick: () => (
                              (DisabledItem.value[index] = true),
                              setTimeout(
                                () => (DisabledItem.value[index] = false),
                                1
                              ),
                              setProperty(
                                searchArray.value,
                                `${path ? `${path}.` : ""}${condition}[${
                                  items.length
                                }]`,
                                [null, "=", null]
                              )
                            ),
                            circle: true,
                            size: "small",
                          },
                          {
                            icon: () => h(NIcon, () => h(IconPlus)),
                          }
                        )
                    ),
                    h(
                      NButton,
                      {
                        onClick: () => (
                          (DisabledItem.value[index] = true),
                          setTimeout(
                            () => (DisabledItem.value[index] = false),
                            1
                          ),
                          setProperty(
                            searchArray.value,
                            `${path ? `${path}.` : ""}${
                              condition === "and" ? "or" : "and"
                            }`,
                            getProperty(
                              searchArray.value,
                              `${path ? `${path}.` : ""}${condition}`,
                              [[null, "=", null]]
                            )
                          ),
                          deleteProperty(
                            searchArray.value,
                            `${path ? `${path}.` : ""}${condition}`
                          )
                        ),
                        circle: true,
                        size: "small",
                      },
                      {
                        icon: () => h(NIcon, () => h(IconSwitchHorizontal)),
                      }
                    ),
                    h(
                      NButton,
                      {
                        disabled:
                          `${path ? `${path}.` : ""}${condition}` === "and",
                        onClick: () => (
                          (DisabledItem.value[index] = true),
                          setTimeout(
                            () => (DisabledItem.value[index] = false),
                            1
                          ),
                          deleteProperty(
                            searchArray.value,
                            `${path ? `${path}.` : ""}${condition}`
                          )
                        ),
                        circle: true,
                        size: "small",
                      },
                      {
                        icon: () => h(NIcon, () => h(IconTrash)),
                      }
                    ),
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
                      items.map((item: any, index: string | number) =>
                        Array.isArray(item)
                          ? h(NInputGroup, () => [
                              h(NSelect, {
                                tag: true,
                                filterable: true,
                                value: item[0],
                                onUpdateValue: (v, option) => (
                                  (searchField.value[index] = (
                                    option as any
                                  ).label),
                                  (item[0] = v)
                                ),
                                options:
                                  database.value.tables
                                    ?.find(
                                      ({ slug }) => slug === route.params.table
                                    )
                                    ?.schema?.map((item, _index: any, schema) =>
                                      GenerateSearchInOptions(schema, item)
                                    )
                                    .flat(Infinity) ?? [],
                                style: {
                                  width: "33.33%",
                                },
                              }),
                              h(NSelect, {
                                filterable: true,
                                defaultValue: "=",
                                value: item[1],
                                onUpdateValue: (v) => (item[1] = v),
                                options: [
                                  ...(searchField.value[index] &&
                                  ["date", "number"].includes(
                                    searchField.value[index]
                                  )
                                    ? [
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
                                      ]
                                    : []),
                                  {
                                    label: t("search_conditions.equal_to"),
                                    value: "=",
                                  },
                                  {
                                    label: t("search_conditions.not_equal_to"),
                                    value: "!",
                                  },
                                  {
                                    label: t("search_conditions.contains"),
                                    value: "*",
                                  },
                                  {
                                    label: t("search_conditions.not_contain"),
                                    value: "!*",
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
                                      value: item[2]
                                        ? item[2] * 1000
                                        : Date.now(),
                                      type: "datetime",
                                    });
                                  default:
                                    return h(NInput, {
                                      value: item[2],
                                      onUpdateValue: (v) => (item[2] = v),
                                      style: {
                                        width: "33.33%",
                                      },
                                    });
                                }
                              })(),

                              h(
                                NButton,
                                {
                                  disabled:
                                    `${
                                      path ? `${path}.` : ""
                                    }${condition}[${index}]` === "and[0]",
                                  onClick: () =>
                                    deleteProperty(
                                      searchArray.value,
                                      `${
                                        path ? `${path}.` : ""
                                      }${condition}[${index}]`
                                    ),
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconMinus)),
                                }
                              ),
                            ])
                          : RenderSearch(
                              `${path ? `${path}.` : ""}${condition}[${index}]`
                            )
                      )
                  ),
              }
            )
          )
        ),
      generateSearchInput = (search: any) => {
        let RETURN: any = {};
        Object.entries(search).forEach(([condition, items]) => {
          items.forEach((item: any) => {
            if (!RETURN[condition]) RETURN[condition] = {};
            if (Array.isArray(item))
              RETURN[condition][item[0]] = `${item[1]}${item[2]}`;
            else RETURN[condition] = generateSearchInput(item);
          });
        });
        return RETURN;
      };

    Drawer.value = {
      show: false,
      id: null,
      table: null,
      data: {},
      width: 251,
    };

    watch(searchInput, (v) => {
      const { search, ...Query }: any = route.query;
      return v
        ? router.push({
            query: {
              ...(Query ?? {}),
              search: JSON.stringify(v),
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
        database.value.tables?.find(({ slug }) => slug === route.params.table)
          ?.slug ?? ""
      )} ${t("Table")}`,
      link: [{ rel: "icon", href: database.value.icon ?? "" }],
    });

    return () => [
      Window.value.width >= 700
        ? h(
            NDrawer,
            {
              show: Drawer.value.show,
              "on-update:show": (v: boolean) => (Drawer.value.show = v),
              width:
                Window.value.width < 700
                  ? window.screen.width
                  : Drawer.value.width,
              "on-update:width": (w: any) => (Drawer.value.width = w),
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
                              onClick: (e: any) => (
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
                              h(NIcon, () => h(IconExternalLink)),
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
                                        ? IconChevronRight
                                        : IconChevronLeft
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
                            icon: () => h(NIcon, () => h(IconDeviceFloppy)),
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
                          schema:
                            database.value.tables
                              ?.find(({ slug }) => slug === Drawer.value.table)
                              ?.schema?.filter(
                                ({ key }) =>
                                  !["id", "createdAt", "updatedAt"].includes(
                                    key
                                  )
                              ) ?? [],
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
                    database.value.tables?.find(
                      ({ slug }) => slug === route.params.table
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
                    onChange: async (e: any) => {
                      // const reader = new FileReader();
                      // reader.addEventListCheckener(
                      //   "load",
                      //   async (event: any) => {
                      //     try {
                      //       let items,
                      //         chunkSize = 500;
                      //       switch (e.target.files[0].type) {
                      //         case "application/json":
                      //           items = JSON.parse(event.target.result);
                      //           break;
                      //       }
                      //       if (items && items.length > 0) {
                      //         UploadProgress.value = 0;
                      //         let newItems = [
                      //           ...Array(Math.ceil(items.length / chunkSize)),
                      //         ].map((_, index) => index);
                      //         for await (const index of newItems) {
                      //           const { data }:any = await useFetch(
                      //             `/api/${route.params.database}/${route.params.table}`,
                      //             {
                      //               method: "POST",
                      //               body: items.splice(0, chunkSize),
                      //             }
                      //           );
                      //           if (
                      //             data.value &&
                      //             data.value.result &&
                      //             data.value.result.length > 0
                      //           ) {
                      //             UploadProgress.value =
                      //               ((index + 1) * 100) / newItems.length;
                      //             if (UploadProgress.value === 100) {
                      //               message.success(data.value.message.en);
                      //               setTimeout(
                      //                 () => (UploadProgress.value = null),
                      //                 1500
                      //               );
                      //             }
                      //           } else message.error(data.value.message.en);
                      //         }
                      //         refreshTableData();
                      //       } else message.error("File not valid");
                      //     } catch (error) {
                      //       console.log(error);
                      //     }
                      //     e.target.value = null;
                      //   }
                      // );
                      // reader.readAsText(e.target.files[0]);
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
                            ({ slug }) => slug === route.params.table
                          )?.schema),
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
                                        ({ slug }) =>
                                          slug === route.params.table
                                      )?.schema),
                                },
                                {
                                  icon: () => h(NIcon, () => h(IconSearch)),
                                }
                              ),
                            default: () => t("search"),
                          }
                        ),
                      footer: () =>
                        h(NSpace, { justify: "end" }, () => [
                          h(NSpace, {}, () => [
                            h(
                              NButton,
                              {
                                disabled: searchInput.value === null,
                                loading: Loading.value["TableData"],
                                onClick: () => (
                                  (searchArray.value = {
                                    and: [[null, "=", null]],
                                  }),
                                  (searchInput.value = null),
                                  refreshTableData()
                                ),
                              },
                              {
                                icon: () => h(NIcon, () => h(IconX)),
                                default: () => t("reset"),
                              }
                            ),
                            h(
                              NButton,
                              {
                                loading: Loading.value["TableData"],
                                onClick: () => (
                                  console.log(
                                    generateSearchInput(searchArray.value)
                                  ),
                                  (searchInput.value =
                                    searchArray.value &&
                                    Object.values(searchArray.value).length > 0
                                      ? generateSearchInput(searchArray.value)
                                      : null),
                                  refreshTableData()
                                ),
                              },
                              {
                                icon: () => h(NIcon, () => h(IconSearch)),
                                default: () => t("search"),
                              }
                            ),
                          ]),
                        ]),
                      default: () => RenderSearch(),
                    }
                  ),
                  h(
                    NDropdown,
                    {
                      options: [
                        {
                          icon: () => h(NIcon, () => h(IconTableImport)),
                          label: t("import"),
                          key: "import",
                        },
                        {
                          icon: () => h(NIcon, () => h(IconTableExport)),
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
                                    : h(NIcon, () => h(IconTools)),
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
                                ({ slug }) => slug === route.params.table
                              )?.schema,
                            tag: "a",
                            href:
                              !database.value.tables ||
                              !database.value.tables.find(
                                ({ slug }) => slug === route.params.table
                              )?.schema
                                ? null
                                : `/${route.params.database}/admin/tables/${route.params.table}/new`,
                            onClick: (e) => (
                              e.preventDefault(),
                              Window.value.width >= 700
                                ? ((Drawer.value.table = route.params
                                    .table as string),
                                  (Drawer.value.id = null),
                                  (Drawer.value.data = {}),
                                  (Drawer.value.show = true))
                                : navigateTo(
                                    !database.value.tables ||
                                      !database.value.tables.find(
                                        ({ slug }) =>
                                          slug === route.params.table
                                      )?.schema
                                      ? null
                                      : `/${route.params.database}/admin/tables/${route.params.table}/new`
                                  )
                            ),
                          },
                          {
                            icon: () => h(NIcon, () => h(IconPlus)),
                          }
                        ),
                      default: () => t("add_new"),
                    }
                  ),
                  user.value?.role === "admin"
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
                                icon: () => h(NIcon, () => h(IconSettings)),
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
                  ref: TableDataRef as any,
                  columns: columns as any,
                  data: TableData.value?.result || [],
                  loading: Loading.value["TableData"],
                  pagination: pagination.value,
                  rowKey: (row) => row.id,
                  checkedRowKeys: checkedRowKeys.value,
                  "on-update:checked-row-keys": (keys: never[]) =>
                    (checkedRowKeys.value = keys),
                  "on-update:sorter": (sorter: any) => console.log(sorter),
                });
              },
            }
          )
        : null,
    ];
  },
});
