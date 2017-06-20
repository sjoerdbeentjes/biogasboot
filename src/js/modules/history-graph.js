const d3 = require('d3');

if (document.querySelector('#history-graph')) {
  const containerWidth = parseInt(window.getComputedStyle(document.querySelector('#history-graph').parentNode).getPropertyValue('width'));
  const containerHeight = parseInt(window.getComputedStyle(document.querySelector('#history-graph').parentNode).getPropertyValue('height'));

  // Set the dimensions of the canvas / graph
  const margin = {top: 20, right: 40, bottom: 60, left: 40};
  const width = containerWidth - margin.left - margin.right - 32;
  const height = containerHeight - margin.top - margin.bottom - 16;

  const firstYear = document.querySelector('#firstYear');
  const secondYear = document.querySelector('#secondYear');
  const firstMonth = document.querySelector('#firstMonth');
  const secondMonth = document.querySelector('#secondMonth');

  const filters = document.querySelector('.filters');

  const usedValues = [{
    name: 'Bag_Height',
    title: 'Gaszak-hoogte',
    min: 0,
    max: 400
  }, {
    name: 'pH_Value',
    title: 'PH-waarde',
    min: 5,
    max: 10
  }, {
    name: 'Temp_PT100_1',
    title: 'Temperatuur',
    min: 0,
    max: 100
  }];

  const range = {
    firstYear: firstYear.value,
    secondYear: secondYear.value,
    firstMonth: firstMonth.value,
    secondMonth: secondMonth.value
  };

  const drawnValues = [0, 1];

  // Parse the date / time
  const parseDate = d3.timeParse('%d-%b-%y');
  const parseYear = d3.timeParse('%Y');
  const parseMonth = d3.timeParse('%Y-%m');

  // Set the ranges
  const x = d3
    .scaleTime()
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .range([height, 0]);

  const y1 = d3
    .scaleLinear()
    .range([height, 0]);

  // Define the axes
  const xAxis = d3
    .axisBottom()
    .scale(x);

  const yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(5)
    .tickSize(-width);

  const y1Axis = d3
    .axisRight()
    .scale(y1)
    .ticks(5)
    .tickSize(-width);

  // Define the line
  const valueline = d3.line()
    .x(d => x(d.date))
    .y(d => y(d[usedValues[drawnValues[0]].name] / d.count));

  const compareValueline = d3.line()
    .x(d => x(d.date))
    .y(d => y(d[usedValues[drawnValues[1]].name] / d.count));

  // Adds the svg canvas
  const svg = d3.select('#history-graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  usedValues.forEach(value => {
    const el = document.createElement('button');
    el.innerHTML = value.title;
    el.setAttribute('name', value.name);
    el.addEventListener('click', e => {
      console.log(e);
    });
    filters.appendChild(el);
  });

  // Get the data
  d3.json(showMonth(firstMonth.value, firstYear.value), (error, data) => {
    console.log(data);

    data.forEach(d => {
      d.date = new Date(d['Date']);
      d.Bag_Height = +d.Bag_Height;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.date));

    y.domain([usedValues[drawnValues[0]].min, usedValues[drawnValues[0]].max]);
    y1.domain([usedValues[drawnValues[1]].min, usedValues[drawnValues[1]].max]);

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line')
      .attr('d', valueline(data));

    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append('g')
      .attr('class', 'y axis right')
      .attr('transform', `translate(${width})`)
      .call(y1Axis);
  });

  // ** Update data section (Called from the onclick)
  function updateData(url) {
    // Get the data again
    d3.json(url, (error, data) => {
      console.log(data);

      data.forEach(d => {
        if (d.count) {
          d.Bag_Height = +d.Bag_Height / d.count;
        } else {
          d.Bag_Height = +d.Bag_Height;
        }
        d.date = new Date(d['Date']);
      });

      // Scale the range of the data again
      x.domain(d3.extent(data, d => {
        return d.date;
      }));

      y.domain([0, 400]);

      // Select the section we want to apply our changes to
      const svg = d3.select('body').transition();

      // Make the changes
      svg.select('.line')
        .duration(750).attr('d', valueline(data));

      svg.select('.x.axis')
        .duration(750).call(xAxis);

      svg.select('.y.axis')
        .duration(750).call(yAxis);

      svg.select('.y.axis.right')
        .duration(750).call(y1Axis);
    });
  }

  function updateCompareData(url) {
    d3.json(url, (error, data) => {
      console.log(data);
    });
  }

  function showMonth(monthNumber, yearNumber) {
    const month = parseMonth(`${yearNumber}-${monthNumber}`);
    const monthFromMonth = parseMonth(`${yearNumber}-${Number(monthNumber) + 1}`);

    const monthUnix = month / 1000;
    const monthFromMonthUnix = monthFromMonth / 1000;

    const url = `/api?dateStart=${monthUnix}&dateEnd=${monthFromMonthUnix}&format=d&api_key=CMD17`;

    return url;
  }

  if (firstYear && secondYear && firstMonth && secondMonth) {
    firstYear.addEventListener('change', e => {
      const value = e.target.value;

      range.firstYear = value;

      getRange();
    });

    secondYear.addEventListener('change', e => {
      const value = e.target.value;

      range.secondYear = value;

      getRange();
    });

    firstMonth.addEventListener('change', e => {
      const value = e.target.value;
      const year = firstYear.value;

      range.firstMonth = value;
      range.firstYear = year;

      getRange();
    });

    secondMonth.addEventListener('change', e => {
      const value = e.target.value;
      const year = secondYear.value;

      range.secondMonth = value;
      range.secondYear = year;

      getRange();
    });
  }

  // Get month for usage
  function showMonthUsage(monthNumber, yearNumber) {
    const month = parseMonth(`${yearNumber}-${monthNumber}`);

    const monthUnix = month / 1000;
    //const monthFromMonthUnix = monthFromMonth / 1000;
    const url = `/api/status/range/${monthUnix}?api_key=CMD17`;

    return url;
  }
  // Update usage table
  function updateCompareUsage(url, indicator) {
    const compareContainer = document.querySelector('#compare');
    compareContainer.classList.add('loading');
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        // First date
        if (indicator === 0) {
          let response = xhttp.responseText;
          response = JSON.parse(response);
          const compareTable = document.querySelector('#compareTable');
          Object.keys(response).map(function (key, index) {
            let getIDtd = document.getElementById(key);
            // Fill in the table
            getIDtd.getElementsByClassName('timeON')[0].innerHTML = (Number(response[key].timeON) / 60).toFixed(2);
            getIDtd.getElementsByClassName('kWh')[0].innerHTML = response[key].kWh;
          });
          compareContainer.classList.remove('loading');
        } // Second date
        else if (indicator === 1) {
          let response = xhttp.responseText;
          response = JSON.parse(response);
          const compareTable = document.querySelector('#compareTable');
          Object.keys(response).map(function (key, index) {
            let getIDtd = document.getElementById(key);
            // Fill in the table
            getIDtd.getElementsByClassName('timeON')[1].innerHTML = (Number(response[key].timeON) / 60).toFixed(2);
            getIDtd.getElementsByClassName('kWh')[1].innerHTML = response[key].kWh;
          });
          compareContainer.classList.remove('loading');
        }
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function getRange() {
    if (range.secondYear === '0' || range.secondMonth === '0') {
      updateData(showMonth(range.firstMonth, range.firstYear));
      updateCompareUsage(showMonthUsage(range.firstMonth, range.firstYear), 0);
    } else {
      updateData(showMonth(range.firstMonth, range.firstYear));
      updateCompareData(showMonth(range.secondMonth, range.secondYear));
      updateCompareUsage(showMonthUsage(range.secondMonth, range.secondYear), 1);
    }
  }
}
