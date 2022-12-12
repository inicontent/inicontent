<template>
  <n-card
    title
    style="height: fit-content"
    @keydown.ctrl.s.prevent.stop="CREATE"
    @keydown.meta.s.prevent.stop="CREATE"
  >
    <template #header>
      <n-ellipsis>
        New
        {{
          database.tables.find((item) => item.slug === $route.params.slug).name
        }}
      </n-ellipsis>
    </template>
    <template #header-extra>
      <n-space justify="end">
        <n-button
          circle
          secondary
          type="primary"
          @click="CREATE"
          :loading="Loading['CREATE']"
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
        <n-button
          round
          secondary
          type="primary"
          @click="CREATE"
          :loading="Loading['CREATE']"
        >
          <template #icon>
            <n-icon>
              <DeviceFloppy />
            </n-icon>
          </template>
          CREATE
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
} from "naive-ui";
import { DeviceFloppy } from "@vicons/tabler";
import { Buffer } from "buffer";

definePageMeta({
  middleware: "dashboard",
});

const Loading = useState("Loading", () => ({}));
Loading.value["CREATE"] = false;
Loading.value["EDITOR"] = false;

const route = useRoute(),
  database = useState("database"),
  Schema = database.value.tables.find(
    (item) => item.slug === route.params.slug
  ).schema,
  User = useState("User"),
  message = useMessage(),
  single = ref({}),
  formRef = ref(),
  CREATE = async () => {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        Loading.value["CREATE"] = true;
        const { data } = await useFetch(
          `https://api.inicontent.com/${route.params.db_slug}/${route.params.slug}`,
          {
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${User.value.username}:${User.value.password}`
                ).toString("base64"),
            },
            method: "POST",
            body: single.value,
            initialCache: false,
            transform: (res) => {
              if (res.result) res.result = [].concat(res.result)[0];
              return res;
            },
          }
        );
        if (data.value.result && data.value.result.id) {
          message.success(data.value.message.en);
          Loading.value["CREATE"] = false;
          return navigateTo(
            `/${route.params.db_slug}/table/${route.params.slug}/${data.value.result.id}`
          );
        } else message.error(data.value.message.en);
        Loading.value["CREATE"] = false;
      } else message.error("The inputs are Invalid");
    });
  };

useHead({
  title: `${database.value.name} | New ${
    database.value.tables.find((item) => item.slug === route.params.slug).name
  }`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
