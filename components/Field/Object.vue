<template>
    <NCollapse :default-expanded-names="field.expand ? field.id : undefined" display-directive="show"
        style="margin: 0 0 20px;" arrow-placement="right" :trigger-areas="['main', 'arrow']" accordion>
        <NCollapseItem display-directive="show" :title="t(field.key)" :path="field.id" :name="field.id">
            <div class="collapseContentPadding">
                <FieldS :schema="(field.children as Schema)" v-model="modelValue" />
            </div>
        </NCollapseItem>
    </NCollapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from "naive-ui";

const { field } = defineProps<{ field: Field }>();

const modelValue = defineModel<Record<string | number, any>>();
if (!modelValue.value) modelValue.value = {};
</script>