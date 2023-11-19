import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(event.context.database.slug, "databases"),
    table = getRouterParam(event, "table"),
    id = getRouterParam(event, "id");

  const result = await db.delete(
    event.context.table.slug,
    table === "user" &&
      id === (event.context.user.id ?? event.context.child_user.id)
      ? id
      : fixWhere(event, { id })
  );

  event.context._options = db.pageInfo;
  return [result, 201];
});
