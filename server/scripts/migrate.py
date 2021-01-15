import boto3
from botocore.exceptions import ClientError
import argparse
import magic
from os import mkdir, listdir, rename, remove
from os.path import exists, isfile, join, splitext
import sys
import json
from bson.objectid import ObjectId
from pymongo import MongoClient
from PIL import Image
from paddleocr import PaddleOCR
import numpy as np
import datetime
import getpass

DEFAULT_INPUT_FOLDER = './data/raw/'
DEFAULT_OUTPUT_FOLDER = './data/processed/'
DEFAULT_ERROR_FOLDER = './data/error/'

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_dir')
parser.add_argument('-o', '--output_dir')
parser.add_argument('-e', '--error_dir')
parser.add_argument('-r', '--recursive', action='store_true')
parser.add_argument('-p', '--prod', action='store_true')
parser.add_argument('-t', '--test', action='store_true')

args = parser.parse_args()

input_dir = args.input_dir if args.input_dir else DEFAULT_INPUT_FOLDER
output_dir = args.output_dir if args.output_dir else DEFAULT_OUTPUT_FOLDER
error_dir = args.error_dir if args.error_dir else DEFAULT_ERROR_FOLDER

if args.test:
    print('Running in test mode, output directory will be changed to ${output_dir}/test/')
    output_dir = join(output_dir, 'test/')

BUCKET_NAME = 'memegle' if not args.test else 'memegle-test'
URL_PREFIX = 'https://memegle.s3-us-west-1.amazonaws.com/' if not args.test \
    else 'https://memegle-test.s3-us-west-1.amazonaws.com/'

s3 = boto3.resource('s3')
bucket = s3.Bucket(BUCKET_NAME)
boto = boto3.client('s3')
if args.prod:
    url = "memegle.live"
    port = 7017
    username = input('Enter MongoDB username: ')
    password = getpass.getpass()
    mongo = MongoClient('mongodb://{}:{}@{}:{}/?authSource=admin&ssl=true'.format(username, password, url, port))
else:
    mongo = MongoClient(port=27017)
db = mongo.memegle if not args.test else mongo.test
pic_col = db.pictures
paddle = PaddleOCR(use_angle_cls=True, lang='ch', use_gpu=False)
success = 0

if not exists(input_dir):
    if input_dir == DEFAULT_INPUT_FOLDER:
        print('Default input directory does not exist, creating and exiting')
        mkdir(input_dir)
    else:
        print('Input directory does not exist, exiting')

    sys.exit()

if not args.prod and not exists(output_dir):
    print('Output directory does not exist, creating')
    mkdir(output_dir)

if not exists(error_dir):
    print('Error directory does not exist, creating')
    mkdir(error_dir)


def has_required_keys(d):
    required = ['source_url', 'path']
    return all(key in d for key in required)


def exclude_keys(d):
    exclude = ['path']
    return {k: v for k, v in d.items() if k not in exclude}


def process_img(filename, d):
    if not has_required_keys(d):
        print('Skipping {}, dict does not contain all required keys')
        return False

    _, ext = splitext(filename)
    if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
        print('Skipping {}, not image file'.format(filename))
        return False

    if 'source_url' in d and pic_col.find_one({'source_url': d['source_url']}) is not None:
        print('Skipping {}, source url already exists in the db')
        return False

    try:
        id = ObjectId()
        path = d['path']

        img = Image.open(path)
        width, height = img.size

        texts = []
        confidences = []
        bounding_boxes = []
        result = paddle.ocr(path, cls=True)

        for line in result:
            bounding_boxes.append(line[0])
            texts.append(line[1][0])
            confidences.append(np.float64(line[1][1]).item())

        print('found text:', texts)

        d['_id'] = id
        d['date_created'] = datetime.datetime.utcnow()
        d['width'] = width
        d['height'] = height
        d['texts'] = texts
        d['bounding_boxes'] = bounding_boxes
        d['confidences'] = confidences
        d['ext'] = ext[1:]
        d['media_url'] = URL_PREFIX + str(id) + ext

        return True

    except Exception as e:
        print('Error {} on file {}'.format(e, filename))
        return False


def process_dir(dir, recur=False):
    global success
    if recur:
        for filename in listdir(dir):
            p = join(dir, filename)
            if isdir(p):
                process_dir(p)

    print('Processing directory {}'.format(dir))
    meta_path = join(dir, 'meta.json')
    if not isfile(meta_path):
        print('Cannot process {}, missing meta.json'.format(dir))
        return

    with open(meta_path, 'r') as f:
        data = json.load(f)

    for filename, d in data.items():
        path = d['path']
        if not isfile(path):
            path = join(input_dir, filename)

            if not isfile(path):
                print("File not found: {}".format(path))
                continue

            d['path'] = path

        if not process_img(filename, d):
            rename(path, join(error_dir, filename))
            continue

        d = exclude_keys(d)
        new_name = str(d['_id']) + '.' + d['ext']
        try:
            # add to mongo and upload to s3
            if args.prod:
                upload_file(path, new_name)
                if args.test:
                    rename(path, join(output_dir, new_name))
                else:
                    remove(path)
            else:
                rename(path, join(output_dir, new_name))

            pic_col.insert_one(d)
            success += 1
        except Exception as e:
            print('Failed to update s3 or mongo: {}'.format(e))
            rename(path, join(error_dir, filename))

    if args.test:
        rename(meta_path, join(output_dir, 'meta.json'))
    else:
        remove(meta_path)


def upload_file(path, key):
    print('Uploading {} to s3...'.format(key))
    mime = magic.from_file(path, mime=True)
    bucket.put_object(Key=key, Body=open(path, 'rb'), ContentType=mime)


def key_exists(key):
    try:
        boto.head_object(Bucket=BUCKET_NAME, Key=key)
        return True
    except ClientError as e:
        if e.response['ResponseMetadata']['HTTPStatusCode'] == 404:
            return False

        raise


process_dir(input_dir, args.recursive)
print('Successfully inserted {} pictures to db'.format(success))
