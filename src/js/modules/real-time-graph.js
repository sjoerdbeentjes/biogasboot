const d3 = require('d3');
const io = require('socket.io-client');
const config = require('../../../modules/config');

// Make objects for D3.js
const getUsedValues = function(){
  let i = 0;
  let values = [];
  for (let key in config.defineValues) {
    i++;
    values.push({
      name: config.defineValues[key].name,
      title: config.defineValues[key].title,
      min: config.defineValues[key].min,
      max: config.defineValues[key].max,
      high: config.defineValues[key].high,
      low: config.defineValues[key].low
    });
  }
  if (i === Object.keys(config.defineValues).length) {
    return values;
  }
};
// Fill the values
const usedValues = getUsedValues();

const windowWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

if (document.querySelector('#chart') && windowWidth > 800) {
  const socket = io.connect();

  let data = [];

  const ticks = 240;

  const containerWidth = parseInt(window.getComputedStyle(document.querySelector('#chart').parentNode).getPropertyValue('width'));
  const containerHeight = parseInt(window.getComputedStyle(document.querySelector('#chart').parentNode).getPropertyValue('height'));

  const margin = {top: 20, right: 30, bottom: 60, left: 30};
  const width = containerWidth - margin.left - margin.right - 32;
  const height = containerHeight - margin.top - margin.bottom - 16;

  let minDate = new Date();
  let maxDate = d3.timeMinute.offset(minDate, -ticks);

  const parseTime = d3.timeParse('%d-%m-%y %H:%M:%S');
  const formatTime = d3.timeFormat('%H:%M');

  const chart = d3.select('#chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3
    .scaleTime()
    .range([0, width])
    .domain([minDate, maxDate]);

  const y = d3
    .scaleLinear()
    .domain([usedValues[2].min, usedValues[2].max])
    .range([height, 0]);

  let line = d3.line()
    .x(d => x(d.dateTime))
    .y(d => y(d.Bag_Height));

  // Draw the axis
  const xAxis = d3
    .axisBottom()
    .tickFormat(d => {
      const date = d3.timeMinute.offset(d, -ticks);
      return formatTime(d);
    })
    .scale(x);

  const yAxis = d3
    .axisLeft()
    .ticks(10)
    .tickSize(-width)
    .scale(y);

  const axisX = chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  const axisY = chart.append('g')
    .attr('class', 'y axis hoogte')
    .call(yAxis);

  const clip = chart.append('svg:clipPath')
      .attr('id', 'clip')
    .append('svg:rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height);

  const path = chart
    .append('g')
    .attr('class', 'line')
    .attr('clip-path', (d, i) => 'url(#clip)')
    .append('path');

  const areaPath = chart
    .append('g')
    .append('rect')
    .attr('x', 0)
    .attr('y', y(usedValues[2].high))
    .attr('width', width)
    .attr('height', 140)
    .style('fill', '#3498db')
    .style('opacity', 0.3);

  const warningLine = chart
    .append('g')
    .attr('class', 'warning-line')
    .append('line')
    .attr('x0', 0)
    .attr('x1', width)
    .attr('y1', y(usedValues[2].high))
    .attr('y2', y(usedValues[2].high));

  socket.on('dataPoint', points => {
    const lastIndex = points.length - 1;

    const parsedDateTime = new Date(points[lastIndex]['Date']);

    maxDate = parsedDateTime;
    minDate = d3.timeMinute.offset(maxDate, -ticks);
    points.forEach(point => {

      point.dateTime = new Date(point['Date']);
    });

    tick(points);
  });

  // Main loop
  function tick(points) {
    data = [...data, ...points];

    // Remote old data (max 20 points)
    if (data.length > ticks + 1) {
      data.shift();
    }

    x
      .domain([minDate, maxDate]);

    line
      .x(d => x(d.dateTime));

    // Draw new line
    path.datum(data)
      .attr('class', 'line line-hoogte')
      .attr('d', line);

    axisY
      .call(yAxis);

    axisX
      .call(xAxis);
  }

  // function init() {
  //   d3.json('http://localhost:3000/api/all', (err, points) => {
  //     if (err) throw err;

  //     const lastIndex = points.length - 1;

  //     const dateTime = points[lastIndex]['Date'];

  //     const parsedDateTime = new Date(dateTime);

  //     maxDate = parsedDateTime;
  //     minDate = d3.timeMinute.offset(maxDate, -ticks);

  //     points.forEach(point => {
  //       point.dateTime = new Date(point['Date']);
  //     });

  //     console.log(points);

  //     tick(points);
  //   });
  // }

  // init();
}
