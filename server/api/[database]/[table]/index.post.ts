import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
      event.context.database.slug,
      useRuntimeConfig().databasePath
    ),
    table = getRouterParam(event, "table"),
    { _options } = getQuery(event);

  let body = await readBody(event);

  if (table === "user") body = fixRole(event, body);

  const result = await db.post(
    event.context.table.slug,
    fixBody(event, body),
    parseQuery(_options) ?? undefined
  );

  event.context._options = db.pageInfo;
  return [result, 201];
});
