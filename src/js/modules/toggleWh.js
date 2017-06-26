const options = document.querySelectorAll('.energyMargin');
const kwh = document.querySelectorAll('.kWh');
const wh = document.querySelectorAll('.Wh');

options.forEach(option => {
  option.addEventListener('click', e => {
    check(e);
  });
});

wh.forEach(cell => cell.classList.add('show'));

function check(e) {
  wh.forEach(option => option.classList.remove('show'));
  kwh.forEach(option => option.classList.remove('show'));

  if (e.target.id === 'kWhCheck') {
    kwh.forEach(cell => cell.classList.add('show'));
  } else if (e.target.id === 'WhCheck') {
    wh.forEach(cell => cell.classList.add('show'));
  }
}
