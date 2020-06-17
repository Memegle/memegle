#!/usr/bin/env python
# coding: utf-8

import urllib.request
import requests
import re
import unicodedata
import sys

if len(sys.argv) != 3:
    sys.exit('Require two int arguments: [start_id] [num_pics]')

def extractImgInfo(content):
    found = 'not found'
    try:
        found = re.search('<img class="biaoqingpp"(.+?)/>', content).group(1)
        url = re.search('src="(.+?)"', found).group(1)
        title = re.search('title="(.+?)"', found).group(1)
        
        return url, title
    except AttributeError:
        print(found)
        return None
    
def getExtention(url):
    ind = url.rindex('.')
    return url[ind:]

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


URL = 'https://fabiaoqing.com/biaoqing/detail/id/'
SUFFIX = '.html'
DOWNLOAD_FOLDER = 'raw/'
ID = abs(int(sys.argv[1]))
TIMES_RUN = int(sys.argv[2])

success = 0
fail = 0
for cid in range(ID, ID + TIMES_RUN, 1):
    try:
        response = requests.get(URL + str(cid) + SUFFIX)
        img_url, title = extractImgInfo(response.text)
        ext = getExtention(img_url)
        filename = DOWNLOAD_FOLDER + slugify(title, allow_unicode=True) + ext
        urllib.request.urlretrieve(img_url, filename)
        print('saving {}'.format(filename))
        success += 1
    except Exception as e:
        print('failing at {}'.format(cid))
        print(e)
        fail += 1
        
print('successfully download {} images, failing {}'.format(success, fail))




