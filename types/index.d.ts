import type { FieldType, pageInfo } from "inibase";

type CMS_FieldType =
  | "text"
  | "upload"
  | "textarea"
  | "radio"
  | "checkbox"
  | "tags"
  | "color"
  | "select"
  | "role";

declare global {
  type Field = {
    id?: string | number;
    key: string;
    children?: string | string[] | Schema;
    required?: boolean;
    table?: string;
    type:
      | FieldType
      | CMS_FieldType
      | string
      | (FieldType | CMS_FieldType | string)[];
    subType?: string;
    accept?: string[];
    isArray?: boolean;
    searchIn?: string[];
    image?: string;
    values?: (string | number)[];
    labelProps?: any;
    inputProps?: any;
    onCreate?: any;
    disabledItems?: number[];
    isTable?: boolean;
    disableActions?: boolean;
    defaultValue?: any;
    children?: string | string[] | Schema;
  };
  type Schema = Field[];
  type Table = {
    id?: string;
    slug: string;
    label?: string;
    allowedMethods?: string;
    schema?: Schema;
  };
  type Item = {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
    user?: User;
    [key: string]: any;
  };
  type User = Item & {
    username: string;
    email: string;
    password: string;
    role: string;
  };
  type Database = {
    slug?: string;
    id?: string;
    icon?: null | string;
    languages?: string[];
    allowedDomains?: string[];
    roles?: { name: string; id: string }[];
    tables?: Table[];
    user?: User;
    size?: number;
  };
  type apiResponse<T = any> = {
    result: T;
    message: string;
    options: pageInfo;
  };
  type Asset = {
    name?: string;
    type?: string | null;
    size?: number;
    createdAt?: number;
    updatedAt?: number;
    publicURL?: string;
    user?: any;
  };
  type ThemeConfig = {
    primaryColor: string;
    primaryColorHover: string;
    primaryColorPressed: string;
    primaryColorSuppl: string;
  };
}
declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    apiBase: string;
  }
}

export {
  Field,
  Schema,
  Table,
  User,
  Item,
  Database,
  Asset,
  apiResponse,
  ThemeConfig,
};
