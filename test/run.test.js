const randomize = require('randomatic');
const { times, sample, random } = require('lodash');
const { before } = require('mocha');
const { movies } = require('./movie-data');
const { Search, AllSubstringsIndexStrategy } = require('js-search');

const sizes = [1, 10, 100, 1000, 2000, 5000, 10000];
const fields = ['id', 'name', 'details', 'location'];

function text() {
  return randomize('a', 25);
}

function doc() {
  return fields.reduce((acc, cur) => {
    acc[cur] = text();
    return acc;
  }, {});
}

function docs(length) {
  return times(length, doc);
}

function build() {
  const search = new Search(fields[0]);
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
      search.indexStrategy = new AllSubstringsIndexStrategy();
      search.addIndex('title');
      search.addIndex('year');
      search.addIndex('director');
      search.addIndex('cast');
      search.addIndex('genre');
      search.addIndex('notes');
    });

    it('build', () => {
      console.log(`Adding ${movies.length} documents`);
      search.addDocuments(movies);
    });

    it('search', () => {
      const query = 'caught';
      console.log(`searching for: ${query}`);
      const results = search.search(query);
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
        const ref = sample(documents);
        const field = sample(fields);
        const begin = random(0, 10);
        const end = random(10, 25);
        const text = ref[field].substring(begin, end);
        console.log(`searching for: ${text}`);
        const results = search.search(text);
        console.log(JSON.stringify(results, null, '  '));
      });
    });
  });
});
