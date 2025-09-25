function adjustColor(hex: string, factor: number) {
	// Convert hex to RGB
	let [r, g, b] = hexToRGB(hex)

	// Adjust RGB values
	r = Math.min(255, Math.max(0, Math.round(r * factor)))
	g = Math.min(255, Math.max(0, Math.round(g * factor)))
	b = Math.min(255, Math.max(0, Math.round(b * factor)))

	// Convert back to hex
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

export default function () {
	const database = useState<Database>("database")
	const Theme = useCookie<"dark" | "light">("theme", { sameSite: true })
	const Language = useCookie<LanguagesType>("language", { sameSite: true })
	const ThemeConfig = useState<ThemeConfig>("ThemeConfig")

	const mainColor =
		(Theme.value === "light" || !database.value.primaryDarkColor
			? database.value.primaryColor
			: database.value.primaryDarkColor) ?? "#FF9800"
	ThemeConfig.value = {
		primaryColor: mainColor,
		primaryColorHover: adjustColor(mainColor, 1.1),
		primaryColorPressed: adjustColor(mainColor, 0.9),
		primaryColorSuppl: adjustColor(mainColor, 0.8),
	}
	if (!Language.value) Language.value = database.value.primaryLanguage ?? "en"
}
