export default [
	{
		key: "slug",
		type: "string",
		required: true,
	},
	{
		key: "icon",
		type: "table",
		table: "asset",
		accept: ["image"],
		params: "format=avif&fit=94",
	},
	{
		key: "primaryColor",
		type: "string",
		subType: "color",
	},
	{
		key: "primaryDarkColor",
		type: "string",
		subType: "color",
	},
	{
		key: "roles",
		type: "array",
		children: [
			{
				key: "id",
				type: "id",
				inputProps: {
					disabled: true,
				},
			},
			{
				key: "name",
				type: "string",
			},
		],
		onCreate: { id: `temp-${randomID()}` },
		disabledItems: [0, 1, 2],
		required: false,
	},
] as Schema;
