const d3 = require('d3');
const io = require('socket.io-client');

if (document.querySelector('#chart')) {
  const socket = io.connect();

  const data = [];

  const ticks = 30;

  const containerWidth = Number((window.getComputedStyle(document.querySelector('#chart').parentNode).getPropertyValue('width')).replace('px', ''));
  const containerHeight = Number((window.getComputedStyle(document.querySelector('#chart').parentNode).getPropertyValue('height')).replace('px', ''));

  const margin = {top: 20, right: 60, bottom: 60, left: 30};
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

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
    .domain([d3.timeMinute.offset(minDate, 1), maxDate])
    .range([0, width]);

  const yLeft = d3
    .scaleLinear()
    .domain([0, 200])
    .range([height, 0]);

  const yRight = d3
    .scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

  const lineOne = d3.line()
    .x(d => x(d.minDate))
    .y(d => yLeft(d.Gaszak_hoogte_hu));

  const lineTwo = d3.line()
    .x(d => x(d.minDate))
    .y(d => yRight(d.PT100_real_2));

  // Draw the axis
  const xAxis = d3
    .axisBottom()
    .tickFormat(d => {
      const date = d3.timeMinute.offset(d, -ticks);
      return formatTime(date);
    })
    .scale(x);

  const yAxisLeft = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yLeft);

  const yAxisRight = d3
    .axisRight()
    .ticks(6)
    .tickSize(width)
    .scale(yRight);

  const axisX = chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  const axisYLeft = chart.append('g')
    .attr('class', 'y axis left')
    .style('fill', '#9b59b6')
    .call(yAxisLeft);

  const axisYRight = chart.append('g')
    .attr('class', 'y axis right')
    .style('fill', '#e67e22')
    .call(yAxisRight);

  const pathOne = chart
    .append('g')
    .attr('stroke', '#e67e22')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  const pathTwo = chart
    .append('g')
    .attr('stroke', '#9b59b6')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  socket.on('dataPoint', point => {
    const dateTime = `${point.Date} ${point.Time}`;

    const parsedDateTime = parseTime(dateTime);

    point.minDate = parsedDateTime;
    point.maxDate = d3.timeMinute.offset(minDate, ticks);

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
    pathOne.datum(data)
      .attr('class', 'lineOne')
      .attr('d', lineOne);

    pathTwo.datum(data)
      .attr('class', 'lineTwo')
      .attr('d', lineTwo);

    // Shift the chart left
    x
      .domain([d3.timeMinute.offset(minDate, -1), maxDate]);

    axisYLeft
      .call(yAxisLeft);

    axisYRight
      .call(yAxisRight);

    axisX
      .call(xAxis);
  }
}
