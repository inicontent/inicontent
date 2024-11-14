import { NIcon } from "naive-ui";
import { detectFieldType } from "inibase/utils";
import Inison from "inison";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { DataIcon } from "#components";

function renderIcon(icon: VNode) {
	return () => h(NIcon, () => icon);
}

export default function fieldsList(): SelectMixedOption[] {
	useLanguage({
		ar: {
			fields: {
				string: "نص",
				shortText: "نص قصير",
				longText: "نص طويل",
				html: "محرر نصوص",
				number: "رقم",
				password: "كلمة مرور",
				link: "رابط",
				email: "بريد",
				color: "لون",
				upload: "ملحق",
				tags: "وسوم",
				date: "تاريخ",
				toggle: "سحب",
				list: "قائمة",
				array: "مصفوفة",
				object: "كائن",
				table: "جدول",
				role: "دور",
				mention: "نصوص جاهزة",
				id: "معرف",
			},
		},
		en: {
			fields: {
				html: "Rich Editor",
				list: "Select",
			},
		},
	});
	return [
		{
			label: t("fields.string"),
			key: "text",
			icon: renderIcon(h(DataIcon, { value: "typography" })),
			children: [
				{
					label: t("fields.shortText"),
					key: "string",
					icon: renderIcon(h(DataIcon, { value: "letter-case" })),
				},
				{
					label: t("fields.longText"),
					key: "textarea",
					icon: renderIcon(h(DataIcon, { value: "align-justified" })),
				},
				{
					label: t("fields.html"),
					key: "html",
					icon: renderIcon(h(DataIcon, { value: "code" })),
				},
				{
					label: t("fields.password"),
					key: "password",
					icon: renderIcon(h(DataIcon, { value: "key" })),
				},
				{
					label: t("fields.email"),
					key: "email",
					icon: renderIcon(h(DataIcon, { value: "at" })),
				},
				{
					label: t("fields.link"),
					key: "url",
					icon: renderIcon(h(DataIcon, { value: "link" })),
				},
				{
					label: t("fields.color"),
					key: "color",
					icon: renderIcon(h(DataIcon, { value: "palette" })),
				},
				{
					label: t("fields.role"),
					key: "role",
					icon: renderIcon(h(DataIcon, { value: "shield-lock" })),
				},
				{
					label: t("fields.mention"),
					key: "mention",
					icon: renderIcon(h(DataIcon, { value: "message" })),
				},
			],
		},
		{
			label: t("fields.id"),
			key: "id",
			icon: renderIcon(h(DataIcon, { value: "id" })),
		},
		{
			label: t("fields.number"),
			key: "number",
			icon: renderIcon(h(DataIcon, { value: "number" })),
			children: [
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.number"),
					key: "number",
					icon: renderIcon(h(DataIcon, { value: "number" })),
				},
				{
					label: t("fields.slider"),
					key: "slider",
					icon: renderIcon(h(DataIcon, { value: "timeline-event" })),
					disabled: true,
				},
			],
		},
		{
			label: t("fields.date"),
			key: "date",
			icon: renderIcon(h(DataIcon, { value: "calendar" })),
		},
		{
			label: t("fields.toggle"),
			key: "boolean",
			icon: renderIcon(h(DataIcon, { value: "toggle-left" })),
		},
		{
			label: t("fields.upload"),
			key: "upload",
			icon: renderIcon(h(DataIcon, { value: "upload" })),
		},
		{
			label: t("fields.list"),
			key: "select",
			icon: renderIcon(h(DataIcon, { value: "list-check" })),
		},
		{
			label: t("fields.array"),
			key: "array",
			icon: renderIcon(h(DataIcon, { value: "brackets" })),
			children: [
				{
					label: t("fields.tags"),
					key: "tags",
					icon: renderIcon(h(DataIcon, { value: "tags" })),
				},
				{
					label: t("fields.list"),
					key: "array-select",
					icon: renderIcon(h(DataIcon, { value: "list-check" })),
				},
				{
					label: t("fields.upload"),
					key: "array-upload",
					icon: renderIcon(h(DataIcon, { value: "upload" })),
				},
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.range"),
					key: "range",
					icon: renderIcon(h(DataIcon, { value: "parentheses" })),
					disabled: true,
				},
				{
					label: t("fields.table"),
					key: "array-table",
					icon: renderIcon(h(DataIcon, { value: "table" })),
				},
				{
					label: t("fields.object"),
					key: "array",
					icon: renderIcon(h(DataIcon, { value: "braces" })),
				},
			],
		},
		{
			label: t("fields.object"),
			key: "object",
			icon: renderIcon(h(DataIcon, { value: "braces" })),
		},
		{
			label: t("fields.table"),
			key: "table",
			icon: renderIcon(h(DataIcon, { value: "table" })),
		},
	];
}

const defaultUnfoundField = {
	key: "custom",
	label: "custom",
	icon: renderIcon(h(DataIcon, { value: "question-mark" })),
};

export function flatFieldsList() {
	return fieldsList().flatMap(({ label, key, icon, children }) => [
		{ label, key, icon },
		...((children as any) ?? []),
	]);
}
export function getField(fieldType?: string | string[], value?: any) {
	if (Array.isArray(fieldType))
		fieldType = detectFieldType(
			value && typeof value === "object"
				? value.id
					? value.id
					: Inison.stringify(value)
				: value,
			fieldType as any,
		);
	if (!fieldType) return defaultUnfoundField;
	return (
		flatFieldsList().find(({ key }) => key === fieldType) ?? defaultUnfoundField
	);
}
