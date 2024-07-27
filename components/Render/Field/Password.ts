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
			path = props.path,
			alreadyRun = ref(false);

		if (
			!alreadyRun.value &&
			getProperty(modelValue.value, path) !== undefined &&
			getProperty(modelValue.value, path) !== ""
		) {
			alreadyRun.value = true;
			setProperty(modelValue.value, path, undefined);
		}
		return () =>
			h(
				NFormItem,
				{
					label: t(field.key),
					path,
					rule: {
						required: field.required && !alreadyRun.value,
						trigger: ["blur", "input"],
						validator: (_rule, value) =>
							field.required && !alreadyRun.value && !value
								? new Error(`${t(field.key)} ${t("isRequired")}`)
								: true,
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NInput, {
						type: "password",
						showPasswordOn: "click",
						value: getProperty(modelValue.value, path),
						onUpdateValue: (value: any) =>
							setProperty(modelValue.value, path, value),
						placeholder: t(field.key),
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
