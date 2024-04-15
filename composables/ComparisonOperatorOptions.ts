useLanguage({
  ar: {
    ComparisonOperator: {
      equalTo: "يساوي",
      notEqualTo: "لا يساوي",
      greaterThan: "أكبر من",
      greaterOrEqualTo: "أكبر من او يساوي",
      lessThan: "أصغر من",
      lessOrEqualTo: "أصغر من او يساوي",
      contains: "يحتوي",
      doesNotContain: "لا يحتوي",
    },
  },
});
export default [
  {
    label: t("ComparisonOperator.equalTo"),
    value: "=",
  },
  {
    label: t("ComparisonOperator.notEqualTo"),
    value: "!=",
  },
  {
    label: t("ComparisonOperator.contains"),
    value: "*",
  },
  {
    label: t("ComparisonOperator.doesNotContain"),
    value: "!*",
  },
  {
    label: t("ComparisonOperator.isOneOf"),
    value: "[]",
  },
  {
    label: t("ComparisonOperator.isNotOneOf"),
    value: "![]",
  },
  {
    label: t("ComparisonOperator.greaterThan"),
    value: ">",
  },
  {
    label: t("ComparisonOperator.greaterOrEqualTo"),
    value: ">=",
  },
  {
    label: t("ComparisonOperator.lessThan"),
    value: "<",
  },
  {
    label: t("ComparisonOperator.lessOrEqualTo"),
    value: "<=",
  },
];
