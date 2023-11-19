import type { Schema, Field } from "inibase";
import { isArrayOfArrays, isArrayOfObjects } from "inibase/utils";

export const fixRole = (event: any, data: any): any =>
  isArrayOfObjects(data)
    ? data.map((item: any) => fixRole(event, item))
    : {
        ...data,
        role:
          data.role && (event.context.child_user ?? event.context.user).role
            ? (event.context.child_user ?? event.context.user).role !== "admin"
              ? (event.context.child_user ?? event.context.user).role
              : data.role
            : "user",
      };

export const fixBody = (event: any, data: any): any =>
  isArrayOfObjects(data)
    ? data.map((item: any) => fixBody(event, item))
    : event.context.child_user ?? event.context.user
    ? {
        ...data,
        user: (event.context.child_user ?? event.context.user).id,
      }
    : { ...data, user: undefined };

export const fixWhere = (event: any, where?: any) =>
  event.context.child_user
    ? event.context.child_user.role !== "admin"
      ? {
          ...(parseQuery(where as any) ?? {}),
          user: event.context.child_user.id,
        }
      : parseQuery(where as any) ?? undefined
    : event.context.user.role !== "admin"
    ? { ...(parseQuery(where as any) ?? {}), user: event.context.user.id }
    : parseQuery(where as any) ?? undefined;

const isValidJSON = (text: any) => {
  if (typeof text !== "string") return false;
  try {
    var json = JSON.parse(text);
    return typeof json === "object";
  } catch (error) {
    return false;
  }
};

export const parseQuery = (strObj: any): Record<any, any> | null => {
  if (!strObj) return null;
  if (typeof strObj === "object") return strObj;

  if (isValidJSON(strObj)) return JSON.parse(strObj.toString());
  return null;
};

export const splitSchema = (schema: Schema) => {
  let validSchema: Schema = [],
    unvalidSchema: any[] = [];
  for (const { id, key, type, children, required, ...rest } of schema) {
    if (children) {
      if (isArrayOfArrays(children)) {
        const [vSchema, unvSchema] = splitSchema(children);
        validSchema.push({ id, key, type, required, children: vSchema });
        if (Object.keys(rest).length || unvSchema.length)
          unvalidSchema.push({ id, ...rest });
        unvalidSchema = [...unvalidSchema, ...unvSchema];
      } else {
        validSchema.push({ id, key, type, required, children });
        if (Object.keys(rest).length) unvalidSchema.push({ id, ...rest });
      }
    } else {
      validSchema.push({ id, key, required, type } as Field);
      if (Object.keys(rest).length) unvalidSchema.push({ id, ...rest });
    }
  }
  return [validSchema, unvalidSchema];
};

export const getUserIP = (event: any) =>
  getRequestIP(event) ?? event.node.req.headers["x-forwarded-for"];
