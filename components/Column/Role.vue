<template>
    <NTag round :bordered="false">
        <template #icon>
            <span v-if="role" style="padding: 0 5px;">{{ t(role).charAt(0).toUpperCase() }}</span>
            <Icon v-else name="question-mark" />
        </template>
        {{ role ? t(role) : "--" }}
    </NTag>
</template>

<script lang="ts" setup>
const { value } = defineProps<{ value: string }>();
const database = useState<Database>("database");
const role = database.value.roles?.find(({ id }) => id === value)?.name;
</script>