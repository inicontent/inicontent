import { writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

export default defineWrappedResponseHandler(async (event: any) => {
  let result = [];
  const files = (await readMultipartFormData(event))?.filter((form) =>
    form.hasOwnProperty("filename")
  );
  if (files?.length) {
    for (const file of files) {
      const parseFileName = parse(file.filename as string),
        name = parseFileName.name.replaceAll(".", "_"),
        fileName = name + parseFileName.ext,
        data = {
          mime_type: file.type,
          size: file.data.length,
          created_at: new Date(),
          updated_at: new Date(),
        };
      if (event.context.child_user?.id ?? event.context.user?.id) {
        result.push({
          name,
          ...data,
          public_url: encodeURI(
            `http://localhost:3000/api/${event.context.database.slug}/asset/${
              event.context.child_user?.id ?? event.context.user?.id
            }.${fileName}`
          ),
          user: event.context.child_user?.id ?? event.context.user?.id,
        });
        await writeFile(
          join(
            "databases",
            event.context.database.slug,
            "asset",
            `${
              event.context.child_user?.id ?? event.context.user?.id
            }.${fileName}`
          ),
          file.data
        );
      } else {
        result.push({
          name,
          ...data,
          public_url: encodeURI(
            `http://localhost:3000/api/${event.context.database.slug}/asset/${fileName}`
          ),
        });
        await writeFile(
          join("databases", event.context.database.slug, "asset", fileName),
          file.data
        );
      }
    }

    return [files.length > 1 ? result : result[0], 201];
  }

  throw new Error("no_data_found");
});
