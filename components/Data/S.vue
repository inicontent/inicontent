<template>
    <NScrollbar x-scrollable>
        <NList class="printable" hoverable :bordered="false">
            <Data v-for="field in schema" :field :value="value[field.key]" />
        </NList>
    </NScrollbar>
</template>

<script lang="ts" setup>
import { NList, NScrollbar } from "naive-ui";

const { schema, value } = defineProps<{ schema: Schema; value: Item }>();
</script>
