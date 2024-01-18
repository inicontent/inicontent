import type { FieldType, Options } from "inibase";
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
export type Field = {
  id?: string | number;
  key: string;
  children?: string | string[] | Schema;
  required?: boolean;
  type:
    | FieldType
    | CMS_FieldType
    | string
    | (FieldType | CMS_FieldType | string)[];
  subType?: string;
  accept?: string[];
  single?: boolean;
  search?: string[];
  label?: string[];
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
export type Schema = Field[];
export type Table = {
  id?: string;
  slug: string;
  allowed_methods?:
    | {
        role: string;
        methods: ("c" | "r" | "u" | "d" | "s")[] | string[];
      }[];
  schema?: Schema;
};
export type Item = {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  user?: User;
};
export type User = Item & {
  username: string;
  email: string;
  password: string;
  role: string;
};
export type Database = {
  slug?: string;
  id?: string;
  icon?: null | string;
  languages?: string[];
  allowed_domains?: string[];
  roles?: string[];
  tables?: Table[];
  user?: User;
};

export type apiResponse<T = any> = {
  result: T;
  message: Record<string, string>;
  options: Options;
};

export type Asset = {
  name?: string;
  type?: string | null;
  size?: number;
  createdAt?: number;
  updatedAt?: number;
  publicURL?: string;
  user?: any;
};

export type ThemeConfig = {
  primaryColor: string;
  primaryColorHover: string;
  primaryColorPressed: string;
  primaryColorSuppl: string;
};

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    apiBase: string;
  }
}
