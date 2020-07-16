#!/bin/bash

echo "Starting replica set intialization"
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
echo "Connection finished"
echo "Creating replica set"
mongo --host mongo1 <<EOF
rs.initiate(
    {
        _id : 'rs0',
        members: [
            { _id : 0, host : "mongo1:27017" }
        ]
    }
)
EOF
echo "replica set created"