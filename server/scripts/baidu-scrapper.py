import os
import requests
import urllib.request
from os.path import exists, isdir, join, isfile, abspath
import re
import argparse
import json as js
import csv
import pathlib


# This function checks whether the input is string.
#
def string_check(val):
    if not isinstance(val, str):
        raise argparse.ArgumentTypeError("Cannot accept non-string input")
    return val


# This function checks whether the input is an integer.
#
def positive_int(num):
    val = int(num)
    if val < 0:
        raise argparse.ArgumentTypeError("Cannot accept negative start id")
    return val


parser = argparse.ArgumentParser()
parser.add_argument('keyword', type=string_check)
parser.add_argument('tags')
parser.add_argument('count', type=positive_int)
parser.add_argument('-o', '--output_dir', default='./data/raw/')

args = parser.parse_args()
QUERY = args.keyword
PHOTO_COUNT = args.count
TAGS = args.tags.split(',')

# Constants
DOWNLOAD_FOLDER = 'data/raw/' + ','.join(TAGS) + '/'
CSV_PATH = 'data/raw/meta.csv'
HEADERS = ['source_url', 'tag', 'title', 'file_name', 'path', 'source']

success = 0
fail = 0

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' \
                    'Chrome/86.0.4240.75 Safari/537.36 '

if not (exists(DOWNLOAD_FOLDER) and isdir(DOWNLOAD_FOLDER)):
    print('Creating new folder {}'.format(DOWNLOAD_FOLDER))
    pathlib.Path(DOWNLOAD_FOLDER).mkdir(parents=True, exist_ok=True)  # os.mkdir(DOWNLOAD_FOLDER)

if isfile(CSV_PATH):
    f = open(CSV_PATH, 'a')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
else:
    f = open(CSV_PATH, 'w')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
    writer.writeheader()


# function to get the file name from the last part of 'middleURL'
def get_filename(str):
    idx = str.rindex("/")
    file_name = str[idx:len(str)]
    return file_name


# variable that keeps track of the number of images
num_images = len(os.listdir(DOWNLOAD_FOLDER))

# number of pages needed to download from
total_page = int((num_images + PHOTO_COUNT) / 30)

# variable that helps turn to the next available page
new_page = int(num_images / 30)


def get_json_data(i):
    page = i  # + new_page
    print('Processing page {}'.format(page))
    start_ind = page
    url = 'https://tupian.baidu.com/search/acjson?tn=resultjson_com&logid=9967771140088488215&ipn=rj&ct=201326592&is=&fp=result&QUERYWord=' \
          + QUERY + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&hd=&latest=&copyright=&word=' \
          + QUERY + '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&pn=' \
          + str(start_ind) + '&rn=30&gsm=1e&1603393461671='

    response = session.get(url)
    # handle invalid escapes
    text = response.text
    text = re.sub(r'"fromPageTitle":".*?[^\\]",', '', text)
    text = re.sub(r'\\([^\/u"])', '\\1', text, re.MULTILINE)
    result = re.sub(r'\\\\"', '', text, re.MULTILINE)

    json = js.loads(result, strict=False)
    data = json['data']
    return data


# download each image
page = 0

for x in range(page + total_page + 2):

    data = get_json_data(x)

    for i in range(30):
        try:
            num_images = len(os.listdir(DOWNLOAD_FOLDER))
            #  print(num_of_images)
            #  print(PHOTO_COUNT)
            if num_images == PHOTO_COUNT:
                break

            d = data[i]
            img_url = d['middleURL']
            filename = get_filename(img_url)
            ext = '.' + d['type']
            path = DOWNLOAD_FOLDER + d['fromURL'] + ext

            if isfile(path):
                print('file already exists, skipping: {}'.format(path))
                continue

            urllib.request.urlretrieve(img_url, path)
            writer.writerow({'source_url': img_url, 'tag': TAGS, 'title': d['fromPageTitleEnc'], 'file_name': filename,
                             'path': path, 'source': "baidu",
                             })
            print('{}.{}: Saving {}'.format(page, i, path))
            success += 1

        except Exception as e:
            print('{}.{}: {}'.format(page, i, str(e)))
            fail += 1

    print('successfully download {} images, failing {}'.format(success, fail))
