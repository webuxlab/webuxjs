#!/bin/bash

# Source: https://docs.confluent.io/platform/current/platform-quickstart.html#ce-docker-quickstart

curl --silent --output docker-compose.yml \
  https://raw.githubusercontent.com/confluentinc/cp-all-in-one/7.3.3-post/cp-all-in-one/docker-compose.yml

docker-compose up -d

node producer.js &
node consumer-1.js