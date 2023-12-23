import { type Schema } from "inibase";

export type Table = {
  id: string;
  slug: string;
  allowed_methods: {
    role: string;
    methods: ("c" | "r" | "u" | "d" | "s")[];
  }[];
  schema: Schema;
};
export type Item = {
  id: string;
  createdAt?: number;
  updatedAt?: number;
  user?: User;
};
export type User = Item & {
  username: string;
  email: string;
  password: string;
};
export type Database = {
  slug: string;
  id: string;
  icon: null | string;
  languages: string[];
  allowed_domains: string[];
  roles: string[];
  tables: Table[];
  user: User;
};
