import {
  NStatistic,
  NText,
  NTabs,
  NTabPane,
  NSkeleton,
  NScrollbar,
  NSpace,
} from "naive-ui";
import { GridLayout } from "vue3-drr-grid-layout";
import objectPath from "object-path";
import VueApexCharts from "vue3-apexcharts";
import "vue3-drr-grid-layout/dist/style.css";

export default defineComponent({
  async setup() {
    const Theme = useGlobalCookie("Theme"),
      database = useState("database"),
      ThemeConfig = useState("ThemeConfig"),
      FETCH_DATA = ref({}),
      route = useRoute();
    definePageMeta({
      middleware: "dashboard",
    });
    useHead({
      title: `${database.value.name} | ${route.params.slug} Dashboard`,
      link: [{ rel: "icon", href: database.value.icon }],
    });

    const layout = ref([
      {
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        type: "text",
        value: "المهام",
      },
      {
        x: 0,
        y: 2,
        w: 3,
        h: 3,
        type: "counter",
        url: "https://pteam.sa/tasks/",
        label: "المهام التي انتهى تاريخها ولم تنجز",
        value: "overdue",
      },
      {
        x: 3,
        y: 2,
        w: 2,
        h: 3,
        type: "counter",
        url: "https://pteam.sa/tasks/",
        label: "المهام المعلقه",
        value: "pending",
      },
      {
        x: 5,
        y: 2,
        w: 3,
        h: 3,
        type: "counter",
        url: "https://pteam.sa/tasks/",
        label: "المهام التي تحت الاجراء",
        value: "in_progress",
      },
      {
        x: 8,
        y: 2,
        w: 2,
        h: 3,
        type: "counter",
        url: "https://pteam.sa/tasks/",
        label: "المهام المنجزة",
        value: "completed",
      },
      {
        x: 10,
        y: 2,
        w: 2,
        h: 3,
        type: "counter",
        url: "https://pteam.sa/tasks/",
        label: "عدد المهام",
        value: "total",
      },
      {
        x: 0,
        y: 5,
        w: 12,
        h: 2,
        type: "text",
        value: "مبيعات المتاجر وأكثر المنتجات مبيعاً",
      },
      {
        x: 6,
        y: 7,
        w: 6,
        h: 8,
        type: "group",
        label: "المبيعات",
        value: [
          {
            type: "chart-bar",
            label: "Pteam",
            color: "#E5AF0F",
            url: "https://pteam.sa/analytics/",
            keys: "pteam.sales.keys",
            data: "pteam.sales.data",
          },
          {
            type: "chart-bar",
            label: "Wezlie",
            color: "#ffe031",
            url: "https://pteam.sa/analytics/",
            keys: "wezlie.sales.keys",
            data: "wezlie.sales.data",
          },
          {
            type: "chart-bar",
            label: "Orovai",
            color: "#ff8b00",
            url: "https://pteam.sa/analytics/",
            keys: "orovai.sales.keys",
            data: "orovai.sales.data",
          },
        ],
      },
      {
        x: 3,
        y: 7,
        w: 3,
        h: 8,
        type: "group",
        label: "المنتجات الاكثر مبيعاً",
        value: [
          {
            type: "list",
            label: "Pteam",
            url: "https://pteam.sa/analytics/",
            value: "pteam.top_products",
          },
          {
            type: "list",
            label: "Wezlie",
            url: "https://pteam.sa/analytics/",
            value: "wezlie.top_products",
          },
          {
            type: "list",
            label: "Orovai",
            url: "https://pteam.sa/analytics/",
            value: "orovai.top_products",
          },
        ],
      },
      {
        x: 0,
        y: 7,
        w: 3,
        h: 8,
        type: "group",
        label: "معدل التحويل",
        value: [
          {
            type: "counter",
            url: "https://pteam.sa/analytics/",
            label: "Pteam",
            value: "pteam.conversion_rate",
          },
          {
            type: "counter",
            url: "https://pteam.sa/analytics/",
            label: "Wezlie",
            value: "wezlie.conversion_rate",
          },
          {
            type: "counter",
            url: "https://pteam.sa/analytics/",
            label: "Orovai",
            value: "orovai.conversion_rate",
          },
        ],
      },
    ]);
    for (const element of layout.value) {
      if (element.url && !FETCH_DATA.value.hasOwnProperty(element.url)) {
        try {
          FETCH_DATA.value[element.url] = true;
          $fetch(element.url).then(
            (res) => (FETCH_DATA.value[element.url] = res)
          );
        } catch (error) {
          FETCH_DATA.value[element.url] = false;
          console.log(error);
        }
      } else if (element.type === "group") {
        for (const ele of element.value) {
          if (ele.url && !FETCH_DATA.value.hasOwnProperty(ele.url))
            try {
              FETCH_DATA.value[ele.url] = true;
              $fetch(ele.url).then((res) => (FETCH_DATA.value[ele.url] = res));
            } catch (error) {
              FETCH_DATA.value[ele.url] = false;
              console.log(error);
            }
        }
      }
    }
    const RenderElement = ({ type, ...item }) => {
      switch (type) {
        case "counter":
          return h(
            NStatistic,
            {
              label: item.label,
            },
            {
              default: () =>
                objectPath.get(
                  FETCH_DATA.value[item.url],
                  item.value,
                  h(NSkeleton, { text: true, round: true })
                ),
            }
          );
        case "text":
          return h(
            NText,
            {
              strong: true,
            },
            () => item.value
          );
        case "list":
          return h(
            NScrollbar,
            {
              style: {
                maxHeight: "calc(100% - 41px)",
              },
            },
            () =>
              h(NSpace, { vertical: true }, () =>
                FETCH_DATA.value[item.url] &&
                typeof FETCH_DATA.value[item.url] !== "boolean"
                  ? objectPath
                      .get(FETCH_DATA.value[item.url], item.value, [])
                      .map((element) => h(NText, () => element))
                  : [...Array(5).keys()].map(() =>
                      h(NSkeleton, { text: true, round: true })
                    )
              )
          );
        case "chart-bar":
          // loading: !FETCH_DATA.value[item.url] || typeof FETCH_DATA.value[item.url] === "boolean",
          return h(VueApexCharts, {
            type: "bar",
            width: "100%",
            height: "100%",
            options: {
              theme: {
                mode: Theme.value,
              },
              colors: [ThemeConfig.value.primaryColor, "#E91E63", "#9C27B0"],
              chart: {
                background: "transparent",
                toolbar: {
                  show: false,
                },
              },
              xaxis: {
                categories: objectPath.get(
                  FETCH_DATA.value[item.url],
                  item.keys,
                  []
                ),
              },
              yaxis: {
                showForNullSeries: false,
                decimalsInFloat: 0,
              },
              plotOptions: {
                bar: {
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                offsetY: -20,
                style: {
                  colors: Theme.value === "light" ? ["#000"] : ["#fff"],
                },
                formatter: function (value) {
                  if (parseInt(value)) {
                    let formatter = Intl.NumberFormat("en", {
                      notation: "compact",
                    });
                    value = formatter.format(parseInt(value));
                  }
                  return value;
                },
              },
            },
            series: [
              {
                name: item.title,
                data: objectPath
                  .get(FETCH_DATA.value[item.url], item.data, [])
                  .map((val) => val.replace(/[^\d.-]/g, "")),
              },
            ],
          });
        case "group":
          return [
            h(
              NText,
              {
                strong: true,
              },
              () => item.label
            ),
            h(
              NTabs,
              {
                style: {
                  height: "100%",
                },
                defaultValue: item.value[0].label,
                justifyContent: "space-evenly",
                type: "line",
              },
              () =>
                item.value.map((i) =>
                  h(
                    NTabPane,
                    {
                      style: {
                        height: "100%",
                      },
                      name: i.label,
                      tab: i.label,
                    },
                    () => RenderElement({ title: item.label, ...i })
                  )
                )
            ),
          ];
        default:
          return h(NText, () => "Empty");
      }
    };
    return () => [
      h(
        "style",
        {},
        {
          default: () => `
            .vue-grid-item {
                background-color: ${ThemeConfig.value.primaryColor}1a;
                padding: 20px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                border-radius: 15px;
            }
            .vue-grid-item.vue-grid-placeholder {
                background: ${ThemeConfig.value.primaryColor}!important;
            }`,
        }
      ),
      h(
        GridLayout,
        {
          style: {
            width: "100%",
          },
          layout: layout.value.map((item, index) => ({
            i: index,
            minH: 2,
            minW: 2,
            ...item,
          })),
          "onUpdate:layout": (v) =>
            (layout.value = v.map(({ moved, i, minH, minW, ...item }) => item)),
          isDraggable: false,
          isResizable: false,
          responsive: true,
          colNum: 12,
          rowHeight: 30,
        },
        {
          gridItemContent: ({ item }) => RenderElement(item),
        }
      ),
    ];
  },
});
