export const defaultTablesSchemas = {
  user: {
    slug: "user",
    allowed_methods: [
      {
        role: "admin",
        methods: ["c", "r", "u", "d"],
      },
      {
        role: "user",
        methods: ["c", "r", "u", "d"],
      },
      { role: "guest", methods: ["c"] },
    ],
    schema: [
      {
        key: "username",
        type: "string",
        required: true,
      },
      {
        key: "password",
        type: "password",
        required: true,
      },
      {
        key: "email",
        type: "email",
        required: true,
      },
      {
        key: "role",
        type: "string",
        required: true,
      },
      {
        key: "user",
        type: ["table", "array"],
        children: "table",
        required: true,
      },
    ],
  },
  session: {
    slug: "session",
    allowed_methods: [
      {
        role: "admin",
        methods: ["c", "r", "u", "d"],
      },
      { role: "user", methods: ["c", "r", "u", "d"] },
    ],
    schema: [
      {
        key: "ip",
        type: "ip",
        required: true,
      },
      {
        key: "userAgent",
        type: "string",
        required: true,
      },
      {
        key: "user",
        type: "table",
        required: true,
      },
    ],
  },
  translation: {
    slug: "translation",
    allowed_methods: [
      {
        role: "admin",
        methods: ["c", "r", "u", "d"],
      },
      {
        role: "user",
        methods: ["c", "r", "u", "d"],
      },
      { role: "guest", methods: ["r"] },
    ],
    schema: [
      {
        key: "original",
        type: "string",
        required: true,
      },
      {
        key: "translated",
        type: "string",
        required: true,
      },
      {
        key: "table",
        type: "string",
        required: false,
      },
      {
        key: "item",
        type: "id",
        required: false,
      },
      {
        key: "locale",
        type: "string",
        required: true,
      },
      {
        key: "user",
        type: ["table", "array"],
        children: "table",
        required: true,
      },
    ],
  },
  asset: {
    slug: "asset",
    allowed_methods: [
      {
        role: "admin",
        methods: ["c", "r", "u", "d"],
      },
      {
        role: "user",
        methods: ["c", "r", "u", "d"],
      },
      {
        role: "guest",
        methods: ["r"],
      },
    ],
  },
};
