import {
	NButton,
	NDynamicTags,
	NFormItem,
	NIcon,
	NSpace,
	NTag,
} from "naive-ui";
import { getProperty, setProperty } from "inidot";
import { IconPlus } from "@tabler/icons-vue";
import type { FieldType } from "inibase";
import { validateFieldType } from "inibase/utils";

export default defineNuxtComponent({
	props: {
		modelValue: {
			type: Object,
			required: true,
		},
		field: {
			type: Object as PropType<Field>,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Drawer = false;

		const modelValue = toRef(props, "modelValue"),
			field = props.field,
			path = props.path;

		return () =>
			h(
				NFormItem,
				{
					label: t(field.key),
					path,
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
					rule: {
						type: "array",
						required: field.required,
						trigger: ["change"],
						validator(_rule, values) {
							if (!Array.isArray(values) || values.length === 0)
								return field.required && !field.defaultValue
									? new Error("This field is required")
									: true;

							for (const value of values)
								if (
									!validateFieldType(
										value,
										field.children as FieldType | FieldType[],
									)
								)
									return new Error(
										`Please type a valid ${
											Array.isArray(field.children)
												? field.children.join("| ")
												: field.children
										}`,
									);
							return true;
						},
					},
				},
				() =>
					h(NSpace, () => [
						field.defaultValue
							? h(NSpace, () =>
									field.defaultValue.map((v: any) =>
										h(NTag, { disabled: true }, () => t(v)),
									),
								)
							: null,
						h(
							NDynamicTags,
							{
								inputProps: {
									placeholder: Array.isArray(field.children)
										? (field.children as string[])
												.map(
													(child: string) =>
														({
															url: "https://example.com",
															email: "example@example.com",
															number: "123456",
														})[child] ?? "example",
												)
												.join("|")
										: {
												url: "https://example.com",
												email: "example@example.com",
												number: "123456",
											}[field.children as string] ?? "Type here",
								},
								value: field.defaultValue
									? getProperty(modelValue.value, path).filter(
											(v: any) => !field.defaultValue.includes(v),
										)
									: getProperty(modelValue.value, path) ?? undefined,
								onUpdateValue: (value: any) =>
									setProperty(
										modelValue.value,
										path,
										field.defaultValue
											? [...value, ...[].concat(field.defaultValue)]
											: value,
									),
							},
							{
								trigger: ({ activate, disabled }: any) =>
									h(
										NButton,
										{
											size: "small",
											type: "primary",
											dashed: true,
											disabled: disabled,
											onClick: activate,
										},
										{
											icon: () => h(NIcon, () => h(IconPlus)),
										},
									),
							},
						),
					]),
			);
	},
});
