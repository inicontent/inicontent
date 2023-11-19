import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(event.context.database.slug, "databases"),
    table = getRouterParam(event, "table"),
    { _where, _options } = getQuery(event);

  let body = await readBody(event);

  if (table === "user") body = fixRole(event, body);

  const result = await db.put(
    event.context.table.slug,
    fixBody(event, body),
    fixWhere(event, _where),
    parseQuery(_options) ?? undefined
  );

  event.context._options = db.pageInfo;
  return [result, 201];
});
