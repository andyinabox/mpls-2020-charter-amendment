#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob-fs')();
const pdf = require('pdf-parse');
const Sentiment = require('sentiment');
const { Parser } = require('json2csv');

const dateRe = /\d+\/\d+\/\d+ \d+:\d+:\d+ [AP]M\s+/g
const sentiment = new Sentiment()




const getCombinedText = async (files) => {
  let output = '';
  let buf
  let data
  for (let i = 0; i < files.length; i++) {
    buf = fs.readFileSync(files[i]);
    data = await pdf(buf);
    output += data.text;
  }
  return output
}


const parseData = async (corpus) => {
  const data = []
  const responses = corpus.split(dateRe)
  // remove first empty string
  responses.shift()

  let matches
  while ((matches = dateRe.exec(corpus)) !== null) {
    const text = responses.shift().trim().split("\n").join('')
    data.push({
      timestamp: matches[0].trim(),
      sentiment: sentiment.analyze(text).score,
      position: "",
      notes: "",
      text,
    })
  }

  return data;
}

const run = async () => {
  const csvParser = new Parser()
  const files = glob.readdirSync("data/*.pdf")
  const corpus = await getCombinedText(files)
  const responses = await parseData(corpus);
  // remove extra data for csv version
  const csvData = responses.map(({ timestamp, text }) => ({ timestamp, text }))
  fs.writeFileSync("data.json", JSON.stringify(responses, null, 2));
  fs.writeFileSync("data.csv", csvParser.parse(csvData))
}

run();