const lineByLine = require('line-by-line');
const file = new lineByLine('../data/data/worked-data.csv');

let yValues = [];

file.on('error', function (err) {
    // 'err' contains error object
});

file.on('line', function (line) {
    // pause emitting of lines...
    file.pause();

    // ...do your asynchronous line processing..
    setTimeout(function () {
        let data = line.split(',');
        let averageTemperature = (parseFloat(data[2]) + parseFloat(data[3])) / 2;
        yValues.push(averageTemperature.toFixed(2));
        if (yValues.length > 5) yValues.shift();
        calculateDirection();
        file.resume();
    }, 100);
});

file.on('end', function () {
    // All lines are read, file is closed now.
});

function calculateDirection() {
    let direction;
    let xValues = Array.apply(null, {length: yValues.length}).map(Number.call, Number);
    let regression = linearRegression(yValues, xValues);
    console.log(regression);
}
// http://www.localwisdom.com/blog/2014/01/get-trend-line-javascript-graph-linear-regression/
function linearRegression(y, x) {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr;
}