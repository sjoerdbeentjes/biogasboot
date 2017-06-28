# Contribution of Diego Staphorst
## Introduction
This project has been carried out together with [Sjoerd](https://github.com/sjoerdbeentjes). [Timo](https://github.com/TimoVerkroost) and [Camille](https://github.com/camille500), two classmates from the Amsterdam University of Applied Sciences. We executed our last project of the semester with a commissioner of [The Biogas Boat](http://www.biogasboot.nl/). This boat can convert organic waste into biogas which can be cooked with in [de Ceuvel](http://deceuvel.nl/). This has to be done to close loops, which helps by creating a sustainable environment.

In order to monitor the entire digestion process of organic waste into biogas, several sensors have been placed on the boat. These sensors are located in the digester, at the gas bag, on the boat to keep track of the gas supply to the Ceuvel and one for the temperature outside the boat.
## Table of contents
- [Contribution of Diego Staphorst](#contribution-of-diego-staphorst)
  - [Introduction](#introduction)
  - [Table of contents](#table-of-contents)
  - [Process](#process)
  - [Builded modules](#builded-modules)
    - [Module 1](#module-1)
  - [Subjects](#subjects)
    - [Web App from Scratch](#web-app-from-scratch)
    - [CSS to the Rescue](#css-to-the-rescue)
    - [Performance Matters](#performance-matters)
      - [MongoDB & Mongoose](#mongodb--mongoose)
      - [Browserify](#browserify)
      - [NPM scripts](#npm-scripts)
    - [Real-Time Web](#real-time-web)
    - [Web of Things](#web-of-things)
      - [Sensor data](#sensor-data)
      - [Device data](#device-data)

## Branches by me
- [Customer dashboard](https://github.com/sjoerdbeentjes/biogasboot/tree/feature/customer-dashboard_DBS)
- [Data manipulation of the first set of test data, this data has been discarded](https://github.com/sjoerdbeentjes/biogasboot/tree/feature/data-manipulation_DBS)
- [Creating an API route for getting the total of gas produced by the boat](https://github.com/sjoerdbeentjes/biogasboot/tree/feature/gas_produced_API_DBS)
- [Simulating temperature in the area of the biogas boat](https://github.com/sjoerdbeentjes/biogasboot/tree/feature/realTimeWeatherApi_DBS)
- [Adding schema for status data of the devices on the boat](https://github.com/sjoerdbeentjes/biogasboot/tree/feature/status-data_DBS)

I also worked in master directly if branches were not needed for the feature

## Subjects
I used a lot of new techniques that I learned during this Minor. I was working for the biggest part on managing the data we got from The BioGas Boat. But also did some frontend work.

- Working with API's
- Working with git/github
- Using design patterns in the frontend javascript
- Using design patterns in the Node.js backend
- Browserify
- NPM & NPM scripts
- Mongo & Mongoose

and so on. It was kinda hectic but I managed till now!

### Web App from Scratch
I worked on some parts the frontend of the real time dashboard like the current weather in the location of the boat. In the future the boat will contain it's own temperature sensors but for now we used an API from [openweathermap.org](https://openweathermap.org/api). This an API which works location based.

I made use of the object litteral design pattern. I also made use of the new ES6 style of coding which later was babelified for use in older browsers. Beneath in the details you can see an example of the API used.

<details>

```javascript
const weatherApi = {
  value: document.querySelector(`#tempCurrentOutside .value`),
  icon: document.querySelector(`#tempCurrentOutside .icon`),
  url: 'http://api.openweathermap.org/data/2.5/weather',
  key: 'APPID=3e418cff30ae27d7220280cdf07d7a86',
  location: {
    lat: 'lat=52.394063',
    lon: 'lon=4.911307'
  },
  checkTemperature() {
    fetch(`${this.url}?${this.location.lat}&${this.location.lon}&${this.key}&units=metric`)
      .then(data => data.json())
      .then(data => {
        this.value.innerHTML = data.main.temp;
        this.icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      });
  }
};

if (document.getElementById('tempCurrentOutside')) weatherApi.checkTemperature();
```

</details>

### CSS to the Rescue
I created the map structure for Sass, it is based on [DevTips Starter kit](https://github.com/DevTips/DevTips-Starter-Kit/tree/master/assets/css) but with a little twist to make it more biological. We used variables for storing data we had to reuse like the colors so it will be changed on the whole website when the variables changes. I also styled the first version of the customer dashboard which was not included in the final product because Camille was working on that part of the website when he started working with us.

<details>

- src/
  - scss/
    - 01-dna _______________________ # Config with typography, variables, colors
      - _dna.scss __________________ # Imports all scss files in this folder

    - 02-molecules _________________ # Styling of single HTML elements
      - _molecules.scss ____________ # Imports all scss files in this folder

    - 03-proteins __________________ # Styling of the elements containing other elements, like menu's
      - _base.scss _________________ # Imports all scss files in this folder

    - 04-cells _____________________ # Styling of pages
      - _base.scss _________________ # Imports all scss files in this folder

    - main.scss ____________________ # Imports all underscored files from the folders.

</details>

### Performance Matters
#### MongoDB & Mongoose
We did a lot about the performance because we were working with huge sets of data. The first problems arose with querying the mongo database. At first we were downloading the whole data set into the backend and parsed the data with Node.js. When I saw what the problem was we started using $match, $group, $aggregate which are functions for creating queries. This way you can ask the database storage to already manipulate the data which creates smaller JSON downloads. This way there al shorter loading times for the users which creates a better User Experience.

In the example below you can see the aggregate function which clumps data of a single day ($match) together. It takes the average of the day from the selected properties. By doing it this way we were able to reduce the send time by nearly 2 minutes, only a small part of the data had to be processed after getting it. 

<details>

```javascript
DataPoint.aggregate([{
      $match: {
          Date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          }
        },
    },
      {$group: {_id: {
        year: {$year: '$Date'},
        month: {$month: '$Date'},
        day: {$dayOfMonth: '$Date'}
       }, Temp_PT100_1: {
            $avg: '$Temp_PT100_1'
          },
          Temp_PT100_2: {
            $avg: '$Temp_PT100_2'
          },
          pH_Value: {
            $avg: '$pH_Value'
          },
          Bag_Height: {
            $avg: '$Bag_Height'
          },
          count: {
            $sum: 1
          },}
      },
      { $sort: {'_id.year':1, '_id.day':1} }
    ], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
```

</details>

#### Browserify
By using browserify we were able to work also in the frontend in modules. To keep structure in the project we had to this.

#### NPM scripts
To keep track and process files we made use of NPM scripts. Processing of the images to webp was also done I created the setup for this.

<details>

```json
  "scripts": {
    "start": "node ./bin/www",
    "start-update": "nodemon ./bin/www",
    "expose": "ngrok http 3000",
    "build-js": "mkdir -p public/js && browserify ./src/js/index.js -o ./public/js/index.js -t [ babelify --presets es2015 ]",
    "build-css": "mkdir -p public/css && node-sass --include-path scss src/scss/main.scss ./public/css/main.css",
    "build-webp": "node ./npm-scripts/webp.js",
    "build": "mkdir -p public/js && mkdir -p public/css && npm run build-js && npm run build-css",
    "watch-js": "mkdir -p public/js && watchify ./src/js/index.js -o ./public/js/index.js -t [ babelify --presets es2015 ]",
    "watch-css": "mkdir -p public/css && nodemon -e scss -x \"npm run build-css\"",
    "watch": "mkdir -p public/js && mkdir -p public/css && concurrently --kill-others \"npm run watch-js\" \"npm run watch-css\""
  }
```
```javascript
const imagemin = require('imagemin'); // The imagemin module.
const webp = require('imagemin-webp'); // imagemin's WebP plugin.

const outputFolder = '../public/images/'; // Output folder
const PNGImages = '../src/images/*.png'; // PNG images
const JPEGImages = '../src/images/*.jpg'; // JPEG images

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
    lossless: true // Losslessly encode images
  })]
});

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
});
```

</details>

### Real-Time Web
We got a semi real time web experience. All the data collected from the biogas boat for time being is set on a sd-card. In the future they will upload a file via 2G to a FTP. We simulated this by creating our own FTP where we put the files on. I was in charge of getting the data from the FTP to mongo and delivering it to the end users (operators, website viewers and restaurant dashboard). In the picture below you are able to see the data flow. To give the team a better view of the flow I created this flow chart.

![Data flow from boat to web](../md-media/flow-chart-data.png)

In this [getFTPFiles.js](https://github.com/sjoerdbeentjes/biogasboot/blob/master/modules/getFTPFiles.js) file I was working for getting the files from FTP to the database.


<details>

### Checking FTP for new data

```javascript
function checkLatestFileForNewData(file) {
  const formattedDate = moment(file.split('.')[0], 'YYMMDD');
  dataPoint.find({
    Date: {
      $gte: formattedDate.toDate(),
      $lt: formattedDate.add(1, 'days').toDate()
    }
  })
    .sort('-Date')
    .limit(1)
    .exec((err, latestDataPoint) => {
      new JSFtp(settingsFTP).get(`/uploads/VALUE/VALUE/${file}`, path.join(__dirname, `../data/ftp/VALUE/${file}`), hadErr => {
        if (hadErr) throw hadErr;
        fs.readFile(path.join(__dirname, `../data/ftp/VALUE/${file}`), (err, data) => {
          if (err) throw err;
          parse(data, {
            columns: ['Date', 'Time', 'Temp_PT100_1', 'Temp_PT100_2', 'pH_Value', 'Bag_Height']
          }, (err, parsedData) => {
            if (err) throw err;
            parsedData.shift(); // Remove headers from arrays
            parsedData = parsedData.map(dataPoint => {
              dataPoint.Date = moment(`${dataPoint.Date} ${dataPoint.Time}`, 'DD-MM-YYYY HH:mm:ss').toDate();
              delete dataPoint.Time;
              return dataPoint;
            });
            parsedData = parsedData.filter(dataPoint => dataPoint.Date > latestDataPoint[0].Date);
            if (parsedData.length > 0)
              addFileToMongo(parsedData);
          });
        });
      });
    });
}
```

</details>

<details>

#### Backend simulating realtime graph
In this function data is send to the frontend with Socket.io.
```javascript
function webSokets(app, io) {
  const range = 1483225200;
  const inputRange = 1;
  const months = moment.duration(inputRange, 'months').valueOf();
  const startDate = moment(Number(range) * 1000);
  const endDate = moment(Number(startDate + months));
  dataPoint.find({
      Date: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate()
      }
    },
    (err, dataPoints) => {
      let i = 0;
      const sendItemsCount = 30;
      let sendTimeOutHigh = false;
      let sendTimeOutLow = false;
      setInterval(() => {

        if (!dataPoints[i + sendItemsCount]) {
          i = 0;
        }

        const dataCollection = [];

        for (let x = 0; x <= sendItemsCount; x++) {
          dataCollection.push(dataPoints[x + i]);
          if (dataPoints[x + i].Bag_Height >= usedValues[2].high) {
            if (dataPoints[x + i - 1].Bag_Height < usedValues[2].high && sendTimeOutHigh === false) {
              sendTimeOutHigh = true;
              sendGasBagHigh();
            }
          } else if (dataPoints[x + i].Bag_Height <= usedValues[2].low) {
            if (dataPoints[x + i - 1].Bag_Height > usedValues[2].low && sendTimeOutLow === false) {
              sendTimeOutLow = true;
              sendGasBagLow();
            }
          }
        }

        i += 30;
        sendTimeOutHigh = false;
        sendTimeOutLow = false;
        io.sockets.emit('dataPoint', dataCollection, config.tileStatus(dataPoints[i]));
      }, 10000);
    });
}
```

</details>

### Web of Things
The BioGas boat has a lot of sensors on board. The operators and control panel need this to have an overlook about what is going on during the digestion process. On board are also different devices to help controlling the process, like heaters, mixers, feed pumps and blowers. To determine the efficiency in the boat, these are also included in the calculations. Below is a table of the various devices. 

#### Sensor data
    Date;Time;Temp_PT100_1;Temp_PT100_2;pH_Value;Bag_Height
    01/01/17;00:00:11;35.35;35.5;7.3;193

#### Device data
    Date,Time,Storagetank_Mixe,Storagetank_Feed,Digester_Mixer,Digester_Heater_,Digester_Heater_,Gaspump,Mode_Stop, Mode_Manual,Mode_Auto,System_Started,Additive_Pump
    01-01-2015,10:25:34,0,0,0,0,0,1,0,1,0,0,0

Above are the first 2 lines from both used files.

At the start of this project we did not have a big data collection, we had to create some data ourselves I created a small bash script which was able to create 2 years of data from the single file we had.
```bash
# for date in 2015-02-{01..28} 2015-{04,06,09,11}-{01..30} 2015-{03,05,07,08,10,12}-{01..31}
# for date in 2017-02-{01..28} 2017-04-{01..30} 2017-{01,03,05}-{01..31}
for date in 2015-01-{02..31}
do
    year=$(printf "%02s" ${date:2:2})
    month=$(printf "%02s" ${date:5:2})
    day=$(printf "%02s" ${date:8:2})
    fileName=$(printf "%02s%02s%02s.csv\n" $year $month $day )
    cat ./150101.csv | awk -v year=$year -v month=$month -v day=$day -F ',' 'BEGIN{
        OFS = ","
        } {
            if (substr($1,1,1) == "D") {print $0}
            else {$1="";print day"-"month"-20"year$0}
            }' >> $fileName
done
```

We were able to connect the script to the FTP which then downloaded the files from there if they were not in Mongo yet. This way we simulated the data flow according to what we were told. 
[FTP](https://github.com/sjoerdbeentjes/biogasboot/blob/master/modules/getFTPFiles.js)
