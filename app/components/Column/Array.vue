<template>
    <LazyColumn v-if="field.subType" :field="{ ...field, type: field.subType }" :value="value" />
    <LazyColumn v-else-if="!isArrayOfObjects(field.children)"
        :field="{ ...field, type: field.children === 'table' ? 'table' : 'tags' }" :value="value" />
    <UPopover v-else scrollable style="max-height: 240px;" trigger="click">
        <template #trigger>
            <UButton size="small" circle>{{ `[${([] as Record<string, any>[]).concat(value).length}]` }}</UButton>
        </template>
        <UAccordion accordion arrow-placement="right">
            <UAccordionItem v-for="(singleValue, index) in ([] as Record<string, any>[]).concat(value)"
                :title="getCollapseItemTitle(field, (singleValue as Item), index)">
                <div class="flex flex-col">
                    <div class="flex"
                        v-for="child in (field.children as Schema).filter(({ key }) => typeof singleValue[key] !== 'undefined')"
                        align="center" inline>
                        <strong>{{ child.key }}:</strong>
                        <LazyColumn :field="child" :value="singleValue[child.key]" />
                    </div>
                </div>
            </UAccordionItem>
        </UAccordion>
    </UPopover>
</template>

<script lang="ts" setup>
import { isArrayOfObjects } from "inibase/utils"

const { field, value } = defineProps<{ field: Field; value?: any }>()
</script>