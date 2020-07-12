#!/bin/bash

docker-compose stop server
pip3 install -r ./server/scripts/requirement.txt
docker-compose build
docker-compose run --rm build_server gradle build -i --no-daemon -x test
docker-compose run --rm client npm install