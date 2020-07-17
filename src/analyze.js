const fs = require('fs');
const nlp = require('compromise')

nlp.extend(require('compromise-export'))

const analyze = (comments) => {
  const text = comments.map(d => d.text).join("\n");
  let doc = nlp(text);
  return doc.export()
}


const run = async () => {
  const comments = fs.readFileSync('./data/comments.json', {encoding:'utf8', flag:'r'});
  const data = analyze(JSON.parse(comments));
  fs.writeFileSync('./data/nlp-data.json', JSON.stringify(data))
}

run();