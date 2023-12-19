import Inibase, { Data } from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(
    event.context.database.slug,
    useRuntimeConfig().databasePath
  );

  let body = await readBody(event);

  if (!body.password) throw new Error("no_password_found");
  if (!body.username && !body.email) throw new Error("params_not_correct");

  const user = await db.get(
    "user",
    JSON.parse(
      JSON.stringify(
        (({ username, email, password }) => ({ username, email, password }))(
          body
        )
      )
    ),
    undefined,
    true
  );
  if (!user) throw new Error("login_unsuccess");

  const session = await db.get(
    "session",
    {
      ip: getUserIP(event),
      userAgent: getRequestHeader(event, "user-agent"),
    },
    undefined,
    true
  );

  if (session) {
    if (!session.user || session.user.id !== user.id)
      await db.put("session", { user: user.id }, session.id, undefined, true);
  } else
    await db.post(
      "session",
      {
        user: user.id,
        ip: getUserIP(event),
        userAgent: getRequestHeader(event, "user-agent"),
      },
      undefined,
      false
    );

  return [user, "login_success"];
});
