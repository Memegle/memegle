import requests
import urllib.request
from os import mkdir
from os.path import exists, isdir,join,isfile,abspath
import re
import argparse
import unicodedata
import json as js
import csv

# Please manually filter out bad images after running the scripts.

# Always change this two variable before executing
# The + sign force the result to include pattern 表情包



# This function checks whether the input is string.
#
def string_check(val):
    fl= False
    if isinstance(val,str) is fl:
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
parser.add_argument('searching_word', type=string_check)
parser.add_argument('count', type=positive_int)
parser.add_argument('-o', '--output_dir', default='./data/raw/')

args = parser.parse_args()
query = args.searching_word
tags = [query]

# Constants
DOWNLOAD_FOLDER = 'data/raw/' + ';'.join(tags) + '/'
CSV_PATH = 'data/raw/meta.csv'
HEADERS = ['source_url','title','path', 'source']

# Each page returns 30 images, [start, end)
PHOTO_COUNT = args.count
#START_PAGE = 0
#END_PAGE = 3

success = 0
fail = 0

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'




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


if not (exists(DOWNLOAD_FOLDER) and isdir(DOWNLOAD_FOLDER)):
    print('Creating new folder {}'.format(DOWNLOAD_FOLDER))
    mkdir(DOWNLOAD_FOLDER)


if isfile(CSV_PATH):
    f = open(CSV_PATH, 'a')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
else:
    f = open(CSV_PATH, 'w')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
    writer.writeheader()


#for page in range(START_PAGE, END_PAGE, 1):
page = 0
print('Processing page {}'.format(page))
start_ind = page
url = 'https://tupian.baidu.com/search/acjson?tn=resultjson_com&logid=9967771140088488215&ipn=rj&ct=201326592&is=&fp=result&queryWord=' \
    + query + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&hd=&latest=&copyright=&word=' \
    + query + '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&pn=' \
    + str(start_ind) + '&rn=30&gsm=1e&1603393461671='

response = session.get(url)
# handle invalid escapes
text = response.text
text = re.sub(r'"fromPageTitle":".*?[^\\]",', '', text)
text = re.sub(r'\\([^\/u"])', '\\1', text, re.MULTILINE)
result = re.sub(r'\\\\"', '', text, re.MULTILINE)

json = js.loads(result, strict=False)
data = json['data']

# download each image
for i in range(PHOTO_COUNT):
    try:
        d = data[i]
        img_url = d['middleURL']
        filename = slugify(d['fromPageTitleEnc'], allow_unicode=True)
        ext = '.' + d['type']
        path = DOWNLOAD_FOLDER + filename + ext
        if isfile(path):
            print('file already exists, skipping: {}'.format(path))
            continue
        urllib.request.urlretrieve(img_url, path)
        writer.writerow({'source_url': img_url,'title':filename, 'path': path, 'source':query})
        print('{}.{}: Saving {}'.format(page, i, path))
        success += 1

    except Exception as e:
        print('{}.{}: {}'.format(page, i, str(e)))
        fail += 1

print('successfully download {} images, failing {}'.format(success, fail))