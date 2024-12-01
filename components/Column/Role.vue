<template>
    <NTag round :bordered="false">
        <template #icon>
            <span v-if="role" style="padding: 0 5px;">{{ t(role).charAt(0).toUpperCase() }}</span>
            <NIcon v-else>
                <IconQuestionMark />
            </NIcon>
        </template>
        {{ role ? t(role) : "--" }}
    </NTag>
</template>

<script lang="ts" setup>
import { IconQuestionMark } from "@tabler/icons-vue";
import { NIcon, NTag } from "naive-ui";

const { value } = defineProps<{ value: string }>();
const database = useState<Database>("database");
const role = database.value.roles?.find(({ id }) => id === value)?.name;
</script>