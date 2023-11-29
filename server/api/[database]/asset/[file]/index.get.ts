import { readFile } from "node:fs/promises";
import { isExists } from "inibase/file";
import { join } from "node:path";
import sharp from "sharp";

export default defineWrappedResponseHandler(async (event: any) => {
  const file = getRouterParam(event, "file"),
    formats = {
      avif: {
        priority: 4,
        alpha: true,
        quality: {
          9: 87,
          8: 79,
          7: 70,
          6: 66,
          5: 61,
          4: 54,
          3: 42,
          2: 38,
          1: 34,
        },
        options: {
          effort: 3,
        },
        contentType: "image/avif",
        supported: event.node.req.headers.accept?.includes("image/avif"),
      },
      webp: {
        priority: 3,
        alpha: true,
        quality: {
          9: 93,
          8: 89,
          7: 84,
          6: 79,
          5: 74,
          4: 69,
          3: 48,
          2: 38,
          1: 32,
        },
        options: {},
        contentType: "image/webp",
        supported: event.node.req.headers.accept?.includes("image/webp"),
      },
      jpeg: {
        priority: 2,
        alpha: false,
        quality: {
          9: 95,
          8: 90,
          7: 85,
          6: 80,
          5: 75,
          4: 70,
          3: 60,
          2: 50,
          1: 40,
        },
        options: {},
        contentType: "image/jpeg",
        supported: true,
      },
      png: {
        priority: 1,
        alpha: true,
        quality: {
          9: 87,
          8: 78,
          7: 72,
          6: 68,
          5: 63,
          4: 61,
          3: 55,
          2: 52,
          1: 48,
        },
        options: {},
        contentType: "image/png",
        supported: true,
      },
    },
    {
      format,
      f,
      quality,
      q,
      width,
      w,
      height,
      h,
      fit,
      position,
      p,
      background,
      bg,
      rotate,
      r,
      blur,
      b,
    } = getQuery(event);

  if (
    file &&
    (await isExists(
      join(
        useRuntimeConfig().databasePath,
        event.context.database.slug,
        "asset",
        decodeURI(file)
      )
    ))
  ) {
    const instance = sharp(
        await readFile(
          join(
            useRuntimeConfig().databasePath,
            event.context.database.slug,
            "asset",
            decodeURI(file)
          )
        )
      ),
      metadata = await instance.metadata(),
      uFormat = (
        (format ?? f) && formats.hasOwnProperty((format ?? f) as string)
          ? format ?? f
          : Object.keys(
              Object.fromEntries(
                Object.entries(formats)
                  .filter(
                    ([_format, _options]) =>
                      (!metadata.hasAlpha || _options.alpha) &&
                      _options.supported
                  )
                  .sort(([, a], [, b]) => b.priority - a.priority)
              )
            )[0]
      ) as keyof typeof formats,
      uQuality: number =
        (quality ?? q) &&
        formats[uFormat].quality.hasOwnProperty((quality ?? q) as number)
          ? formats[uFormat].quality[
              (quality ??
                q) as keyof (typeof formats)[typeof uFormat]["quality"]
            ]
          : formats[uFormat].quality[8];

    if (rotate ?? r) instance.rotate(Number((rotate ?? r) || 0) || undefined);
    if ((width ?? w) || (height ?? h))
      instance.resize(
        Number((width ?? w) || 0) || null,
        Number((height ?? h) || 0) || null,
        {
          fit: (fit as any) || "cover",
          position: ((position ?? p) || "centre") as string | number,
        }
      );
    if (!(width ?? w) && !(height ?? h) && fit)
      instance.resize(Number(fit || 0) || null, Number(fit || 0) || null);
    if (background ?? bg)
      instance.flatten({
        background: ((background ?? bg) as string | null) || undefined,
      });
    if (blur ?? b) instance.blur(Number((blur ?? b) || 0) || undefined);
    const output = await instance
      .toFormat(uFormat, {
        ...formats[uFormat],
        quality: uQuality,
      })
      .toBuffer();
    setResponseHeader(event, "Content-Type", formats[uFormat].contentType);
    setResponseHeader(event, "Content-Length", output.length);
    return output;
  } else {
    // return 404 image
    return {
      msg: file,
    };
  }
});
