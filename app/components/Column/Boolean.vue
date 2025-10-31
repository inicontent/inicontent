<template>
    <div class="inline-flex items-center justify-center" :color="value === true ? undefined : '#D32F2F'" :border-radius="50" :size="18">
        <span size="16">
            <Icon name="tabler:check" v-if="value === true" />
            <Icon name="tabler:x" v-else />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: boolean }>()
</script>