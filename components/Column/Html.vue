<template>
    <NButton circle @click="showModal = true" :disabled="!value || value.length < 8" size="small"
        @mouseover="buttonHovered = true" @mouseout="buttonHovered = false">
        <template #icon>
            <NIcon>
                <Icon name="tabler:zoom-in" v-if="buttonHovered" />
                <Icon name="tabler:brackets-angle" v-else />
            </NIcon>
        </template>
    </NButton>
    <NModal v-model:show="showModal" preset="card">
        <div v-html="value?.replaceAll('<img ', '<img style=\'width:100%\'') || ''"></div>
    </NModal>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value?: string }>()
const showModal = ref(false)
const buttonHovered = ref(false)
</script>