<template>
  <n-message-provider>
    <NLayout position="absolute">
      <n-scrollbar style="max-height: 65px" x-scrollable trigger="none">
        <NLayoutHeader style="height: 64px; padding: 15px 24px" bordered>
          <n-page-header>
            <template #avatar>
              <n-tag strong round :bordered="false">
                {{ database.name }}
                <template #avatar>
                  <n-avatar :src="database.icon ?? '/favicon.ico'" />
                </template>
              </n-tag>
            </template>
            <template
              v-if="
                ![
                  'index',
                  'auth',
                  'dashboard',
                  'db_slug',
                  'db_slug-auth',
                ].includes($route.name)
              "
              #title
            >
              <n-breadcrumb>
                <n-breadcrumb-item
                  v-for="(childRoute, index) in $route.path
                    .substring(1)
                    .split('/')
                    .filter(Boolean)"
                  :key="childRoute"
                >
                  <NuxtLink
                    :to="
                      $route.path
                        .split('/')
                        .slice(0, index + 2)
                        .join('/')
                    "
                    >{{
                      childRoute.charAt(0).toUpperCase() +
                      childRoute.slice(1).replaceAll("_", " ")
                    }}
                  </NuxtLink>
                </n-breadcrumb-item>
              </n-breadcrumb>
            </template>
            <template #extra>
              <n-space inline :wrap="false">
                <n-dropdown
                  v-if="User && User.id"
                  :options="UserOptions"
                  @select="UserOptionsOnSelect"
                >
                  <n-tag round checkable>
                    {{ User.username }}
                    <template #icon>
                      <n-icon>
                        <UserCircle />
                      </n-icon>
                    </template>
                  </n-tag>
                </n-dropdown>
                <n-button
                  size="small"
                  circle
                  @click="
                    Theme === 'dark' ? (Theme = 'light') : (Theme = 'dark')
                  "
                >
                  <template #icon>
                    <n-icon v-if="Theme === 'light'">
                      <MoonStars />
                    </n-icon>
                    <n-icon v-else>
                      <Sun />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </template>
          </n-page-header>
        </NLayoutHeader>
      </n-scrollbar>

      <n-layout-content
        position="absolute"
        style="top: 64px; bottom: 34px; height: calc(~'100vh - 98px')"
        :native-scrollbar="false"
        :content-style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          height: 'max-content',
        }"
      >
        <slot />
      </n-layout-content>
      <NLayoutFooter
        position="absolute"
        style="
          height: 34px;
          padding: 0 24px;
          display: flex;
          align-items: center;
        "
        bordered
      >
        <n-text>
          All rights reserved Inicontent
          <n-icon :size="12">
            <Copyright />
          </n-icon>
          {{ new Date().getFullYear() }}
        </n-text>
      </NLayoutFooter>
    </NLayout>
  </n-message-provider>
</template>

<script setup>
import {
  NLayout,
  NLayoutHeader,
  NScrollbar,
  NLayoutFooter,
  NLayoutContent,
  NPageHeader,
  NBreadcrumb,
  NBreadcrumbItem,
  NSpace,
  NButton,
  NIcon,
  NTag,
  NAvatar,
  useLoadingBar,
  NMessageProvider,
  NText,
  NDropdown,
} from "naive-ui";
import {
  Sun,
  MoonStars,
  Copyright,
  UserCircle,
  Pencil,
  Logout,
} from "@vicons/tabler";
import { Buffer } from "buffer";

const route = useRoute(),
  Window = useState("Window"),
  UserCookie = useCookie("User"),
  User = useState("User"),
  Theme = useGlobalCookie("Theme"),
  nuxtApp = useNuxtApp(),
  loadingBar = useLoadingBar(),
  database = useState("database", () => ({
    name: "Inicontent",
    icon: "/favicon.ico",
  })),
  UserOptions = [
    {
      label: "Edit User",
      key: "edit",
      icon: () => h(NIcon, () => h(Pencil)),
    },
    {
      label: "Logout",
      key: "logout",
      icon: () => h(NIcon, () => h(Logout)),
    },
  ],
  UserOptionsOnSelect = async (v) => {
    switch (v) {
      case "edit":
        navigateTo(
          `${route.name.startsWith("dashboard") ? "/dashboard/" : "/"}${
            route.params.db_slug
          }/user/${User.value.id}`
        );
        break;
      case "logout":
        await $fetch(
          `https://api.inicontent.com/${
            route.params.db_slug ?? "inicontent"
          }/auth/logout`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
          }
        );
        UserCookie.value = null;
        User.value = null;
        await navigateTo(
          route.name.startsWith("dashboard")
            ? "/auth"
            : route.params.db_slug
            ? `/${route.params.db_slug}/auth`
            : "/auth"
        );
        break;
    }
  };
// nuxtApp.hook('page:start', () => (loadingBar.start(), setTimeout(() => loadingBar.finish(), 1000)))
nuxtApp.hook("page:start", () => loadingBar.start());
nuxtApp.hook("page:finish", () => loadingBar.finish());
nuxtApp.hook("app:error", () => loadingBar.error());

onMounted(() => {
  Window.value = { width: window.innerWidth };
  window.addEventListener(
    "resize",
    () => (Window.value = { width: window.innerWidth })
  );
});
</script>
