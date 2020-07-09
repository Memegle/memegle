#!/bin/bash

# https://linuxparrot.com/elasticsearch-healthcheck/
es_status=-1
uri="$ES_URI/_cluster/health"

# Not checking for mongo status bc it's already done in mongo_init.sh
echo "Waiting for ES cluster to be on..."

until [ $es_status -eq 200 ]; do
  sleep 2
  es_status=$(curl --write-out %{http_code} --silent --output /dev/null $uri)
done

echo "ES cluster is now on!"
echo "Starting Memegle server..."

catalina.sh run