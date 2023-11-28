import Inibase, { Schema } from "inibase";
import { isExists } from "inibase/file";
import { join } from "node:path";
import { isArrayOfObjects } from "inibase/utils";

const getCombinedSchema = (
  validSchema: Schema | undefined,
  unvalidSchema: any
) =>
  validSchema
    ? validSchema.map((field) => {
        let foundUnvalidField = unvalidSchema.find(
          (unvalidField: any) => unvalidField.id === field.id
        );
        if (
          (field as any).children &&
          isArrayOfObjects((field as any).children)
        )
          (field as any).children = getCombinedSchema(
            (field as any).children,
            unvalidSchema
          );
        return { ...field, ...foundUnvalidField };
      })
    : unvalidSchema;

const doesUserHasAccess = (
  table: { allowed_methods: Record<string, string>[] },
  method: string,
  user?: { id: string; role: string }
) =>
  user && user.id
    ? user.role === "admin" ||
      table.allowed_methods
        .find((roleMethods) => roleMethods.role === user.role)
        ?.methods.includes(
          ({ POST: "c", GET: "r", PUT: "u", DELETE: "d" } as any)[method] ?? ""
        )
    : table.allowed_methods
        .find((roleMethods) => roleMethods.role === "guest")
        ?.methods.includes(
          ({ POST: "c", GET: "r", PUT: "u", DELETE: "d" } as any)[method] ?? ""
        );

export default defineWrappedResponseHandler(async (event: any) => {
  const [api, DatabaseSlug, tableSlug, idSlug] = getRequestURL(event)
    .pathname.split("/")
    .slice(1);
  if (api !== "api") return;

  if (!DatabaseSlug) throw new Error("db_not_found");

  if (!(await isExists(join("databases", DatabaseSlug))))
    throw new Error("db_not_found");
  const db = new Inibase("inicontent", "databases");
  let database = await db.get(
    "database",
    { slug: DatabaseSlug },
    undefined,
    true
  );
  event.context._options = db.pageInfo;

  if (!database) throw new Error("db_not_found");
  const child_db = new Inibase(DatabaseSlug, "databases");
  if (database.tables) {
    database.tables = await Promise.all(
      (
        database.tables as {
          slug: string;
          schema: Schema;
          allowed_methods: Record<string, string>[];
        }[]
      )
        .filter((table) =>
          doesUserHasAccess(
            table,
            event.method,
            event.context?.child_user ?? event.context?.user
          )
        )
        .map(async (table) => ({
          ...table,
          schema: table.schema
            ? getCombinedSchema(
                await child_db.getTableSchema(table.slug),
                table.schema
              )
            : await child_db.getTableSchema(table.slug),
        }))
    );
  }

  if (
    DatabaseSlug === "inicontent" &&
    tableSlug === "database" &&
    idSlug &&
    idSlug !== "inicontent"
  ) {
    let child_database = await db.get(
      "database",
      { slug: idSlug },
      undefined,
      true
    );
    const child_child_db = new Inibase(idSlug, "databases");

    if (child_database) {
      if (child_database.tables) {
        child_database.tables = await Promise.all(
          (
            child_database.tables as {
              slug: string;
              schema: Schema;
              allowed_methods: Record<string, string>[];
            }[]
          )
            .filter((table) =>
              doesUserHasAccess(
                table,
                event.method,
                event.context?.child_user ?? event.context?.user
              )
            )
            .map(async (table) => ({
              ...table,
              schema: table.schema
                ? getCombinedSchema(
                    await child_child_db.getTableSchema(table.slug),
                    table.schema
                  )
                : await child_child_db.getTableSchema(table.slug),
            }))
        );
      }
      event.context.child_database = child_database;
    } else event.context.child_database = null;
  }
  // if (!database.tables.length) throw new Error("dont_have_access");
  event.context.database = database;
}, true);
