const io = require('socket.io-client');

const socket = io.connect();

const colors = [
  {
    id: 1,
    used: false,
    hex: '#3498db' // blue
  },
  {
    id: 2,
    used: false,
    hex: '#e67e22' // orange
  }
];

socket.on('dataPoint', point => {
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
  // Change status text in tile, only when there is a change
  if (currentHeater === 0) {
    if (heaterElementValue.innerHTML !== 'Uit') {
      heaterElementValue.innerHTML = 'Uit';
    }
  } else if (currentHeater === 1) {
    if (heaterElementValue.innerHTML !== 'Aan') {
      heaterElementValue.innerHTML = 'Aan';
    }
  }
});

// Toggle tiles max 2 selected
const getButtons = document.querySelectorAll('#currentData > button');
let i;
let count = 0;

// Loop through buttons
getButtons.forEach(button => {
  button.addEventListener('click', function () {
    const type = this.getAttribute('data-type');

    const line = document.querySelector(`.line-${type}`);

    // select max of 2
    if (count < 2) {
      this.classList.toggle('active');

      if (this.classList.contains('active')) {
        count++;
      } else {
        count--;
      }

      if (line.parentNode.classList.contains('show')) {
        const colorId = Number(this.getAttribute('data-color'));

        line.parentNode.classList.remove('show');

        colors.forEach(color => {
          if (color.id === colorId) {
            color.used = false;
          }
        });
      } else {
        let color;

        if (colors[0].used) {
          color = colors[1];
          colors[1].used = true;

          this.setAttribute('data-color', color.id);

          console.log(this.querySelector('.indicator'));

          this.querySelector('.indicator').style.background = color.hex;
        } else {
          color = colors[0];
          colors[0].used = true;

          this.setAttribute('data-color', color.id);

          console.log(this.querySelector('.indicator'));

          this.querySelector('.indicator').style.background = color.hex;
        }

        line.parentNode.classList.add('show');
        line.parentNode.style.stroke = color.hex;
      }
    } else if (this.classList.contains('active')) {
      // When 2 are selected this is the way to remove an active class
      this.classList.remove('active');
      count--;

      if (line.parentNode.classList.contains('show')) {
        const colorId = Number(this.getAttribute('data-color'));

        line.parentNode.classList.remove('show');

        colors.forEach(color => {
          colors.forEach(color => {
            if (color.id === colorId) {
              color.used = false;
            }
          });
        });
      }
    }

    console.log(colors);
  });
});
