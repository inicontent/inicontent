<template>
    <NScrollbar x-scrollable>
        <NList id="Printable" hoverable :bordered="false">
            <RenderData v-for="field in schema" :field :value="value[field.key]" />
        </NList>
    </NScrollbar>
</template>

<script lang="ts" setup>
import {
    NList,
    NScrollbar,
} from "naive-ui";

const { schema, value } = defineProps<{ schema: Schema, value: Item }>()
</script>
