<template>
    <NTooltip :delay="isRelativeDateNotifShown ? 2500 : 500" trigger="hover"
        @update:show="(show) => !show ? isRelativeDateNotifShown = true : ''">
        <template #trigger>
            <NTime v-if="timeValue !== undefined" style="cursor: pointer;" @click.prevent="isRelative = !isRelative"
                :time="timeValue" :type="isRelative ? 'relative' : absoluteType">
                {{ value }}
            </NTime>
            <NText v-else :depth="3">{{ value }}</NText>
        </template>
        {{ t('clickToToggleDate') }}
    </NTooltip>
</template>

<script lang="ts" setup>
const datetimeFieldTypes = ["datetime", "datetimerange"]

const isRelative = useState("isRelative", () => false)
const isRelativeDateNotifShown = useState(
    "isRelativeDateNotifShown",
    () => false,
)
const { value, field } = defineProps<{ value?: number | string | Date; field?: Field }>()

const timeValue = computed<number | undefined>(() => {
    if (value === null || value === undefined) return undefined

    if (value instanceof Date) {
        const ms = value.getTime()
        return Number.isNaN(ms) ? undefined : ms
    }

    if (typeof value === "number")
        return Number.isNaN(value) ? undefined : value

    if (typeof value === "string") {
        const trimmed = value.trim()
        if (!trimmed) return undefined

        const numericValue = Number(trimmed)
        if (!Number.isNaN(numericValue)) return numericValue

        const parsedMs = Date.parse(trimmed)
        return Number.isNaN(parsedMs) ? undefined : parsedMs
    }

    return undefined
})

const hasTime = computed(() => {
    return !!field?.date && datetimeFieldTypes.includes(field.date)
})

const absoluteType = computed<"date" | "datetime">(() =>
    hasTime.value ? "datetime" : "date",
)
</script>