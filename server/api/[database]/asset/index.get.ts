import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { lookup } from "mime-types";

export default defineWrappedResponseHandler(async (event: any) => {
  let { _where, _options } = getQuery(event);
  _options = parseQuery(_options);
  if (!_options) _options = {};
  if (!_options.page) _options.page = 1;
  if (!_options.per_page) _options.per_page = 15;
  let result = [],
    index = 0;
  const files = await readdir(
    join("databases", event.context.database.slug, "asset")
  );
  _options.total = files.length;
  _options.total_pages = Math.ceil(_options.total / _options.per_page);
  for await (const file of files) {
    index++;
    if (index <= (_options.page - 1) * _options.per_page) continue;
    if (index > _options.page * _options.per_page) break;
    const stats = await stat(
        join("databases", event.context.database.slug, "asset", file)
      ),
      splited_name = file.split("."),
      data = {
        mime_type: lookup(file),
        public_url: encodeURI(
          `http://localhost:3000/api/${event.context.database.slug}/asset/${file}`
        ),
        size: stats.size,
        created_at: stats.birthtime,
        updated_at: stats.mtime,
      };
    result.push(
      splited_name.length === 3
        ? {
            name: splited_name[1],
            ...data,
            user: splited_name[0],
          }
        : {
            name: splited_name[0],
            ...data,
          }
    );
  }
  event.context._options = _options;
  if (result.length) return [result, 202];
  throw new Error("404");
});
