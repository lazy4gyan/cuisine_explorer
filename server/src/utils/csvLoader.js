const csv = require('csvtojson');
const path = require('path');

const loadCSV = async () => {
  const csvFilePath = path.join(__dirname, '../../data/indian_food.csv');
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
};

module.exports = { loadCSV };
