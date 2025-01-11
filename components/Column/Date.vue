<template>
    <NTooltip trigger="hover" :delay="500">
        <template #trigger>
            <NTime style="cursor: pointer;" @click="isRelative = !isRelative" :time="Number(value)"
                :type="isRelative ? 'relative' : 'date'">
                {{ value }}
            </NTime>
        </template>
        {{ t('clickToToggleDate') }}
    </NTooltip>
</template>

<script lang="ts" setup>
import { NTime, NTooltip } from "naive-ui";

const isRelative = useState("isRelative", () => false);

const { value } = defineProps<{ value?: number }>();

defineTranslation({
	ar: {
		clickToToggleDate: "إضغط لتغيير طريقة عرض التاريخ",
	},
});
</script>