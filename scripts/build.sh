#!/bin/bash

docker-compose stop server
pip3 install -r ./server/scripts/requirements.txt
docker-compose build
docker-compose run --rm build_server gradle build -i --no-daemon -x test
# use yarn to avoid the annoying npm audit
docker-compose run --rm client yarn
