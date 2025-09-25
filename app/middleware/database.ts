// import Inison from "inison"

export default defineNuxtRouteMiddleware(async (to) => {
	const database = useState<Database>("database")
	const appConfig = useAppConfig()
	// console.log(Inison.unstringify('[{key:المساحة,required:true,type:table,table:المساحات,id:10,width:2,where:\\{المرسلين\\:\\\[\\\]@user.0\\}},{key:ﺗﺎرﯾﺦ التسليم,required:false,type:date,id:2,width:2},{key:عنوان المهمة,required:true,type:string,id:1},{key:الأولوية,required:false,type:[string,number],subType:radio,options:[عالي الأهمية,هام,عادي],id:4},{key:الوصف,required:false,type:html,id:6}]'))

	if (!appConfig.database && !to.params.database)
		throw createError({
			statusCode: 500,
			statusMessage:
				"You must define a database in app.config.ts or provide it as a route parameter.",
		})

	if (!database.value)
		database.value = (
			await $fetch<apiResponse<Database>>(
				`${appConfig.apiBase}inicontent/databases/${appConfig.database === "inicontent"
					? to.params.database || appConfig.database
					: appConfig.database || to.params.database
				}`,
				{ credentials: "include" },
			)
		).result

	if (!database.value)
		throw createError({
			statusCode: 404,
			statusMessage: "database",
		})

	formatDatabase()

	useState<ThemeConfig>("ThemeConfig", () => ({
		primaryColor: "#FF9800",
		primaryColorHover: "#F7A42A",
		primaryColorPressed: "#E19421",
		primaryColorSuppl: "#CB7900",
	}))

	setThemeConfig()
})
