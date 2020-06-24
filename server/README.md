# Memegle Server

This folder contains the server code for memegle app.

Skim through this [coursera course](https://www.coursera.org/learn/cloud-services-java-spring-framework) for an overview of Java Spring and MongoDB

## Dependencies
### Gradle Build
The server of Memegle is built on Java Spring Boot 2.2.6, and uses [Gradle Build](https://gradle.org/) for dependency management.
You can download Gradle and run gradle build to install all dependencies. You're recommended to use IntelliJ or Eclipse as IDE, both of which have great support for Java and Gradle project.

### Running server on Docker container
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install docker-compose (If window user, recommend using [Git Bash](https://gitforwindows.org/), which docker-compose and docker come along with)
- `cd` to this directory and run `docker-compose build web && docker-compose up`.
    - (If this is your first time starting docker compose for memegle, run `docker-compose --build`). Be very careful using this command because it will restart the image for MongoDB, and may cause you to lose your exiting data in MongoDB.
    - Optional: You can download [MongoDB compass](https://www.mongodb.com/products/compass) to inspect  db collections in UI mode. The default port for MongoDB is 27017
    - Optional: You can also use `docker-compose up -d` to run the containers in the background, and use `docker-compose down` to shut down running containers. (CTRL + C will also work if not running with `-d`)
- After running `docker compose up`, you should be able to access local server at localhost:8080, and mongoDB should also be up at localhost:27017
    
### Running scripts
- You might need to run `pip3 install -r ./scripts/requirements` to install dependencies for the scripts to run properly. 
### Filling Local Database

- Dataset is uploaded to shared Google Drive
- The [master](https://drive.google.com/drive/u/0/folders/1Nu1plUq-xfuSrg72PR-MFisYNmTRi_9F) folder contains all processed data
- The [raw](https://drive.google.com/drive/u/0/folders/1gOO1qCdqdsBnPriZFc5U_FW-iLYUVorQ) folder contains unprocessed data
- Put all images you want to add to local database under `./raw/`
- (Recommended: upload the raw image you got to the Google Drive before running the migration task)
- Run `docker-compose up -d db` to start the MongoDB container
- Running `python3 ./scripts/migrate.py` will all the metadata to the db and move imgs under raw to `./src/main/resources/static/data` to be exposed on the WAR project
- Run `docker-compose down` to stop the MongoDB container we just started
- Notice that the current scanning mechanism handles duplicate by checking filename. Duplicate images with different filename could be added to the db.
    
    
### Adding images to deployed server
You can use `MemeScrapper.py` to automatically web-scrap meme images from fabiaoqing.com

Usage: `python3 ./scripts/MemeScrapper.py [start_id] [num_pics]`

- For example:
    - You start at https://fabiaoqing.com/biaoqing/detail/id/651071.html
    - The last part of the url before .html is the id of the meme picture on fabiaoqing.com
    - Then running `python3 .\MemeScrapper.py 651071 1` will download a single picture from fabiaoqing.com starting from id 651071
    - Example output: `saving raw/我喜欢你这句话太轻微我爱你这句话太沉重了我带你上分这句话刚刚好_我爱你_太沉重_上分_我带_这句表情.jpg
                   successfully download 1 images, failing 0`
- Upload the newly downloaded images to the raw folder on shared drive and notify Paul to update the database on deployed server.
- (You're encouraged to write more script and scrap pictures from other CN/EN websites as well)

### Local Development
- To speed up local development process, I recommend you to keep the MongoDB and ElasticSearch container running (`docker-compose up -d && docker-compose stop web`)
- Then run gradle build project manually from your IDE. (since gradle build with docker takes a lot of time)
- Now you have both MongoDB and Elasticsearch available at their respective ports, the only thing you need to do is to rebuild the web project after making code changes.
