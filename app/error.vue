<template>
	<NuxtLayout name="dashboard">
		<div class="flex items-center justify-center min-h-screen">
			<UCard>
				<div class="text-center p-8">
					<div class="text-6xl font-bold mb-4" :class="code === 'error' ? 'text-red-500' : 'text-yellow-500'">
						{{ error?.statusCode || '500' }}
					</div>
					<div class="text-xl font-semibold mb-2">{{ message }}</div>
					<UButton @click="() => navigateTo('/')" class="mt-4">
						{{ t('goHome') }}
					</UButton>
				</div>
			</UCard>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app"
type errorCodes =
	| "info"
	| "success"
	| "warning"
	| "error"
	| "404"
	| "403"
	| "500"
	| "418"
const { error } = defineProps({
	error: Object as () => NuxtError & { message: "database" | "table" | "item" },
})
const code = ref<errorCodes>()
const message = ref()

defineTranslation({
	ar: {
		notFound: "غير موجودة",
		accessDenied: "ليست لديك الصلاحية",
		internalServerError: "حدث خطأ في النظام الداخلي",
		database: "قاعدة البيانات",
		table: "الجدول",
		item: "العنصر",
		page: "الصفحة",
		goHome: "العودة للصفحة الرئيسية",
	},
})

if (error) {
	code.value = String(error.statusCode) as errorCodes
	switch (error.statusCode) {
		case 404:
			code.value = "warning"
			message.value = `${t(error.message)} ${t("notFound")}`
			break
		case 403:
			code.value = "warning"
			message.value = t("accessDenied")
			break
		default:
			code.value = "error"
			message.value = t("internalServerError")
			console.clear()
			console.error(error)
			break
	}
} else {
	code.value = "error"
	message.value = t("internalServerError")
}
</script>