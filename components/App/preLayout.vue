<template>
    <NMessageProvider keepAliveOnHover closable :containerStyle='{ top: "70px" }'>
        <NDialogProvider>
            <slot></slot>
        </NDialogProvider>
    </NMessageProvider>
</template>

<script lang="ts" setup>
import { NDialogProvider, NMessageProvider } from "naive-ui"
</script>
