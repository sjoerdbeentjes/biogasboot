const maxBagValue = 200;
const bagValues = [
  130, // warning
  160 // error
];

if (document.getElementById('currentData')) {
  const io = require('socket.io-client');
  const socket = io.connect();

  socket.on('dataPoint', (points, tileStatus) => {
    console.log(tileStatus);
    // Get current number of bag height
    const currentBag = Number(points[points.length - 1].Gaszak_hoogte_hu);
    const currentTemp = (Number(points[points.length - 1].PT100_real_1) + Number(points[points.length - 1].PT100_real_2)) / 2;
    const currentPh = Number(points[points.length - 1].ph_value);

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
  } else if (status === 1) {
    color = '#e74c3c';
  }

  el.style.width = `${(value / maxBagValue) * 100}%`;
  el.style.backgroundColor = color;
}
