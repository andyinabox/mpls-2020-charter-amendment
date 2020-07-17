#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob-fs')();
const pdf = require('pdf-parse');
const Sentiment = require('sentiment');

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


const parse = async (corpus) => {
  const data = []
  const responses = corpus.split(dateRe)
  // remove first empty string
  responses.shift()

  let matches
  while ((matches = dateRe.exec(corpus)) !== null) {
    const text = responses.shift().trim().split("\n").join('')
    data.push({
      date: matches[0],
      sentiment: sentiment.analyze(text).score,
      text,
    })
  }

  return data;
}

const run = async () => {
  const files = glob.readdirSync("data/*.pdf")
  const corpus = await getCombinedText(files)
  const responses = await parse(corpus);
  fs.writeFileSync("data.json", JSON.stringify(responses, null, 2));
}

run();