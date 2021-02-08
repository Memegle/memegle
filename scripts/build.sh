#!/bin/bash

python3 -m pip install -r ./server/scripts/requirements.txt
docker-compose build
docker-compose run --rm server gradle build -i -x test
# use yarn to avoid the annoying npm audit
docker-compose run --rm client yarn
