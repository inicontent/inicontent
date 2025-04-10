<template>
    <NTooltip v-if="!isRelativeDateNotifShown" trigger="hover"
        @update:show="(show) => !show ? isRelativeDateNotifShown = true : ''" :delay="500">
        <template #trigger>
            <NTime style="cursor: pointer;" @contextmenu.prevent="isRelative = !isRelative" :time="Number(value)"
                :type="isRelative ? 'relative' : 'date'">
                {{ value }}
            </NTime>
        </template>
        {{ t('rightClickToToggleDate') }}
    </NTooltip>
    <NTime v-else style="cursor: pointer;" @contextmenu.prevent="isRelative = !isRelative" :time="Number(value)"
        :type="isRelative ? 'relative' : 'date'">
        {{ value }}
    </NTime>
</template>

<script lang="ts" setup>
import { NTime, NTooltip } from "naive-ui";

const isRelative = useState("isRelative", () => false);
const isRelativeDateNotifShown = useState(
	"isRelativeDateNotifShown",
	() => false,
);
const { value } = defineProps<{ value?: number }>();

defineTranslation({
	ar: {
		rightClickToToggleDate: "انقر بزر الماوس الأيمن لتغيير طريقة عرض التاريخ",
	},
});
</script>