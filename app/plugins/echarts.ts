import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

export default defineNuxtPlugin((nuxtApp) => {
	use([
		CanvasRenderer,
		LineChart,
		BarChart,
		PieChart,
		TitleComponent,
		TooltipComponent,
		LegendComponent,
		GridComponent,
	]);

	nuxtApp.vueApp.component("VChart", VChart);
});
