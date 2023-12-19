import { LazyRenderFields } from "#components";
import { NForm } from "naive-ui";
export default defineNuxtComponent({
  async setup() {
    const user = ref({
        username: "karim.ama",
        password: "azqswx",
        email: "karim.amahtil@gmail.com",
        role: "admin",
        icon: [
          "http://localhost:3000/api/inicontent/asset/57cc3d9df7a98973c647874e880e291a.square_E.jpg",
          "http://localhost:3000/api/inicontent/asset/57cc3d9df7a98973c647874e880e291a.2-ar.png",
        ],
      }),
      userRef = ref(),
      schema = [
        {
          id: "57cc3d9df7a98973c647874e880e291a",
          key: "username",
          required: true,
          type: "string",
        },
        {
          id: "a1fc4fea41c1264822491f98a3345cc0",
          key: "password",
          required: true,
          type: "password",
        },
        {
          id: "c7c8c0e4b32338596727cedaeeab1a44",
          key: "email",
          required: true,
          type: "email",
        },
        {
          id: "19cc813b4c1df3f3838c6206cfb9f7c5c",
          key: "role",
          required: true,
          type: "string",
        },
        {
          id: "19c813b4c1df3f3838c6206cfb9f7c5c",
          key: "createdAt",
          type: "date",
          required: true,
        },
        {
          id: "a1057000f4ab8bd4e97eee569a299a11",
          key: "updatedAt",
          type: "date",
          required: false,
        },
        {
          id: "a1057000f4ab8bd4sdfe97eee569a299a11",
          key: "content",
          type: "html",
          required: true,
        },
        {
          id: "a1dq057000f4ab8bd4e97eee569a299a11",
          key: "icon",
          type: "array",
          subtype: "upload",
          children: "url",
          required: false,
        },
      ];
    return () =>
      h(
        NForm,
        {
          ref: userRef,
          model: user.value,
        },
        () =>
          h(LazyRenderFields, {
            modelValue: user,
            schema: schema,
          })
      );
  },
});
