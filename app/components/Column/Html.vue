<template>
    <NButton circle @click="showModal = true" :disabled="!valueRef || valueRef.length < 8" size="small"
        @mouseover="buttonHovered = true" @mouseout="buttonHovered = false">
        <template #icon>
            <NIcon>
                <Icon name="tabler:zoom-in" v-if="buttonHovered" />
                <Icon name="tabler:brackets-angle" v-else />
            </NIcon>
        </template>
    </NButton>
    <NModal v-model:show="showModal" :title="modalTitle" draggable preset="card" style="width: 600px;">
        <div v-html="valueRef?.replaceAll('<img ', '<img style=\'width:100%\'') || ''"></div>
    </NModal>
</template>

<script lang="ts" setup>
const props = defineProps<{ field: Field; value?: string; itemLabel?: string }>()
const fieldRef = toRef(props, "field")
const valueRef = toRef(props, "value")
const showModal = ref(false)
const buttonHovered = ref(false)
const modalTitle = computed(() => {
	const titleParts = [t(fieldRef.value.key)]
    if (props.itemLabel && props.itemLabel !== "--") titleParts.push(props.itemLabel)
    return titleParts.join(" - ")
})
</script>