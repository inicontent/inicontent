import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
      event.context.database.slug,
      useRuntimeConfig().databasePath
    ),
    { _options } = getQuery(event),
    table = getRouterParam(event, "table"),
    id = getRouterParam(event, "id");

  let body = await readBody(event);

  if (table === "user") body = fixRole(event, body);

  const result = await db.put(
    event.context.table.slug,
    fixBody(event, body),
    table === "user" &&
      id === (event.context.user.id ?? event.context.child_user.id)
      ? id
      : fixWhere(event, { id }),
    parseQuery(_options) ?? undefined
  );

  event.context._options = db.pageInfo;
  return [result, 201];
});
