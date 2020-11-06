import requests
import urllib.request
from os import mkdir
from os.path import exists, isdir
import re
import unicodedata
import json as js

# Please manually filter out bad images after running the scripts.

# Always change this two variable before executing
# The + sign force the result to include pattern 表情包
query = '问号 +表情包'
tags = ['???', '问号', '？？？']

# Constants
DOWNLOAD_FOLDER = 'data/raw/' + ';'.join(tags) + '/'
# Each page returns 30 images, [start, end)
START_PAGE = 0
END_PAGE = 3

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

for page in range(START_PAGE, END_PAGE, 1):
    print('Processing page {}'.format(page))
    start_ind = page * 30
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
    for i in range(len(data) - 1):
        try:
            d = data[i]
            img_url = d['middleURL']
            filename = slugify(d['fromPageTitleEnc'], allow_unicode=True)
            ext = '.' + d['type']
            path = DOWNLOAD_FOLDER + filename + ext
            urllib.request.urlretrieve(img_url, path)
            print('{}.{}: Saving {}'.format(page, i, path))
            success += 1

        except Exception as e:
            print('{}.{}: {}'.format(page, i, str(e)))
            fail += 1


print('successfully download {} images, failing {}'.format(success, fail))