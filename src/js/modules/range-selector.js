const firstYear = document.querySelector('#firstYear');
const secondYear = document.querySelector('#secondYear');
const firstMonth = document.querySelector('#firstMonth');
const secondMonth = document.querySelector('#secondMonth');

const range = {};

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

    range.firstMonth = value;

    getRange();
  });

  secondMonth.addEventListener('change', e => {
    const value = e.target.value;

    range.secondMonth = value;

    getRange();
  });
}

function getRange() {
  console.log(range);
}
