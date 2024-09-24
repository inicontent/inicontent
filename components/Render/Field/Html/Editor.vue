<template>
  <NDrawer v-model:show="showAssetsModal" default-height="50%" placement="bottom" resizable>
    <NDrawerContent id="assetsModal" :native-scrollbar="false" body-content-style="padding: 0">
      <LazyAssetCard targetID="assetsModal">
        <template v-slot="{ asset }">
          <NRadio v-if="asset.type !== 'folder'" @update:checked="insertImage(asset.publicURL)" />
        </template>
      </LazyAssetCard>
    </NDrawerContent>
  </NDrawer>

  <NFlex vertical style="width: 100%">
    <NScrollbar x-scrollable>
      <NFlex :wrap="false">
        <NButtonGroup size="small">
          <NButton :disabled="!currentSelection" :type="isState('bold') ? 'primary' : 'default'"
            @click="() => applyStyle('bold')">
            <NIcon>
              <IconBold />
            </NIcon>
          </NButton>

          <NButton :disabled="!currentSelection" :type="isState('italic') ? 'primary' : 'default'"
            @click="() => applyStyle('italic')">
            <NIcon>
              <IconItalic />
            </NIcon>
          </NButton>

          <NButton :disabled="!currentSelection" :type="isState('underline') ? 'primary' : 'default'"
            @click="() => applyStyle('underline')">
            <NIcon>
              <IconUnderline />
            </NIcon>
          </NButton>

          <NButton :disabled="!currentSelection" :type="isState('strikeThrough') ? 'primary' : 'default'"
            @click="() => applyStyle('strikeThrough')">
            <NIcon>
              <IconStrikethrough />
            </NIcon>
          </NButton>

          <NPopselect :disabled="!isFocused" size="small"
            :value="currentSelection?.commonAncestorContainer.parentElement.tagName.toLowerCase() ?? null"
            @update:value="(value) => applyStyle('formatBlock', value)" :options="headingOptions">
            <NButton :disabled="!isFocused" :type="isState('heading') ? 'primary' : 'default'">
              <NIcon>
                <IconHeading />
              </NIcon>
            </NButton>
          </NPopselect>

          <NPopover v-if="currentSelection" v-model:show="showForeColorPicker">
            <NButton :style="{ color: foreColor }"
              @click="() => (applyStyle('foreColor', foreColor), showForeColorPicker = false)"
              :disabled="!currentSelection">
              <NIcon>
                <IconColorPicker />
              </NIcon>
            </NButton>
            <LazyRenderFieldHtmlColorPicker :modelValue="foreColor"
              @update:modelValue="(value) => applyStyle('foreColor', value)" />
          </NPopover>

          <NPopover v-if="currentSelection" v-model:show="showBackColorPicker">
            <NButton :style="{ backgroundColor: backColor }"
              @click="() => (applyStyle('backColor', foreColor), showBackColorPicker = false)"
              :disabled="!currentSelection">
              <NIcon>
                <IconHighlight />
              </NIcon>
            </NButton>
            <LazyRenderFieldHtmlColorPicker :modelValue="backColor"
              @update:modelValue="(value) => applyStyle('backColor', value)" />
          </NPopover>

          <NPopselect :disabled="!isFocused" size="small" scrollable :value="currentFontSize"
            @update:value="(value) => applyStyle('fontSize', value)" :options="fontSizeOptions">
            <NButton :disabled="!isFocused" :type="isState('fontSize') ? 'primary' : 'default'">
              <NIcon>
                <IconTextResize />
              </NIcon>
            </NButton>
          </NPopselect>
        </NButtonGroup>
        <NDivider vertical />
        <NButtonGroup size="small">
          <NButton :disabled="!isFocused" :type="isState('img') ? 'primary' : 'default'"
            @click="() => showAssetsModal = true">
            <NIcon>
              <IconUpload />
            </NIcon>
          </NButton>

          <NPopover :disabled="!isFocused"
            @update:show="(show: boolean) => { if (show) currentSelection = saveSelection(); else restoreSelection(); }">
            <template #trigger>
              <NButton :disabled="!isFocused" :type="isState('a') ? 'primary' : 'default'">
                <NIcon>
                  <IconLink />
                </NIcon>
              </NButton>
            </template>
            <NInputGroup>
              <NInput :input-props="{ type: 'url' }" size="small" v-model="aHref" />
              <NButton type="primary"
                @click="() => (restoreSelection(), applyStyle('createLink', aHref), aHref = undefined)">
                <NIcon>
                  <IconArrowRight />
                </NIcon>
              </NButton>
            </NInputGroup>
          </NPopover>

          <NButton :disabled="!isFocused" :type="isState('insertOrderedList') ? 'primary' : 'default'"
            @click="() => applyStyle('insertOrderedList')">
            <NIcon>
              <IconListNumbers />
            </NIcon>
          </NButton>

          <NButton :disabled="!isFocused" :type="isState('insertUnorderedList') ? 'primary' : 'default'"
            @click="() => applyStyle('insertUnorderedList')">
            <NIcon>
              <IconList />
            </NIcon>
          </NButton>
        </NButtonGroup>

        <NDivider vertical />

        <NButtonGroup size="small">
          <NButton :disabled="!isFocused" :type="isState('justifyLeft') ? 'primary' : 'default'"
            @click="() => applyStyle('justifyLeft')">
            <NIcon>
              <IconAlignLeft />
            </NIcon>
          </NButton>

          <NButton :disabled="!isFocused" :type="isState('justifyCenter') ? 'primary' : 'default'"
            @click="() => applyStyle('justifyCenter')">
            <NIcon>
              <IconAlignCenter />
            </NIcon>
          </NButton>

          <NButton :disabled="!isFocused" :type="isState('justifyRight') ? 'primary' : 'default'"
            @click="() => applyStyle('justifyRight')">
            <NIcon>
              <IconAlignRight />
            </NIcon>
          </NButton>
        </NButtonGroup>

        <NDivider vertical />

        <NButtonGroup size="small">
          <NButton :disabled="!isSupported('undo')" @click="() => applyStyle('undo')">
            <NIcon>
              <IconArrowBackUp />
            </NIcon>
          </NButton>

          <NButton :disabled="!isSupported('redo')" @click="() => applyStyle('redo')">
            <NIcon>
              <IconArrowForwardUp />
            </NIcon>
          </NButton>
        </NButtonGroup>

      </NFlex>
    </NScrollbar>

    <NScrollbar class="ExternalRicheditor">
      <!-- @vue-ignore -->
      <div :id class="internalRichEditor" contenteditable spellcheck="false" ref="editorDiv" @input="updateContent"
        @focusin="isFocused = true" @focusout="isFocused = false" :innerHTML="modelValue"></div>
    </NScrollbar>
  </NFlex>
</template>

<script setup lang="ts">
// TO-DO:
// replacement of execCommand: https://github.com/cihad/yaz
// using markdown instead https://github.com/jefago/tiny-markdown-editor
import {
  NButton,
  NButtonGroup,
  NRadio,
  NDrawer,
  NDrawerContent,
  NIcon,
  NPopselect,
  NScrollbar,
  NFlex,
  NPopover,
  NDivider,
  NInputGroup,
  NInput,
} from "naive-ui";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconHeading,
  IconColorPicker,
  IconHighlight,
  IconListNumbers,
  IconList,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconTextResize,
  IconUpload,
  IconLink,
  IconArrowRight,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp
} from "@tabler/icons-vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const modelValue = defineModel({
  type: String,
});

const id = randomID()

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

const showAssetsModal = ref(false);
const currentSelection = ref<Range>();
const isFocused = ref(false);
const foreColor = ref();
const backColor = ref();
const showForeColorPicker = ref(false);
const showBackColorPicker = ref(false);
const aHref = ref();
const currentHeading = ref<string>("p");

const headingOptions = [
  {
    label: () => h("h1", { style: { margin: 0 } }, "Heading 1"),
    value: "h1",
    icon: () => h(NIcon, () => h(IconH1)),
  },
  {
    label: () => h("h2", { style: { margin: 0 } }, "Heading 2"),
    value: "h2",
    icon: () => h(NIcon, () => h(IconH2)),
  },
  {
    label: () => h("h3", { style: { margin: 0 } }, "Heading 3"),
    value: "h3",
    icon: () => h(NIcon, () => h(IconH3)),
  },
  {
    label: () => h("h4", { style: { margin: 0 } }, "Heading 4"),
    value: "h4",
    icon: () => h(NIcon, () => h(IconH4)),
  },
  {
    label: () => h("h5", { style: { margin: 0 } }, "Heading 5"),
    value: "h5",
    icon: () => h(NIcon, () => h(IconH5)),
  },
  {
    label: () => h("h6", { style: { margin: 0 } }, "Heading 6"),
    value: "h6",
    icon: () => h(NIcon, () => h(IconH6)),
  },
];

const fontSizeOptions = [
  {
    label: () => h("span", { style: { fontSize: "xxx-large" } }, "Paragraph"),
    value: 7,
  },
  {
    label: () => h("span", { style: { fontSize: "xx-large" } }, "Paragraph"),
    value: 6,
  },
  {
    label: () => h("span", { style: { fontSize: "x-large" } }, "Paragraph"),
    value: 5,
  },
  {
    label: () => h("span", { style: { fontSize: "large" } }, "Paragraph"),
    value: 4,
  },
  {
    label: () => h("span", { style: { fontSize: "medium" } }, "Paragraph"),
    value: 3,
  },
  {
    label: () => h("span", { style: { fontSize: "small" } }, "Paragraph"),
    value: 2,
  },
  {
    label: () => h("span", { style: { fontSize: "x-small" } }, "Paragraph"),
    value: 1,
  },
];
const currentFontSize = computed(() =>
  currentSelection.value
    ? {
      "xxx-large": 7,
      "xx-large": 6,
      "x-large": 5,
      large: 4,
      medium: 3,
      small: 2,
      "x-small": 1,
    }[
    currentSelection.value.commonAncestorContainer.parentElement.style
      .fontSize
    ]
    : null,
);

function isState(state: string) {
  switch (state) {
    case "heading":
      return (
        currentSelection.value?.commonAncestorContainer.parentElement.tagName
          .toLowerCase()
          .charAt(0) === "h"
      );
    case "a":
    case "img":
      return (
        currentSelection.value.commonAncestorContainer.parentElement.tagName.toLowerCase() ===
        state
      );
    default:
      return document.queryCommandState(state);
  }
}

function isSupported(command: string) {
  return document.queryCommandEnabled(command)
}

function applyStyle(name: string, value?: string) {
  if (value) document.execCommand(name, false, value);
  else document.execCommand(name);
}

const saveSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    currentSelection.value = selection.getRangeAt(0);
  }
};

const restoreSelection = () => {
  if (currentSelection.value) {
    if (window.getSelection) window?.getSelection()?.removeAllRanges();
    window?.getSelection()?.addRange(currentSelection.value);
  }
};

const updateContent = (event: InputEvent) => {
  modelValue.value = (event.target as HTMLElement).innerHTML;
};
</script>

<style scoped>
.ExternalRicheditor {
  max-height: 250px;
}

.internalRichEditor {
  min-height: 100px;
  outline: 0px solid transparent;
}
</style>