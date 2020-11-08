#!/bin/bash

es_status=-1
PING_COUNT=0
uri="$ES_URI/_cluster/health"

# Not checking for mongo status bc it's already done in mongo_init.sh
echo "Waiting for ES cluster to be on..."

until [ $es_status -eq 200 ]; do
  sleep 2
  es_status=$(curl --write-out %{http_code} --silent --output /dev/null $uri)
  PING_COUNT=$((PING_COUNT+1))
  # Stop after 1 min
  if [ $PING_COUNT -gt 30 ]
  then
    echo Connection failed, stopping...
    exit 1
  fi
done

echo "ES cluster is now on!"
echo "Starting Memegle server..."

gradle --stop

# https://stackoverflow.com/questions/3004811/how-do-you-run-multiple-programs-in-parallel-from-a-bash-script
gradle build --continuous -x test &
P1=$!
gradle bootRun &
P2=$!
wait $P1 $P2