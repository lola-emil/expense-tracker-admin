
let days = [];
let expense = [];

for (let i = 0; i < 30; i++) {
    days.push(i + 1);
    expense.push(Math.floor(Math.random() * 1000));
}

let option = {
    legend: {},
    tooltip: {},
    dataset: {
      // Define the dimension of array. In cartesian coordinate system,
      // if the type of x-axis is category, map the first dimension to
      // x-axis by default, the second dimension to y-axis.
      // You can also specify 'series.encode' to complete the map
      // without specify dimensions. Please see below.
  
      dimensions: ['product', '2015', '2016', '2017'],
      source: [
        { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
        { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
        { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
        { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  };

const barChart = echarts.init(document.getElementById('bar-chart'));

barChart.setOption(option)

window.addEventListener('resize', evt => {
    barChart.resize();
});