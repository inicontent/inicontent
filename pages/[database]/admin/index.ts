import { NCard, NText } from "naive-ui";
import { LazyTablesGrid } from "#components";
import type { Database } from "~/types";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    useLanguage({
      ar: {
        add_new: "أضف عنصر جديد",
        table_settings: "إعدادات الجدول",
      },
      en: {
        add_new: "Add New Item",
        table_settings: "Table Settings",
      },
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
