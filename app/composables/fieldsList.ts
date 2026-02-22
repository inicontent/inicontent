import type { VNodeChild } from "vue";
import { Icon, NIcon } from "#components";

function renderIcon(iconName: string) {
	return () => h(NIcon, () => h(Icon, { name: `tabler:${iconName}` }));
}

type fieldListOptionType = {
	type?: string;
	key: CMS_FieldType | DB_FieldType;
	label: string;
	icon: () => VNodeChild;
	disabled?: boolean;
	children?: fieldListOptionType[];
};

export default function fieldsList(): fieldListOptionType[] {
	return [
		{
			label: t("fields.string"),
			key: "text",
			icon: renderIcon("typography"),
			children: [
				{
					label: t("fields.shortText"),
					key: "string",
					icon: renderIcon("letter-case"),
				},
				{
					label: t("fields.longText"),
					key: "textarea",
					icon: renderIcon("align-justified"),
				},
				{
					label: t("fields.html"),
					key: "html",
					icon: renderIcon("code"),
				},
				{
					label: t("fields.password"),
					key: "password",
					icon: renderIcon("key"),
				},
				{
					label: t("fields.email"),
					key: "email",
					icon: renderIcon("at"),
				},
				{
					label: t("fields.link"),
					key: "url",
					icon: renderIcon("link"),
				},
				{
					label: t("fields.color"),
					key: "color",
					icon: renderIcon("palette"),
				},
				{
					label: t("fields.role"),
					key: "role",
					icon: renderIcon("shield-lock"),
				},
				{
					label: t("fields.mention"),
					key: "mention",
					icon: renderIcon("message"),
				},
			],
		},
		{
			label: t("fields.number"),
			key: "number",
			icon: renderIcon("numbers"),
			children: [
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.number"),
					key: "number",
					icon: renderIcon("numbers"),
				},
				{
					label: t("fields.slider"),
					key: "slider",
					icon: renderIcon("timeline-event"),
					disabled: true,
				},
				{
					label: t("fields.ip"),
					key: "ip",
					icon: renderIcon("map-2"),
					disabled: true,
				},
			],
		},
		{
			label: t("fields.multiple"),
			key: "multiple",
			icon: renderIcon("box-multiple"),
		},
		{
			label: t("fields.date"),
			key: "date",
			icon: renderIcon("calendar"),
		},
		{
			label: t("fields.toggle"),
			key: "boolean",
			icon: renderIcon("toggle-left"),
		},
		{
			label: t("fields.id"),
			key: "id",
			icon: renderIcon("id"),
		},
		{
			label: t("fields.asset"),
			key: "asset",
			icon: renderIcon("upload"),
		},
		{
			label: t("fields.radio"),
			key: "radio",
			icon: renderIcon("circle-check"),
		},
		{
			label: t("fields.select"),
			key: "select",
			icon: renderIcon("list-check"),
		},
		{
			label: t("fields.array"),
			key: "array",
			icon: renderIcon("brackets"),
			children: [
				{
					label: t("fields.tags"),
					key: "tags",
					icon: renderIcon("tags"),
				},
				{
					label: t("fields.select"),
					key: "array-select",
					icon: renderIcon("list-check"),
				},
				{
					label: t("fields.checkbox"),
					key: "checkbox",
					icon: renderIcon("copy-check"),
				},
				{
					label: t("fields.assets"),
					key: "array-asset",
					icon: renderIcon("upload"),
				},
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.range"),
					key: "range",
					icon: renderIcon("parentheses"),
					disabled: true,
				},
				{
					label: t("fields.tableItems"),
					key: "array-table",
					icon: renderIcon("brand-airtable"),
				},
				{
					label: t("fields.objects"),
					key: "array",
					icon: renderIcon("object-scan"),
				},
			],
		},
		{
			label: t("fields.object"),
			key: "object",
			icon: renderIcon("braces"),
		},
		{
			label: t("fields.table"),
			key: "table",
			icon: renderIcon("table"),
		},
		{
			label: t("fields.json"),
			key: "json",
			icon: renderIcon("code"),
		},
	];
}

const defaultField: fieldListOptionType = {
	key: "custom",
	label: t("fields.custom"),
	icon: renderIcon("question-mark"),
};

export function flatFieldsList() {
	return fieldsList().flatMap((field) => field.children || field);
}

export function getField(field: Field) {
	if (field.table === "assets")
		return (
			flatFieldsList().find(
				({ key }) => key === (field.type === "array" ? "array-asset" : "asset"),
			) ?? defaultField
		);
	if (field.type === "array") {
		if (
			!Array.isArray(field.children) &&
			["table", "object"].includes(field.children as string)
		)
			return (
				flatFieldsList().find(
					({ key }) => key === [field.type, field.children].join("-"),
				) ?? defaultField
			);
	}
	let fieldType = field.subType ?? field.type;
	if (Array.isArray(fieldType)) fieldType = "multiple";
	if (!fieldType) return defaultField;
	return flatFieldsList().find(({ key }) => key === fieldType) ?? defaultField;
}
