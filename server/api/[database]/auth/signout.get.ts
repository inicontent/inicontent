import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(event.context.database.slug, "databases"),
    { allDevices } = getQuery(event);

  if (!event.context.user) throw new Error("login_first");
  if (allDevices) await db.delete("session", { user: event.context.user.id });
  else
    await db.delete("session", {
      ip: getUserIP(event) as string,
      userAgent: event.node.req.headers["user-agent"] as string,
      user: event.context.user.id,
    });
  throw new Error("logout_success");
});
