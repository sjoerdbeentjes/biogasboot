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

  const yHoogte = d3
    .scaleLinear()
    .domain([0, 200])
    .range([height, 0]);

  const yTemp = d3
    .scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

  const yPH = d3
    .scaleLinear()
    .domain([0, 14])
    .range([height, 0]);

  const yInput = d3
    .scaleLinear()
    .domain([0, 20])
    .range([height, 0]);

  const yHeater = d3
    .scaleLinear()
    .domain([0, 2])
    .range([height, 0]);

  const lineHoogte = d3.line()
    .x(d => x(d.minDate))
    .y(d => yHoogte(d.Gaszak_hoogte_hu));

  const lineTemp = d3.line()
    .x(d => x(d.minDate))
    .y(d => yTemp(d.PT100_real_2));

  const linePH = d3.line()
    .x(d => x(d.minDate))
    .y(d => yPH(d.ph_value));

  const lineInput = d3.line()
    .x(d => x(d.minDate))
    .y(d => yInput(d.input_value));

  const lineHeater = d3.line()
    .x(d => x(d.minDate))
    .y(d => yHeater(d.heater_status));

  // Draw the axis
  const xAxis = d3
    .axisBottom()
    .tickFormat(d => {
      const date = d3.timeMinute.offset(d, -ticks);
      return formatTime(date);
    })
    .scale(x);

  const yAxisHoogte = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yHoogte);

  const yAxisTemp = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yHoogte);

  const yAxisPH = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yHoogte);

  const yAxisInput = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yHoogte);

  const yAxisHeater = d3
    .axisLeft()
    .ticks(6)
    .tickSize(-width)
    .scale(yHoogte);

  const axisX = chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  const axisYHoogte = chart.append('g')
    .attr('class', 'y axis hoogte')
    .style('fill', '#9b59b6')
    .call(yAxisHoogte);

  const axisYTemp = chart.append('g')
    .attr('class', 'y axis temp')
    .style('fill', '#9b59b6')
    .call(yAxisTemp);

  const axisYPH = chart.append('g')
    .attr('class', 'y axis ph')
    .style('fill', '#9b59b6')
    .call(yAxisPH);

  const axisYInput = chart.append('g')
    .attr('class', 'y axis input')
    .style('fill', '#9b59b6')
    .call(yAxisInput);

  const axisYHeater = chart.append('g')
    .attr('class', 'y axis heater')
    .style('fill', '#9b59b6')
    .call(yAxisHeater);

  const pathHoogte = chart
    .append('g')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  const pathTemp = chart
    .append('g')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  const pathPH = chart
    .append('g')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  const pathInput = chart
    .append('g')
    .attr('transform', `translate(${x(d3.timeMinute.offset(maxDate, 2))})`)
    .append('path');

  const pathHeater = chart
    .append('g')
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
    pathHoogte.datum(data)
      .attr('class', 'line line-hoogte')
      .attr('d', lineHoogte);

    pathTemp.datum(data)
      .attr('class', 'line line-temp')
      .attr('d', lineTemp);

    pathPH.datum(data)
      .attr('class', 'line line-ph')
      .attr('d', linePH);

    pathInput.datum(data)
      .attr('class', 'line line-input')
      .attr('d', lineInput);

    pathHeater.datum(data)
      .attr('class', 'line line-heater')
      .attr('d', lineHeater);

    // Shift the chart left
    x
      .domain([d3.timeMinute.offset(minDate, -1), maxDate]);

    axisYHoogte
      .call(yAxisHoogte);

    axisYTemp
      .call(yAxisTemp);

    axisYPH
      .call(yAxisPH);

    axisYInput
      .call(yAxisInput);

    axisYHeater
      .call(yAxisHeater);

    axisX
      .call(xAxis);
  }
}
