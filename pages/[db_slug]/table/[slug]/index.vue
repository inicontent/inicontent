<template>
  <NLayout position="absolute" has-sider>
    <NLayoutSider
      :collapsed="!isMenuOpen"
      @collapse="isMenuOpen = false"
      @expand="isMenuOpen = true"
      style="z-index: 999"
      bordered
      show-trigger="bar"
      collapse-mode="width"
      :collapsed-width="Window.width < 700 ? 0 : 64"
      :width="240"
      :native-scrollbar="false"
    >
      <NMenu
        :collapsed="!isMenuOpen"
        :collapsed-icon-size="22"
        :collapsed-width="Window.width < 700 ? 0 : 64"
        :options="menuOptions"
        :default-expanded-keys="[$route.params.slug]"
        v-model:value="$route.params.slug"
        accordion
      />
    </NLayoutSider>
    <n-layout-content
      position="absolute"
      :content-style="
        Window.width < 700 ? 'padding: 24px' : 'padding: 24px 24px 24px 88px'
      "
      :native-scrollbar="false"
      id="page_content"
    >
      <div
        v-show="isMenuOpen"
        @click="isMenuOpen = false"
        style="
          width: 100%;
          height: 100%;
          right: 0px;
          top: 0px;
          background-color: #0000006e;
          position: absolute;
          z-index: 99;
          cursor: pointer;
        "
      ></div>
      <RenderTable :db="$route.params.db_slug" :table="$route.params.slug" />
    </n-layout-content>
  </NLayout>
</template>

<script setup>
import { NLayout, NLayoutSider, NLayoutContent, NMenu, NIcon } from "naive-ui";
import {
  LetterA,
  LetterB,
  LetterC,
  LetterD,
  LetterE,
  LetterF,
  LetterG,
  LetterH,
  LetterI,
  LetterJ,
  LetterK,
  LetterL,
  LetterM,
  LetterN,
  LetterO,
  LetterP,
  LetterQ,
  LetterR,
  LetterS,
  LetterT,
  LetterU,
  LetterV,
  LetterW,
  LetterX,
  LetterY,
  LetterZ,
  Database,
  CirclePlus,
  Eye,
} from "@vicons/tabler";
import { NuxtLink } from "#components";

definePageMeta({
  middleware: "dashboard",
});
const LettersIcons = {
  a: LetterA,
  b: LetterB,
  c: LetterC,
  d: LetterD,
  e: LetterE,
  f: LetterF,
  g: LetterG,
  h: LetterH,
  i: LetterI,
  j: LetterJ,
  k: LetterK,
  l: LetterL,
  m: LetterM,
  n: LetterN,
  o: LetterO,
  p: LetterP,
  q: LetterQ,
  r: LetterR,
  s: LetterS,
  t: LetterT,
  u: LetterU,
  v: LetterV,
  w: LetterW,
  x: LetterX,
  y: LetterY,
  z: LetterZ,
};

const route = useRoute(),
  Window = useState("Window", () => ({
    width: 0,
  })),
  User = useState("User"),
  isMenuOpen = useState("isMenuOpen", () => false),
  database = useState("database"),
  menuOptions = database.value.tables
    .filter(
      ({ slug, allowed_methods }) =>
        User.value.role &&
        (User.value.role === "admin" ||
          slug === "user" ||
          (allowed_methods &&
            allowed_methods[User.value.role] &&
            allowed_methods[User.value.role].includes("r")))
    )
    .map(({ name, slug, allowed_methods }) => ({
      label: () =>
        h(
          NuxtLink,
          {
            to: `/${route.params.db_slug}/table/${slug}`,
          },
          { default: () => name }
        ),
      key: slug,
      icon: () => h(NIcon, () => h(LettersIcons[slug.charAt(0)] ?? Database)),
      children:
        User.value.role === "admin" ||
        slug === "user" ||
        (allowed_methods &&
          allowed_methods[User.value.role] &&
          allowed_methods[User.value.role].includes("c"))
          ? [
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: `/${route.params.db_slug}/table/${slug}`,
                    },
                    { default: () => `Show all` }
                  ),
                key: slug,
                icon: () => h(NIcon, () => h(Eye)),
              },
              {
                label: () =>
                  h(
                    NuxtLink,
                    {
                      to: `/${route.params.db_slug}/table/${slug}/new`,
                    },
                    { default: () => "New " + name }
                  ),
                key: `new-${slug}`,
                icon: () => h(NIcon, () => h(CirclePlus)),
              },
            ]
          : null,
    }));

useHead({
  title: `${database.value.name} | ${
    database.value.tables.find((item) => item.slug === route.params.slug).name
  } Table`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
