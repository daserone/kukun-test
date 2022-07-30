const values = [523, 610, 340, 200, 550, 659];

const labels = ["NOW", "2023", "2024", "2025", "2026", "2027"];

const drawChart = (x, y) => {
  const ctx = document.getElementById("myChart").getContext("2d");

  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#854AF2");
  gradient.addColorStop(1, "#1A92EA");
  const labels = x;

  const values = y;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        label: "5-Year Forecasted Value",
        borderColor: gradient,
        tension: 0.1,
        radius: 7,
        borderWidth: 5,
        backgroundColor: "white",
      },
    ],
  };
  const totalDuration = 2000;
  const delayBetweenPoints = totalDuration / values.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  const animation = {
    x: {
      type: "number",
      easing: "easeOutQuad",
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "easeOutQuad",
      duration: 2000,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };
  const config = {
    type: "line",
    data: data,

    options: {
      // animations: {
      //   x: {
      //     from: 0,
      //     duration: 4000,
      //   },
      //   y: {
      //     from: 0,
      //     duration: 4000,
      //   },
      // },
      animation,
      responsive: true,
      scales: {
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: true,
            borderDash: [5, 15],
          },
        },
        x: {
          grid: {
            display: false,
            drawOnChartArea: true,
            drawBorder: true,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        customPlugin: {
          consoleText: "testText",
        },
      },
    },
    plugins: [
      {
        id: "customPlugin",
        afterDraw: (chart, args, options) => {
          var ctx = chart.ctx;
          var yAxis = chart.scales.y.end;
          console.log("test", chart.scales.y.end);

          ctx.save();
          ctx.font = "18px Arial";
          ctx.fillStyle = "black";

          ctx.fillText("$" + values[0] + "k", 0, 80);
          ctx.fillText("$" + values[values.length - 1] + "k", 530, 20);

          ctx.restore();
        },
      },
    ],
  };

  const myChart = new Chart(ctx, config);
};
const changeText = () => {
  const percent = document.getElementById("percent");
  setTimeout(() => (percent.textContent = "29.5"), 1000);
  setTimeout(() => (percent.className = "fade"), 1000);
};
drawChart(labels, values);
changeText();
