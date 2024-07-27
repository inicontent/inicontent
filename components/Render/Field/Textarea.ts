import { getProperty, setProperty } from "inidot";
import { NFormItem, NInput } from "naive-ui";

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
						trigger: ["blur", "input"],
						message: `${t(field.key)} ${t("isRequired")}`,
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(
						NInput,
						{
							type: "textarea",
							rows: field.isTable ? 1 : 3,
							value: getProperty(modelValue.value, path),
							onUpdateValue: (value) =>
								setProperty(modelValue.value, path, value.toString()),
							placeholder: t(field.key),
							showCount: true,
							clearable: true,
							...(field.inputProps
								? field.inputProps instanceof Function
									? field.inputProps(getProperty(modelValue.value, path)) ?? {}
									: field.inputProps
								: {}),
						},
						{
							suffix: getField(
								field.subType ?? field.type,
								getProperty(modelValue.value, path, ""),
							).icon,
						},
					),
			);
	},
});
