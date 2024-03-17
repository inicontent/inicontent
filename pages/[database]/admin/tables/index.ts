import { NCard } from "naive-ui";
import { LazyTableGrid } from "#components";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
    });

    const database = useState<Database>("database");
    useHead({
      title: `${database.value.slug} | ${t("Tables")}`,
      link: [{ rel: "icon", href: database.value?.icon ?? "" }],
    });
    return () =>
      h(
        NCard,
        { title: t("tables"), style: "background: none", bordered: false },
        () => h(LazyTableGrid, { modelValue: database.value })
      );
  },
});
