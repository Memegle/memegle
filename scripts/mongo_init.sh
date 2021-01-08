#!/bin/bash

echo "Starting replica set initialization..."
PING_COUNT=0
until mongo --host mongo1 --eval "print(\"waited for connection\")"
do
  PING_COUNT=$((PING_COUNT+1))
  if [ $PING_COUNT -gt 30 ]
  then
    echo Connection failed, stopping...
    exit 1
  fi
  sleep 2
done
echo "Connected"
echo "Creating replica set..."
mongo admin --host mongo1 --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" <<EOF
rs.initiate(
    {
        _id : 'rs',
        members: [
            { _id : 0, host : "mongo1:27017" }
        ]
    }
)
EOF
echo "Mongo init is finished"