<template>
    <div v-if="data" v-html="data"></div>
</template>
<script setup lang="ts">
const { value } = defineProps<{ value: string }>()
const { data } = await useLazyAsyncData(`icon-${value}`, () => $fetch<Blob>(`https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/${value}.svg`),
    {
        transform: async (res) => {
            return await res.text()
        },
    }
)
</script>