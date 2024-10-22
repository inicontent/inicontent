<template>
    <div class="colorPicker">
        <div v-for="colorsGroup in colors">
            <span v-for="color in colorsGroup" :style="{ background: color }" @click="modelValue = color"></span>
        </div>
    </div>
</template>

<script lang="ts" setup>
const modelValue = defineModel({
    type: String,
})

const colors = [
    [
        "#d3d9e3",
        "#feccd1",
        "#f8e5ad",
        "#bbe3cd",
        "#bcefe8",
        "#b2e4fb",
        "#aec0fd",
        "#c4bfd9",
        "#d5bccb",
        "#d1c4c0",
    ],
    [
        "#afb7cc",
        "#fd9897",
        "#f3d57a",
        "#8fd1af",
        "#91e6db",
        "#81d3f9",
        "#88a3f7",
        "#9f96c0",
        "#c391ab",
        "#b39f99",
    ],
    [
        "#939cb0",
        "#f25c4e",
        "#ecb81b",
        "#30b479",
        "#00d6c4",
        "#2ab5f4",
        "#5874cb",
        "#7e6bab",
        "#a8537b",
        "#816257",
    ],
    [
        "#71798b",
        "#e84532",
        "#e9a00f",
        "#34945f",
        "#0fb2a4",
        "#0c9be3",
        "#2449ac",
        "#584a8e",
        "#953963",
        "#614238",
    ],
    [
        "#5d6576",
        "#d63b2c",
        "#e98e0d",
        "#227246",
        "#008a7f",
        "#0a88cf",
        "#183fa0",
        "#4f4082",
        "#803459",
        "#5c3f36",
    ],
    [
        "#3e4656",
        "#c93525",
        "#e97d0a",
        "#1b5a38",
        "#016a5f",
        "#0977bb",
        "#0d3594",
        "#473675",
        "#6d2f50",
        "#4d332d",
    ],
    [
        "#1c2433",
        "#ba2a19",
        "#e95c06",
        "#15482c",
        "#014e42",
        "#06579a",
        "#042380",
        "#39255e",
        "#4b253f",
        "#3d2622",
    ],
];
</script>

<style lang="css" scoped>
.colorPicker {
    display: flex;
    flex-direction: column-reverse;
    border-radius: 5px;
    overflow: hidden;
    border: 2px solid #fff;
}

.dark .colorPicker {
    border-color: #000;
}

.colorPicker div {
    display: flex;
}

.colorPicker div span {
    width: 20px;
    height: 20px;
}

.colorPicker div span:hover {
    transform: scale(1.2);
    box-shadow: 0 0 8px #00000011;
    border-radius: 5px;
}
</style>
