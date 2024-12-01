<template>
  <NDrawer v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
    <NDrawerContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
      <AssetCard targetID="assetsModal">
        <template v-slot="{ asset }">
          <NRadio v-if="asset.type !== 'dir'"
            @update:checked="(editor?.chain().focus().setImage({ src: asset.publicURL }).run(), showAssetsModal = false)" />
        </template>
      </AssetCard>
    </NDrawerContent>
  </NDrawer>

  <NFlex class="richEditorWrapper" vertical style="width: 100%">
    <NScrollbar x-scrollable>
      <NFlex :wrap="false" align="center">
        <NButtonGroup size="small">
          <NButton @click="editor?.chain().focus().toggleBold().run()"
            :disabled="!editor?.can().chain().focus().toggleBold().run()"
            :type="editor?.isActive('bold') ? 'primary' : 'default'">
            <NIcon>
              <IconBold />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().toggleItalic().run()"
            :disabled="!editor?.can().chain().focus().toggleItalic().run()"
            :type="editor?.isActive('italic') ? 'primary' : 'default'">
            <NIcon>
              <IconItalic />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().toggleUnderline().run()"
            :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
            :type="editor?.isActive('underline') ? 'primary' : 'default'">
            <NIcon>
              <IconUnderline />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive('strike') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleStrike().run()"
            :disabled="!editor?.can().chain().focus().toggleStrike().run()">
            <NIcon>
              <IconStrikethrough />
            </NIcon>
          </NButton>

          <NPopselect :disabled="!editor?.can().chain().focus().toggleHeading({ level: 1 }).run()" size="small"
            :render-label="renderHeadingOption" :value="editor?.getAttributes('heading').level"
            @update:value="(value) => editor?.chain().focus().toggleHeading({ level: value }).run()"
            :options="headingOptions">
            <NButton :type="editor?.isActive('heading') ? 'primary' : 'default'">
              <NIcon>
                <IconHeading />
              </NIcon>
            </NButton>
          </NPopselect>

          <NPopselect size="small" scrollable :render-label="renderFontSizeOption"
            :value="editor?.getAttributes('font-size').size?.replace('px', '')"
            @update:value="(value: string) => editor?.chain().focus().setFontSize(value).run()"
            :options="fontSizeOptions">
            <NButton @click="editor?.chain().focus().unsetFontSize().run()">
              <NIcon>
                <IconTextSize />
              </NIcon>
            </NButton>
          </NPopselect>

          <NPopover>
            <template #trigger>
              <NButton :style="{ color: fontColor }"
                :disabled="!editor?.can().chain().focus().setColor('#ff9800').run()">
                <NIcon>
                  <IconColorPicker />
                </NIcon>
              </NButton>
            </template>
            <LazyFieldHtmlColorPicker :modelValue="fontColor"
              @update:modelValue="(value) => (fontColor = value, editor?.chain().focus().setColor(value).run())" />
          </NPopover>

          <NPopover>
            <template #trigger>
              <NButton @click="editor?.chain().focus().toggleHighlight().run()" :style="{ color: fontBgColor }">
                <NIcon>
                  <IconHighlight />
                </NIcon>
              </NButton>
            </template>
            <LazyFieldHtmlColorPicker :modelValue="fontBgColor"
              @update:modelValue="(value) => (fontBgColor = value, editor?.chain().focus().toggleHighlight({ color: value }).run())" />
          </NPopover>

        </NButtonGroup>


        <NDivider vertical />


        <NButtonGroup size="small">

          <NButton @click="showAssetsModal = true">
            <NIcon>
              <IconUpload />
            </NIcon>
          </NButton>

          <NPopover @update:show="(show: boolean) => {
            if (show) url = editor?.getAttributes('link').href
            else url = undefined
          }">
            <template #trigger>
              <NButton :type="editor?.isActive('link') ? 'primary' : 'default'">
                <NIcon>
                  <IconLink />
                </NIcon>
              </NButton>
            </template>
            <NInputGroup>
              <NInput :input-props="{ type: 'url' }" size="small" v-model="url" />
              <NButton :type="editor?.isActive('link') ? 'error' : 'default'"
                @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor?.isActive('link')">
                <NIcon>
                  <IconLinkOff />
                </NIcon>
              </NButton>
              <NButton type="primary" @click="setLink">
                <NIcon>
                  <IconArrowRight />
                </NIcon>
              </NButton>
            </NInputGroup>
          </NPopover>

          <NButton :type="editor?.isActive('bulletList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleBulletList().run()">
            <NIcon>
              <IconListNumbers />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive('orderedList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleOrderedList().run()">
            <NIcon>
              <IconList />
            </NIcon>
          </NButton>

        </NButtonGroup>


        <NDivider vertical />


        <NButtonGroup size="small">

          <NButton :type="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('left').run()">
            <NIcon>
              <IconAlignLeft />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('center').run()">
            <NIcon>
              <IconAlignCenter />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('right').run()">
            <NIcon>
              <IconAlignRight />
            </NIcon>
          </NButton>


          <NButton :type="editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('justify').run()">
            <NIcon>
              <IconAlignJustified />
            </NIcon>
          </NButton>



          <NButton
            :type="editor?.isActive({ textAlign: 'left' }) || editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' }) || editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().unsetTextAlign().run()">
            <NIcon>
              <IconTextWrap />
            </NIcon>
          </NButton>

        </NButtonGroup>

        <NDivider vertical />

        <NButtonGroup size="small">
          <NButton @click="editor?.chain().focus().undo().run()"
            :disabled="!editor?.can().chain().focus().undo().run()">
            <NIcon>
              <IconArrowBackUp />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().redo().run()"
            :disabled="!editor?.can().chain().focus().redo().run()">
            <NIcon>
              <IconArrowForwardUp />
            </NIcon>
          </NButton>
        </NButtonGroup>

      </NFlex>
    </NScrollbar>

    <NScrollbar class="externalRichEditor">
      <TiptapEditorContent class="internalRichEditor" :editor="editor" />
    </NScrollbar>
  </NFlex>
</template>

<script setup lang="ts">
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
	IconTextSize,
	IconUpload,
	IconLink,
	IconArrowRight,
	IconAlignLeft,
	IconAlignCenter,
	IconAlignRight,
	IconArrowBackUp,
	IconArrowForwardUp,
	IconLinkOff,
	IconAlignJustified,
	IconTextWrap,
} from "@tabler/icons-vue";
import TiptapTextStyle from "@tiptap/extension-text-style";
import { Color as TiptapColor } from "@tiptap/extension-color";
import TiptapHighlight from "@tiptap/extension-highlight";
import TiptapUnderline from "@tiptap/extension-underline";
import TiptapTextAlign from "@tiptap/extension-text-align";

const modelValue = defineModel<string>();

const showAssetsModal = ref(false);
const fontColor = ref();
const fontBgColor = ref();
const url = ref();

function renderHeadingOption({ value }: { value: number }) {
	return h(`h${value}`, { style: { margin: 0 } }, `Heading ${value}`);
}

const headingOptions = [
	{
		value: 1,
	},
	{
		value: 2,
	},
	{
		value: 3,
	},
	{
		value: 4,
	},
	{
		value: 5,
	},
	{
		value: 6,
	},
];

function renderFontSizeOption({ value }: { value: number }) {
	return h("span", { style: { fontSize: `${value}px` } }, "Paragraph");
}

const fontSizeOptions = [
	{
		value: 8,
	},
	{
		value: 10,
	},
	{
		value: 12,
	},
	{
		value: 14,
	},
	{
		value: 16,
	},
	{
		value: 18,
	},
	{
		value: 20,
	},
	{
		value: 24,
	},
	{
		value: 30,
	},
	{
		value: 48,
	},
	{
		value: 60,
	},
	{
		value: 72,
	},
];

function setLink() {
	// cancelled
	if (url.value === null) {
		return;
	}

	// empty
	if (url.value === "") {
		editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();

		return;
	}

	// update link
	editor.value
		?.chain()
		.focus()
		.extendMarkRange("link")
		.setLink({ href: url.value })
		.run();
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		fontSize: {
			/**
			 * Set the font size
			 */
			setFontSize: (size: string) => ReturnType;
			/**
			 * Unset the font size
			 */
			unsetFontSize: () => ReturnType;
		};
	}
}

const TextStyleExtended = TiptapTextStyle.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			fontSize: {
				default: null,
				parseHTML: (element) => element.style.fontSize.replace("px", ""),
				renderHTML: (attributes) => {
					if (!attributes.fontSize) {
						return {};
					}
					return {
						style: `font-size: ${attributes.fontSize}px`,
					};
				},
			},
		};
	},

	addCommands() {
		return {
			...this.parent?.(),
			setFontSize:
				(fontSize) =>
				({ commands }) => {
					return commands.setMark(this.name, { fontSize: fontSize });
				},
			unsetFontSize:
				() =>
				({ chain }) => {
					return chain()
						.setMark(this.name, { fontSize: null })
						.removeEmptyTextStyle()
						.run();
				},
		};
	},
});

const editor = useEditor({
	content: modelValue.value,
	extensions: [
		TiptapStarterKit,
		TiptapImage,
		TiptapColor,
		TextStyleExtended,
		TiptapHighlight,
		TiptapUnderline,
		TiptapTextAlign,
	],
	onUpdate: ({ editor }) => {
		const content = editor.getHTML();
		modelValue.value = content;
	},
});

onBeforeUnmount(() => {
	unref(editor)?.destroy();
});

const primaryColor = useState<ThemeConfig>("ThemeConfig").value.primaryColor;
</script>

<style>
.ProseMirror-focused,
.ProseMirror:focus {
  outline: none;
}

.externalRichEditor {
  max-height: 250px;
  border-radius: 3px;
  background-color: transparent;
  border: 1px solid rgb(224, 224, 230);
  transition: all .3s cubic-bezier(.4, 0, .2, 1);

}

.ProseMirror,
.internalRichEditor {
  min-height: 100px;
}

.internalRichEditor {
  min-height: 100px;
  padding: 15px;
  width: 100%;
}

.externalRichEditor:hover,
.externalRichEditor:focus {
  border-color: v-bind(primaryColor);
}

.dark .externalRichEditor {
  border-color: transparent;
  background-color: rgba(255, 255, 255, 0.1);
  resize: vertical;
}
</style>