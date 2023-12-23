import Inibase from "inibase";
import { isExists } from "inibase/file";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const POST_Session = async (event: any, slug: string) => {
  console.log("using CWD:");
  console.log(readdirSync(process.cwd()));

  console.log("using Runtime:");
  console.log(readdirSync(useRuntimeConfig().databasePath));

  const db = new Inibase(slug, useRuntimeConfig().databasePath);
  const session_data = {
      ip: getUserIP(event),
      userAgent: getRequestHeader(event, "user-agent"),
    },
    session = await db.get("session", session_data, undefined, true, undefined);
  if (session && session.user) return session.user;
  else if (event.node.req.headers.authorization) {
    const [username, password] = Buffer.from(
      event.node.req.headers.authorization.split(" ")[1],
      "base64"
    )
      .toString()
      .split(":");
    const user = await db.get(
      "user",
      {
        username: username,
        password: password,
      },
      undefined,
      true
    );
    if (user) {
      if (session)
        await db.put(
          "session",
          { user: user.id },
          session.id,
          undefined,
          false
        );
      else
        await db.post(
          "session",
          {
            ...session_data,
            user: user.id,
          },
          undefined,
          false
        );
      return user;
    }
  }
  return undefined;
};

export default defineWrappedResponseHandler(async (event: any) => {
  const [api, DatabaseSlug, tableSlug, idSlug] = getRequestURL(event)
    .pathname.split("/")
    .slice(1);
  if (api !== "api") return;

  if (!DatabaseSlug) throw new Error("db_not_ found");

  if (await isExists(join(useRuntimeConfig().databasePath, DatabaseSlug)))
    event.context.user = await POST_Session(event, DatabaseSlug);

  if (DatabaseSlug === "inicontent") {
    const subDatabaseSlug = getRouterParam(event, "database");
    if (
      subDatabaseSlug &&
      subDatabaseSlug !== "inicontent" &&
      (await isExists(join(useRuntimeConfig().databasePath, subDatabaseSlug)))
    )
      event.context.child_user = await POST_Session(event, subDatabaseSlug);
  }
}, true);
