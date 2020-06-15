# https://www.mongodb.com/blog/post/getting-started-with-python-and-mongodb
from pymongo import MongoClient
from pprint import pprint
from os import listdir, rename, remove
from os.path import isfile, join
import datetime

RAW_DATA_PATH = '../raw/'
STATIC_DATA_PATH = '../src/main/resources/static/data/'
URL_PREFIX = 'http://memegle.qicp.vip/data/'

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
name_too_long = []

def byte_length(s):
    return len(s.encode('utf-8'))

for img in img_files:
    if byte_length(img) >= 255:
        name_too_long.append(img)
        continue

    if pic_col.find_one({'name': img}) is not None:
        already_exist.append(img)
        continue

    seq += 1

    d = {
        '_id': seq,
        'name': img,
        'dateUpdated': datetime.datetime.utcnow(),
        'url': URL_PREFIX + img,
        '_class': 'com.memegle.server.Picture.Picture'
    }
    insert_lst.append(d)

    # move file to static
    try:
        rename(join(RAW_DATA_PATH, img), join(STATIC_DATA_PATH, img))
    except FileExistsError:
        remove(join(RAW_DATA_PATH, img))


seq_col.update_one({'_id': 'picture_sequence'}, {'$set': {'seq': seq}})
pic_col.insert_many(insert_lst)

if len(name_too_long) > 0:
    print('The following imgs have a too long filename:')
for i in name_too_long:
    print(i)
if len(already_exist) > 0:
    print('The following imgs already exists in the db:')
for i in already_exist:
    print(i)
print('Total {}, inserted {} to the db'.format(len(img_files), len(insert_lst)))