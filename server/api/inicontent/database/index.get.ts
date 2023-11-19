import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  if (!event.context.user) throw new Error("dont_have_access");
  const { _where } = getQuery(event);

  const db = new Inibase("inicontent", "databases"),
    result = await db.get("database", fixWhere(event, _where));

  event.context._options = db.pageInfo;
  return [result, 202];
});
