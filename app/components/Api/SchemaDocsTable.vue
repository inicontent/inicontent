<template>
    <div class="schema-docs-table">
        <NDataTable v-if="rows.length" :columns="columns" :data="rows" :row-key="rowKey" :bordered="false"
            :single-line="false" :size="size" striped :pagination="false" />
        <NEmpty v-else :description="emptyDescription || t('apiDocs.noSchemaFields')" />
    </div>
</template>

<script setup lang="ts">
import { h, computed } from "vue"
import type { DataTableColumns } from "naive-ui"
import { NTable, NText } from "naive-ui"

interface SchemaDocRow {
    id: string
    keyText: string
    labelText: string
    typeText: string
    required: boolean
    requiredText: string
    descriptionText: string
    children?: SchemaDocRow[]
}

const props = withDefaults(defineProps<{ schema?: Schema; size?: "small" | "medium" | "large"; emptyDescription?: string }>(), {
    size: "medium",
})

const rows = computed(() => (props.schema ? mapSchema(props.schema) : []))
const size = computed(() => props.size)
const rowKey = (row: SchemaDocRow) => row.id

const columns = computed<DataTableColumns<SchemaDocRow>>(() => [
    {
        type: "expand",
        expandable: (rowData) => Boolean(rowData.children?.length),
        renderExpand: (rowData) =>
            rowData.children?.length ? renderNestedTable(rowData.children) : null,
    },
    {
        title: t("label"),
        key: "labelText",
        className: "schema-docs-table__column--label",
        render: (rowData) => rowData.labelText,
        minWidth: 180,
    },
    {
        title: t("key"),
        key: "keyText",
        width: 160,
        ellipsis: true,
        render: (rowData) => rowData.keyText,
    },
    {
        title: t("type"),
        key: "typeText",
        width: 180,
        render: (rowData) => rowData.typeText,
    },
    {
        title: t("required"),
        key: "requiredText",
        width: 120,
        render: (rowData) =>
            rowData.required
                ? h(NText, { type: "success" }, { default: () => rowData.requiredText })
                : h(NText, { type: "default" }, { default: () => rowData.requiredText }),
    },
    {
        title: t("description"),
        key: "descriptionText",
        minWidth: 220,
        render: (rowData) => rowData.descriptionText,
    },
])

function renderNestedTable(children: SchemaDocRow[]) {
    return h(
        "div",
        { class: "schema-docs-table__nested" },
        h(
            NTable,
            {
                singleLine: false,
                size: "small",
                bordered: false,
            },
            {
                default: () =>
                    h(
                        "tbody",
                        null,
                        children.map((child) =>
                            h("tr", { key: child.id }, [
                                h("td", { class: "schema-docs-table__column--label" }, child.labelText),
                                h("td", null, child.keyText),
                                h("td", null, child.typeText),
                                h("td", null, child.requiredText),
                                h("td", null, child.descriptionText),
                            ]),
                        ),
                    ),
            },
        ),
    )
}

function mapSchema(schema: Schema, parentPath: string[] = []): SchemaDocRow[] {
    return schema.map((field, index) => {
        const fallbackKey = `field-${index}`
        const key = field.key ?? fallbackKey
        const path = [...parentPath, key].join(".")
        const labelReference = field.label ?? key

        const nestedChildren = hasSchemaChildren(field)
            ? mapSchema(field.children as Schema, [...parentPath, key])
            : undefined

        return {
            id: path,
            keyText: key,
            labelText: t(labelReference),
            typeText: formatFieldType(field),
            required: Boolean(field.required),
            requiredText: field.required ? t("required") : t("optional"),
            descriptionText: field.description || "—",
            children: nestedChildren,
        }
    })
}

function hasSchemaChildren(field: Field): field is Field & { children: Schema } {
    if (!field.children) return false
    if (Array.isArray(field.children)) {
        return field.children.some((child) =>
            typeof child === "object" && child !== null && "key" in child,
        )
    }

    return typeof field.children === "object"
}

function formatFieldType(field: Field): string {
    if (Array.isArray(field.type)) {
        return field.type.join(" | ")
    }

    const baseType = field.type ?? "string"

    if (baseType === "array") {
        if (hasSchemaChildren(field)) return "Array<Object>"
        if (Array.isArray(field.children))
            return `Array<${field.children.map(String).join(" | ")}>`
        if (typeof field.children === "string") return `Array<${field.children}>`
    }

    if (baseType === "table") {
        if ("table" in field && field.table) return `Table<${field.table}>`
        if (hasSchemaChildren(field)) return "Table<Object>"
    }

    if (field.subType) return `${baseType} (${field.subType})`

    return String(baseType)
}
</script>

<style scoped>
.schema-docs-table {
    width: 100%;
}

.schema-docs-table__nested {
    padding: 8px 8px 0 8px;
}

.schema-docs-table__column--label {
    font-weight: 600;
}
</style>
