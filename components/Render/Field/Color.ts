import { NColorPicker, NFormItem } from "naive-ui";
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
						required: field.required,
						trigger: "change",
						message: "This field is required",
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NColorPicker, {
						modes: ["hex"],
						value: getProperty(modelValue.value, path),
						onUpdateValue: (value: any) =>
							setProperty(modelValue.value, path, value),
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
