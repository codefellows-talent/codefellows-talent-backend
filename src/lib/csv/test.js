const parseCSV = require('../csv-parser.js');
const fs = require('fs');

fs.readFile('./sample.csv', 'utf8', (err, data) => {
  if(err) {
    return console.error(err);
  }
  parseCSV(data)
    .then(res => console.log(res[0]))
    .catch(err => console.error(err));
});
