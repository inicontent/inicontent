<template>
    <NTime style="cursor: pointer;" @click="isRelative = !isRelative" :time="Number(value)"
        :type="isRelative ? 'relative' : 'date'">
        {{ value }}
    </NTime>
</template>

<script lang="ts" setup>
import { NTime } from 'naive-ui';

const isRelative = useState("isRelative", () => false)

defineProps({
    value: {
        type: Number,
        required: true
    }
})
</script>