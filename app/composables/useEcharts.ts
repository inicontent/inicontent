let registered = false;

export const VChart = defineAsyncComponent(async () => {
	const [
		{ use },
		{ CanvasRenderer },
		{ LineChart, BarChart, PieChart },
		components,
		{ default: VChartImpl },
	] = await Promise.all([
		import("echarts/core"),
		import("echarts/renderers"),
		import("echarts/charts"),
		import("echarts/components"),
		import("vue-echarts"),
	]);

	if (!registered) {
		use([
			CanvasRenderer,
			LineChart,
			BarChart,
			PieChart,
			components.TitleComponent,
			components.TooltipComponent,
			components.LegendComponent,
			components.GridComponent,
		]);
		registered = true;
	}

	return VChartImpl;
});
