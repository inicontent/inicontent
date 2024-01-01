import { NCard } from "naive-ui";
import { LazyTablesGrid } from "#components";
import type { Database } from "~/types";
export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    const database = useState<Database>("database");
    useHead({
      title: `${database.value.slug} | ${t("Tables")}`,
      link: [{ rel: "icon", href: database.value.icon ?? "" }],
    });
    return () =>
      h(
        NCard,
        { title: t("Tables"), style: "background: none", bordered: false },
        () => h(LazyTablesGrid, { modelValue: database.value })
      );
  },
});
