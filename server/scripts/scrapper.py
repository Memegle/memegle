#!/usr/bin/env python
# coding: utf-8

import urllib.request
import requests
import re
import unicodedata
import sys
from bs4 import BeautifulSoup


if len(sys.argv) != 3:
    sys.exit('Require two int arguments: [start_id] [num_pics]')

def extractImgInfo(content):
    found = 'not found'
    try:
        urls = []
        titles = []
        soup = BeautifulSoup(content, 'html.parser')
        images = soup.findAll('img', alt=True)
        for image in images:
            urls.append(image['src'])
            titles.append(image['alt'])
        return urls, titles
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


#URL = 'http://www.bbsnet.com/page/'
URL = 'http://www.weixinbqb.com/plus/list.php?tid=8&TotalResult=2004&PageNo='
DOWNLOAD_FOLDER = 'raw2/'
ID = abs(int(sys.argv[1]))
TIMES_RUN = int(sys.argv[2])

subs = "/uploads/allimg/"

success = 0
fail = 0
for cid in range(ID, ID + TIMES_RUN, 1):
    try:
        response = requests.get(URL + str(cid))
        img_url, title = extractImgInfo(response.text)
        j = 0
        for img in img_url:
            if (img.find(subs) != -1):
                ext = getExtention(img)
                filename = DOWNLOAD_FOLDER + title[j] + ext
                u = 'http://www.weixinbqb.com' + img
                urllib.request.urlretrieve(u, filename)
                print('saving {}'.format(filename))
                success += 1
            j += 1
    except Exception as e:
        print('failing at {}'.format(cid))
        print(e)
        fail += 1
        
print('successfully download {} images, failing {}'.format(success, fail))




