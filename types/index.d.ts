import type {
	Field as dbField,
	FieldType as dbFieldType,
	pageInfo,
	ComparisonOperator,
} from "inibase";
import type { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import type languages from "~/composables/Translation/languages";

type onCreateCallback = (index: number) => onCreateType;
type onCreateType = string | number | boolean | Data;
type singleLanguageTranslations = {
	[key: string]: string | singleLanguageTranslations;
};
declare global {
	interface Window {
		$message: MessageApiInjection;
		$dialog: DialogApiInjection;
		$notification: NotificationApiInjection;
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
		| "mention"
		| "icon"
		| "multiple"
		| "slider"
		| "asset"
		| "range"
		| "array-select"
		| "array-asset"
		| "array-table"
		| "custom";
	type FieldType = dbFieldType;
	type Field = dbField & {
		type: CMS_FieldType | FieldType | FieldType[];
		children?: CMS_FieldType | FieldType | FieldType[] | Schema;
		subType?: CMS_FieldType;
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
		query?: any;
		where?: string | Record<string, any>;
		description?: string;
	};
	type Schema = Field[];
	type FlowType = (
		| [
				"set",
				string | null,
				string | number | boolean | null | (string | number | boolean | null)[],
		  ]
		| ["unset", null | string | string[]]
		| ["error", null | string]
		| [
				`@${"user" | "data" | "where"}.${string | number}` | "@method",
				ComparisonOperator,
				string | number | boolean | null | (string | number | boolean | null)[],
		  ]
		| [null, null, null]
	)[];
	type Table = {
		id?: string;
		slug: string;
		label?: string;
		icon?: string;
		defaultSearchableColumns?: string[];
		allowedMethods?: string;
		schema?: Schema;
		onRequest?: FlowType[];
		onResponse?: FlowType[];
		currentJob?: "export" | "import";
		config?: {
			compression: boolean;
			cache: boolean;
			prepend: boolean;
			decodeID: boolean;
		};
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

	type LanguagesType = (typeof languages)[number];

	type TranslationsType = {
		[localeName: LanguagesType]: singleLanguageTranslations;
	};

	type SearchType = {
		and?: [string | null, string, any][];
		or?: [string | null, string, any][];
	};

	type TableRef = {
		search: {
			data: SearchType;
			execute: (search?: SearchType) => void;
			reset: () => void;
		};
		delete: (id?: string | string[]) => Promise<void>;
	};

	type FormRef = {
		create: () => Promise<void>;
		update: () => Promise<void>;
		delete: () => Promise<void>;
		schema: Schema;
		data?: Item;
	};

	type DrawerRef = {
		show: boolean;
		id?: string;
		table?: string;
		data?: Item;
	};
}
declare module "nuxt/schema" {
	interface appConfig {
		apiBase: string;
		idOne: string;
		database?: string;
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
	LanguagesType,
	TranslationsType,
	SearchType,
	TableRef,
	FormRef,
	DrawerRef,
};
