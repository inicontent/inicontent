<template>
    <UButton circle @click="showModal = true" :disabled="!value || value.length < 8" size="small"
        @mouseover="buttonHovered = true" @mouseout="buttonHovered = false">
        <template #icon>
            <div class="inline-block">
                <Icon name="tabler:zoom-in" v-if="buttonHovered" />
                <Icon name="tabler:brackets-angle" v-else />
            </div>
        </template>
    </UButton>
    <UModal v-model:show="showModal" :title="t(field.key)" draggable preset="card" style="width: 600px;">
        <div v-html="value?.replaceAll('<img ', '<img style=\'width:100%\'') || ''"></div>
    </UModal>
</template>

<script lang="ts" setup>
const { field, value } = defineProps<{ field: Field; value?: string }>()
const showModal = ref(false)
const buttonHovered = ref(false)
</script>