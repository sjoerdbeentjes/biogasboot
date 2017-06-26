const maxBagValue = 200;
const bagValues = [
  130, // warning
  160 // error
];

if (document.getElementById('currentData')) {
  const io = require('socket.io-client');
  const socket = io.connect();

  socket.on('dataPoint', (points, tileStatus) => {
    // Get current number of bag height
    const currentBag = Number(points[points.length - 1].Bag_Height);
    const currentTemp = (Number(points[points.length - 1].Temp_PT100_1) + Number(points[points.length - 1].Temp_PT100_2)) / 2;
    const currentPh = Number(points[points.length - 1].pH_Value);

    setValue('#bagCurrent', Math.round(currentBag), tileStatus.gasbagStatus);
    setValue('#tempCurrent', parseFloat(Math.round(currentTemp * 10) / 10).toFixed(1), tileStatus.tempStatus);
    setValue('#phCurrent', parseFloat(Math.round(currentPh * 100) / 100).toFixed(2), tileStatus.phStatus);

    setMeterBar(tileStatus.gasbagStatus, currentBag);
  });
}

function setValue(selector, value, status) {
  const valueEl = document.querySelector(`${selector} .value`);
  const indicatorEl = document.querySelector(selector);

  if (Number(valueEl.innerHTML) !== value) {
    // Update value
    valueEl.innerHTML = value;
    // Indicator
    // Explain number meanings
    // 0 = Good
    // 1 = Error
    indicatorEl.setAttribute('data-status', status);
  }
}

function setMeterBar(status, value) {
  const el = document.querySelector('#currentData .meter .meter-inner');
  let color;

  if (status === 0) {
    color = '#2ecc71';
  } else if (status === 1 || status === 2) {
    color = '#e74c3c';
  }

  el.style.width = `${(value / maxBagValue) * 100}%`;
  el.style.backgroundColor = color;
}

const weatherApi = {
  value: document.querySelector(`#tempCurrentOutside .value`),
  icon: document.querySelector(`#tempCurrentOutside .icon`),
  url: 'http://api.openweathermap.org/data/2.5/weather',
  key: 'APPID=3e418cff30ae27d7220280cdf07d7a86',
  location: {
    lat: 'lat=52.394063',
    lon: 'lon=4.911307'
  },
  checkTemperature() {
    fetch(`${this.url}?${this.location.lat}&${this.location.lon}&${this.key}&units=metric`)
      .then(data => data.json())
      .then(data => {
        this.value.innerHTML = data.main.temp;
        this.icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      });
  }
};

if (document.getElementById('tempCurrentOutside')) weatherApi.checkTemperature();
