<template>
  <USlideover v-model:show="showAssetsModal" defaultHeight="50%" placement="bottom" resizable>
    <USlideoverContent id="assetsModal" :nativeScrollbar="false" :bodyContentStyle="{ padding: 0 }">
      <AssetCard targetID="assetsModal">
        <template v-slot="{ asset }">
          <URadio v-if="asset.type !== 'dir'"
            @update:checked="(editor?.chain().focus().setImage({ src: asset.publicURL }).run(), showAssetsModal = false)" />
        </template>
      </AssetCard>
    </div>
  </USlideover>

  <div class="flex" class="richEditorWrapper" vertical style="width: 100%">
    <div class="overflow-auto" x-scrollable>
      <div class="flex" :wrap="false" align="center">
        <UButtonGroup size="small">
          <UButton @click="editor?.chain().focus().toggleBold().run()"
            :disabled="!editor?.can().chain().focus().toggleBold().run()"
            :type="editor?.isActive('bold') ? 'primary' : 'default'">
            <div class="inline-block">
              <Icon name="tabler:bold" />
            </div>
          </UButton>

          <UButton @click="editor?.chain().focus().toggleItalic().run()"
            :disabled="!editor?.can().chain().focus().toggleItalic().run()"
            :type="editor?.isActive('italic') ? 'primary' : 'default'">
            <div class="inline-block">
              <Icon name="tabler:italic" />
            </div>
          </UButton>

          <UButton @click="editor?.chain().focus().toggleUnderline().run()"
            :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
            :type="editor?.isActive('underline') ? 'primary' : 'default'">
            <div class="inline-block">
              <Icon name="tabler:underline" />
            </div>
          </UButton>

          <UButton :type="editor?.isActive('strike') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleStrike().run()"
            :disabled="!editor?.can().chain().focus().toggleStrike().run()">
            <div class="inline-block">
              <Icon name="tabler:strikethrough" />
            </div>
          </UButton>

          <UPopover :disabled="!editor?.can().chain().focus().toggleHeading({ level: 1 }).run()" size="small"
            :render-label="renderHeadingOption" :value="editor?.getAttributes('heading').level"
            @update:value="(value) => editor?.chain().focus().toggleHeading({ level: value }).run()"
            :options="headingOptions">
            <UButton :type="editor?.isActive('heading') ? 'primary' : 'default'">
              <div class="inline-block">
                <Icon name="tabler:heading" />
              </div>
            </UButton>
          </UPopover>

          <UPopover size="small" scrollable :render-label="renderFontSizeOption"
            :value="editor?.getAttributes('font-size').size?.replace('px', '')"
            @update:value="(value: string) => editor?.chain().focus().setFontSize(value).run()"
            :options="fontSizeOptions">
            <UButton @click="editor?.chain().focus().unsetFontSize().run()">
              <div class="inline-block">
                <Icon name="tabler:text-size" />
              </div>
            </UButton>
          </UPopover>

          <UPopover>
            <template #trigger>
              <UButton :style="{ color: fontColor }"
                :disabled="!editor?.can().chain().focus().setColor('#ff9800').run()">
                <div class="inline-block">
                  <Icon name="tabler:color-picker" />
                </div>
              </UButton>
            </template>
            <LazyFieldHtmlColorPicker :modelValue="fontColor"
              @update:modelValue="(value) => (fontColor = value, editor?.chain().focus().setColor(value).run())" />
          </UPopover>

          <UPopover>
            <template #trigger>
              <UButton @click="editor?.chain().focus().toggleHighlight().run()" :style="{ color: fontBgColor }">
                <div class="inline-block">
                  <Icon name="tabler:highlight" />
                </div>
              </UButton>
            </template>
            <LazyFieldHtmlColorPicker :modelValue="fontBgColor"
              @update:modelValue="(value) => (fontBgColor = value, editor?.chain().focus().toggleHighlight({ color: value }).run())" />
          </UPopover>

        </div>


        <UDivider vertical />


        <UButtonGroup size="small">

          <UButton @click="showAssetsModal = true">
            <div class="inline-block">
              <Icon name="tabler:upload" />
            </div>
          </UButton>

          <!-- TO-DO: Fix URL -->
          <UPopover @update:show="(show: boolean) => {
            if (show) url = editor?.getAttributes('link').href
            else url = undefined
          }">
            <template #trigger>
              <UButton :type="editor?.isActive('link') ? 'primary' : 'default'">
                <div class="inline-block">
                  <Icon name="tabler:link" />
                </div>
              </UButton>
            </template>
            <div class="flex" :reverse="Language === 'ar'" :wrap="false">
              <UInput :input-props="{ type: 'url' }" size="small" v-model="url" />
              <UButtonGroup>
                <UButton :type="'error'" @click="editor?.chain().focus().unsetLink().run()"
                  :disabled="!editor?.isActive('link')">
                  <div class="inline-block">
                    <Icon name="tabler:link-off" />
                  </div>
                </UButton>
                <UButton type="primary" @click="setLink">
                  <div class="inline-block">
                    <Icon name="tabler:arrow-right" />
                  </div>
                </UButton>
              </div>
            </div>
          </UPopover>

          <UButton :type="editor?.isActive('bulletList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleBulletList().run()">
            <div class="inline-block">
              <Icon name="tabler:list-numbers" />
            </div>
          </UButton>

          <UButton :type="editor?.isActive('orderedList') ? 'primary' : 'default'"
            @click="editor?.chain().focus().toggleOrderedList().run()">
            <div class="inline-block">
              <Icon name="tabler:list" />
            </div>
          </UButton>

        </div>


        <UDivider vertical />


        <UButtonGroup size="small">

          <UButton :type="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('left').run()">
            <div class="inline-block">
              <Icon name="tabler:align-left" />
            </div>
          </UButton>

          <UButton :type="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('center').run()">
            <div class="inline-block">
              <Icon name="tabler:align-center" />
            </div>
          </UButton>

          <UButton :type="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('right').run()">
            <div class="inline-block">
              <Icon name="tabler:align-right" />
            </div>
          </UButton>


          <UButton :type="editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().setTextAlign('justify').run()">
            <div class="inline-block">
              <Icon name="tabler:align-justified" />
            </div>
          </UButton>



          <UButton
            :type="editor?.isActive({ textAlign: 'left' }) || editor?.isActive({ textAlign: 'center' }) || editor?.isActive({ textAlign: 'right' }) || editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
            @click="editor?.chain().focus().unsetTextAlign().run()">
            <div class="inline-block">
              <Icon name="tabler:text-wrap" />
            </div>
          </UButton>

        </div>

        <UDivider vertical />


        <UButtonGroup size="small">
          <UButton @click="editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
            <div class="inline-block">
              <Icon name="tabler:table-plus" />
            </div>
          </UButton>
          <template
            v-if="editor?.isActive('table') || editor?.isActive('tableCell') || editor?.isActive('tableHeader') || editor?.isActive('tableRow')">
            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().deleteTable().run()">
                  <div class="inline-block">
                    <Icon name="tabler:table-minus" />
                  </div>
                </UButton>
              </template>
              {{ t('deleteTable') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().addColumnAfter().run()">
                  <div class="inline-block">
                    <Icon name="tabler:column-insert-right" />
                  </div>
                </UButton>
              </template>
              {{ t('addColumnAfter') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().addColumnBefore().run()">
                  <div class="inline-block">
                    <Icon name="tabler:column-insert-left" />
                  </div>
                </UButton>
              </template>
              {{ t('addColumnBefore') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().deleteColumn().run()">
                  <div class="inline-block">
                    <Icon name="tabler:column-remove" />
                  </div>
                </UButton>
              </template>
              {{ t('deleteColumn') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().addRowBefore().run()">
                  <div class="inline-block">
                    <Icon name="tabler:row-insert-top" />
                  </div>
                </UButton>
              </template>
              {{ t('addRowBefore') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().addColumnBefore().run()">
                  <div class="inline-block">
                    <Icon name="tabler:column-insert-left" />
                  </div>
                </UButton>
              </template>
              {{ t('addColumnBefore') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().addRowAfter().run()">
                  <div class="inline-block">
                    <Icon name="tabler:row-insert-bottom" />
                  </div>
                </UButton>
              </template>
              {{ t('addRowAfter') }}
            </UTooltip>

            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().deleteRow().run()">
                  <div class="inline-block">
                    <Icon name="tabler:row-remove" />
                  </div>
                </UButton>
              </template>
              {{ t('deleteRow') }}
            </UTooltip>


            <UTooltip>
              <template #trigger>
                <UButton @click="editor?.chain().focus().mergeCells().run()">
                  <div class="inline-block">
                    <Icon name="tabler:table-row" />
                  </div>
                </UButton>
              </template>
              {{ t('mergeCells') }}
            </UTooltip>

          </template>
        </div>

        <UDivider vertical />

        <UButtonGroup size="small">
          <UButton @click="editor?.chain().focus().undo().run()"
            :disabled="!editor?.can().chain().focus().undo().run()">
            <div class="inline-block">
              <Icon name="tabler:arrow-back-up" />
            </div>
          </UButton>

          <UButton @click="editor?.chain().focus().redo().run()"
            :disabled="!editor?.can().chain().focus().redo().run()">
            <div class="inline-block">
              <Icon name="tabler:arrow-forward-up" />
            </div>
          </UButton>
        </div>

      </div>
    </div>

    <div class="overflow-auto" class="externalRichEditor">
      <TiptapEditorContent class="internalRichEditor" :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color as TiptapColor } from "@tiptap/extension-color"
import TiptapHighlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TiptapTextAlign from "@tiptap/extension-text-align"
import TiptapTextStyle from "@tiptap/extension-text-style"
import TiptapUnderline from "@tiptap/extension-underline"

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