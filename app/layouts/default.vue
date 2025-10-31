<template>
	<div>
		<NuxtLoadingIndicator :color="ThemeConfig.primaryColor" :height=2 />
		<UNotifications />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import "~/assets/main.css"

import { hexToRGB } from "~/composables"

const Language = useCookie<LanguagesType>("language", { sameSite: true })
const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
const ThemeConfig = useState<ThemeConfig>("ThemeConfig")

const toast = useToast()

// Create message and notification APIs compatible with the old naive-ui API
const message: MessageApiInjection = {
	info: (content: string) => toast.add({ title: content, color: 'blue' }),
	success: (content: string) => toast.add({ title: content, color: 'green' }),
	warning: (content: string) => toast.add({ title: content, color: 'yellow' }),
	error: (content: string) => toast.add({ title: content, color: 'red' }),
	loading: (content: string) => toast.add({ title: content, icon: 'i-heroicons-arrow-path', timeout: 0 }),
}

const notification: NotificationApiInjection = {
	info: (options) => toast.add({ ...options, color: 'blue' }),
	success: (options) => toast.add({ ...options, color: 'green' }),
	warning: (options) => toast.add({ ...options, color: 'yellow' }),
	error: (options) => toast.add({ ...options, color: 'red' }),
}

onMounted(() => {
	window.$message = message
	window.$notification = notification

	// Add an event listener for the print action
	window.onbeforeprint = () => {
		// Select the element with the class "printable"
		let element = document.querySelector(".printable")

		// Check if the element and its parent exist
		if (element?.parentElement) {
			// Add the class "printable-direct-parent" to the direct parent
			element.parentElement.classList.add("printable-direct-parent")

			// Traverse up the DOM starting from the direct parent's parent
			let parent = element.parentElement.parentElement
			while (parent) {
				// Add the class "printable-parent" to all other ancestors
				parent.classList.add("printable-parent")
				parent = parent.parentElement
			}
		}
	}

	// Optional: Remove the added classes after printing
	window.onafterprint = () => {
		// Remove the "printable-parent" class after printing
		const elements = document.querySelectorAll(".printable-parent")
		for (let i = 0; i < elements.length; i++)
			elements[i]?.classList.remove("printable-parent")

		document
			.querySelector(".printable-direct-parent")
			?.classList.remove("printable-parent")
	}
})

useHead({
	bodyAttrs: {
		style: computed(
			() =>
				`--primaryColor: ${hexToRGB(ThemeConfig.value.primaryColor).join(", ")}`,
		),
	},
})

// onMounted(fetchTranslation);
// watch(Language, fetchTranslation);
</script>