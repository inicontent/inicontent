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
import { IconQuestionMark } from "@tabler/icons-vue"
import { NIcon, NTag } from 'naive-ui';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
})
const database = useState<Database>("database");
const role = database.value.roles?.find(({ id }) => id === props.value)?.name
</script>