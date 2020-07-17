#!/usr/bin/env node
const fs = require('fs')
const { Parser } = require('json2csv');

const parseCsv = (json) => {
    const csvParser = new Parser()
    return csvParser.parse(json)
}

const run = async () => {
  const data = fs.readFileSync('./data/comments.json', {encoding:'utf8', flag:'r'});
  const csv = parseCsv(JSON.parse(data));
  fs.writeFileSync('./data/comments.csv', csv);
}

run();