import type { FieldType } from "inibase";
type CMS_FieldType =
  | "text"
  | "upload"
  | "textarea"
  | "radio"
  | "checkbox"
  | "tags"
  | "color"
  | "list"
  | "role";
export type Field = {
  id?: string | number;
  key: string;
  children?: string | string[] | Schema;
  required?: boolean;
  type: FieldType | CMS_FieldType | (FieldType | CMS_FieldType)[];
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
  allowed_methods: {
    role: string;
    methods: ("c" | "r" | "u" | "d" | "s")[];
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
