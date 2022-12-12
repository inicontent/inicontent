<template>
  <n-card
    title
    style="height: fit-content"
    @keydown.ctrl.s.prevent.stop="UPDATE"
    @keydown.meta.s.prevent.stop="UPDATE"
  >
    <template #header>
      <n-ellipsis>
        {{
          database.tables.find((item) => item.slug === $route.params.slug).name
        }}
        #{{ single.id }}
      </n-ellipsis>
    </template>
    <template #header-extra>
      <n-space justify="end">
        <NuxtLink
          :to="`/${$route.params.db_slug}/table/${$route.params.slug}/${$route.params.id}`"
        >
          <n-button circle secondary>
            <template #icon>
              <n-icon>
                <Eye />
              </n-icon>
            </template>
          </n-button>
        </NuxtLink>
        <n-popconfirm @positive-click="DELETE">
          <template #trigger>
            <n-button
              circle
              secondary
              type="error"
              :loading="Loading['DELETE']"
            >
              <template #icon>
                <n-icon>
                  <Trash />
                </n-icon>
              </template>
            </n-button>
          </template>
          Are you sure?
        </n-popconfirm>
        <n-button
          circle
          secondary
          type="primary"
          @click="UPDATE"
          :loading="Loading['UPDATE']"
        >
          <template #icon>
            <n-icon>
              <DeviceFloppy />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
    <n-form :model="single" ref="formRef">
      <RenderFields v-model="single" :schema="Schema" />
    </n-form>
    <template #action>
      <n-space justify="end">
        <n-popconfirm @positive-click="DELETE">
          <template #trigger>
            <n-button round secondary type="error" :loading="Loading['DELETE']">
              <template #icon>
                <n-icon>
                  <Trash />
                </n-icon>
              </template>
              DELETE
            </n-button>
          </template>
          Are you sure?
        </n-popconfirm>
        <n-button
          round
          secondary
          type="primary"
          @click="UPDATE"
          :loading="Loading['UPDATE']"
        >
          <template #icon>
            <n-icon>
              <DeviceFloppy />
            </n-icon>
          </template>
          Save
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NForm,
  NIcon,
  NButton,
  NSpace,
  NEllipsis,
  useMessage,
  NPopconfirm,
} from "naive-ui";
import { DeviceFloppy, Trash, Eye } from "@vicons/tabler";
import { Buffer } from "buffer";

definePageMeta({
  middleware: "dashboard",
});

const Loading = useState("Loading", () => ({}));
Loading.value["UPDATE"] = false;
Loading.value["DELETE"] = false;
Loading.value["EDITOR"] = false;

const route = useRoute(),
  database = useState("database"),
  Schema = database.value.tables.find(
    (item) => item.slug === route.params.slug
  ).schema,
  User = useState("User"),
  message = useMessage(),
  { data: single } = await useFetch(
    `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${
      route.params.id
    }?_options[show_deleted]=true${
      Schema
        ? "&_options[columns]=" +
          JSON.stringify(
            Schema.map((item, _index, schema) => GetPathes(schema, item)).flat(
              Infinity
            )
          )
        : ""
    }`,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${User.value.username}:${User.value.password}`).toString(
            "base64"
          ),
      },
      transform: (res) => {
        if (!res.result || !res.result.id) {
          message.error("Item not found");
          setTimeout(
            () =>
              navigateTo(`/${route.params.db_slug}/table/${route.params.slug}`),
            1000
          );
        }
        return res.result ?? {};
      },
      initialCache: false,
    }
  ),
  formRef = ref(),
  UPDATE = async () => {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        Loading.value["UPDATE"] = true;
        const { data } = await useFetch(
          `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${route.params.id}!`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            method: "PUT",
            body: single.value,
            initialCache: false,
          }
        );
        if (data.value.result && data.value.result.id) {
          single.value = data.value.result;
          message.success(data.value.message.en);
        } else message.error(data.value.message.en);
        Loading.value["UPDATE"] = false;
      } else message.error("The inputs are Invalid");
    });
  },
  DELETE = async () => {
    Loading.value["DELETE"] = true;
    const { data } = await useFetch(
      `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}/${route.params.id}`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${User.value.username}:${User.value.password}`
            ).toString("base64"),
        },
        method: "DELETE",
        initialCache: false,
      }
    );
    if (data.value.code === 204) {
      message.success(data.value.message.en);
      Loading.value["DELETE"] = false;
      return navigateTo(`/${route.params.db_slug}/table/${route.params.slug}`);
    } else message.error(data.value.message.en);
    Loading.value["DELETE"] = false;
  };
useHead({
  title: `${database.value.name} | ${
    database.value.tables.find((item) => item.slug === route.params.slug).name
  } Table : ${route.params.id}`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
