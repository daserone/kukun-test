const simulationData = {
  x: [300, 340, 400, 350, 300, 280],
  y: ["NOW", "2023", "2024", "2025", "2026", "2027"],
};
const drawChart = ({ x, y }) => {
  const ctx = document.getElementById("myChart").getContext("2d");

  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#854AF2");
  gradient.addColorStop(1, "#1A92EA");
  const labels = y;

  const values = x;

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
  const totalDuration = 1000;
  const delayBetweenPoints = totalDuration / values.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;

  const config = {
    type: "line",
    data: data,

    options: {
      animations: {
        borderColor: {
          type: "color",
          ease: "easeOutQuad",
          duration: 12000,
          from: "transparent",
          to: "#1A92EA",
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
            borderDash: [5, 5],
          },
        },
        x: {
          ticks: {
            font: {
              size: 18,
            },
            color: "black",
          },
          grid: {
            display: false,
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
          let f = new FontFace(
            "poppins",
            "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          );

          f.load().then(() => {
            ctx.font = "bold 18px poppins";
          });
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          if (xFirst != 0 && xSecond != 0) {
            ctx.fillText("$" + values[0] + "K", xFirst + 10, yFirst - 30);
            ctx.fillText(
              "$" + values[values.length - 1] + "K",
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

const percIncrease = (a, b) => {
  let percent;
  if (b !== 0) {
    if (a !== 0) {
      percent = ((b - a) / a) * 100;
    } else {
      percent = b * 100;
    }
  } else {
    percent = -a * 100;
  }
  return Math.floor(percent);
};
const changeText = () => {
  const percent = document.getElementById("percent");
  const arrow = document.getElementById("arrow");
  let change = percIncrease(
    simulationData.x[0],
    simulationData.x[simulationData.x.length - 1]
  );
  setTimeout(
    () => {
      percent.textContent = change;
      if (change < 0) {
        arrow.className = "arrow-down";
      }
    },

    1000
  );

  setTimeout(() => (percent.className = "fade"), 1000);
};

drawChart(simulationData);
changeText();
