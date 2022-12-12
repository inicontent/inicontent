<template>
  <n-card
    title
    style="height: fit-content"
    @keydown.ctrl.p.prevent.stop="PRINT"
    @keydown.meta.p.prevent.stop="PRINT"
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
        <n-button disabled circle secondary>
          <template #icon>
            <n-icon>
              <Settings />
            </n-icon>
          </template>
        </n-button>
        <NuxtLink :to="`${$route.params.id}/edit`">
          <n-button circle secondary type="info">
            <template #icon>
              <n-icon>
                <Pencil />
              </n-icon>
            </template>
          </n-button>
        </NuxtLink>
        <n-button
          circle
          secondary
          type="primary"
          @click="PRINT"
          :loading="Loading['PRINT']"
        >
          <template #icon>
            <n-icon>
              <Printer />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
    <RenderData v-model="single" :schema="Schema" />
    <template #action>
      <n-space justify="end">
        <n-button
          round
          secondary
          type="primary"
          @click="PRINT"
          :loading="Loading['PRINT']"
        >
          <template #icon>
            <n-icon>
              <Printer />
            </n-icon>
          </template>
          Print
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup>
import { NCard, NIcon, NButton, NSpace, NEllipsis, useMessage } from "naive-ui";
import { Printer, Pencil, Settings } from "@vicons/tabler";
import { Buffer } from "buffer";

definePageMeta({
  middleware: "dashboard",
});

const Loading = useState("Loading", () => ({}));
Loading.value["PRINT"] = false;

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
  PRINT = () => {
    {
      Loading.value["PRINT"] = true;
      window.print();
      Loading.value["PRINT"] = false;
      return true;
    }
  };
useHead({
  title: `${database.value.name} | ${
    database.value.tables.find((item) => item.slug === route.params.slug).name
  } Table : ${route.params.id}`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
