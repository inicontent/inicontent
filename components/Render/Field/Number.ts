import { isNumber } from "inibase/utils";
import { getProperty, hasProperty, setProperty } from "inidot";
import { NFormItem, NInputNumber } from "naive-ui";

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
						type: "number",
						required: field.required,
						trigger: ["blur", "change"],
						validator(_rule, value) {
							if (!value)
								return field.required
									? new Error(`${t(field.key)} ${t("isRequired")}`)
									: true;
							if (!isNumber(value))
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
					h(
						NInputNumber,
						{
							value: hasProperty(modelValue.value, path)
								? Number(getProperty(modelValue.value, path))
								: getProperty(modelValue.value, path),
							onUpdateValue: (value) =>
								setProperty(modelValue.value, path, value),
							placeholder: t(field.key),
							showButton: false,
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
