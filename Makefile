.PHONY: clean

default: clean data/comments.csv

clean:
	rm -rf data/*

data/comments.txt:
	node src/build-corpus.js

data/comments.json: data/comments.txt
	node src/parse-corpus.js

data/comments.csv: data/comments.json
	node src/parse-csv.js