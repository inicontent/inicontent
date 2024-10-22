<template>
    <App>
        <NResult :status="code" :title="message" />
    </App>
</template>

<script setup lang="ts">
import { NResult } from "naive-ui"
import type { NuxtError } from '#app'
type errorCodes = 'info' | 'success' | 'warning' | 'error' | '404' | '403' | '500' | '418'
const { error } = defineProps({
    error: Object as () => NuxtError
})
const code = ref<errorCodes>()
const message = ref()

if (error) {
    code.value = String(error.statusCode) as errorCodes
    switch (error.statusCode) {
        case 404:
            message.value = t(`${error.message}NotFound`)
            break;
        case 500:
            message.value = t("internalServerError")
            break;
        default:
            code.value = "warning"
            message.value = t('unexpectedError')
            break;
    }
} else {
    code.value = "warning"
    message.value = t('unexpectedError')
}
</script>