import { getProperty, hasProperty, setProperty } from "inidot";
import { NDatePicker, NFormItem } from "naive-ui";

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
		const modelValue = toRef(props, "modelValue"),
			field = props.field,
			path = props.path;
		// if (!hasProperty(modelValue.value, path) && field.required)
		// 	setProperty(modelValue.value, path, Date.now());
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
						message: `${t(field.key)} ${t("isRequired")}`,
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NDatePicker, {
						value: getProperty(modelValue.value, path),
						actions: null,
						onConfirm: (value: number) =>
							setProperty(modelValue.value, path, value),
						"on-update:value": (value: number) =>
							setProperty(modelValue.value, path, value),
						monthFormat: field.date && field.date === "month" ? "MMM" : "MM",
						format: "dd-MM-yyyy",
						type: field.date || "date",
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
