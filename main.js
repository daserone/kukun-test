const values = [100, 610, 340, 200, 550, 100];

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
        radius: 0,
        borderWidth: 5,
        backgroundColor: "white",
      },
    ],
  };
  const totalDuration = 800;
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
      from: NaN,
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
      animations: {
        borderColor: {
          type: "color",
          ease: "linear",
          duration: 10000,
          from: "transparent",
          to: "blue",
        },
        x: {
          type: "number",
          easing: "easeOutQuad",
          duration: delayBetweenPoints,
          from: NaN,
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
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
      },
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
        afterDraw: (chart) => {
          var ctx = chart.ctx;
          const {
            chartArea: { top },
            scales: { x, y },
          } = chart;
          let xFirst = 0;
          let xSecond = 0;
          let yFirst = 0;
          let ySecond = 0;
          if (chart.getDatasetMeta(1).data[0] != undefined) {
            if (chart.getDatasetMeta(1).data[0].x != undefined) {
              xFirst = chart.getDatasetMeta(1).data[0].x;
            }
          }
          if (chart.getDatasetMeta(1).data[values.length - 1] != undefined) {
            if (
              chart.getDatasetMeta(1).data[values.length - 1].x != undefined
            ) {
              xSecond = chart.getDatasetMeta(1).data[values.length - 1].x;
            }
          }
          if (chart.getDatasetMeta(1).data[0] != undefined) {
            if (chart.getDatasetMeta(1).data[0].y != undefined) {
              yFirst = chart.getDatasetMeta(1).data[0].y;
            }
          }
          if (chart.getDatasetMeta(1).data[values.length - 1] != undefined) {
            if (
              chart.getDatasetMeta(1).data[values.length - 1].y != undefined
            ) {
              ySecond = chart.getDatasetMeta(1).data[values.length - 1].y;
            }
          }
          ctx.save();
          ctx.font = "18px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          if (xFirst != 0 && xSecond != 0) {
            ctx.fillText("$" + values[0] + "k", xFirst + 10, yFirst - 30);
            ctx.fillText(
              "$" + values[values.length - 1] + "k",
              xSecond - 10,
              ySecond - 20
            );
          }
        },
      },
    ],
  };

  const myChart = new Chart(ctx, config);
  setTimeout(() => {
    myChart.data.datasets[0].borderColor = "transparent";
    myChart.data.datasets.push({
      data: values,
      label: "5-Year Forecasted Value",
      borderColor: gradient,
      tension: 0.1,
      radius: 7,
      borderWidth: 5,
      backgroundColor: "white",
    });
    myChart.update("none");
  }, 1200);
};
const changeText = () => {
  const percent = document.getElementById("percent");
  setTimeout(() => (percent.textContent = "29.5"), 1000);
  setTimeout(() => (percent.className = "fade"), 1000);
};
drawChart(labels, values);
changeText();
