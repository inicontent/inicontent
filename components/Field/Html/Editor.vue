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
              <Icon name="tabler:bold" />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().toggleItalic().run()"
            :disabled="!editor?.can().chain().focus().toggleItalic().run()"
            :type="editor?.isActive('italic') ? 'primary' : 'default'">
            <NIcon>
              <Icon name="tabler:italic" />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().toggleUnderline().run()"
            :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
            :type="editor?.isActive('underline') ? 'primary' : 'default'">
            <NIcon>
              <Icon name="tabler:underline" />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive('strike') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleStrike().run()"
            :disabled="!editor?.can().chain().focus().toggleStrike().run()">
            <NIcon>
              <Icon name="tabler:strikethrough" />
            </NIcon>
          </NButton>

          <NPopselect :disabled="!editor?.can().chain().focus().toggleHeading({ level: 1 }).run()" size="small"
            :render-label="renderHeadingOption" :value="editor?.getAttributes('heading').level"
            @update:value="(value) => editor?.chain().focus().toggleHeading({ level: value }).run()"
            :options="headingOptions">
            <NButton :type="editor?.isActive('heading') ? 'primary' : 'default'">
              <NIcon>
                <Icon name="tabler:heading" />
              </NIcon>
            </NButton>
          </NPopselect>

          <NPopselect size="small" scrollable :render-label="renderFontSizeOption"
            :value="editor?.getAttributes('font-size').size?.replace('px', '')"
            @update:value="(value: string) => editor?.chain().focus().setFontSize(value).run()"
            :options="fontSizeOptions">
            <NButton @click="editor?.chain().focus().unsetFontSize().run()">
              <NIcon>
                <Icon name="tabler:text-size" />
              </NIcon>
            </NButton>
          </NPopselect>

          <NPopover>
            <template #trigger>
              <NButton :style="{ color: fontColor }"
                :disabled="!editor?.can().chain().focus().setColor('#ff9800').run()">
                <NIcon>
                  <Icon name="tabler:color-picker" />
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
                  <Icon name="tabler:highlight" />
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
              <Icon name="tabler:upload" />
            </NIcon>
          </NButton>

          <!-- TO-DO: Fix URL -->
          <NPopover @update:show="(show: boolean) => {
            if (show) url = editor?.getAttributes('link').href
            else url = undefined
          }">
            <template #trigger>
              <NButton :type="editor?.isActive('link') ? 'primary' : 'default'">
                <NIcon>
                  <Icon name="tabler:link" />
                </NIcon>
              </NButton>
            </template>
            <NFlex :reverse="Language === 'ar'" :wrap="false">
              <NInput :input-props="{ type: 'url' }" size="small" v-model="url" />
              <NButtonGroup>
                <NButton :type="'error'" @click="editor?.chain().focus().unsetLink().run()"
                  :disabled="!editor?.isActive('link')">
                  <NIcon>
                    <Icon name="tabler:link-off" />
                  </NIcon>
                </NButton>
                <NButton type="primary" @click="setLink">
                  <NIcon>
                    <Icon name="tabler:arrow-right" />
                  </NIcon>
                </NButton>
              </NButtonGroup>
            </NFlex>
          </NPopover>

          <NButton :type="editor?.isActive('bulletList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleBulletList().run()">
            <NIcon>
              <Icon name="tabler:list-numbers" />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive('orderedList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleOrderedList().run()">
            <NIcon>
              <Icon name="tabler:list" />
            </NIcon>
          </NButton>

        </NButtonGroup>


        <NDivider vertical />


        <NButtonGroup size="small">

          <NButton :type="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('left').run()">
            <NIcon>
              <Icon name="tabler:align-left" />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('center').run()">
            <NIcon>
              <Icon name="tabler:align-center" />
            </NIcon>
          </NButton>

          <NButton :type="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('right').run()">
            <NIcon>
              <Icon name="tabler:align-right" />
            </NIcon>
          </NButton>


          <NButton :type="editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('justify').run()">
            <NIcon>
              <Icon name="tabler:align-justified" />
            </NIcon>
          </NButton>



          <NButton
            :type="editor?.isActive({ textAlign: 'left' }) || editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' }) || editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().unsetTextAlign().run()">
            <NIcon>
              <Icon name="tabler:text-wrap" />
            </NIcon>
          </NButton>

        </NButtonGroup>

        <NDivider vertical />


        <NButtonGroup size="small">
          <NButton @click="editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
            <NIcon>
              <Icon name="tabler:table-plus" />
            </NIcon>
          </NButton>
          <template
            v-if="editor?.isActive('table') || editor?.isActive('tableCell') || editor?.isActive('tableHeader') || editor?.isActive('tableRow')">
            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().deleteTable().run()">
                  <NIcon>
                    <Icon name="tabler:table-minus" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('deleteTable') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().addColumnAfter().run()">
                  <NIcon>
                    <Icon name="tabler:column-insert-right" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('addColumnAfter') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().addColumnBefore().run()">
                  <NIcon>
                    <Icon name="tabler:column-insert-left" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('addColumnBefore') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().deleteColumn().run()">
                  <NIcon>
                    <Icon name="tabler:column-remove" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('deleteColumn') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().addRowBefore().run()">
                  <NIcon>
                    <Icon name="tabler:row-insert-top" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('addRowBefore') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().addColumnBefore().run()">
                  <NIcon>
                    <Icon name="tabler:column-insert-left" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('addColumnBefore') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().addRowAfter().run()">
                  <NIcon>
                    <Icon name="tabler:row-insert-bottom" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('addRowAfter') }}
            </NTooltip>

            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().deleteRow().run()">
                  <NIcon>
                    <Icon name="tabler:row-remove" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('deleteRow') }}
            </NTooltip>


            <NTooltip>
              <template #trigger>
                <NButton @click="editor?.chain().focus().mergeCells().run()">
                  <NIcon>
                    <Icon name="tabler:table-row" />
                  </NIcon>
                </NButton>
              </template>
              {{ t('mergeCells') }}
            </NTooltip>

          </template>
        </NButtonGroup>

        <NDivider vertical />

        <NButtonGroup size="small">
          <NButton @click="editor?.chain().focus().undo().run()"
            :disabled="!editor?.can().chain().focus().undo().run()">
            <NIcon>
              <Icon name="tabler:arrow-back-up" />
            </NIcon>
          </NButton>

          <NButton @click="editor?.chain().focus().redo().run()"
            :disabled="!editor?.can().chain().focus().redo().run()">
            <NIcon>
              <Icon name="tabler:arrow-forward-up" />
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
import TiptapTextStyle from "@tiptap/extension-text-style"
import { Color as TiptapColor } from "@tiptap/extension-color"
import TiptapHighlight from "@tiptap/extension-highlight"
import TiptapUnderline from "@tiptap/extension-underline"
import TiptapTextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"

const modelValue = defineModel<string>()

const showAssetsModal = ref(false)
const fontColor = ref()
const fontBgColor = ref()
const url = ref()

function renderHeadingOption({ value }: { value: number }) {
	return h(`h${value}`, { style: { margin: 0 } }, `Heading ${value}`)
}

const Language = useCookie<LanguagesType>("language", { sameSite: true })

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
]

function renderFontSizeOption({ value }: { value: number }) {
	return h("span", { style: { fontSize: `${value}px` } }, "Paragraph")
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
]

function setLink() {
	// cancelled
	if (url.value === null) {
		return
	}

	// empty
	if (url.value === "") {
		editor.value?.chain().focus().extendMarkRange("link").unsetLink().run()

		return
	}

	// update link
	editor.value
		?.chain()
		.focus()
		.extendMarkRange("link")
		.setLink({ href: url.value })
		.run()
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		fontSize: {
			/**
			 * Set the font size
			 */
			setFontSize: (size: string) => ReturnType
			/**
			 * Unset the font size
			 */
			unsetFontSize: () => ReturnType
		}
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
						return {}
					}
					return {
						style: `font-size: ${attributes.fontSize}px`,
					}
				},
			},
		}
	},

	addCommands() {
		return {
			...this.parent?.(),
			setFontSize:
				(fontSize) =>
				({ commands }) => {
					return commands.setMark(this.name, { fontSize: fontSize })
				},
			unsetFontSize:
				() =>
				({ chain }) => {
					return chain()
						.setMark(this.name, { fontSize: null })
						.removeEmptyTextStyle()
						.run()
				},
		}
	},
})

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
		Link,
		Table.configure({
			resizable: true,
		}),
		TableRow,
		TableHeader,
		TableCell,
	],
	onUpdate: ({ editor }) => {
		const content = editor.getHTML()
		modelValue.value = content
	},
})

onBeforeUnmount(() => {
	unref(editor)?.destroy()
})
</script>