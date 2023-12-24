import { createWriteStream, mkdirSync, unlinkSync } from "node:fs";
import { get } from "node:https";
import { createHash } from "node:crypto";
import { isExists } from "inibase/file";
import StreamZip from "node-stream-zip";

export default defineWrappedResponseHandler(async (event: any) => {
  const { secret, url } = getQuery(event);
  if (!secret || !url || process.env.INIBASE_SECRET !== secret)
    return [null, 404];

  if (!(await isExists(useRuntimeConfig().databasePath)))
    mkdirSync(useRuntimeConfig().databasePath, { recursive: true });

  const tmpFilePath = `${
    useRuntimeConfig().databasePath
  }/${Date.now()}${createHash("md5").update(url.toString()).digest("hex")}.zip`;
  return [
    await new Promise((resolve, reject) => {
      get(decodeURI(url.toString()), function (response) {
        const file = createWriteStream(tmpFilePath);

        response.pipe(file);

        // after download completed close filestream
        file.on("finish", async () => {
          file.close();
          try {
            const zip = new StreamZip.async({ file: tmpFilePath });
            await zip.extract(null, useRuntimeConfig().databasePath);
            await zip.close();
            unlinkSync(tmpFilePath);
            resolve(true);
          } catch {
            reject(false);
          }
        });
      });
    }),
    202,
  ];
});
