<template>
  <NConfigProvider
    :theme="Theme === 'dark' ? darkTheme : {}"
    :theme-overrides="{ common: ThemeConfig }"
  >
    <NLoadingBarProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<script setup>
import { NConfigProvider, NLoadingBarProvider, darkTheme } from "naive-ui";
import * as Vibrant from "node-vibrant";
const Theme = useGlobalCookie("Theme"),
  database = useState("database", () => ({
    name: "Inicontent",
    icon: "/favicon.ico",
  })),
  ThemeConfig = useState("ThemeConfig", () => ({
    primaryColor: "#FF9800",
    primaryColorHover: "#F7A42A",
    primaryColorPressed: "#E19421",
    primaryColorSuppl: "#CB7900",
  }));

if (!Theme.value) Theme.value = "light";

if (
  database.value &&
  database.value.slug !== "inicontent" &&
  database.value.icon
) {
  try {
    const Palette = await Vibrant.from(database.value.icon).getPalette();
    if (Palette && Palette.Vibrant)
      ThemeConfig.value = {
        primaryColor: Palette.Vibrant.hex,
        primaryColorHover: Palette.LightVibrant.hex,
        primaryColorPressed: Palette.DarkVibrant.hex,
        primaryColorSuppl: Palette.Muted.hex,
      };
  } catch (error) {
    console.error(error);
  }
}
</script>

<style>
a {
  text-decoration: none !important;
}
</style>
