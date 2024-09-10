<template>
    <NFlex :wrap="false">
        <NButton v-for="singleValue in ([] as Item[]).concat(value)" tag="a"
            :href="`/admin/tables/${field.table}/${singleValue.id}/edit`" @click="(e) => handleClick(e, singleValue)"
            :loading="Loading[`Drawer_${field.table}_${singleValue.id}`]" size="small" round>
            <template #icon>
                <NIcon>
                    {{ field.table?.charAt(0).toUpperCase() }}
                </NIcon>
            </template>
            {{
                renderLabel(
                    database.tables?.find(({ slug }) => slug === field.table)?.label,
                    database.tables?.find(({ slug }) => slug === field.table)?.schema, singleValue)
            }}
        </NButton>
    </NFlex>
</template>

<script lang="ts" setup>
import { NFlex, NButton, NIcon } from 'naive-ui';

const { field } = defineProps({
    field: {
        type: Object as PropType<Field | never>,
        default: [],
    },
    value: {
        type: Object as PropType<Item | Item[]>,
        required: true
    }
})
const Loading = useState<Record<string, boolean>>("Loading", () => ({}));
const database = useState<Database>("database")

const { isMobile } = useDevice()
const Drawer = useState<{
    show: boolean;
    id: null | string;
    table: null | string;
    data: any;
}>("Drawer", () => ({
    show: false,
    id: null,
    table: null,
    data: {},
}))
function handleClick(e: MouseEvent, item: Item) {
    e.preventDefault();
    if (item.id && field.table) {
        if (!isMobile)
            Drawer.value = {
                ...Drawer.value,
                id: item.id,
                table: field.table,
                data: {},
                show: true,
            };
        else
            navigateTo(
                `/admin/tables/${field.table}/${item.id}/edit`,
            );
    }
}
</script>