import { Buffer } from "buffer";
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
function saveSelection() {
  if (window.getSelection) {
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount && !sel.isCollapsed)
      return sel.getRangeAt(0);
  } else if (document.selection && document.selection.createRange)
    return document.selection.createRange();

  return null;
}

function restoreSelection(range) {
  if (range) {
    if (window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && range.select) range.select();
  }
}

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  setup: (props, { emit }) => {
    const ColorPicker = resolveComponent("ColorPicker");
    const Loading = useState("Loading", () => ({}));
    Loading.value["Upload"] = false;

    const EditorText = JSON.parse(JSON.stringify(props.modelValue)),
      id = Math.random().toString(36).replace("0.", "RichEditor"),
      currentSelection = ref(null),
      foreColor = ref(null),
      showForeColorPicker = ref(false),
      backColor = ref(null),
      showBackColorPicker = ref(false),
      aHref = ref(null),
      User = useState("User");

    onMounted(() => {
      ["mouseup", "keyup", "selectionchange"].forEach((e) => {
        document.getElementById(id).addEventListener(e, () => {
          if (
            window
              .getSelection()
              .anchorNode.textContent.substring(
                window.getSelection().extentOffset,
                window.getSelection().anchorOffset
              ).length !== 0
          )
            currentSelection.value = saveSelection();
          else currentSelection.value = null;
        });
      });
    });

    return () => [
      h(
        "style",
        {},
        {
          default: () => `
          .rich-editor {
              border: 1px solid;
              border-radius: 10px;
              padding: 15px;
              width: calc(100% - 32px);
          }
          `,
        }
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
                      size: "small",
                      scrollable: true,
                      "on-update:value": (key) => (
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
                      show: showForeColorPicker.value,
                      "on-update:show": (show) =>
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
                            color: foreColor.value,
                            ghost: true,
                            size: "small",
                            onClick: () => (
                              restoreSelection(currentSelection.value),
                              document.execCommand("styleWithCSS", false, true),
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
                        h(ColorPicker, {
                          modelValue: foreColor.value,
                          "onUpdate:modelValue": (color) => (
                            (foreColor.value = color),
                            restoreSelection(currentSelection.value),
                            document.execCommand("styleWithCSS", false, true),
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
                      show: showBackColorPicker.value,
                      "on-update:show": (show) =>
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
                              document.execCommand("styleWithCSS", false, true),
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
                        h(ColorPicker, {
                          modelValue: backColor.value,
                          "onUpdate:modelValue": (color) => (
                            (backColor.value = color),
                            restoreSelection(currentSelection.value),
                            document.execCommand("styleWithCSS", false, true),
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
                      size: "small",
                      scrollable: true,
                      type: document.queryCommandState("fontSize")
                        ? "primary"
                        : "default",
                      "on-update:value": (key) => (
                        document.execCommand("styleWithCSS", false, true),
                        document.execCommand("fontSize", false, key),
                        (currentSelection.value = saveSelection())
                      ),
                      value: currentSelection.value
                        ? {
                            "xxx-large": 7,
                            "xx-large": 6,
                            "x-large": 5,
                            large: 4,
                            medium: 3,
                            small: 2,
                            "x-small": 1,
                          }[
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
              h(NButtonGroup, { size: "small" }, () => [
                h(
                  NUpload,
                  {
                    style: {
                      width: "fit-content",
                    },
                    showFileList: false,
                    triggerStyle: {
                      height: "100%",
                    },
                    directoryDnd: true,
                    max: 1,
                    multiple: false,
                    accept: "image/*",
                    action: `https://api.inicontent.com/inicontent/assets`,
                    headers: {
                      Authorization:
                        "Basic " +
                        Buffer.from(
                          `${User.value.username}:${User.value.password}`
                        ).toString("base64"),
                    },
                    onBeforeUpload: () => (Loading.value["Upload"] = true),
                    onFinish: ({ file, event }) => {
                      const src = JSON.parse(event.target.response).result
                        .public_url;
                      var sel = document.selection;
                      if (sel) {
                        var textRange = sel.createRange();
                        document.execCommand("insertImage", false, src);
                        textRange.collapse(false);
                        textRange.select();
                      } else {
                        document.execCommand("insertImage", false, src);
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
                ),
                h(
                  NPopover,
                  {
                    "on-update:show": (show) =>
                      show
                        ? (currentSelection.value = saveSelection())
                        : restoreSelection(currentSelection.value),
                  },
                  {
                    trigger: () =>
                      h(
                        NButton,
                        {
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
                          "on-update:value": (url) => (aHref.value = url),
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
                    type: document.queryCommandState("insertUnorderedList")
                      ? "primary"
                      : "default",
                    onClick: () => document.execCommand("insertUnorderedList"),
                  },
                  {
                    icon: () => h(NIcon, () => h(List)),
                  }
                ),
              ]),
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
                    onClick: () => document.execCommand("undo", false, null),
                  },
                  {
                    icon: () => h(NIcon, () => h(ArrowBackUp)),
                  }
                ),
                h(
                  NButton,
                  {
                    disabled: !document.queryCommandEnabled("redo"),
                    onClick: () => document.execCommand("redo", false, null),
                  },
                  {
                    icon: () => h(NIcon, () => h(ArrowForwardUp)),
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
                  outline: "0px solid transparent",
                },
                id: id,
                innerHTML: EditorText,
                onKeyup: (e) =>
                  e.code === "Enter" &&
                  e.ctrlKey &&
                  document.execCommand("insertParagraph", false, null),
                onInput: (event) =>
                  emit("update:modelValue", event.target.innerHTML),
                contenteditable: true,
              })
          ),
        ]
      ),
    ];
  },
});
