import {
	NForm,
	NFormItem,
	NInput,
	NUpload,
	NDatePicker,
	NSwitch,
	NIcon,
	NButton,
	NSpace,
	NInputNumber,
	NCollapse,
	NCollapseItem,
	NPopover,
	NUploadDragger,
	NText,
	NRadioGroup,
	NRadio,
	NCheckbox,
	NCheckboxGroup,
	NDrawer,
	NDrawerContent,
	NSelect,
	NAvatar,
	NTag,
	NCard,
	NDataTable,
	NDynamicTags,
	useMessage,
	NColorPicker,
	NAutoComplete,
	NTooltip,
	type FormInst,
} from "naive-ui";
import {
	IconPencil,
	IconPlus,
	IconTrash,
	IconChevronRight,
	IconUpload,
	IconLink,
	IconBooks,
	IconDeviceFloppy,
} from "@tabler/icons-vue";
import {
	isArrayOfObjects,
	isURL,
	isEmail,
	validateFieldType,
	deepMerge,
} from "inibase/utils";
import { LazyRichEditor, LazyRenderFields, LazyAssetCard } from "#components";
import type { FieldType } from "inibase";
import { getProperty, setProperty, deleteProperty, hasProperty } from "inidot";
import Inison from "inison";

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
	},
});
