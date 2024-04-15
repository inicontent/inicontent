import { NDatePicker, NFormItem, NInput } from "naive-ui";
import { getProperty, hasProperty, setProperty } from "inidot";

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
		if (!hasProperty(modelValue.value, path) && field.required)
			setProperty(modelValue.value, path, Date.now());
		return () =>
			h(
				NFormItem,
				{
					label: t(field.key),
					path,
					rule: {
						type: "number",
						required: field.required,
						trigger: ["blur", "change"],
						message: "Please select a valid date",
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NDatePicker, {
						value: getProperty(modelValue.value, path)
							? Number(getProperty(modelValue.value, path))
							: null,
						onConfirm: (e: number) => setProperty(modelValue.value, path, e),
						type: "datetime",
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
