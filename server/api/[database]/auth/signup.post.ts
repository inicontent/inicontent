import Inibase from "inibase";

export default defineWrappedResponseHandler(async (event: any) => {
  const db = new Inibase(event.context.database.slug, "databases"),
    { _options } = getQuery(event);

  let body = await readBody(event);
  if (!body.username || !body.email || !body.password)
    throw new Error("username_email_password_required");
  if (
    await db.get("user", { or: { username: body.username, email: body.email } })
  )
    throw new Error("user_already_exist");

  body = fixRole(event, body);

  const result = await db.post(
    "user",
    fixBody(event, body),
    parseQuery(_options) ?? undefined
  );

  return [result, "signup_success"];
});
