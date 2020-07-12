# Memegle

A search engine for Meme Pictures

## Dependencies
**To run this app, the following dependencies are quired.**
1. Python3 (and pip3)
2. [Docker](https://www.docker.com/products/docker-desktop) and Docker-Compose

([MongoDB compass](https://www.mongodb.com/products/compass) is a tool for visualizing the MongoDB database, and is recommended.)

(Windows user are recommended to use Git Bash, which docker-compose comes along with)

## Running the app in dev environment
(All path a relative to current directory)
1. Run `./scripts/build.sh`
    - This will compile all the source code and create all docker images needed
    - Another option is to manually compile the source code with your IDE, before that you need to run `docker-compose up monstache` for all the required service to be available. (If you are doing it this way, sometime the container for monstache may fail to start because the elasticsearch is starting up slow. If this happens, keep the current terminal window open and re-run the command in a new terminal window in awhile)
2. Run `docker-compose up`

Client will be up on [localhost:3000]() and Server should be up on [localhost:8080](). 

Default ports: 27017 for MongoDB; 9200 for ElasticSearch.

(hot reload should be working for client, i.e. changes in the client code should be directly reflected on localhost:3000)

## Other Notices
- If you see on terminal that monstache complains query to elasticsearch is FORBIDDEN with messages similar to something like READ_ONLY is set, it's probably because you're using up the space in your docker virtual machine. To fix this run the following commands (with elasticsearch container running).
    - `docker system prune` (this will remove unused images/containers/volumes)
    - `./scripts/reset-es-readonly.sh` (this will disable read-only property on elasticsearch)