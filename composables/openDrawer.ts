import Inison from "inison"

async function loadDrawer(index: number) {
	const Drawers = useState<DrawerRef>("drawers", () => [])
	const drawer = Drawers.value[index]

	if (drawer.id) {
		const Loading = useState<Record<string, boolean>>("Loading", () => ({}))
		const appConfig = useAppConfig()
		const database = useState<Database>("database")
		const Language = useCookie<LanguagesType>("language", { sameSite: true })

		drawer.show = false
		const key = `Drawer_${drawer.table}_${drawer.id}`
		Loading.value[key] = true

		const table = database.value.tables?.find(
			({ slug }) => slug === drawer.table,
		)
		drawer.data = {
			...((
				await $fetch<apiResponse>(
					`${appConfig.apiBase}${database.value.slug}/${drawer.table}/${drawer.id}`,
					{
						params: {
							options: Inison.stringify({
								columns: table?.columns,
							}),
							locale: Language.value,
						},
						credentials: "include",
					},
				)
			).result ?? {}),
			...(drawer.data ?? {}),
		}
		Loading.value[key] = false
	}

	drawer.show = true
}

export default function (table: string, id?: string | number, data: any = {}) {
	const Drawers = useState<DrawerRef>("drawers", () => [])
	const defaultWidth = useCookie<number | string>("width", {
		sameSite: true,
	})
	const index = Drawers.value.findIndex((d) => d.table === table && d.id === id)

	let width = defaultWidth.value ?? 251
	if (index === -1) {
		if (Drawers.value.length) {
			for (let index = 0; index < Drawers.value.length; index++) {
				const drawer = Drawers.value[index]
				if (typeof drawer.width === "string") continue
				if (drawer.width) width = drawer.width
				if (typeof width === "number")
					drawer.width = Math.min(window.screen.width, width + width * 0.1)
			}
		}
		// If drawer doesn't exist, create it
		Drawers.value.push({
			id,
			table,
			data,
			show: false,
			schema: undefined,
			width, // Set width based on nesting level
		})

		loadDrawer(Drawers.value.length - 1)
	} else {
		// If drawer already exists, just update it
		Drawers.value[index].show = true
		if (!Drawers.value[index].width) Drawers.value[index].width = width
	}
}
