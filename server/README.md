# Memegle Server

This folder contains the server code for memegle app.

Skim through this [coursera course](https://www.coursera.org/learn/cloud-services-java-spring-framework) for a overview of Java Spring and MongoDB

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
    
### Filling Local Database
(The current process for db migration is not very efficient. We might use MongoBee to perform migration task in the future)

- Dataset is uploaded to shared Google Drive
- The [master](https://drive.google.com/drive/u/0/folders/1Nu1plUq-xfuSrg72PR-MFisYNmTRi_9F) folder contains all processed data
- The [raw](https://drive.google.com/drive/u/0/folders/1gOO1qCdqdsBnPriZFc5U_FW-iLYUVorQ) folder contains unprocessed data
    - It often happens that filenames of files in raw folder are too long to be deployed (can't be compressed with tar, as required by tomcat), so don't try to deploy images within the raw folder.
    - To convert raw image files to valid image files to deploy, you need to shrink their filename (A useful .bat script for windows can be found [here](https://superuser.com/questions/347931/how-do-i-rename-a-bunch-of-files-in-the-command-prompt))
- To deploy images file on local server, simply copy them to `./src/main/resources/static/data/`.
    - Every time the server get deployed, it will automatically scan all image files under `/static/data/` and add them to db.
    - Notice that the current scanning mechanism doesn't handle duplicate, if you add images that have previously been added to the db, a duplicate may occur.
    - Current mechanism is not efficient, and will be changed later.
    
    
### Adding images to deployed server
You can use `MemScrapper.py` to automatically web-scrap meme images from fabiaoqing.com

Usage: `python MemeScrapper.py [start_id] [num_pics]`

- For example:
    - You start at https://fabiaoqing.com/biaoqing/detail/id/651071.html
    - The last part of the url before .html is the id of the meme picture on fabiaoqing.com
    - Then running `python3 .\MemeScrapper.py 651071 1` will download a single picture from fabiaoqing.com starting from id 651071
    - Example output: `saving raw/我喜欢你这句话太轻微我爱你这句话太沉重了我带你上分这句话刚刚好_我爱你_太沉重_上分_我带_这句表情.jpg
                   successfully download 1 images, failing 0`
- Upload the newly downloaded images to the raw folder on shared drive and notify Paul to update the database on deployed server.
- (You're encouraged to write more script and scrap pictures from other CN/EN websites as well)