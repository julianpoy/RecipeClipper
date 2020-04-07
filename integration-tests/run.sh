#!/bin/bash

npm run build # Puppeteer uses built image for browser injection

if [ -z "$BROWSERLESS_WS" ]; then
  export BROWSERLESS_WS="ws://localhost:3031"
  export CLEANUP="true"

  docker run \
    --rm \
    -d \
    -p 3031:3000 \
    -e "MAX_CONCURRENT_SESSIONS=10" \
    -e "MAX_QUEUE_LENGTH=1000" \
    --name recipe-clipper-browserless \
    browserless/chrome:1.28.0-chrome-stable
fi

npx jest integration-tests/*.spec.js

if ! [ -z "$CLEANUP" ]; then
  docker stop recipe-clipper-browserless || true
fi

