import { NCard, NText } from "naive-ui";
import { LazyTablesGrid } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        newItem: "عنصر جديد",
        tableSettings: "إعدادات الجدول",
      },
      en: {},
    });

    const Loading = useState("Loading", () => ({}));

    const database = useState<Database>("database");

    useHead({
      title: `${database.value.slug} | ${t("admin")}`,
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });
    return () => [
      h(
        NCard,
        { title: t("Tables"), style: "background: none", bordered: false },
        {
          header: () =>
            h(
              NText,
              {
                href: `/${database.value.slug}/admin/settings`,
                onClick: () =>
                  navigateTo(`/${database.value.slug}/admin/tables`),
                style: {
                  cursor: "pointer",
                },
              },
              () => t("Tables")
            ),
          default: () => h(LazyTablesGrid, { modelValue: database.value }),
        }
      ),
    ];
  },
});
