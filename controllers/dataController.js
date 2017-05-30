const lineByLine = require('line-by-line');
const file = new lineByLine('../data/data/worked-data.csv');

let arrayToDetermineDirection = [];

file.on('error', function (err) {
    // 'err' contains error object
});

file.on('line', function (line) {
    // pause emitting of lines...
    file.pause();

    // ...do your asynchronous line processing..
    setTimeout(function () {
        let data = line.split(',');
        let averageTemperature = (parseInt(data[2]) + parseInt(data[3])) / 2;
        arrayToDetermineDirection.push(averageTemperature);
        calculateDirection();
        file.resume();
    }, 100);
});

file.on('end', function () {
    // All lines are read, file is closed now.
});