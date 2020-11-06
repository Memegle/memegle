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
success = 0

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
ERROR_PATH = './data/error/'

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
    seq_col.update_one({'_id': 'picture_sequence'}, {'$set': {'prev_seq': seq}})

print('starting at seq {}'.format(seq))

img_files = []
already_exist = []
gifs = []
error_lst = []


def process_image(dir, filename):
    img_name, ext = splitext(filename)

    if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
        return None

    if pic_col.find_one({'name': img_name}) is not None:
        already_exist.append(join(dir, filename))
        return None

    global seq
    seq += 1

    try:
        picture = Image.open(join(dir, filename))
        width, height = picture.size

        lines = []
        confs = []
        boundingBoxes = []
        result = ocr.ocr(join(dir, filename), cls=True)
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
        }

        return d

    except Exception as e:
        print('Error {}'.format(e))
        error_lst.append(join(dir, filename))
        seq -= 1


def update_db(d):
    print('inserting {} to db...'.format(d['name'] + '.' + d['filetype']))
    pic_col.insert_one(d)
    seq_col.update_one({'_id': 'picture_sequence'}, {'$set': {'seq': seq}})


def add_to_processed(dir, name, ext, id):
    print('copying {} with id {}'.format(name + '.' + ext, id))
    src_filename = name + '.' + ext
    dest_filename = str(id) + '.' + ext

    source = join(dir, src_filename)
    dest = join(OUTPUT_DATA_PATH, dest_filename)

    if exists(dest):
        remove(dest)

    if COPY:
        copyfile(source, dest)
    else:
        rename(source, dest)


for f in listdir(RAW_DATA_PATH):
    if isfile(join(RAW_DATA_PATH, f)):
        img_files.append(f)
    else:
        tags = f.split(';')
        print('processing folder with tags {}'.format(tags))
        dir = join(RAW_DATA_PATH, f)
        for filename in listdir(dir):
            count += 1
            d = process_image(dir, filename)
            if d:
                d['tags'] = tags
                update_db(d)
                add_to_processed(dir, d['name'], d['filetype'], d['_id'])
                print('done with {}'.format(d['name'] + '.' + d['filetype']))
                success += 1

for filename in img_files:
    count += 1
    if count > NUM_PICS:
        break
    d = process_image(RAW_DATA_PATH, filename)
    if d:
        update_db(d)
        add_to_processed(RAW_DATA_PATH, d['name'], d['filetype'], d['_id'])
        print('done with {}'.format(d['name'] + '.' + d['filetype']))
        success += 1


if len(already_exist) > 0:
    print('Skipped {} images that are already in the db'.format(len(already_exist)))

if len(error_lst) > 0:
    print('Had problem reading {} images'.format(len(error_lst)))

    for source in error_lst:
        dest = join(ERROR_PATH, filename)

        rename(source, dest)

if len(gifs) > 0:
    print('Skipped {} gif images'.format(len(gifs)))

    for source in gifs:
        dest = join(GIF_DATA_PATH, filename)

        rename(source, dest)

print('Total {}, inserted {} to the db'.format(count, success))
