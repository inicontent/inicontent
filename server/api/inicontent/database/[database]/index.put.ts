import { existsSync, mkdirSync, renameSync } from "fs";
import Inibase, { Data, Schema } from "inibase";
import { isValidID, findChangedProperties } from "inibase/utils";
import { decodeID, encodeID } from "inibase/utils";
import { join } from "path";

export default defineWrappedResponseHandler(async (event: any) => {
  if (!event.context.user) throw new Error("dont_have_access");

  const db = new Inibase("inicontent", "databases"),
    { _options } = getQuery(event),
    tableToIdsSlug = (tables: Record<string, string>[]) => {
      let RETURN: any = {};
      for (const table of tables)
        if (isValidID(table.id))
          RETURN[decodeID(table.id, db.salt)] = table.slug;

      return RETURN;
    };

  let body = await readBody(event),
    tablesWithId,
    tablesWithoutId,
    bodySchema: any = {};

  if (body.tables && event.context.database.tables) {
    tablesWithId = body.tables.filter((table: Record<string, string>) =>
      table.hasOwnProperty("id")
    );
    tablesWithoutId = body.tables.filter(
      (table: Record<string, string>) => !table.hasOwnProperty("id")
    );
    if (tablesWithoutId.length) {
      let starterID = 1;
      if (tablesWithId.length)
        starterID += tablesWithId
          .map((table: Record<string, string>) => table.id)
          .sort((a: number, b: number) => b - a)[0];
      body.tables = [
        ...tablesWithId,
        ...tablesWithoutId.map(
          (table: Record<string, string>, index: number) => ({
            ...table,
            id: encodeID(starterID + index, db.salt),
          })
        ),
      ];
    }
    body.tables.forEach(({ slug, schema }: any, index: number) => {
      if (schema) {
        const [validSchema, unvalidSchema] = splitSchema(schema);
        bodySchema[slug] = validSchema;
        body.tables[index].schema = unvalidSchema;
      }
    });
  }

  const result = await db.put(
    "database",
    fixBody(event, body),
    fixWhere(event, { id: event.context.database.id }),
    parseQuery(_options) ?? undefined
  );

  if (result) {
    if ((result as Data).slug !== event.context.database.slug) {
      renameSync(
        join("databases", event.context.database.slug),
        join("databases", (result as Data).slug)
      );
      event.context.database.slug = (result as Data).slug;
    }
    if ((result as Data).tables) {
      if (tablesWithId.length && event.context.database.tables) {
        const replaceOldSlugs = findChangedProperties(
          tableToIdsSlug(event.context.database.tables),
          tableToIdsSlug(body.tables)
        );

        if (replaceOldSlugs)
          for (const [oldPath, newPath] of Object.entries(replaceOldSlugs))
            if (
              existsSync(
                join("databases", event.context.database.slug, oldPath)
              )
            )
              renameSync(
                join("databases", event.context.database.slug, oldPath),
                join(
                  ".",
                  "databases",
                  "database",
                  event.context.database.slug,
                  newPath
                )
              );
      } else if (tablesWithoutId.length) {
        // Create folders for new tables
        for (const table_slug in (tablesWithoutId as Record<string, any>[]).map(
          (table) => table.slug
        ))
          mkdirSync(join("databases", body.slug, table_slug));
      }
      const child_database = new Inibase(
        event.context.database.slug,
        "databases"
      );
      if (Object.keys(bodySchema).length)
        for await (const [table, schema] of Object.entries(bodySchema))
          await child_database.setTableSchema(table, schema as Schema);
    }
    return [result, 201];
  } else throw new Error("404");
});
