# Memegle Server
source code for Memegle server

## Dependencies
To be able to run data migration, you need to have PaddleOCR installed
1. run `./scripts/paddle-setup.sh`
2. (Optional) Download det, cls, rec inference models from [PaddleOCR repo](https://github.com/PaddlePaddle/PaddleOCR/blob/develop/doc/doc_en/quickstart_en.md),
put them under `~/.paddleOCR`, follow the instruction on the repo to uncompress them, and rename them to `det`, `rec`, `cls` respectively.
The folder should have the following structure after uncompressing. (Don't forget to remove the tar files).
    
    ```
    |-.paddleOCR
        |-det
            |- model
            |- params
        |-rec
            |- ch
                |- model
                |- params
        |-cls
            |- model
            |- params
        ...
    ```
    
    If you choose to not download any model, models of middle-size and medium performance will be downloaded the first time you run migrate.

## Running Scripts
We have a few python scripts of various purposes.

(All paths are relative to current directory)

### MemeScrapper
`python3 ./scripts/scrapper.py [start_id] [num_pics]`

or

`python3 ./scripts/scrapper.py [start_id] [num_pics]`

will web-scrap Chinese meme pictures from fabiaoqing.com and weixinbqb.com

- For example:
    - You start at https://fabiaoqing.com/biaoqing/detail/id/651071.html
    - The last part of the url before .html is the id of the meme picture on fabiaoqing.com
    - Then running `python3 ./scripts/scrapper.py 651071 1` will download a single picture from fabiaoqing.com starting from id 651071
    - Example output: `saving ./data/raw/我喜欢你这句话太轻微我爱你这句话太沉重了我带你上分这句话刚刚好_我爱你_太沉重_上分_我带_这句表情.jpg
                   successfully download 1 images, failing 0`

### Database Operations
1. `python3 ./scripts/clear.py` will drop the existing Picture table in MongoDB
2. `python3 ./scripts/migrate.py` will add all pictures under `./data/raw/` to `./data/processed` to be exposed on the Spring web app. The pictures will also be added to MongoDB table. (After running migrate.py, the you should be able to directly see new pictures on `http://localhost:8080/img/{filename}`)
## References/Links
- Skim through this [coursera course](https://www.coursera.org/learn/cloud-services-java-spring-framework) for an overview of Java Spring and MongoDB
