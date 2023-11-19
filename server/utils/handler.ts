import type { EventHandler, EventHandlerRequest } from "h3";
import { deflateRawSync } from "node:zlib";

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
  middleware: boolean = false
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event: any) => {
    const { _options } = getQuery(event);
    try {
      // do something before the route handler
      const response: any = await handler(event);
      if (middleware) return response;
      // do something after the route handler
      if (Buffer.isBuffer(response)) return response;
      setResponseHeader(event, "Vary", "Accept-Encoding");
      setResponseHeader(event, "Content-Encoding", "deflate");
      setResponseHeader(
        event,
        "Content-Type",
        "application/json; charset=utf-8"
      );

      return deflateRawSync(
        JSON.stringify({
          result: response[0],
          message: message(response[1]),
          options: event.context._options ??
            parseQuery(_options) ?? { page: 1, per_page: 15 },
        })
      );
    } catch (err: any) {
      // Error handling
      console.log(err);
      return {
        result: null,
        message: message(err.message),
        options: event.context._options ??
          parseQuery(_options) ?? { page: 1, per_page: 15 },
      };
    }
  });
