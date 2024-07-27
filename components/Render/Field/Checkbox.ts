import { getProperty, setProperty } from "inidot";
import { NCheckbox, NCheckboxGroup, NFormItem, NSpace } from "naive-ui";

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
						type: "array",
						required: field.required,
						trigger: "change",
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
						NCheckboxGroup,
						{
							value: getProperty(modelValue.value, path),
							onUpdateValue: (value) =>
								setProperty(modelValue.value, path, value),
							...(field.inputProps
								? field.inputProps instanceof Function
									? field.inputProps(getProperty(modelValue.value, path)) ?? {}
									: field.inputProps
								: {}),
						},
						() =>
							h(
								NSpace,
								{
									"item-style": "display: flex",
									align: "center",
								},
								() =>
									field.values?.map((value: any) =>
										h(NCheckbox, {
											value: value,
											label: t(value),
										}),
									),
							),
					),
			);
	},
});
