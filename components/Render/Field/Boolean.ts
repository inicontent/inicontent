import { NFormItem, NSwitch } from "naive-ui";
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
					labelPlacement: "left",
					label: t(field.key),
					path,
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NSwitch, {
						value: getProperty(modelValue.value, path),
						onUpdateValue: (value) =>
							setProperty(modelValue.value, path, value),
					}),
			);
	},
});
