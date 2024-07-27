import { getProperty, setProperty } from "inidot";
import { NFormItem, NSelect } from "naive-ui";

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
					rule: {
						type: field.isArray ? "array" : "any",
						required: field.required,
						trigger: "change",
						min: field.isArray ? field.min : undefined,
						validator(_rule, value) {
							if (!value || (Array.isArray(value) && value.length === 0))
								return field.required
									? new Error(`${t(field.key)} ${t("isRequired")}`)
									: true;
							if (Array.isArray(value) && field.min && value.length < field.min)
								return new Error(`${t(field.key)} ${t("isNotValid")}`);
						},
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NSelect, {
						value: field.isArray
							? getProperty(modelValue.value, path)?.map(String)
							: getProperty(modelValue.value, path)?.toString(),
						onUpdateValue: (value: any) =>
							setProperty(modelValue.value, path, value),
						options: field.values?.map((value: any) => ({
							value: value,
							label: t(value),
						})),
						tag: !!field.custom,
						maxTagCount: "responsive",
						consistentMenuWidth: false,
						filterable: true,
						multiple: !!field.isArray,
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
