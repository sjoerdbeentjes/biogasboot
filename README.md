# Biogasboot data visualization
Through sensors that themselves report their data, data is generated about the fermentation process. This data is received by us and translated to a (data) visualisation for both operators and visitors that visit the cafe "De Ceuvel".

Biogasboot data visualization: [Live demo not available yet](#)

## Concept
We have 2 specific target audiences that both needed their own approach.
- **The operators** of the Biogasboot, they have to see all the data that is coming from the sensors of the Biogasboot.
- **The customers** of café De Ceuvel, they don't need all the data but only a fraction of it so realize what the Biogasboot does.

### Operators
The operator is the person who takes control of the food waste digester. He or she wants to know the current state of the digester with the current values of the process parameters. Historical data should be accessible to the operator to determine if a new adjustment had a good effect on the process compared to a previous run. Remarkable trends in the data should also be notified which the operator gets the response of.

### Customers
When a customer is at the bar he or she sees the large TV screen with the Biogasboot it's data. We know that all customers have to order add the bar so they have to see it. It's important that the customer almost instantly knows what the data on the screen means, this can be done for example with illustrations and leading titles. Also the customers have to know from what date the data is measured until the current date. They have to realize how "bio clean" café De Ceuvel's kitchen is.

## Usage
For now operators can see live visualizations of the data generated on the Biogasboot. The visualization shows all the values that are available. It is also possible to look at the historical data. The filter funcionality isn't finished yet though. There are multiple API endpoints that can be used to filter and format the data from the FTP server.

Administrators can register new accounts for other admins and operators. Soon a dashboard for Café de Ceuvel will follow, as well as a interactive website where users can learn more about the Biogasboot. See the ToDo list below for more functions to come!

## Stakeholders
- Operators of the Biogasboot.
- Customers of café "De Ceuvel".
- Employees of café "De Ceuvel".
- The planet :earth_africa:.

## Features
- User system with roles (register and login)
- User management panel for administrators
- Dashboard for the operators with live visualized data from the Biogasboot
- Dashboard for searching and comparing Historical data, visualized in D3
- Dashboard with live visualizations for in Café de Ceuvel


### Single features

***API: Filter data from the API***
This function gets all the data from the API and filters and formats it according to the date and format parameters. For example: Get the average per day in a specific range.
```javascript
function filterData(format, date, data) {
  const returnData = [];
  // Create a new dataObject
  const dataObject = {
    Date: new Date(Number(date) * 1000),
    'Temp_PT100_1': 0,
    'Temp_PT100_2': 0,
    pH_Value: 0,
    Bag_Height: 0,
    count: 0
  };
  const parsedDate = parseDate(new Date(Number(date) * 1000));
  // Fill the dataObject with the data of that day
  data.forEach(function(point) {
    let thisDate = parseDate(point.Date);
    if (thisDate == parsedDate) {
      dataObject['Temp_PT100_1'] = dataObject['Temp_PT100_1'] + Number(point['Temp_PT100_1']);
      dataObject['Temp_PT100_2'] = dataObject['Temp_PT100_2'] + Number(point['Temp_PT100_2']);
      dataObject['pH_Value'] = dataObject['pH_Value'] + Number(point['pH_Value']);
      dataObject['Bag_Height'] = dataObject['Bag_Height'] + Number(point['Bag_Height']);
      dataObject['count'] = dataObject['count'] + 1;
    }
  });
  returnData.push(dataObject);
  return returnData;
}
```

## Screenshots
![Live Operator Dashboard](screenshots/dashboard1.png)
![History Data Overview](screenshots/dashboard2.png)

## Used packages
* [x] [`BCryptjs`](https://www.npmjs.com/package/bcryptjs) Password hashing
* [x] [`Body-parser`](https://www.npmjs.com/package/body-parser) Middleware for body parsing
* [x] [`Connect-flash`](https://www.npmjs.com/package/connect-flash) Store messages in sessions
* [x] [`Cookie-parser`](https://www.npmjs.com/package/cookie-parser) Parse and populate cookies
* [x] [`CSV-parse`](https://www.npmjs.com/package/csv-parse) Convert CSV files into arrays and objects
* [x] [`D3`](https://www.npmjs.com/package/d3) Library for data visualizations
* [x] [`Debug`](https://www.npmjs.com/package/debug) Debugging utility
* [x] [`Dotenv`](https://www.npmjs.com/package/dotenv) Load enviroment variables from .env files
* [x] [`EJS`](https://www.npmjs.com/package/ejs) Templating library (Embedded JavaScript templates)
* [x] [`Express`](https://www.npmjs.com/package/express) Web framework for NodeJS (routing)
* [x] [`Express-session`](https://www.npmjs.com/package/express-session) Middleware for creating sessions
* [x] [`Express-validator`](https://www.npmjs.com/package/express-validator) Validator middleware for NodeJS
* [x] [`JSFtp`](https://www.npmjs.com/package/jsftp) Library for FTP access
* [x] [`Line-by-line`](https://www.npmjs.com/package/line-by-line) Reading big text documents without saving to the memory
* [x] [`Moment`](https://www.npmjs.com/package/moment) Parse, validate, manipulate, and display dates
* [x] [`MongoDB`](https://www.npmjs.com/package/mongodb) Official MongoDB library for NodeJS
* [x] [`Mongoose`](https://www.npmjs.com/package/mongoose) MongoDB object modeling
* [x] [`Morgan`](https://www.npmjs.com/package/morgan) HTTP request logger middleware for node.js
* [x] [`Node-Sass-Middleware`](https://www.npmjs.com/package/node-sass-middleware) Compiles .scss and .sass files
* [x] [`Passport`](https://www.npmjs.com/package/passport) Authentication for NodeJS
* [x] [`Passport-http`](https://www.npmjs.com/package/passport-http) HTTP Basic and Digest authentication strategies for Passport.
* [x] [`Passport-local`](https://www.npmjs.com/package/passport-local) Authentication addon for Passport
* [x] [`Request`](https://www.npmjs.com/package/request) Client for HTTP requests
* [x] [`Socket.io`](https://www.npmjs.com/package/socket.io) Enables websockets
* [x] [`Web-push`](https://www.npmjs.com/package/web-push) Library for push notifications

## ToDo
* [ ] Push notification for operators if something goes wrong
* [ ] Smart defaults for selecting range's / views in the backend
* [ ] Layout for the history section
* [ ] Filters for the history section
* [ ] D3 Graphs for comparing time ranges
* [ ] Interactive view of the Biogasboot
* [ ] Dashboard view for in Café de Ceuvel
* [ ] Possibility for admins to add event data to the dashboard
* [ ] Build a guide for the operator application

## Finished ToDo's
* [x] Range selector to select two dates and pass the range to the front-end
* [x] Data tiles on real-time dashboard have to change color based on status data
* [x] Create functions for showing week, month or year in history view
* [x] API endpoints for data in specific range
* [x] API endpoint for formatting data to get avarage values per day.
* [x] Get files via FTP based on timestamp

## Wishlist
* [ ] Live data from the Biogasboot

## API Endpoints
The application has multiple API endpoints. This is an overview of all the possibilities.

**All data**
```/api/all```
This call returns an object with all the data that is available.

**Date Range data**
```/api/all?dateStart=1489720679&dateEnd=1490268059```
This call returns an object with all the data within the specified date-range The date has to be a UNIX timestamp. You declare the start- and end datel

**Data for a specific day**
```/api/all?format=d&date=1490400000```
This call returns the data of a specific day. All values are added up and the 'count' value can be used to divide the values to get the average of that day. This call needs an UNIX timestamp as date.

**Average per day in a specific range**
```/api/all?dateStart=1489720679&dateEnd=1490268059&format=d```
Get the average per day in a specific range. Use a UNIX timestamp as date, followed by ```&format=d```

## Build / Install and start project

### Clone this repo

```
  git clone https://github.com/sjoerdbeentjes/biogasboot
  cd biogasboot
```

### Install the dependencies
```
npm install
```

### Build CSS and JS
This will build the minified and cleaned CSS and JavaScript files.
```
npm run build
```

### Start server
```
npm start
```

### Start server with live updates
```
npm run start-update
```

## Sources
- [De Biogasboot](http://www.biogasboot.nl/)
- [De Ceuvel](http://deceuvel.nl/nl/)

## Collaborators
Diego Staphorst   | Sjoerd Beentjes  | Timo Verkroost  | Camille Sébastien
--- | --- | --- | ---
![Diego Staphorst][diego] | ![Sjoerd Beentjes][sjoerd] | ![Timo Verkroost][timo] | ![Camille Sébastien][camille]
## License
MIT © Diego Staphorst, Sjoerd Beentjes, Timo Verkroost, Camille Sébastien

[diego]: https://avatars0.githubusercontent.com/u/10053770?v=3&s=400 "Diego Staphorst"

[sjoerd]: https://avatars3.githubusercontent.com/u/11621275?v=3&s=400 "Sjoerd Beentjes"

[timo]: https://avatars2.githubusercontent.com/u/17787175?v=3&s=400 "Timo Verkroost"

[Camille]: https://avatars1.githubusercontent.com/u/8942820?v=3&s=460 "Camille Sébastien"
