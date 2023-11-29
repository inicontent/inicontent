import { isExists } from "inibase/file";
import { join } from "node:path";

export default defineWrappedResponseHandler(async (event: any) => {
  const [api, DatabaseSlug, tableSlug, idSlug, childTableSlug] = getRequestURL(
    event
  )
    .pathname.split("/")
    .slice(1);
  if (api !== "api") return;

  if (tableSlug == "auth") return;
  if (
    !(await isExists(
      join(
        useRuntimeConfig().databasePath,
        event.context.database.slug,
        tableSlug
      )
    ))
  )
    throw new Error("table_not_found");

  let table = event.context.database.tables.find(
    (table: Record<string, string>) => table.slug === tableSlug
  );

  if (!table) throw new Error("dont_have_access");
  event.context.table = table;
  if (
    DatabaseSlug === "inicontent" &&
    tableSlug === "database" &&
    idSlug &&
    childTableSlug &&
    idSlug ===
      (event.context.child_database?.slug ?? event.context.database.slug)
  ) {
    let childTable = (
      event.context.child_database ?? event.context.database
    ).tables.find(
      (table: Record<string, string>) => table.slug === childTableSlug
    );
    if (childTable) event.context.child_table = childTable;
  }
}, true);
