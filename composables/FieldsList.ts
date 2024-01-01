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
} from "@tabler/icons-vue";
type FieldsList = {
  label: string;
  key: string;
  icon: any;
  children?: FieldsList[];
};
export default function (): FieldsList[] {
  useLanguage({
    ar: {
      fields: {
        text: "نص",
        short_text: "نص قصير",
        long_text: "نص طويل",
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
        array: "Array",
        object: "Object",
        table: "جدول",
        role: "Role",
        id: "معرف",
      },
    },
    en: {
      fields: {
        text: "Text",
        short_text: "Short Text",
        long_text: "Long Text",
        html: "Rich Editor",
        number: "Number",
        password: "Password",
        email: "Email",
        link: "Link",
        color: "Color",
        upload: "Upload",
        tags: "Tags",
        date: "Date",
        toggle: "Toggle",
        list: "ListCheck",
        array: "Array",
        object: "Object",
        table: "Table",
        role: "Role",
        id: "ID",
      },
    },
  });
  return [
    {
      label: t("fields.text"),
      key: "string",
      icon: () => h(NIcon, () => h(IconTypography)),
      children: [
        {
          label: t("fields.short_text"),
          key: "text",
          icon: () => h(NIcon, () => h(IconLetterCase)),
        },
        {
          label: t("fields.long_text"),
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
          label: t("fields.role"),
          key: "role",
          icon: () => h(NIcon, () => h(IconShieldLock)),
        },
        {
          label: t("fields.id"),
          key: "id",
          icon: () => h(NIcon, () => h(IconId)),
        },
      ],
    },
    {
      label: t("fields.number"),
      key: "number",
      icon: () => h(NIcon, () => h(IconRelationOneToOne)),
    },
    {
      label: t("fields.upload"),
      key: "upload",
      icon: () => h(NIcon, () => h(IconUpload)),
    },
    {
      label: t("fields.tags"),
      key: "tags",
      icon: () => h(NIcon, () => h(IconTags)),
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
      label: t("fields.list"),
      key: "list",
      icon: () => h(NIcon, () => h(IconListCheck)),
    },
    {
      label: t("fields.color"),
      key: "color",
      icon: () => h(NIcon, () => h(IconPalette)),
    },
    {
      label: t("fields.array"),
      key: "array",
      icon: () => h(NIcon, () => h(IconBrackets)),
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
