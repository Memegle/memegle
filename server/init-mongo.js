// set up a mongo replica set
rs.initiate(
    {
        _id : 'rs0',
        members: [
            { _id : 0, host : "mongo1:27017" }
        ]
    }
)
