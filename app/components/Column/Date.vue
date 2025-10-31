<template>
    <UTooltip :delay="isRelativeDateNotifShown ? 2500 : 500" trigger="hover"
        @update:show="(show) => !show ? isRelativeDateNotifShown = true : ''">
        <template #trigger>
            <time style="cursor: pointer;" @click.prevent="isRelative = !isRelative" :time="Number(value)"
                :type="isRelative ? 'relative' : 'date'">
                {{ value }}
            </time>
        </template>
        {{ t('clickToToggleDate') }}
    </UTooltip>
</template>

<script lang="ts" setup>
const isRelative = useState("isRelative", () => false)
const isRelativeDateNotifShown = useState(
	"isRelativeDateNotifShown",
	() => false,
)
const { value } = defineProps<{ value?: number }>()

defineTranslation({
	ar: {
		clickToToggleDate: "انقر بزر الماوس الأيمن لتغيير طريقة عرض التاريخ",
	},
})
</script>