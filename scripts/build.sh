#!/bin/bash

pip3 install -r ./server/scripts/requirements.txt
dos2unix ./scripts/*
dos2unix ./server/scripts/*
docker-compose build
docker-compose run --rm server gradle build -i -x test
# use yarn to avoid the annoying npm audit
docker-compose run --rm client yarn
