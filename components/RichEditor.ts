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
  NUpload,
} from "naive-ui";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  ArrowForwardUp,
  ArrowBackUp,
  ColorPicker as ColorPickerIcon,
  Highlight,
  Upload,
  Link,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListNumbers,
  List,
  TextResize,
} from "@vicons/tabler";
import { LazyColorPicker } from "#components";
function saveSelection() {
  if (
    window?.getSelection &&
    window?.getSelection()?.getRangeAt &&
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
      type: String,
      default: "",
    },
  },
  setup: (props, { emit }) => {
    const Language = useGlobalCookie("Language");

    const Loading = <any>useState("Loading", () => ({}));
    Loading.value["Upload"] = false;

    const route = useRoute(),
      EditorText = JSON.parse(JSON.stringify(props.modelValue)),
      id = Math.random().toString(36).replace("0.", "RichEditor"),
      isFocused = <any>ref(false),
      currentSelection = <any>ref(null),
      foreColor = <any>ref(null),
      showForeColorPicker = <any>ref(false),
      backColor = <any>ref(null),
      showBackColorPicker = <any>ref(false),
      aHref = <any>ref(null),
      user = <any>useState("user");

    onMounted(() => {
      document.execCommand("enableObjectResizing", false, "true");
      ["mouseup", "keyup", "selectionchange"].forEach((e) => {
        document.getElementById(id)?.addEventListener(e, () => {
          if (window?.getSelection()?.anchorNode?.textContent?.length !== 0)
            currentSelection.value = saveSelection();
          else currentSelection.value = null;
        });
      });
    });

    return () =>
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
                      icon: () => h(NIcon, () => h(Bold)),
                    }
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
                      icon: () => h(NIcon, () => h(Italic)),
                    }
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
                      icon: () => h(NIcon, () => h(Underline)),
                    }
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
                      icon: () => h(NIcon, () => h(Strikethrough)),
                    }
                  ),
                  h(
                    NPopselect,
                    {
                      disabled: !isFocused.value,
                      size: "small",
                      scrollable: true,
                      "on-update:value": (key: string) => (
                        document.execCommand("formatBlock", false, `<${key}>`),
                        (currentSelection.value = saveSelection())
                      ),
                      value: currentSelection.value
                        ? currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase()
                        : null,
                      options: [
                        {
                          label: () =>
                            h("h1", { style: { margin: 0 } }, "Heading 1"),
                          value: "h1",
                          icon: () => h(NIcon, () => h(H1)),
                        },
                        {
                          label: () =>
                            h("h2", { style: { margin: 0 } }, "Heading 2"),
                          value: "h2",
                          icon: () => h(NIcon, () => h(H2)),
                        },
                        {
                          label: () =>
                            h("h3", { style: { margin: 0 } }, "Heading 3"),
                          value: "h3",
                          icon: () => h(NIcon, () => h(H3)),
                        },
                        {
                          label: () =>
                            h("h4", { style: { margin: 0 } }, "Heading 4"),
                          value: "h4",
                          icon: () => h(NIcon, () => h(H4)),
                        },
                        {
                          label: () =>
                            h("h5", { style: { margin: 0 } }, "Heading 5"),
                          value: "h5",
                          icon: () => h(NIcon, () => h(H5)),
                        },
                        {
                          label: () =>
                            h("h6", { style: { margin: 0 } }, "Heading 6"),
                          value: "h6",
                          icon: () => h(NIcon, () => h(H6)),
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
                          icon: () => h(NIcon, () => h(Heading)),
                        }
                      )
                  ),
                  h(
                    NPopover,
                    {
                      disabled: !currentSelection.value,
                      show: showForeColorPicker.value,
                      "on-update:show": (show: boolean) =>
                        show
                          ? ((showForeColorPicker.value = true),
                            (showBackColorPicker.value = false),
                            (currentSelection.value = saveSelection()))
                          : ((showForeColorPicker.value = false),
                            restoreSelection(currentSelection.value)),
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
                            onClick: () => (
                              restoreSelection(currentSelection.value),
                              document.execCommand("styleWithCSS", false, ""),
                              document.execCommand(
                                "foreColor",
                                false,
                                foreColor.value
                              )
                            ),
                          },
                          {
                            icon: () => h(NIcon, () => h(ColorPickerIcon)),
                          }
                        ),
                      default: () =>
                        h(LazyColorPicker, {
                          modelValue: foreColor.value,
                          "onUpdate:modelValue": (color: string) => (
                            (foreColor.value = color),
                            restoreSelection(currentSelection.value),
                            document.execCommand("styleWithCSS", false, ""),
                            document.execCommand("foreColor", false, color),
                            (currentSelection.value = saveSelection())
                          ),
                          onSelected: () => (showForeColorPicker.value = false),
                        }),
                    }
                  ),
                  h(
                    NPopover,
                    {
                      disabled: !currentSelection.value,
                      show: showBackColorPicker.value,
                      "on-update:show": (show: boolean) =>
                        show
                          ? ((showBackColorPicker.value = true),
                            (showForeColorPicker.value = false),
                            (currentSelection.value = saveSelection()))
                          : ((showBackColorPicker.value = false),
                            restoreSelection(currentSelection.value)),
                    },
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            disabled: !currentSelection.value,
                            color: backColor.value,
                            size: "small",
                            onClick: () => (
                              restoreSelection(currentSelection.value),
                              document.execCommand("styleWithCSS", false, ""),
                              document.execCommand(
                                "backColor",
                                false,
                                backColor.value
                              )
                            ),
                          },
                          {
                            icon: () => h(NIcon, () => h(Highlight)),
                          }
                        ),
                      default: () =>
                        h(LazyColorPicker, {
                          modelValue: backColor.value,
                          "onUpdate:modelValue": (color: string) => (
                            (backColor.value = color),
                            restoreSelection(currentSelection.value),
                            document.execCommand("styleWithCSS", false, ""),
                            document.execCommand("backColor", false, color),
                            (currentSelection.value = saveSelection())
                          ),
                          onSelected: () => (showBackColorPicker.value = false),
                        }),
                    }
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
                      "on-update:value": (key: string) => (
                        document.execCommand("styleWithCSS", false, ""),
                        document.execCommand("fontSize", false, key),
                        (currentSelection.value = saveSelection())
                      ),
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
                              "Paragraph"
                            ),
                          value: 7,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "xx-large" } },
                              "Paragraph"
                            ),
                          value: 6,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "x-large" } },
                              "Paragraph"
                            ),
                          value: 5,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "large" } },
                              "Paragraph"
                            ),
                          value: 4,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "medium" } },
                              "Paragraph"
                            ),
                          value: 3,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "small" } },
                              "Paragraph"
                            ),
                          value: 2,
                        },
                        {
                          label: () =>
                            h(
                              "span",
                              { style: { fontSize: "x-small" } },
                              "Paragraph"
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
                          icon: () => h(NIcon, () => h(TextResize)),
                        }
                      )
                  ),
                ]
              ),
              h(NDivider, { vertical: true }),
              h(
                NButtonGroup,
                { size: "small", style: { display: "flex" } },
                () => [
                  user.value
                    ? h(
                        NUpload,
                        {
                          disabled: !isFocused.value,
                          style: {
                            width: "fit-content",
                            "--n-item-disabled-opacity": 1,
                          },
                          showFileList: false,
                          triggerStyle: {
                            height: "100%",
                          },
                          directoryDnd: true,
                          max: 1,
                          multiple: false,
                          accept: "image/*",
                          action: `/api/${
                            route.params.database ?? "inicontent"
                          }/asset`,
                          onBeforeUpload: () =>
                            (Loading.value["Upload"] = true),
                          onFinish: ({ file, event }: any) => {
                            const src = JSON.parse(event.target.response).result
                              .public_url;
                            var selRanges = window.getSelection();
                            if (selRanges && selRanges.rangeCount > 0) {
                              var curRange = selRanges.getRangeAt(0); // Range object
                              if (curRange.toString().length == 0) {
                                var imageNode = document.createElement("img");
                                imageNode.src = src;
                                // imageNode.alt = title;
                                // imageNode.title = title;
                                curRange.insertNode(imageNode);
                              }
                            }
                            Loading.value["Upload"] = false;
                            file.url = src;
                            file.name = src
                              .split("/")
                              .pop()
                              .split("#")[0]
                              .split("?")[0];
                            return file;
                          },
                        },
                        () =>
                          h(
                            NButton,
                            {
                              disabled: !isFocused.value,
                              type:
                                currentSelection.value &&
                                currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase() ===
                                  "img"
                                  ? "primary"
                                  : "default",
                              style: {
                                BorderTopRightRadius: 0,
                                BorderBottomRightRadius: 0,
                                height: "100%",
                              },
                              loading: Loading.value["Upload"],
                            },
                            { icon: () => h(NIcon, () => h(Upload)) }
                          )
                      )
                    : null,
                  h(
                    NPopover,
                    {
                      disabled: !isFocused.value,
                      "on-update:show": (show: boolean) =>
                        show
                          ? (currentSelection.value = saveSelection())
                          : restoreSelection(currentSelection.value),
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
                            icon: () => h(NIcon, () => h(Link)),
                          }
                        ),
                      default: () =>
                        h(NInputGroup, {}, () => [
                          h(NInput, {
                            inputProps: {
                              type: "url",
                            },
                            size: "small",
                            value: aHref.value,
                            "on-update:value": (url: string) =>
                              (aHref.value = url),
                          }),
                          h(
                            NButton,
                            {
                              type: "primary",
                              onClick: () => (
                                restoreSelection(currentSelection.value),
                                document.execCommand(
                                  "createLink",
                                  true,
                                  aHref.value
                                ),
                                (aHref.value = null)
                              ),
                            },
                            () => h(NIcon, () => h(Plus))
                          ),
                        ]),
                    }
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
                      icon: () => h(NIcon, () => h(ListNumbers)),
                    }
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
                      icon: () => h(NIcon, () => h(List)),
                    }
                  ),
                ]
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
                      icon: () => h(NIcon, () => h(AlignLeft)),
                    }
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
                      icon: () => h(NIcon, () => h(AlignCenter)),
                    }
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
                      icon: () => h(NIcon, () => h(AlignRight)),
                    }
                  ),
                ]
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
                        () => h(ArrowBackUp)
                      ),
                  }
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
                        () => h(ArrowForwardUp)
                      ),
                  }
                ),
              ]),
            ])
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
                innerHTML: EditorText,
                onFocusin: () => (isFocused.value = true),
                onFocusout: () => (isFocused.value = false),
                onKeyup: (e: KeyboardEvent) =>
                  e.code === "Enter" &&
                  e.ctrlKey &&
                  document.execCommand("insertParagraph", false, ""),
                onInput: (event: Event) =>
                  emit(
                    "update:modelValue",
                    (event?.target as HTMLElement | undefined)?.innerHTML ??
                      null
                  ),
                contenteditable: true,
              })
          ),
        ]
      );
  },
});
