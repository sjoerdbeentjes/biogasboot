// const d3 = require('d3');
//
// const firstYear = document.querySelector('#firstYear');
// const secondYear = document.querySelector('#secondYear');
// const firstMonth = document.querySelector('#firstMonth');
// const secondMonth = document.querySelector('#secondMonth');
//
// const range = {};
//
// // Parse the date / time
// const parseDate = d3.timeParse('%d-%b-%y');
// const parseYear = d3.timeParse('%Y');
// const parseMonth = d3.timeParse('%Y-%m');
//
// if (firstYear && secondYear && firstMonth && secondMonth) {
//   firstYear.addEventListener('change', e => {
//     const value = e.target.value;
//
//     range.firstYear = value;
//
//     getRange();
//   });
//
//   secondYear.addEventListener('change', e => {
//     const value = e.target.value;
//
//     range.secondYear = value;
//
//     getRange();
//   });
//
//   firstMonth.addEventListener('change', e => {
//     const value = e.target.value;
//     const year = firstYear.value;
//
//     range.firstMonth = value;
//     range.firstYear = year;
//
//     getRange();
//   });
//
//   secondMonth.addEventListener('change', e => {
//     const value = e.target.value;
//     const year = secondYear.value;
//
//     range.secondMonth = value;
//     range.secondYear = year;
//
//     getRange();
//   });
// }
//
// function getRange() {
//   if (range.firstMonth) {
//     console.log(showMonth(range.firstMonth, range.firstYear));
//   }
// }
//
// function showWeek(weekNumber, yearNumber) {
//   const year = parseYear(yearNumber);
//   const yearUnix = year / 1000;
//
//   const weekNumberUnix = yearUnix + ((7 * weekNumber) * 86400);
//   const weekNumberFromWeekNumberUnix = weekNumberUnix + (7 * 86400);
//
//   const url = `/api?dateStart=${weekNumberUnix}&dateEnd=${weekNumberFromWeekNumberUnix}&format=d`;
//
//   return url;
// }
//
// function showMonth(monthNumber, yearNumber) {
//   const month = parseMonth(`${yearNumber}-${monthNumber}`);
//   const monthFromMonth = parseMonth(`${yearNumber}-${monthNumber + 1}`);
//
//   const monthUnix = month / 1000;
//   const monthFromMonthUnix = monthFromMonth / 1000;
//
//   const url = `/api?dateStart=${monthUnix}&dateEnd=${monthFromMonthUnix}&format=d`;
//
//   return url;
// }
//
// function showYear(yearNumber) {
//   const year = parseYear(yearNumber);
//   const yearFromYear = parseYear(yearNumber + 1);
//
//   const yearUnix = year / 1000;
//   const yearFromYearUnix = yearFromYear / 1000;
//
//   const url = `/api?dateStart=${yearUnix}&dateEnd=${yearFromYearUnix}&format=d`;
//
//   return url;
// }
