<template>
    <NPerformantEllipsis>
        {{ value }}
    </NPerformantEllipsis>
</template>

<script lang="ts" setup>
import { NPerformantEllipsis } from "naive-ui";

defineProps<{ value?: string | number }>();
</script>