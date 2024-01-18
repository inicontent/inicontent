import { LazyAssetCard } from "#components";
import type { Asset, Database, apiResponse } from "~/types";

export default defineNuxtComponent({
  async setup() {
    definePageMeta({
      middleware: "dashboard",
      layout: "table",
    });

    const database = useState<Database>("database");

    useHead({
      title: `${database.value.slug} | ${t("assets")}`,
      link: [{ rel: "icon", href: database.value.icon ?? "" }],
    });

    const { data: assets } = await useLazyFetch<apiResponse<Asset[]>>(
      `${useRuntimeConfig().public.apiBase}${database.value.slug}/asset`
    );

    return () => h(LazyAssetCard, { modelValue: assets.value?.result });
  },
});
