if (document.getElementById('currentData')) {

  const io = require('socket.io-client');
  const socket = io.connect();

  socket.on('dataPoint', (points, tileStatus) => {
    // Get bag value element
    const bagElementValue = document.querySelector('#bagCurrent .value');

    // Get current number of bag height
    let currentBag = Number(points[points.length - 1].Gaszak_hoogte_hu);

    // Round to number
    currentBag = Math.round(currentBag);

    // Only updates the tile when the value is different
    if (Number(bagElementValue.innerHTML) !== currentBag) {
      // Update value
      bagElementValue.innerHTML = currentBag;
    }

    // Get temp value element
    const tempElementValue = document.querySelector('#tempCurrent .value');

    // Get both temps
    const currentTemp1 = Number(points[points.length - 1].PT100_real_1);
    const currentTemp2 = Number(points[points.length - 1].PT100_real_2);

    // Average temp
    let currentTemp = (currentTemp1 + currentTemp2) / 2;

    // Round to 1 decimal
    currentTemp = parseFloat(Math.round(currentTemp * 10) / 10).toFixed(1);

    // Only updates the tile when the value is different
    if (Number(tempElementValue.innerHTML) !== currentTemp) {
      // Update value
      tempElementValue.innerHTML = currentTemp;
    }

    // Get PH value element
    const phElementValue = document.querySelector('#phCurrent .value');

    // Get both temps
    let currentPh = Number(points[points.length - 1].ph_value);

    // Round to 2 decimal
    currentPh = parseFloat(Math.round(currentPh * 100) / 100).toFixed(2);

    // Only updates the tile when the value is different
    if (Number(phElementValue.innerHTML) !== currentPh) {
      // Update value
      phElementValue.innerHTML = currentPh;
      // Indicator
      // Explain number meanings
      // 0 = Good
      // 1 = Warning
      // 2 = Error
      document.getElementById('phCurrent').setAttribute('data-status', tileStatus.phStatus);
    }
  });
}
