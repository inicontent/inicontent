import { isValidID } from "inibase/utils";

export default defineWrappedResponseHandler(async (event: any) => {
  const [api, DatabaseSlug, tableSlug, idSlug] = getRequestURL(event)
    .pathname.split("/")
    .slice(1);
  if (api !== "api") return;

  if (
    idSlug &&
    event.context.database &&
    event.context.table &&
    !["asset", "auth", "database"].includes(tableSlug) &&
    !isValidID(idSlug)
  )
    throw new Error("params_not_correct");
}, true);
