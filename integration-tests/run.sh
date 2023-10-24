#!/bin/bash

npm run build

docker run \
  --rm \
  -d \
  -p 3060:3000 \
  --name ingredient-instruction-classifier \
  julianpoy/ingredient-instruction-classifier

jest integration-tests/*.spec.js --runInBand --testTimeout=30000 --config jest.integration.config.js $@

docker kill ingredient-instruction-classifier

