import { NIcon } from "naive-ui";
import {
  IconKey,
  IconRelationOneToOne,
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
} from "@tabler/icons-vue";
import { detectFieldType } from "inibase/utils";
import Inison from "inison";

type FieldsList = {
  label: string;
  key: string;
  icon: any;
  children?: FieldsList[];
};

export default function FieldsList(): FieldsList[] {
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
      icon: () => h(NIcon, () => h(IconTypography)),
      children: [
        {
          label: t("fields.shortText"),
          key: "string",
          icon: () => h(NIcon, () => h(IconLetterCase)),
        },
        {
          label: t("fields.longText"),
          key: "textarea",
          icon: () => h(NIcon, () => h(IconAlignJustified)),
        },
        {
          label: t("fields.html"),
          key: "html",
          icon: () => h(NIcon, () => h(IconCode)),
        },
        {
          label: t("fields.password"),
          key: "password",
          icon: () => h(NIcon, () => h(IconKey)),
        },
        {
          label: t("fields.email"),
          key: "email",
          icon: () => h(NIcon, () => h(IconAt)),
        },
        {
          label: t("fields.link"),
          key: "url",
          icon: () => h(NIcon, () => h(IconLink)),
        },
        {
          label: t("fields.color"),
          key: "color",
          icon: () => h(NIcon, () => h(IconPalette)),
        },
        {
          label: t("fields.role"),
          key: "role",
          icon: () => h(NIcon, () => h(IconShieldLock)),
        },
      ],
    },
    {
      label: t("fields.id"),
      key: "id",
      icon: () => h(NIcon, () => h(IconId)),
    },
    {
      label: t("fields.number"),
      key: "number",
      icon: () => h(NIcon, () => h(IconRelationOneToOne)),
    },
    {
      label: t("fields.date"),
      key: "date",
      icon: () => h(NIcon, () => h(IconCalendar)),
    },
    {
      label: t("fields.toggle"),
      key: "boolean",
      icon: () => h(NIcon, () => h(IconToggleLeft)),
    },
    {
      label: t("fields.upload"),
      key: "upload",
      icon: () => h(NIcon, () => h(IconUpload)),
    },
    {
      label: t("fields.list"),
      key: "select",
      icon: () => h(NIcon, () => h(IconListCheck)),
    },
    {
      label: t("fields.array"),
      key: "array",
      icon: () => h(NIcon, () => h(IconBrackets)),
      children: [
        {
          label: t("fields.tags"),
          key: "tags",
          icon: () => h(NIcon, () => h(IconTags)),
        },
        {
          label: t("fields.list"),
          key: "array-select",
          icon: () => h(NIcon, () => h(IconListCheck)),
        },
        {
          label: t("fields.upload"),
          key: "array-upload",
          icon: () => h(NIcon, () => h(IconUpload)),
        },
        {
          label: t("fields.table"),
          key: "array-table",
          icon: () => h(NIcon, () => h(IconTable)),
        },
        {
          label: t("fields.object"),
          key: "array",
          icon: () => h(NIcon, () => h(IconBraces)),
        },
      ],
    },
    {
      label: t("fields.object"),
      key: "object",
      icon: () => h(NIcon, () => h(IconBraces)),
    },
    {
      label: t("fields.table"),
      key: "table",
      icon: () => h(NIcon, () => h(IconTable)),
    },
  ];
}

const defaultUnfoundField = {
  key: "custom",
  label: "custom",
  icon: () => h(NIcon, () => h(IconQuestionMark)),
};

export function flatFieldsList() {
  return FieldsList().flatMap(({ label, key, icon, children }) => [
    { label, key, icon },
    ...(children ?? []),
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
      fieldType as any
    );
  if (!fieldType) return defaultUnfoundField;
  return (
    flatFieldsList().find(({ key }) => key === fieldType) ?? defaultUnfoundField
  );
}
