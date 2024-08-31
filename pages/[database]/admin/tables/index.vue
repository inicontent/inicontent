<template>
    <NCard :title="t('tables')" style="background:none" :bordered="false">
        <LazyTableGrid :model-value="database" />
    </NCard>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
definePageMeta({
    middleware: "dashboard",
});

const database = useState<Database>("database");
useHead({
    title: `${database.value.slug} | ${t("tables")}`,
    link: [{ rel: "icon", href: database.value?.icon ?? "" }],
});
</script>