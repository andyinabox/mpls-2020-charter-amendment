#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const getFileNames = (dir) => fs.readdirSync(dir).map(f => path.join(dir, f));

const buildCorpus = async (files) => {
  let output = '';
  let buf;
  let data;
  for (let i = 0; i < files.length; i++) {
    buf = fs.readFileSync(files[i]);
    data = await pdf(buf);
    output += data.text;
  }
  return output;
}

const run = async () => {
  const files = getFileNames('./docs/');
  const corpus = await buildCorpus(files);
  fs.writeFileSync('./data/comments.txt', corpus);
} 

run();