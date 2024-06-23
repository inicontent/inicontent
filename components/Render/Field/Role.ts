import { NFormItem, NInput, NSelect } from "naive-ui";
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
			path = props.path,
			database = useState<Database>("database");

		return () =>
			h(
				NFormItem,
				{
					label: t(field.key),
					path,
					rule: {
						required: true,
						trigger: "change",
						message: "Please select an option",
					},
					...(field.labelProps
						? field.labelProps instanceof Function
							? field.labelProps(getProperty(modelValue.value, path)) ?? {}
							: field.labelProps
						: {}),
				},
				() =>
					h(NSelect, {
						value: getProperty(modelValue.value, path),
						onUpdateValue: (value) =>
							setProperty(modelValue.value, path, value),
						maxTagCount: "responsive",
						options:
							database.value.roles?.map(({ name, id }) => ({
								label: t(name),
								value: id,
							})) ?? [],
					}),
			);
	},
});
