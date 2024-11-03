import type {
	FieldType as dbFieldType,
	pageInfo,
	ComparisonOperator,
} from "inibase";
import type { useMessage } from "naive-ui";

type onCreateCallback = (index: number) => onCreateType;
type onCreateType = string | number | boolean | null | Record<any, any>;
declare global {
	interface Window {
		$message: useMessage;
	}
	type CMS_FieldType =
		| "text"
		| "textarea"
		| "radio"
		| "checkbox"
		| "tags"
		| "color"
		| "select"
		| "role"
		| "mention";
	type FieldType = dbFieldType;
	type Field = {
		id?: string | number;
		key: string;
		children?: FieldType | FieldType[] | Schema;
		required?: boolean;
		table?: string;
		type: CMS_FieldType | FieldType | FieldType[];
		subType?: CMS_FieldType | FieldType | FieldType[];
		accept?: string[];
		isArray?: boolean;
		searchIn?: string[];
		image?: string;
		options?: ((string | number) | { label: string; value: string | number })[];
		labelProps?: any;
		inputProps?: any;
		onCreate?: onCreateType | onCreateType[] | onCreateCallback;
		disabledItems?: number[];
		isTable?: boolean;
		disableActions?: boolean;
		defaultValue?: any;
		custom?: boolean;
		min?: number;
		max?: number;
		date?:
			| "date"
			| "datetime"
			| "daterange"
			| "datetimerange"
			| "month"
			| "monthrange"
			| "year"
			| "yearrange"
			| "quarter"
			| "quarterrange"
			| "week";
		expand?: boolean;
		params?: string;
	};
	type Schema = Field[];
	type FlowType = (
		| [
				"set",
				string,
				string | number | boolean | null | (string | number | boolean | null)[],
		  ]
		| ["unset", string | string[]]
		| ["error", string]
		| [
				`@${"users" | "data" | "where"}.${string | number}` | "@method",
				ComparisonOperator,
				string | number | boolean | null | (string | number | boolean | null)[],
		  ]
	)[];
	type Table = {
		id?: string;
		slug: string;
		label?: string;
		allowedMethods?: string;
		schema?: Schema;
		onRequest?: FlowType[];
		onResponse?: FlowType[];
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
		icon?: Asset;
		primaryColor?: string;
		primaryDarkColor?: string;
		domains?: string[];
		locales?: string[];
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
	type Asset = Item & {
		name?: string;
		type: string;
		size: number;
		publicURL: string;
		createdBy?: User;
	};
	type ThemeConfig = {
		primaryColor: string;
		primaryColorHover: string;
		primaryColorPressed: string;
		primaryColorSuppl: string;
		revert?: boolean;
	};
}
declare module "nuxt/schema" {
	interface PublicRuntimeConfig {
		apiBase: string;
	}
}

export type {
	CMS_FieldType,
	FieldType,
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
