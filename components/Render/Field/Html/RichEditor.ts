// TO-DO:
// replacement of execCommand: https://github.com/cihad/yaz
// using markdown instead https://github.com/jefago/tiny-markdown-editor
import {
	NScrollbar,
	NSpace,
	NButton,
	NIcon,
	NPopselect,
	NPopover,
	NDivider,
	NButtonGroup,
	NInputGroup,
	NInput,
	NDrawerContent,
	NDrawer,
	NRadio,
} from "naive-ui";
import {
	IconBold,
	IconItalic,
	IconUnderline,
	IconStrikethrough,
	IconHeading,
	IconH1,
	IconH2,
	IconH3,
	IconH4,
	IconH5,
	IconH6,
	IconArrowForwardUp,
	IconArrowBackUp,
	IconColorPicker,
	IconHighlight,
	IconUpload,
	IconLink,
	IconPlus,
	IconAlignLeft,
	IconAlignCenter,
	IconAlignRight,
	IconListNumbers,
	IconList,
	IconTextResize,
} from "@tabler/icons-vue";
import { LazyAssetCard, LazyRenderFieldHtmlColorPicker } from "#components";

function saveSelection() {
	if (
		window?.getSelection?.()?.getRangeAt &&
		window?.getSelection()?.rangeCount &&
		!window?.getSelection()?.isCollapsed
	)
		return window?.getSelection()?.getRangeAt(0);

	return null;
}

function restoreSelection(range: Range | null) {
	if (!range) return;

	if (window.getSelection) window?.getSelection()?.removeAllRanges();
	window?.getSelection()?.addRange(range);
}

export default defineNuxtComponent({
	props: {
		modelValue: {
			type: String as PropType<string | undefined>,
			default: undefined,
		},
	},
	setup: (props, { emit }) => {
		const Language = useCookie("Language");

		const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
		Loading.value.Upload = false;

		const route = useRoute(),
			modelValue = computed({
				get: () => props.modelValue,
				set: (value) => emit("update:modelValue", value),
			}),
			showAssetsModal = ref(false),
			id = randomID(),
			isFocused = ref(false),
			currentSelection = ref<any>(null),
			foreColor = ref<string>(),
			showForeColorPicker = ref(false),
			backColor = ref<string>(),
			showBackColorPicker = ref(false),
			aHref = ref<string>(),
			user = useState<any>("user");

		onMounted(() => {
			document.execCommand("enableObjectResizing", false, "true");
			for (const event of ["mouseup", "keyup", "selectionchange"]) {
				document.getElementById(id)?.addEventListener(event, () => {
					if (window?.getSelection()?.anchorNode?.textContent?.length !== 0)
						currentSelection.value = saveSelection();
					else currentSelection.value = null;
				});
			}
		});

		return () => [
			h(
				NDrawer,
				{
					show: showAssetsModal.value,
					"on-update:show": (v: boolean) => {
						showAssetsModal.value = v;
					},
					defaultHeight: "50%",
					placement: "bottom",
					resizable: true,
				},
				() =>
					h(
						NDrawerContent,
						{
							id: "assets_modal",
							nativeScrollbar: false,
							bodyContentStyle: {
								padding: 0,
							},
						},
						() =>
							h(
								LazyAssetCard,
								//@ts-ignore
								{
									targetID: "assets_modal",
								},
								(asset: Asset) =>
									asset.type !== "folder"
										? h(NRadio, {
												onUpdateChecked() {
													document.execCommand(
														"insertimage",
														undefined,
														asset.publicURL,
													);
													showAssetsModal.value = false;
												},
											})
										: null,
							),
					),
			),
			h(
				NSpace,
				{
					vertical: true,
					style: {
						width: "100%",
					},
				},
				() => [
					h(NScrollbar, { xScrollable: true }, () =>
						h(NSpace, { wrap: false }, () => [
							h(
								NButtonGroup,
								{
									size: "small",
								},
								() => [
									h(
										NButton,
										{
											disabled: !currentSelection.value,
											type: document.queryCommandState("bold")
												? "primary"
												: "default",
											onClick: () => document.execCommand("bold"),
										},
										{
											icon: () => h(NIcon, () => h(IconBold)),
										},
									),
									h(
										NButton,
										{
											disabled: !currentSelection.value,
											type: document.queryCommandState("italic")
												? "primary"
												: "default",
											onClick: () => document.execCommand("italic"),
										},
										{
											icon: () => h(NIcon, () => h(IconItalic)),
										},
									),
									h(
										NButton,
										{
											disabled: !currentSelection.value,
											type: document.queryCommandState("underline")
												? "primary"
												: "default",
											onClick: () => document.execCommand("underline"),
										},
										{
											icon: () => h(NIcon, () => h(IconUnderline)),
										},
									),
									h(
										NButton,
										{
											disabled: !currentSelection.value,
											type: document.queryCommandState("strikeThrough")
												? "primary"
												: "default",
											onClick: () => document.execCommand("strikeThrough"),
										},
										{
											icon: () => h(NIcon, () => h(IconStrikethrough)),
										},
									),
									h(
										NPopselect,
										{
											disabled: !isFocused.value,
											size: "small",
											scrollable: true,
											onUpdateValue(key) {
												document.execCommand("formatBlock", false, `<${key}>`);
												currentSelection.value = saveSelection();
											},
											value: currentSelection.value
												? currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase()
												: null,
											options: [
												{
													label: () =>
														h("h1", { style: { margin: 0 } }, "Heading 1"),
													value: "h1",
													icon: () => h(NIcon, () => h(IconH1)),
												},
												{
													label: () =>
														h("h2", { style: { margin: 0 } }, "Heading 2"),
													value: "h2",
													icon: () => h(NIcon, () => h(IconH2)),
												},
												{
													label: () =>
														h("h3", { style: { margin: 0 } }, "Heading 3"),
													value: "h3",
													icon: () => h(NIcon, () => h(IconH3)),
												},
												{
													label: () =>
														h("h4", { style: { margin: 0 } }, "Heading 4"),
													value: "h4",
													icon: () => h(NIcon, () => h(IconH4)),
												},
												{
													label: () =>
														h("h5", { style: { margin: 0 } }, "Heading 5"),
													value: "h5",
													icon: () => h(NIcon, () => h(IconH5)),
												},
												{
													label: () =>
														h("h6", { style: { margin: 0 } }, "Heading 6"),
													value: "h6",
													icon: () => h(NIcon, () => h(IconH6)),
												},
											],
										},
										() =>
											h(
												NButton,
												{
													disabled: !isFocused.value,
													type:
														currentSelection.value &&
														currentSelection.value.commonAncestorContainer.parentElement.tagName
															.toLowerCase()
															.charAt(0) === "h"
															? "primary"
															: "default",
												},
												{
													icon: () => h(NIcon, () => h(IconHeading)),
												},
											),
									),
									h(
										NPopover,
										{
											raw: true,
											disabled: !currentSelection.value,
											show: showForeColorPicker.value,
											onUpdateShow(show: boolean) {
												if (show) {
													showForeColorPicker.value = true;
													showBackColorPicker.value = false;
													currentSelection.value = saveSelection();
												} else {
													showForeColorPicker.value = false;
													restoreSelection(currentSelection.value);
												}
											},
										},
										{
											trigger: () =>
												h(
													NButton,
													{
														disabled: !currentSelection.value,
														style: {
															color: foreColor.value,
														},
														ghost: true,
														size: "small",
														onClick() {
															restoreSelection(currentSelection.value);
															document.execCommand("styleWithCSS", false, "");
															document.execCommand(
																"foreColor",
																false,
																foreColor.value,
															);
														},
													},
													{
														icon: () => h(NIcon, () => h(IconColorPicker)),
													},
												),
											default: () =>
												h(LazyRenderFieldHtmlColorPicker, {
													modelValue: foreColor.value,
													"onUpdate:modelValue"(color: string) {
														foreColor.value = color;
														restoreSelection(currentSelection.value);
														document.execCommand("styleWithCSS", false, "");
														document.execCommand("foreColor", false, color);
														showForeColorPicker.value = false;
														currentSelection.value = saveSelection();
													},
												}),
										},
									),
									h(
										NPopover,
										{
											raw: true,
											disabled: !currentSelection.value,
											show: showBackColorPicker.value,
											onUpdateShow(show: boolean) {
												if (show) {
													showBackColorPicker.value = true;
													showForeColorPicker.value = false;
													currentSelection.value = saveSelection();
												} else {
													showBackColorPicker.value = false;
													restoreSelection(currentSelection.value);
												}
											},
										},
										{
											trigger: () =>
												h(
													NButton,
													{
														disabled: !currentSelection.value,
														color: backColor.value,
														size: "small",
														onClick() {
															restoreSelection(currentSelection.value);
															document.execCommand("styleWithCSS", false, "");
															document.execCommand(
																"backColor",
																false,
																backColor.value,
															);
														},
													},
													{
														icon: () => h(NIcon, () => h(IconHighlight)),
													},
												),
											default: () =>
												h(LazyRenderFieldHtmlColorPicker, {
													modelValue: backColor.value,
													"onUpdate:modelValue"(color: string) {
														backColor.value = color;
														restoreSelection(currentSelection.value);
														document.execCommand("styleWithCSS", false, "");
														document.execCommand("backColor", false, color);
														showBackColorPicker.value = false;
														currentSelection.value = saveSelection();
													},
												}),
										},
									),
									h(
										NPopselect,
										{
											disabled: !currentSelection.value,
											size: "small",
											scrollable: true,
											type: document.queryCommandState("fontSize")
												? "primary"
												: "default",
											onUpdateValue(key) {
												document.execCommand("styleWithCSS", false, "");
												document.execCommand("fontSize", false, key);
												currentSelection.value = saveSelection();
											},
											value: currentSelection.value
												? (
														{
															"xxx-large": 7,
															"xx-large": 6,
															"x-large": 5,
															large: 4,
															medium: 3,
															small: 2,
															"x-small": 1,
														} as any
													)[
														currentSelection.value.commonAncestorContainer
															.parentElement.style.fontSize
													]
												: null,
											options: [
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "xxx-large" } },
															"Paragraph",
														),
													value: 7,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "xx-large" } },
															"Paragraph",
														),
													value: 6,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "x-large" } },
															"Paragraph",
														),
													value: 5,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "large" } },
															"Paragraph",
														),
													value: 4,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "medium" } },
															"Paragraph",
														),
													value: 3,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "small" } },
															"Paragraph",
														),
													value: 2,
												},
												{
													label: () =>
														h(
															"span",
															{ style: { fontSize: "x-small" } },
															"Paragraph",
														),
													value: 1,
												},
											],
										},
										() =>
											h(
												NButton,
												{
													disabled: !currentSelection.value,
												},
												{
													icon: () => h(NIcon, () => h(IconTextResize)),
												},
											),
									),
								],
							),
							h(NDivider, { vertical: true }),
							h(
								NButtonGroup,
								{ size: "small", style: { display: "flex" } },
								() => [
									user.value
										? h(
												NButton,
												{
													disabled: !isFocused.value,
													type:
														currentSelection.value &&
														currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase() ===
															"img"
															? "primary"
															: "default",
													onmousedown: () => {
														showAssetsModal.value = true;
													},
												},
												{ icon: () => h(NIcon, () => h(IconUpload)) },
											)
										: null,
									h(
										NPopover,
										{
											disabled: !isFocused.value,
											"on-update:show": (show: boolean) => {
												if (show) currentSelection.value = saveSelection();
												else restoreSelection(currentSelection.value);
											},
										},
										{
											trigger: () =>
												h(
													NButton,
													{
														disabled: !isFocused.value,
														type:
															currentSelection.value &&
															currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase() ===
																"a"
																? "primary"
																: "default",
													},
													{
														icon: () => h(NIcon, () => h(IconLink)),
													},
												),
											default: () =>
												h(NInputGroup, {}, () => [
													h(NInput, {
														inputProps: {
															type: "url",
														},
														size: "small",
														value: aHref.value,
														"on-update:value": (url: string) => {
															aHref.value = url;
														},
													}),
													h(
														NButton,
														{
															type: "primary",
															onClick() {
																restoreSelection(currentSelection.value);
																document.execCommand(
																	"createLink",
																	true,
																	aHref.value,
																);
																aHref.value = undefined;
															},
														},
														() => h(NIcon, () => h(IconPlus)),
													),
												]),
										},
									),
									h(
										NButton,
										{
											disabled: !isFocused.value,
											type: document.queryCommandState("insertOrderedList")
												? "primary"
												: "default",
											onClick: () => document.execCommand("insertOrderedList"),
										},
										{
											icon: () => h(NIcon, () => h(IconListNumbers)),
										},
									),
									h(
										NButton,
										{
											disabled: !isFocused.value,
											type: document.queryCommandState("insertUnorderedList")
												? "primary"
												: "default",
											onClick: () =>
												document.execCommand("insertUnorderedList"),
										},
										{
											icon: () => h(NIcon, () => h(IconList)),
										},
									),
								],
							),
							h(NDivider, { vertical: true }),
							h(
								NButtonGroup,
								{
									size: "small",
								},
								() => [
									h(
										NButton,
										{
											disabled: !isFocused.value,
											type: document.queryCommandState("justifyLeft")
												? "primary"
												: "default",
											onClick: () => document.execCommand("justifyLeft"),
										},
										{
											icon: () => h(NIcon, () => h(IconAlignLeft)),
										},
									),
									h(
										NButton,
										{
											disabled: !isFocused.value,
											type: document.queryCommandState("justifyCenter")
												? "primary"
												: "default",
											onClick: () => document.execCommand("justifyCenter"),
										},
										{
											icon: () => h(NIcon, () => h(IconAlignCenter)),
										},
									),
									h(
										NButton,
										{
											disabled: !isFocused.value,
											type: document.queryCommandState("justifyRight")
												? "primary"
												: "default",
											onClick: () => document.execCommand("justifyRight"),
										},
										{
											icon: () => h(NIcon, () => h(IconAlignRight)),
										},
									),
								],
							),
							h(NDivider, { vertical: true }),
							h(NButtonGroup, { size: "small" }, () => [
								h(
									NButton,
									{
										disabled: !document.queryCommandEnabled("undo"),
										onClick: () => document.execCommand("undo", false, ""),
									},
									{
										icon: () =>
											h(
												NIcon,
												{
													style:
														Language.value === "ar"
															? {
																	transform: "scaleX(-1)",
																}
															: null,
												},
												() => h(IconArrowBackUp),
											),
									},
								),
								h(
									NButton,
									{
										disabled: !document.queryCommandEnabled("redo"),
										onClick: () => document.execCommand("redo", false, ""),
									},
									{
										icon: () =>
											h(
												NIcon,
												{
													style:
														Language.value === "ar"
															? {
																	transform: "scaleX(-1)",
																}
															: null,
												},
												() => h(IconArrowForwardUp),
											),
									},
								),
							]),
						]),
					),
					h(
						NScrollbar,
						{
							class: "rich-editor",
							style: {
								maxHeight: "250px",
							},
						},
						() =>
							h("div", {
								style: {
									minHeight: "100px",
									outline: "0px solid transparent",
								},
								id: id,
								innerHTML: modelValue.value,
								onFocusin: () => {
									isFocused.value = true;
								},
								onFocusout: () => {
									isFocused.value = false;
								},
								onKeydown: (e: KeyboardEvent) => {
									if (!(e.key === "Enter" && (e.ctrlKey || e.metaKey))) return;
									e.preventDefault();
									document.execCommand("insertParagraph", false, "");
								},
								onInput: (event: InputEvent) => {
									modelValue.value = (
										event?.target as HTMLElement | undefined
									)?.innerHTML;
								},
								contenteditable: true,
							}),
					),
				],
			),
		];
	},
});
