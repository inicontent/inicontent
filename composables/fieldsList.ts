import { NIcon } from "naive-ui";
import {
	IconKey,
	IconNumber,
	IconAt,
	IconLink,
	IconUpload,
	IconTags,
	IconCalendar,
	IconToggleLeft,
	IconCode,
	IconAlignJustified,
	IconLetterCase,
	IconPalette,
	IconListCheck,
	IconBrackets,
	IconBraces,
	IconTable,
	IconTypography,
	IconShieldLock,
	IconId,
	IconQuestionMark,
	IconTimelineEvent,
	IconParentheses,
	IconMessage,
	IconCopyCheck,
	IconCircleCheck,
	type Icon,
} from "@tabler/icons-vue";
import { detectFieldType } from "inibase/utils";
import Inison from "inison";
import type { SelectMixedOption } from "naive-ui/es/select/src/interface";

function renderIcon(icon: Icon) {
	return () => h(NIcon, () => h(icon));
}

export default function fieldsList(): SelectMixedOption[] {
	defineTranslation({
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
				asset: "ملحق",
				assets: "ملحقات",
				tags: "وسوم",
				date: "تاريخ",
				toggle: "سحب",
				select: "قائمة",
				checkbox: "خانة اختيار",
				radio: "زر اختيار",
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
			},
		},
	});
	return [
		{
			label: t("fields.string"),
			key: "text",
			icon: renderIcon(IconTypography),
			children: [
				{
					label: t("fields.shortText"),
					key: "string",
					icon: renderIcon(IconLetterCase),
				},
				{
					label: t("fields.longText"),
					key: "textarea",
					icon: renderIcon(IconAlignJustified),
				},
				{
					label: t("fields.html"),
					key: "html",
					icon: renderIcon(IconCode),
				},
				{
					label: t("fields.password"),
					key: "password",
					icon: renderIcon(IconKey),
				},
				{
					label: t("fields.email"),
					key: "email",
					icon: renderIcon(IconAt),
				},
				{
					label: t("fields.link"),
					key: "url",
					icon: renderIcon(IconLink),
				},
				{
					label: t("fields.color"),
					key: "color",
					icon: renderIcon(IconPalette),
				},
				{
					label: t("fields.role"),
					key: "role",
					icon: renderIcon(IconShieldLock),
				},
				{
					label: t("fields.mention"),
					key: "mention",
					icon: renderIcon(IconMessage),
				},
			],
		},
		{
			label: t("fields.id"),
			key: "id",
			icon: renderIcon(IconId),
		},
		{
			label: t("fields.number"),
			key: "number",
			icon: renderIcon(IconNumber),
			children: [
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.number"),
					key: "number",
					icon: renderIcon(IconNumber),
				},
				{
					label: t("fields.slider"),
					key: "slider",
					icon: renderIcon(IconTimelineEvent),
					disabled: true,
				},
			],
		},
		{
			label: t("fields.date"),
			key: "date",
			icon: renderIcon(IconCalendar),
		},
		{
			label: t("fields.toggle"),
			key: "boolean",
			icon: renderIcon(IconToggleLeft),
		},
		{
			label: t("fields.asset"),
			key: "asset",
			icon: renderIcon(IconUpload),
		},
		{
			label: t("fields.radio"),
			key: "radio",
			icon: renderIcon(IconCircleCheck),
		},
		{
			label: t("fields.select"),
			key: "select",
			icon: renderIcon(IconListCheck),
		},
		{
			label: t("fields.array"),
			key: "array",
			icon: renderIcon(IconBrackets),
			children: [
				{
					label: t("fields.tags"),
					key: "tags",
					icon: renderIcon(IconTags),
				},
				{
					label: t("fields.select"),
					key: "array-select",
					icon: renderIcon(IconListCheck),
				},
				{
					label: t("fields.checkbox"),
					key: "checkbox",
					icon: renderIcon(IconCopyCheck),
				},
				{
					label: t("fields.assets"),
					key: "array-asset",
					icon: renderIcon(IconUpload),
				},
				// https://www.naiveui.com/en-US/dark/components/slider
				{
					label: t("fields.range"),
					key: "range",
					icon: renderIcon(IconParentheses),
					disabled: true,
				},
				{
					label: t("fields.table"),
					key: "array-table",
					icon: renderIcon(IconTable),
				},
				{
					label: t("fields.object"),
					key: "array",
					icon: renderIcon(IconBraces),
				},
			],
		},
		{
			label: t("fields.object"),
			key: "object",
			icon: renderIcon(IconBraces),
		},
		{
			label: t("fields.table"),
			key: "table",
			icon: renderIcon(IconTable),
		},
	];
}

const defaultUnfoundField = {
	key: "custom",
	label: "custom",
	icon: renderIcon(IconQuestionMark),
};

export function flatFieldsList() {
	return fieldsList().flatMap(({ label, key, icon, children }) => [
		{ label, key, icon },
		...((children as any) ?? []),
	]);
}
export function getField(field: Field, value?: any) {
	if (field.table === "assets")
		return flatFieldsList().find(
			({ key }) => key === (field.type === "array" ? "array-asset" : "asset"),
		);
	let fieldType = field.subType ?? (field.type as any);
	if (Array.isArray(fieldType))
		fieldType = detectFieldType(
			value && typeof value === "object"
				? value.id
					? value.id
					: Inison.stringify(value)
				: value,
			fieldType,
		);
	if (!fieldType) return defaultUnfoundField;
	return (
		flatFieldsList().find(({ key }) => key === fieldType) ?? defaultUnfoundField
	);
}
