<template>
    <NIconWrapper :color="value === true ? undefined : '#D32F2F'" :border-radius="50" :size="18">
        <NIcon size="16">
            <Icon name="tabler:check" v-if="value === true" />
            <Icon name="tabler:x" v-else />
        </NIcon>
    </NIconWrapper>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: boolean }>()
</script>