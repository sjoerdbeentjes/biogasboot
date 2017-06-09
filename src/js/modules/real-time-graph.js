const d3 = require('d3');
const io = require('socket.io-client');

if (document.querySelector('#chart')) {
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
    .domain([0, 200])
    .range([height, 0]);

  let line = d3.line()
    .x(d => x(d.dateTime))
    .y(d => y(d.Gaszak_hoogte_hu));

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

  const path = chart
    .append('g')
    .attr('class', 'line')
    .attr('transform', `translate(${x(d3.timeMinute.offset(minDate, 30))})`)
    .append('path');

  const areaPath = chart
    .append('g')
    .append('rect')
    .attr('x', 0)
    .attr('y', y(140))
    .attr('width', width)
    .attr('height', 140)
    .style('fill', '#3498db')
    .style('opacity', 0.3);

  const warningLine = chart
    .append('g')
    .append('line')
    .attr('x0', 0)
    .attr('x1', width)
    .attr('y', y(180))

  socket.on('dataPoint', points => {
    const lastIndex = points.length - 1;

    const dateTime = `${points[lastIndex].Date} ${points[lastIndex].Time}`;

    const parsedDateTime = parseTime(dateTime);

    maxDate = parsedDateTime;
    minDate = d3.timeMinute.offset(maxDate, -ticks);

    points.forEach(point => {
      point.dateTime = parseTime(`${point.Date} ${point.Time}`);
    });

    tick(points);
  });

  // Main loop
  function tick(points) {
    data = [...data, ...points];

    console.log(minDate, maxDate);

    // Remote old data (max 20 points)
    if (data.length > ticks + 1) {
      data.shift();
    }

    // Draw new line
    path.datum(data)
      .attr('class', 'line line-hoogte')
      .attr('d', line);

    // Shift the chart left
    x
      .domain([minDate, maxDate]);

    line = d3.line()
      .x(d => x(d.dateTime))
      .y(d => y(d.Gaszak_hoogte_hu));

    axisY
      .call(yAxis);

    axisX
      .call(xAxis);
  }
}
