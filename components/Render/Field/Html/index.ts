import { getProperty, setProperty } from "inidot";
import { NFormItem } from "naive-ui";
import { LazyRenderFieldHtmlRichEditor } from "#components";

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
					h(LazyRenderFieldHtmlRichEditor, {
						modelValue: getProperty(modelValue.value, path),
						"onUpdate:modelValue.value": (v: any) =>
							setProperty(modelValue.value, path, v),
						...(field.inputProps
							? field.inputProps instanceof Function
								? field.inputProps(getProperty(modelValue.value, path)) ?? {}
								: field.inputProps
							: {}),
					}),
			);
	},
});
