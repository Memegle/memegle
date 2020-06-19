# https://www.mongodb.com/blog/post/getting-started-with-python-and-mongodb
from pymongo import MongoClient
from pprint import pprint
from os import listdir, rename, remove
from os.path import isfile, join, exists, splitext
import datetime
from shutil import copyfile

# COPY is used for debugging this script, normally you don't need to copy, which cost you more disk space.
COPY = True

RAW_DATA_PATH = './raw/'
STATIC_DATA_PATH = './src/main/resources/static/data/'
URL_PREFIX = '/'

client = MongoClient(port=27017)
db = client.memegle

seq_col = db.database_sequences

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
start_seq = seq

# open pictures collection
pic_col = db.pictures

img_files = [f for f in listdir(RAW_DATA_PATH) if isfile(join(RAW_DATA_PATH, f))]
insert_lst = []
already_exist = []

for img in img_files:
    if pic_col.find_one({'name': img}) is not None:
        already_exist.append(img)
        continue

    _, ext = splitext(img)

    seq += 1

    d = {
        '_id': seq,
        'name': img,
        'dateUpdated': datetime.datetime.utcnow(),
        'urlSuffix': URL_PREFIX + str(seq) + ext,
        '_class': 'com.memegle.server.Picture.Picture'
    }
    insert_lst.append(d)


if len(insert_lst) > 0:
    pic_col.insert_many(insert_lst)
    seq_col.update_one({'_id': 'picture_sequence'}, {'$set': {'seq': seq}})

    for i in insert_lst:
        img = i['name']
        id = i['_id']

        _, ext = splitext(img)
        # move file to static
        source = join(RAW_DATA_PATH, img)
        dest = join(STATIC_DATA_PATH, str(id) + ext)
        if exists(dest):
            remove(dest)

        if COPY:
            copyfile(source, dest)
        else:
            rename(source, dest)

if len(already_exist) > 0:
    print('The following imgs already exists in the db:')
for i in already_exist:
    print(i)
print('Total {}, inserted {} to the db'.format(len(img_files), len(insert_lst)))