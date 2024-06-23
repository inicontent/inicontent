import { NFormItem, NSelect } from "naive-ui";
import { getProperty, setProperty } from "inidot";

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
