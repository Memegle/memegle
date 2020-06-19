// set up a mongo replica set
// not used for now
rs.initiate(
    {
        _id : 'rs0',
        members: [
            { _id : 0, host : "mongo1:27017" }
        ]
    }
)
