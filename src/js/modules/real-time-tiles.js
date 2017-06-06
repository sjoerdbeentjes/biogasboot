const io = require('socket.io-client');

const socket = io.connect();

socket.on('dataPoint', point => {
  console.log(point);

  // Get bag value element
  const bagElementValue = document.getElementById('bagCurrent').getElementsByClassName('value')[0];

  // Get current number of bag height
  let currentBag = Number(point.Gaszak_hoogte_hu);

  // Round to number
  currentBag = Math.round(currentBag);

  // Only updates the tile when the value is different
  if (Number(bagElementValue.innerHTML) !== currentBag) {
    // Update value
    bagElementValue.innerHTML = currentBag;
  }

  // Get temp value element
  const tempElementValue = document.getElementById('tempCurrent').getElementsByClassName('value')[0];

  // Get both temps
  const currentTemp1 = Number(point.PT100_real_1);
  const currentTemp2 = Number(point.PT100_real_2);

  // Average temp
  let currentTemp = (currentTemp1 + currentTemp2) / 2;

  // Round to 1 decimal
  currentTemp = Math.round(currentTemp * 10 ) / 10;

  // Only updates the tile when the value is different
  if (Number(tempElementValue.innerHTML) !== currentTemp.toFixed(1)) {
    // Update value
    tempElementValue.innerHTML = currentTemp.toFixed(1);
  }

  // Get PH value element
  const phElementValue = document.getElementById('phCurrent').getElementsByClassName('value')[0];

  // Get both temps
  let currentPh = Number(point.ph_value);

  // Round to number
  currentPh = Math.round(currentPh);

  // Only updates the tile when the value is different
  if (Number(phElementValue.innerHTML) !== currentPh) {
    // Update value
    phElementValue.innerHTML = currentPh;
  }

  // Get input value element
  const inputElementValue = document.getElementById('inputCurrent').getElementsByClassName('value')[0];

  // Get both temps
  let currentInput = Number(point.input_value);

  // Round to number
  currentInput = Math.round(currentInput);

  // Only updates the tile when the value is different
  if (Number(inputElementValue.innerHTML) !== currentInput) {
    // Update value
    inputElementValue.innerHTML = currentInput;
  }

  // Get heater value element
  const heaterElementValue = document.getElementById('heaterCurrent').getElementsByClassName('value')[0];

  // Get both temps
  const currentHeater = Number(point.heater_status);

  if (currentHeater === 0) {
    heaterElementValue.innerHTML = 'Uit';
  } else if (currentHeater === 1) {
    heaterElementValue.innerHTML = 'Aan';
  }

  // // Only updates the tile when the value is different
  // if (Number(heaterElementValue.innerHTML) !== currentHeater) {
  //   // Update value
  //   heaterElementValue.innerHTML = currentHeater;
  // }
});
