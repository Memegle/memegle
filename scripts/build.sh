#!/bin/bash

pip3 install -r ./server/scripts/requirements.txt
docker-compose build
docker-compose run --rm server gradle build -i -x test --project-cache-dir=//home/gradle/cache
# use yarn to avoid the annoying npm audit
docker-compose run --rm client yarn