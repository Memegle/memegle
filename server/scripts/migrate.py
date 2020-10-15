# https://www.mongodb.com/blog/post/getting-started-with-python-and-mongodb
from pymongo import MongoClient
from os import listdir, rename, remove, mkdir
from os.path import isfile, join, exists, splitext, isdir
import datetime
from shutil import copyfile
import sys
from PIL import Image
import numpy as np

if len(sys.argv) == 2:
    NUM_PICS = int(sys.argv[1])
    del sys.argv[1]
else:
    NUM_PICS = float('inf')

count = 0

from paddleocr import PaddleOCR, draw_ocr

ocr = PaddleOCR(use_angle_cls=True, lang='ch', use_gpu=False)

# COPY is used for debugging this script, normally you don't need to copy, which cost you more disk space.
COPY = False
TEST_MODE = False

DATA_PATH = './data/'
RAW_DATA_PATH = './data/raw/'
PROCESSED_DATA_PATH = './data/processed/'
TEST_DATA_PATH = './data/test/'
GIF_DATA_PATH = './data/gif/'
URL_PREFIX = '/'
ERROR_PATH = './data/error'

OUTPUT_DATA_PATH = PROCESSED_DATA_PATH if not TEST_MODE else TEST_DATA_PATH

print('Running', 'Real Migration' if not TEST_MODE else 'Test Migration', 'with COPY =', COPY)

if not (exists(DATA_PATH) and isdir(DATA_PATH)):
    print('creating data folder...')
    mkdir(DATA_PATH)

if not (exists(RAW_DATA_PATH) and isdir(RAW_DATA_PATH)):
    print('./data/raw/ does not exist, creating and exiting')
    mkdir(RAW_DATA_PATH)
    sys.exit()

if not (exists(OUTPUT_DATA_PATH) and isdir(OUTPUT_DATA_PATH)):
    print('{} does not exist, creating'.format(OUTPUT_DATA_PATH))
    mkdir(OUTPUT_DATA_PATH)

if not (exists(GIF_DATA_PATH) and isdir(GIF_DATA_PATH)):
    print('creating gif folder...')
    mkdir(GIF_DATA_PATH)

if not (exists(ERROR_PATH) and isdir(ERROR_PATH)):
    print('creating error folder...')
    mkdir(ERROR_PATH)

# db config
client = MongoClient(port=27017)
db = client.memegle if not TEST_MODE else client.test

seq_col = db.database_sequences
# open pictures collection
pic_col = db.pictures

seq = seq_col.find_one({'_id': 'picture_sequence'})
if seq is None:
    d = {
        '_id': 'picture_sequence',
        'seq': 0
    }
    seq_col.insert_one(d)
    seq = 0
else:
    seq = seq['seq']

print('starting at seq {}'.format(seq))

img_files = [f for f in listdir(RAW_DATA_PATH) if isfile(join(RAW_DATA_PATH, f))]
insert_lst = []
already_exist = []
gifs = []
error_lst = []

for filename in img_files:

    count += 1
    if count > NUM_PICS:
        break

    img_name, ext = splitext(filename)

    if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
        continue

    if pic_col.find_one({'name': img_name}) is not None:
        already_exist.append(filename)
        continue

    seq += 1
    print('Processing {} at seq {}'.format(filename, seq))

    try:
        picture = Image.open(RAW_DATA_PATH + filename)
        width, height = picture.size

        lines = []
        confs = []
        boundingBoxes = []
        result = ocr.ocr(RAW_DATA_PATH + filename, cls=True)
        for line in result:
            boundingBoxes.append(line[0])
            lines.append((line[1])[0])
            confs.append(np.float64((line[1])[1]).item())

        print('found text:', lines)

        d = {
            '_id': seq,
            'name': img_name,
            'filetype': ext[1:],
            'dateUpdated': datetime.datetime.utcnow(),
            'urlSuffix': URL_PREFIX + str(seq) + ext,
            'width': width,
            'height': height,
            'texts': lines,
            'confidences': confs,
            'boundingBoxes': boundingBoxes,
            'tags': [],
        }

        insert_lst.append(d)

    except Exception as e:
        print('Error {}'.format(e))
        error_lst.append(filename)
        seq -= 1
        pass

if len(insert_lst) > 0:
    pic_col.insert_many(insert_lst)
    seq_col.update_one({'_id': 'picture_sequence'}, {'$set': {'seq': seq}})

    print('successfully updated mongodb.')
    print('start copying...')

    for to_insert in insert_lst:
        src_filename = str(to_insert['name']) + '.' + to_insert['filetype']
        dest_filename = str(to_insert['_id']) + '.' + to_insert['filetype']

        # move file to output folder
        source = join(RAW_DATA_PATH, src_filename)
        dest = join(OUTPUT_DATA_PATH, dest_filename)

        if exists(dest):
            remove(dest)

        if COPY:
            copyfile(source, dest)
        else:
            rename(source, dest)

if len(already_exist) > 0:
    print('Skipped {} images that are already in the db'.format(len(already_exist)))

if len(error_lst) > 0:
    print('Had problem reading {} images'.format(len(error_lst)))

    for filename in error_lst:
        source = join(RAW_DATA_PATH, filename)
        dest = join(ERROR_PATH, filename)

        rename(source, dest)

if len(gifs) > 0:
    print('Skipped {} gif images'.format(len(gifs)))

    for filename in gifs:
        source = join(RAW_DATA_PATH, filename)
        dest = join(GIF_DATA_PATH, filename)

        rename(source, dest)

print('Total {}, inserted {} to the db'.format(len(img_files), len(insert_lst)))
