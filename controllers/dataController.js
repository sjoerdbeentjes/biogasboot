const lineByLine = require('line-by-line');
const file = new lineByLine('../data/data/worked-data.csv');
let heaterStatus;

file.on('error', function (err) {
    // 'err' contains error object
});

file.on('line', function (line) {
    // pause emitting of lines...
    file.pause();

    // ...do your asynchronous line processing..
    setTimeout(function () {
        let data = line.split(',');
        let averageTemp = (parseFloat(data[2]) + parseFloat(data[3]))/2;

        if (averageTemp <= 34) {heaterStatus = true};
        if (heaterStatus && averageTemp >= 36.7) {heaterStatus = false};

        if (heaterStatus) console.log("verwarming is aan")
        else console.log("verwarming is uit")

        file.resume();
    }, 1);
});

file.on('end', function () {
    // All lines are read, file is closed now.
});