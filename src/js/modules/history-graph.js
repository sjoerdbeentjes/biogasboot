const d3 = require('d3');

if (document.querySelector('#history-graph')) {
  const containerWidth = parseInt(window.getComputedStyle(document.querySelector('#history-graph').parentNode).getPropertyValue('width'));
  const containerHeight = parseInt(window.getComputedStyle(document.querySelector('#history-graph').parentNode).getPropertyValue('height'));

  // Set the dimensions of the canvas / graph
  const margin = {top: 20, right: 40, bottom: 60, left: 40};
  const width = containerWidth - margin.left - margin.right - 32;
  const height = containerHeight - margin.top - margin.bottom - 16;

  // Parse the date / time
  const parseDate = d3.timeParse('%d-%b-%y');

  // Set the ranges
  const x = d3
    .scaleTime()
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .range([height, 0]);

  // Define the axes
  const xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(5);

  const yAxis = d3
    .axisLeft()
    .scale(y)
    .tickSize(-width)
    .ticks(5);

  // Define the line
  const valueline = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.Bag_Height));

  // Adds the svg canvas
  const svg = d3.select('#history-graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Get the data
  d3.json('http://localhost:3000/api/all?dateStart=1489720179&dateEnd=1490268059', (error, data) => {
    data.forEach(d => {
      d.date = new Date(d['Date']);
      d.Bag_Height = +d.Bag_Height;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.date));

    y.domain([
      0,
      d3.max(data, d => d.Bag_Height)
    ]);

    // Add the valueline path.
    svg.append('path').attr('class', 'line').attr('d', valueline(data));

    // Add the X Axis
    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

    // Add the Y Axis
    svg.append('g').attr('class', 'y axis').call(yAxis);
  });

  // ** Update data section (Called from the onclick)
  function updateData() {
    // Get the data again
    d3.json('http://localhost:3000/api/all?dateStart=1489714560&dateEnd=1489716600', (error, data) => {
      data.forEach(d => {
        d.date = new Date(d['Date']);
        d.Bag_Height = +d.Bag_Height;
      });

      console.log(data);

      // Scale the range of the data again
      x.domain(d3.extent(data, d => {
        return d.date;
      }));

      y.domain([
        0,
        d3.max(data, d => {
          return d.Bag_Height;
        })
      ]);

      // Select the section we want to apply our changes to
      const svg = d3.select('body').transition();

      // Make the changes
      svg.select('.line')
        .duration(750).attr('d', valueline(data));

      svg.select('.x.axis')
        .duration(750).call(xAxis);

      svg.select('.y.axis')
        .duration(750).call(yAxis);
    });
  }

  setTimeout(() => {
    updateData();
  }, 1000);
}