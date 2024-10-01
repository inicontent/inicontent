/*
    To set a default database
    change this file name to "database.global.ts"
    and replace the value of "databaseName" const
    to your database name
*/

export default defineNuxtRouteMiddleware(async () => {
	const databaseName = "inicontent"; // CHANGE IT!
	const database = useState<Database>("database");

	database.value = (
		await $fetch<apiResponse<Database>>(
			`${useRuntimeConfig().public.apiBase}inicontent/database/${databaseName}`,
		)
	).result;
});
