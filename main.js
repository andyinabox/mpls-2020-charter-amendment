#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { Parser } = require('json2csv');
const nlp = require('compromise')

const dateRe = /\d+\/\d+\/\d+ \d+:\d+:\d+ [AP]M\s+/g

const getCorpus = async (files) => {
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


const getFileNames = (dir) => fs.readdirSync(dir).map(f => path.join(dir, f));

const parseJSON = async (corpus) => {
  const data = []
  const responses = corpus.split(dateRe)
  // remove first empty string
  responses.shift()

  let matches
  while ((matches = dateRe.exec(corpus)) !== null) {
    const text = responses.shift().trim().split("\n").join('')
    data.push({
      timestamp: matches[0].trim(),
      text,
    })
  }

  return data;
}


const analyze = async (json) => {
  let doc = nlp(json.map(d => d.text).join('\n'))
  console.log(doc.verbs())
}

const run = async () => {
  // const csvParser = new Parser()
  const files = getFileNames('./data')
  const corpus = await getCorpus(files)
  const responses = await parseJSON(corpus);
  const analysis = analyze(responses);
  // fs.writeFileSync("data.json", JSON.stringify(responses, null, 2));
  // fs.writeFileSync("data.csv", csvParser.parse(responses))
}

run();