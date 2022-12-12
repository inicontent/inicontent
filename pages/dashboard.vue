<template>
  <n-card title="Pick a Database" style="background: none" :bordered="false">
    <n-modal
      v-model:show="ShowAddNewDatabaseModal"
      :style="{
        width: Window.width > 600 ? '600px' : '100%',
      }"
      class="custom-card"
      preset="card"
      :title="
        AddNewDatabaseModal && AddNewDatabaseModal.id
          ? AddNewDatabaseModal.name
          : 'Create new Database'
      "
      :bordered="false"
      size="huge"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
    >
      <RenderNewDatabase />
      <template #footer>
        <n-space justify="end">
          <n-button
            :loading="Loading['AddNewDatabase']"
            @click="AddNewDatabase"
          >
            Save
            <template #icon>
              <n-icon>
                <DeviceFloppy />
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </template>
    </n-modal>
    <template #header-extra>
      <n-button
        circle
        @click="
          (AddNewDatabaseModal = {
            tables: [
              {
                name: 'User',
                slug: 'user',
                schema: [
                  {
                    name: 'Username',
                    type: 'text',
                    required: true,
                    key:
                      Date.now().toString(36) +
                      Math.random().toString(36).substring(2),
                  },
                  {
                    name: 'Password',
                    type: 'password',
                    required: true,
                    key:
                      Date.now().toString(36) +
                      Math.random().toString(36).substring(2),
                  },
                  {
                    name: 'Email',
                    type: 'email',
                    required: false,
                    key:
                      Date.now().toString(36) +
                      Math.random().toString(36).substring(2),
                  },
                  {
                    name: 'Role',
                    type: 'role',
                    required: true,
                    key:
                      Date.now().toString(36) +
                      Math.random().toString(36).substring(2),
                  },
                ],
              },
            ],
          }),
            (ShowAddNewDatabaseModal = true)
        "
      >
        <template #icon>
          <n-icon>
            <Plus />
          </n-icon>
        </template>
      </n-button>
    </template>
    <n-grid x-gap="12" y-gap="12" cols="1 600:2 800:4">
      <n-gi v-for="single_database in databases" :key="single_database.slug">
        <NuxtLink
          :to="`/${single_database.slug}`"
          @click="database = single_database"
        >
          <n-card hoverable>
            <template #header>
              <n-space align="center">
                <n-icon-wrapper :size="28" :border-radius="50">
                  <NIcon
                    :component="
                      LettersIcons[single_database.slug.charAt(0)] ?? Database
                    "
                  />
                </n-icon-wrapper>
                <n-h4 style="margin-bottom: 0">{{ single_database.name }}</n-h4>
              </n-space>
            </template>
            <template #header-extra>
              <n-space>
                <n-button
                  circle
                  @click="
                    (e) => (
                      e.preventDefault(),
                      (AddNewDatabaseModal = JSON.parse(
                        JSON.stringify(single_database)
                      )),
                      (ShowAddNewDatabaseModal = true)
                    )
                  "
                >
                  <template #icon>
                    <n-icon>
                      <Settings />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </template>
          </n-card>
        </NuxtLink>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup>
import {
  NGrid,
  NGi,
  NCard,
  NButton,
  NIcon,
  NModal,
  NForm,
  NSpace,
  NFormItem,
  NInput,
  NDynamicTags,
  NTag,
  NDataTable,
  NCheckbox,
  NCheckboxGroup,
  NH4,
  useMessage,
  NUpload,
  NUploadDragger,
  NText,
  NIconWrapper,
} from "naive-ui";
import {
  Plus,
  Trash,
  DeviceFloppy,
  Link,
  Settings,
  Upload,
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
} from "@vicons/tabler";
import { Buffer } from "buffer";

definePageMeta({
  middleware: "dashboard",
});

const Loading = useState("Loading", () => ({}));
Loading.value["AddNewDatabase"] = false;

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
  },
  database = useState("database"),
  message = useMessage(),
  User = useState("User"),
  Window = useState("Window", () => ({
    width: 0,
  })),
  { data: databases } = await useFetch(
    "https://api.inicontent.com/inicontent/db",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${User.value.username}:${User.value.password}`).toString(
            "base64"
          ),
      },
      transform: (i) => (!i.result[0] ? navigateTo("/auth") : i.result),
      initialCache: false,
    }
  ),
  ShowAddNewDatabaseModal = ref(false),
  AddNewDatabaseRef = ref(null),
  AddNewDatabaseModal = ref(null),
  RenderNewDatabase = defineComponent({
    render: () =>
      h(
        NForm,
        {
          ref: AddNewDatabaseRef,
          model: AddNewDatabaseModal.value,
          rules: {
            name: {
              required: true,
              message: "Please give your database a name",
              trigger: ["input", "blur"],
            },
            slug: {
              required: true,
              message: "Please give your database a unique slug",
              trigger: ["input", "blur"],
            },
            allowed_domains: {
              required: true,
              validator(rule, value) {
                if (value) {
                  var ret = true;
                  value.forEach((val) => {
                    if (!val) {
                      ret = new Error("This field is required");
                    } else if (val === "*" || val.charAt(0) === "#") {
                      ret = true;
                    } else if (
                      !/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(
                        val
                      )
                    ) {
                      ret = new Error("This is not a valid link");
                    }
                  });
                  return ret;
                } else return new Error("This field is required");
              },
              trigger: ["input", "blur"],
            },
          },
        },
        () => [
          h(
            NFormItem,
            {
              label: "Name",
              path: "name",
            },
            () =>
              h(NInput, {
                value: AddNewDatabaseModal.value.name,
                onUpdateValue: (v) => (
                  (AddNewDatabaseModal.value.name = v),
                  (AddNewDatabaseModal.value.slug = v
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, ""))
                ),
              })
          ),
          h(
            NFormItem,
            {
              label: "Slug",
              path: "slug",
            },
            () =>
              h(NInput, {
                disabled: AddNewDatabaseModal.value.id ? true : false,
                value: AddNewDatabaseModal.value.slug,
                onUpdateValue: (v) =>
                  (AddNewDatabaseModal.value.slug = v
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace(/[^\[a-zA-Zء-ي]-_+/g, "")),
              })
          ),
          h(
            NFormItem,
            {
              label: "Icon",
              path: "icon",
            },
            () =>
              h(
                NUpload,
                {
                  directoryDnd: true,
                  max: 1,
                  multiple: false,
                  accept: "image/*",
                  action: `https://api.inicontent.com/inicontent/assets`,
                  headers: {
                    Authorization:
                      "Basic " +
                      Buffer.from(
                        `${User.value.username}:${User.value.password}`
                      ).toString("base64"),
                  },
                  fileList: AddNewDatabaseModal.value.icon
                    ? [
                        {
                          id: AddNewDatabaseModal.value.icon
                            .split("/")
                            .pop()
                            .split("#")[0]
                            .split("?")[0],
                          name: AddNewDatabaseModal.value.icon
                            .split("/")
                            .pop()
                            .split("#")[0]
                            .split("?")[0],
                          status: "finished",
                          url: AddNewDatabaseModal.value.icon,
                        },
                      ]
                    : undefined,
                  onRemove: ({ file }) => {
                    delete AddNewDatabaseModal.value.icon;
                    return true;
                  },
                  onFinish: ({ file, event }) => {
                    const src = JSON.parse(event.target.response).result
                      .public_url;
                    AddNewDatabaseModal.value.icon = src;
                    file.url = src;
                    file.name = src
                      .split("/")
                      .pop()
                      .split("#")[0]
                      .split("?")[0];
                    return file;
                  },
                  listType: "image",
                },
                () =>
                  h(NUploadDragger, () => [
                    h(
                      "div",
                      {
                        style: {
                          "margin-bottom": "12px",
                        },
                      },
                      h(NIcon, { size: 48, depth: 3 }, () => h(Upload))
                    ),
                    h(
                      NText,
                      { style: { "font-size": "16px" } },
                      () => "Click or drag a file to this area to upload"
                    ),
                  ])
              )
          ),
          h(
            NFormItem,
            {
              label: "Allowed Domains",
              path: "allowed_domains",
            },
            () =>
              h(
                NDynamicTags,
                {
                  value: AddNewDatabaseModal.value.allowed_domains,
                  onUpdateValue: (v) =>
                    (AddNewDatabaseModal.value.allowed_domains = v),
                },
                {
                  input: ({ submit, deactivate }) =>
                    h(
                      NInput,
                      {
                        onBlur: deactivate,
                        onChange: submit,
                      },
                      {
                        suffix: () => h(NIcon, () => h(Link)),
                      }
                    ),
                }
              )
          ),
          h(
            NFormItem,
            {
              label: "Roles",
              path: "roles",
            },
            () =>
              h(NDynamicTags, {
                value: [
                  "admin",
                  "user",
                  "guest",
                  ...(AddNewDatabaseModal.value.roles ?? []),
                ],
                onCreate: (label) =>
                  AddNewDatabaseModal.value.roles
                    ? AddNewDatabaseModal.value.roles.push(
                        label
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                      )
                    : (AddNewDatabaseModal.value.roles = [
                        label
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .replace(/[^\[a-zA-Zء-ي]-_+/g, ""),
                      ]),
                renderTag: (tag, index) =>
                  h(
                    NTag,
                    {
                      type: index > 2 ? "default" : "primary",
                      disabled: index < 3,
                      closable: index > 2,
                      onClose: () => (
                        AddNewDatabaseModal.value.roles.splice(index, 1),
                        AddNewDatabaseModal.value.roles.length === 0
                          ? delete AddNewDatabaseModal.value.roles
                          : ""
                      ),
                    },
                    {
                      default: () =>
                        tag.charAt(0).toUpperCase() +
                        tag.slice(1).replaceAll("_", " "),
                    }
                  ),
              })
          ),
          h(NSpace, () => [
            h(NH4, () => "Tables"),
            h(
              NButton,
              {
                size: "small",
                circle: true,
                onClick: () =>
                  AddNewDatabaseModal.value.tables.push({
                    name: "",
                    slug: "",
                    allowed_methods: {},
                  }),
              },
              {
                icon: () => h(NIcon, () => h(Plus)),
              }
            ),
          ]),
          h(NDataTable, {
            columns: [
              {
                title: "Name",
                width: 100,
                key: "name",
                render(row, index) {
                  return h(
                    NFormItem,
                    {
                      showLabel: false,
                      path: `tables.${index}.name`,
                      disabled: row.slug === "user",
                      rule: {
                        required: true,
                        validator(rule, value) {
                          return !value
                            ? new Error("This field is required")
                            : true;
                        },
                        trigger: ["input", "blur"],
                      },
                    },
                    () =>
                      h(NInput, {
                        value: row.name,
                        disabled: row.slug === "user",
                        onUpdateValue: (v) => (
                          (AddNewDatabaseModal.value.tables[index].name = v),
                          (AddNewDatabaseModal.value.tables[index].slug = v
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/[^\[a-zA-Zء-ي]-_+/g, ""))
                        ),
                      })
                  );
                },
              },
              {
                title: "Slug",
                width: 100,
                key: "slug",
                render(row, index) {
                  return h(
                    NFormItem,
                    {
                      disabled:
                        AddNewDatabaseModal.value.id || row.slug === "user"
                          ? true
                          : false,
                      showLabel: false,
                      path: `tables.${index}.slug`,
                      rule: {
                        required: true,
                        validator(rule, value) {
                          return !value
                            ? new Error("This field is required")
                            : true;
                        },
                        trigger: ["input", "blur"],
                      },
                    },
                    () =>
                      h(NInput, {
                        disabled:
                          AddNewDatabaseModal.value.id || row.slug === "user"
                            ? true
                            : false,
                        value: row.slug,
                        onUpdateValue: (v) =>
                          (AddNewDatabaseModal.value.tables[index].slug = [
                            "user",
                            "assets",
                            "session",
                          ].includes(
                            v
                              .toLowerCase()
                              .replace(/ /g, "_")
                              .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                          )
                            ? v
                                .toLowerCase()
                                .replace(/ /g, "_")
                                .replace(/[^\[a-zA-Zء-ي]-_+/g, "")
                            : null),
                      })
                  );
                },
              },
              {
                title: "Allowed methods",
                width: 100,
                key: "allowed_methods",
                render: (row, index) =>
                  [
                    "user",
                    "guest",
                    ...(AddNewDatabaseModal.value.roles ?? []),
                  ].map((role) =>
                    h(
                      NFormItem,
                      {
                        label:
                          role.charAt(0).toUpperCase() +
                          role.slice(1).replaceAll("_", " "),
                        path: `tables.${index}.allowed_methods.${role}`,
                      },
                      () =>
                        h(
                          NCheckboxGroup,
                          {
                            disabled: row.slug === "user",
                            value:
                              AddNewDatabaseModal.value.tables[index] &&
                              AddNewDatabaseModal.value.tables[index]
                                .allowed_methods
                                ? Array.from(
                                    AddNewDatabaseModal.value.tables[index]
                                      .allowed_methods[role] ?? ""
                                  )
                                : ["c", "r", "u"],
                            onUpdateValue: (v) =>
                              (AddNewDatabaseModal.value.tables[
                                index
                              ].allowed_methods[role] = v.join("")),
                            itemStyle: "display: flex",
                          },
                          () =>
                            h(NSpace, () => [
                              h(NCheckbox, {
                                value: "c",
                                label: "Create",
                              }),
                              h(NCheckbox, {
                                value: "r",
                                label: "Read",
                              }),
                              h(NCheckbox, {
                                value: "u",
                                label: "Update",
                              }),
                              h(NCheckbox, {
                                value: "d",
                                label: "Delete",
                              }),
                            ])
                        )
                    )
                  ),
              },
              {
                title: "Actions",
                fixed: "right",
                align: "center",
                width: 60,
                key: "actions",
                render(row, index) {
                  return h(
                    NButton,
                    {
                      strong: true,
                      secondary: true,
                      circle: true,
                      type: "error",
                      disabled: row.slug === "user",
                      onClick() {
                        delete AddNewDatabaseModal.value.tables[index];
                      },
                    },
                    { icon: () => h(NIcon, () => h(Trash)) }
                  );
                },
              },
            ],
            data:
              AddNewDatabaseModal.value.tables.filter((i) => i.slug === "user")
                .length > 0
                ? AddNewDatabaseModal.value.tables
                : [
                    ...AddNewDatabaseModal.value.tables,
                    {
                      name: "User",
                      slug: "user",
                      schema: [
                        {
                          name: "Username",
                          type: "text",
                          required: true,
                          key:
                            Date.now().toString(36) +
                            Math.random().toString(36).substring(2),
                        },
                        {
                          name: "Password",
                          type: "password",
                          required: true,
                          key:
                            Date.now().toString(36) +
                            Math.random().toString(36).substring(2),
                        },
                        {
                          name: "Email",
                          type: "email",
                          required: false,
                          key:
                            Date.now().toString(36) +
                            Math.random().toString(36).substring(2),
                        },
                        {
                          name: "Role",
                          type: "role",
                          required: true,
                          key:
                            Date.now().toString(36) +
                            Math.random().toString(36).substring(2),
                        },
                      ],
                    },
                  ],
            scrollX: 700,
          }),
        ]
      ),
  }),
  AddNewDatabase = async () => {
    AddNewDatabaseRef.value?.validate(async (errors) => {
      if (!errors) {
        Loading.value["AddNewDatabase"] = true;
        if (AddNewDatabaseModal.value.id) {
          const { data } = await useFetch(
            `https://api.inicontent.com/inicontent/db/${AddNewDatabaseModal.value.id}!`,
            {
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(
                    `${User.value.username}:${User.value.password}`
                  ).toString("base64"),
              },
              method: "PUT",
              body: AddNewDatabaseModal.value,
              initialCache: false,
            }
          );
          if (data.value.result) {
            databases.value[
              databases.value.findIndex(
                (i) => i.id === AddNewDatabaseModal.value.id
              )
            ] = data.value.result;
            Loading.value["AddNewDatabase"] = false;
            ShowAddNewDatabaseModal.value = false;
            message.success(data.value.message.en);
          } else message.error(data.value.message.en);
          Loading.value["AddNewDatabase"] = false;
        } else {
          const { data } = await useFetch(
            "https://api.inicontent.com/inicontent/db",
            {
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(
                    `${User.value.username}:${User.value.password}`
                  ).toString("base64"),
              },
              method: "POST",
              body: AddNewDatabaseModal.value,
              initialCache: false,
              transform: (res) => {
                if (res.result) res.result = [].concat(res.result)[0];
                return res;
              },
            }
          );
          if (data.value.result) {
            databases.value.push(data.value.result);
            Loading.value["AddNewDatabase"] = false;
            ShowAddNewDatabaseModal.value = false;
            message.success(data.value.message.en);
          } else message.error(data.value.message.en);
        }
        Loading.value["AddNewDatabase"] = false;
      } else message.error("The inputs are Invalid");
    });
  };

useHead({
  title: `${database.value.name} | Dashboard`,
  link: [{ rel: "icon", href: database.value.icon }],
});
</script>
