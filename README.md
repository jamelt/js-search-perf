# search-perf
Complexity analysis for AllSubstringsIndexStrategy in JS Search

## Set up
```
npm i
```

## Run
```
npx mocha
```

## Test 1
Index large json file of movies. Runs in about 5-10 seconds.

## Random tests
At around 4000 items, the performance slows down dramatically. I think this is because, there are artificial string sequences, those that would not occur in the english language. This causes the token database to become artificially inflated. 
The movies were added to test that hypothesis, that with a large amount of of legible text, the index would perform acceptably.


