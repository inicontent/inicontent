import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
      event.context.database.slug,
      useRuntimeConfig().databasePath
    ),
    { _where, _options } = getQuery(event);

  const result = await db.get(
    event.context.table.slug,
    fixWhere(event, _where),
    parseQuery(_options) ?? undefined
  );

  if (!result) throw new Error("404");
  event.context._options = db.pageInfo;
  return [result, 202];
});
