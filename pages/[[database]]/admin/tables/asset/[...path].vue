<template>
    <AssetCard />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["database", "user", "dashboard", "table"],
    layout: "table",
});

const route = useRoute()
const database = useState<Database>("database");

useHead({
    title: `${t(database.value.slug)} | ${t("assets")}${route.params.folder
        ? ` > /${[].concat(route.params.folder as any).join("/")}`
        : ""
        }`,
    link: [{ rel: "icon", href: database.value?.icon?.publicURL ?? "/favicon.ico" }],
});
</script>
