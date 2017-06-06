const d3 = require('d3');
const io = require('socket.io-client');

const socket = io.connect();

const data = [];

const ticks = 30;

const containerWidth = document.querySelector('#chart').parentNode.offsetWidth;

const margin = {top: 20, right: 50, bottom: 30, left: 20};
const width = containerWidth - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

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
  .domain([maxDate, minDate])
  .range([0, width]);

const y = d3
  .scaleLinear()
  .domain([0, 200])
  .range([height, 0]);

const smoothLine = d3.line()
  .x(d => x(d.minDate))
  .y(d => y(d.Gaszak_hoogte_hu));

// Draw the axis
const xAxis = d3
  .axisBottom()
  .tickFormat(d => {
    const date = d3.timeMinute.offset(d, -ticks);
    return formatTime(date);
  })
  .scale(x);

const yAxis = d3
  .axisLeft()
  .tickSize(-width)
  .scale(y);

const axisX = chart.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);

const axisY = chart.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

const path = chart
  .append('g')
  .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, -1))})`)
  .append('path');

socket.on('dataPoint', point => {
  const dateTime = `${point.Date} ${point.Time}`;

  const parsedDateTime = parseTime(dateTime);

  point.minDate = parsedDateTime;
  point.maxDate = d3.timeMinute.offset(minDate, -ticks);

  minDate = point.minDate;
  maxDate = point.maxDate;

  tick(point);
});

// Main loop
function tick(point) {
  data.push(point);

  // Remote old data (max 20 points)
  if (data.length > ticks + 1) {
    data.shift();
  }

  // Draw new line
  path.datum(data)
    .attr('class', 'smoothline')
    .attr('d', smoothLine);

  // Shift the chart left
  x
    .domain([maxDate, minDate]);

  axisY
    .call(yAxis);

  axisX
    .call(xAxis);
}
