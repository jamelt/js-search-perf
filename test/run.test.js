const randomize = require('randomatic');
const { stemmer } = require('porter-stemmer');
const { times, sample, random } = require('lodash');
const { before } = require('mocha');
const { movies } = require('./movie-data');
const {
  Search,
  StemmingTokenizer,
  SimpleTokenizer,
  TfIdfSearchIndex,
  AllSubstringsIndexStrategy
} = require('js-search');

const sizes = [1, 10, 100, 1000, 2000, 5000, 10000];
const fields = ['id', 'name', 'details', 'location'];

function doc() {
  return fields.reduce((acc, cur) => {
    acc[cur] =
      randomize('a', 10) + ' ' + randomize('a', 12) + ' ' + randomize('a', 8);
    return acc;
  }, {});
}

function docs(length) {
  return times(length, doc);
}

function build() {
  const search = new Search(fields[0]);
  search.tokenizer = new StemmingTokenizer(stemmer, new SimpleTokenizer());
  search.searchIndex = new TfIdfSearchIndex(fields[0]);
  search.indexStrategy = new AllSubstringsIndexStrategy();
  fields.forEach(field => search.addIndex(field));
  return search;
}

describe('index', () => {
  let search;
  let documents;

  describe('movies', () => {
    before(() => {
      search = new Search('title');
      search.tokenizer = new StemmingTokenizer(stemmer, new SimpleTokenizer());
      search.searchIndex = new TfIdfSearchIndex('title');
      search.indexStrategy = new AllSubstringsIndexStrategy();
      search.addIndex('title');
      search.addIndex('year');
      search.addIndex('director');
      search.addIndex('cast');
      search.addIndex('genre');
      search.addIndex('notes');
    });

    it('build', () => {
      search.addDocuments(movies);
    });

    it('search', () => {
      const query = 'caught';
      console.log(`searching for: ${query}`);
      let results = search.search(query);
      console.log(JSON.stringify(results, null, '  '));
    });
  });

  sizes.forEach(size => {
    describe(`${size}`, () => {
      before(() => {
        search = build();
        documents = docs(size);
      });

      it('build', () => {
        search.addDocuments(documents);
      });

      it('search', () => {
        let ref = sample(documents);
        let field = sample(fields);
        let begin = random(0, 10);
        let end = random(10, 25);
        let substr = ref[field].substring(begin, end);
        console.log(`searching for: ${substr}`);
        let results = search.search(substr);
        console.log(JSON.stringify(results, null, '  '));
      });
    });
  });
});
