#!/usr/bin/env node

const fs = require('fs')

const dateRe = /\d+\/\d+\/\d+ \d+:\d+:\d+ [AP]M\s+/g

const parseCorpus = async (corpus) => {
  const data = [];
  const responses = corpus.split(dateRe);
  // remove first empty string
  responses.shift();

  let matches;
  while ((matches = dateRe.exec(corpus)) !== null) {
    const text = responses.shift().trim().split("\n").join('');
    data.push({
      timestamp: matches[0].trim(),
      text,
    });
  };

  return data;
}

const run = async () => {
  const corpus = fs.readFileSync('./data/comments.txt', {encoding:'utf8', flag:'r'});
  const data = await parseCorpus(corpus);
  fs.writeFileSync('./data/comments.json', JSON.stringify(data, null, 2));
}

run();