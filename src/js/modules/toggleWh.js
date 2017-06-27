const options = document.querySelectorAll('.energyMargin');
const kwh = document.querySelectorAll('.kWh');
const wh = document.querySelectorAll('.Wh');

Array.prototype.forEach.call(options, option => {
  option.addEventListener('click', e => {
    check(e);
  });
});

Array.prototype.forEach.call(wh, cell => cell.classList.add('show'));

function check(e) {
  Array.prototype.forEach.call(wh, option => option.classList.remove('show'));
  Array.prototype.forEach.call(kwh, option => option.classList.remove('show'));

  if (e.target.id === 'kWhCheck') {
    Array.prototype.forEach.call(kwh, cell => cell.classList.add('show'));
  } else if (e.target.id === 'WhCheck') {
    Array.prototype.forEach.call(wh, cell => cell.classList.add('show'));
  }
}
