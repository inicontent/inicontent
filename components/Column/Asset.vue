<template>
    <NImageGroup>
        <NFlex :wrap="false">
            <template v-for="singleValue in ([] as Asset[]).concat(value)">
                <NTooltip :disabled="!singleValue.name">
                    <template #trigger>
                        <NImage v-if="singleValue.type.startsWith('image/')" lazy :src="`${singleValue.publicURL}`"
                            :preview-src="singleValue.publicURL" :width="32" :height="32" />
                        <NButton v-else tag="a" :href="singleValue.publicURL" target="_blank" secondary type="primary"
                            round>
                            <template #icon>
                                <NIcon>
                                    <Icon name="tabler:file-upload" />
                                </NIcon>
                            </template>
                        </NButton>
                    </template>
                    {{ singleValue.name }}
                </NTooltip>
            </template>
        </NFlex>
    </NImageGroup>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value: Asset | Asset[] }>();
</script>