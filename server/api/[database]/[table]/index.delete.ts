import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
      event.context.database.slug,
      useRuntimeConfig().databasePath
    ),
    { _where } = getQuery(event);

  const result = await db.delete(
    event.context.table.slug,
    fixWhere(event, _where)
  );

  event.context._options = db.pageInfo;
  return [result, 201];
});
