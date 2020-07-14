#!/bin/bash

echo "Starting replica set intialization"
until mongo --host mongo1 --eval "print(\"waited for connection\")"
do
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