export default async function (textToCopy: string | number) {
	// Navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(String(textToCopy))
	} else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement("textarea")
		textArea.value = String(textToCopy)

		// Move textarea out of the viewport so it's not visible
		textArea.style.position = "absolute"
		textArea.style.left = "-999999px"

		document.body.prepend(textArea)
		textArea.select()

		try {
			document.execCommand("copy")
		} catch (error) {
			console.error(error)
		} finally {
			textArea.remove()
		}
	}
}
