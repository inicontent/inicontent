export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 200,
    },
    modelValue: {
      type: String,
      default: "",
    },
    onSelected: {
      type: Function,
    },
  },
  setup: (props, { emit }) => {
    const modelValue = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      }),
      id = Math.random().toString(36).replace("0.", "ColorPicker");
    const rgbToHex = (r, g, b) =>
      "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    onMounted(() => {
      const { PI, cos, sin } = Math;
      const L = props.width;
      const C = L / 2;
      const LINE_WIDTH = 4;
      const COLOR1 = "white";
      const COLOR2 = "black";

      const container = document.getElementById(id);
      const canvas = document.createElement("canvas");
      canvas.height = canvas.width = L;
      canvas.style.height = canvas.style.width = `${L}px`;

      container.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      ctx.lineWidth = LINE_WIDTH;

      var grad = ctx.createLinearGradient(C, C, C, 0);
      var red = 255;
      var green = 0;
      var blue = 0;
      var rgb = "";
      var x = 0;
      var y = 0;
      for (var i = 0; i < 360; i++) {
        if (i < 60) {
          green = Math.floor((255 / 60) * i);
        } else if (i < 120) {
          green = 255;
          red = 255 - Math.floor((255 / 60) * (i - 60));
        } else if (i < 180) {
          red = 0;
          blue = Math.floor((255 / 60) * (i - 120));
        } else if (i < 240) {
          blue = 255;
          green = 255 - Math.floor((255 / 60) * (i - 180));
        } else if (i < 300) {
          green = 0;
          red = Math.floor((255 / 60) * (i - 240));
        } else {
          red = 255;
          blue = 255 - Math.floor((255 / 60) * (i - 300));
        }
        x = C * sin((i * PI) / 180);
        y = C * cos((i * PI) / 180);
        grad = ctx.createLinearGradient(C, C, C + x, C + y);
        rgb = "rgb(" + red + "," + green + "," + blue + ")";
        grad.addColorStop(0, COLOR1);
        grad.addColorStop(0.5, rgb);
        grad.addColorStop(1, COLOR2);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(C, C);
        ctx.lineTo(C + x, C + y);
        ctx.stroke();
      }

      canvas.addEventListener("mousemove", function show(event) {
        var rect = canvas.getBoundingClientRect();
        var x_pick = event.clientX - rect.left;
        var y_pick = event.clientY - rect.top;
        var pixel = ctx.getImageData(x_pick, y_pick, 1, 1);
        var data = pixel.data;
        modelValue.value = rgbToHex(data[0], data[1], data[2]);
      });

      canvas.addEventListener("mousedown", () => {
        props.onSelected(modelValue.value);
      });
    });
    return () =>
      h("div", {
        id: id,
        style: { cursor: "pointer", borderRadius: "100%", overflow: "hidden" },
      });
  },
});
