import { NAutoComplete, NFormItem, NInput } from "naive-ui";
import { getProperty, setProperty } from "inidot";
import { isEmail } from "inibase/utils";

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
						type: "email",
						required: field.required,
						trigger: "change",
						validator(_rule, value) {
							if (!value)
								return field.required
									? new Error("This field is required")
									: true;
							if (!isEmail(value))
								return new Error("Please type a valid email");
						},
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(
						NAutoComplete,
						{
							inputProps: { type: "email", autocomplete: "disabled" },
							options: [
								"@gmail.com",
								"@outlook.com",
								"@hotmail.com",
								"@qq.com",
							].map((suffix) => {
								const prefix =
									getProperty(modelValue.value, path, "")?.split("@")[0] ?? "";
								return {
									label: prefix + suffix,
									value: prefix + suffix,
								};
							}),
							value: getProperty(modelValue.value, path),
							onUpdateValue: (value) =>
								setProperty(modelValue.value, path, value),
							placeholder: t(field.key),
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
