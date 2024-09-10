<template>
    <NMessageProvider keepAliveOnHover closable :containerStyle='{ top: "70px" }'>
        <slot></slot>
    </NMessageProvider>
</template>

<script lang="ts" setup>
import { NMessageProvider } from "naive-ui"
</script>
