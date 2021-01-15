#!/usr/bin/env python
# coding: utf-8
# If you run two processes of this program at the same time, write to json file may incur race condition
# A possible solution is to use different input folder

import urllib.request
import requests
import re
import unicodedata
import argparse
from os.path import exists, isdir, isfile, join, abspath
from os import mkdir
import json


def positive_int(num):
    val = int(num)
    if val < 0:
        raise argparse.ArgumentTypeError("Cannot accept negative start id")

    return val


parser = argparse.ArgumentParser()
parser.add_argument('start', type=positive_int)
parser.add_argument('count', type=positive_int)
parser.add_argument('-o', '--output_dir', default='./data/raw/')

args = parser.parse_args()

URL = 'https://fabiaoqing.com/biaoqing/detail/id/'
SUFFIX = '.html'
DOWNLOAD_FOLDER = abspath(args.output_dir)
JSON_PATH = join(DOWNLOAD_FOLDER, 'meta.json')
ID = args.start
TIMES_RUN = args.count

if not isdir(DOWNLOAD_FOLDER):
    print('Folder {} not found, creating...'.format(DOWNLOAD_FOLDER))
    mkdir(DOWNLOAD_FOLDER)


def extract_info(content):
    found = 'not found'
    try:
        found = re.search('<img class="biaoqingpp"(.+?)/>', content).group(1)
        url = re.search('src="(.+?)"', found).group(1)
        title = re.search('title="(.+?)"', found).group(1)
        
        return url, title
    except AttributeError:
        print(found)
        return None


# https://github.com/django/django/blob/master/django/utils/text.py
def slugify(value, allow_unicode=False):
    """
    Convert to ASCII if 'allow_unicode' is False. Convert spaces to hyphens.
    Remove characters that aren't alphanumerics, underscores, or hyphens.
    Convert to lowercase. Also strip leading and trailing whitespace.
    """
    value = str(value)
    if allow_unicode:
        value = unicodedata.normalize('NFKC', value)
    else:
        value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value.lower()).strip()
    return re.sub(r'[-\s]+', '-', value)


if isfile(JSON_PATH):
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)
else:
    data = {}

meta_json = open(JSON_PATH, 'w')

success = 0
for cid in range(ID, ID + TIMES_RUN, 1):
    try:
        response = requests.get(URL + str(cid) + SUFFIX)
        img_url, title = extract_info(response.text)
        rind = img_url.rindex('/')
        filename = img_url[rind+1:]
        path = join(DOWNLOAD_FOLDER, filename)
        data[filename] = {'source_url': img_url, 'title': title, 'path': path, 'source': 'fabiaoqing'}
        urllib.request.urlretrieve(img_url, path)
        print('saving {}'.format(path))
        success += 1
    except Exception as e:
        print('failing at {} with error: {}'.format(cid, e))

if data:
    json.dump(data, meta_json)
meta_json.close()
print('successfully download {} images, failing {}'.format(success, TIMES_RUN-success))




