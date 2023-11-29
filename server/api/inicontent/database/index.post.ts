import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import Inibase, { Schema } from "inibase";
import { addIdToSchema, encodeID } from "inibase/utils.server";

export default defineWrappedResponseHandler(async (event: any) => {
  if (!event.context.user) throw new Error("dont_have_access");

  const db = new Inibase("inicontent", useRuntimeConfig().databasePath),
    { _options } = getQuery(event);

  let body = await readBody(event),
    bodySchema: any = {};

  if (Array.isArray(body)) throw new Error("you_can_publish_only_one");
  if (body.slug && existsSync(join("databases", body.slug)))
    throw new Error("database_slug_already_exists");

  if (body.tables && Array.isArray(body.tables))
    for (const [table, schema] of Object.entries(defaultTablesSchemas)) {
      if (
        !body.tables.find(({ slug }: Record<string, string>) => slug === table)
      )
        body.tables.push(schema);
    }
  else body.tables = Object.values(defaultTablesSchemas);

  body.tables = body.tables.map((table: Record<any, any>, index: number) => {
    table.id = encodeID(index + 1, db.salt);
    if (table.hasOwnProperty("schema")) {
      table.schema = addIdToSchema(table.schema, 0, db.salt);
      const [validSchema, unvalidSchema] = splitSchema(table.schema);
      bodySchema[table.slug] = validSchema;
      table.schema = unvalidSchema;
    }
    return table;
  });

  const result = await db.post(
    "database",
    fixBody(event, body),
    parseQuery(_options) ?? undefined
  );

  for (const table of body.tables)
    mkdirSync(join("databases", body.slug, table.slug), { recursive: true });

  const child_database = new Inibase(
    body.slug,
    useRuntimeConfig().databasePath
  );
  if (Object.keys(bodySchema).length)
    for await (const [table, schema] of Object.entries(bodySchema))
      await child_database.setTableSchema(table, schema as Schema);

  await child_database.post("user", event.context.user);
  await child_database.post("session", {
    ip: getUserIP(event) as string,
    userAgent: event.node.req.headers["user-agent"],
    user: event.context.user.id,
  });
  event.context._options = db.pageInfo;
  return [result, 201];
});
