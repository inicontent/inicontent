import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
      event.context.database.slug,
      useRuntimeConfig().databasePath
    ),
    { _options } = getQuery(event),
    table = getRouterParam(event, "table"),
    id = getRouterParam(event, "id");

  const result = await db.get(
    event.context.table.slug,
    table === "user" &&
      id === (event.context.user.id ?? event.context.child_user.id)
      ? id
      : fixWhere(event, { id }),
    parseQuery(_options) ?? undefined,
    true
  );

  if (!result) throw new Error("404");
  event.context._options = db.pageInfo;
  return [result, 202];
});
