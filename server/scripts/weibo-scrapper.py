#!/usr/bin/env python
# coding: utf-8
# codes modified upon: https://blog.csdn.net/weixin_43943977/article/details/102873455

"""
README
Some good user ID to scrap: 2168613091, 5700379397, 6427203514, 3278620272, 5863569045
To find user ID: Check the url of that user
For example: https://weibo.com/u/5863569045?ssl_rnd=1611524439.3577&is_all=1
The uesr ID can be found as 5863569045 after the "/u/" and before "?"

To run this script, you need to provide two parameters: 1. The user ID, 2. Number of pictures to scrap
Example: python3 weibo-scrapper.py 5863569045 5
"""

import urllib.request
import json
import requests
import os
import re
import sys
import argparse
import csv


def positive_int(num):
    val = int(num)
    if val < 0:
        raise argparse.ArgumentTypeError("Cannot accept negative start id")

    return val


parser = argparse.ArgumentParser()
parser.add_argument('uid')
parser.add_argument('count', type=positive_int)
parser.add_argument('-s', '--start_page', type=positive_int, default=0)
parser.add_argument('-p', '--proxy_addr', default="122.241.72.191:808")
parser.add_argument('-o', '--output_dir', default='./data/raw/')
args = parser.parse_args()

start_page = args.start_page
proxy_addr = args.proxy_addr
path = os.path.abspath(args.output_dir)
csv_path = os.path.join(path, 'meta.csv')

HEADERS = ['source_url', 'title', 'path', 'source']

if os.path.isfile(csv_path):
    f = open(csv_path, 'a')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
else:
    f = open(csv_path, 'w')
    writer = csv.DictWriter(f, fieldnames=HEADERS)
    writer.writeheader()


def use_proxy(url, proxy_addr):
    req = urllib.request.Request(url)
    req.add_header("User-Agent",
                   "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0")
    proxy = urllib.request.ProxyHandler({'http': proxy_addr})
    opener = urllib.request.build_opener(proxy, urllib.request.HTTPHandler)
    urllib.request.install_opener(opener)
    data = urllib.request.urlopen(req).read().decode('utf-8', 'ignore')
    return data


def get_containerid(url):
    data = use_proxy(url, proxy_addr)
    content = json.loads(data).get('data')
    for data in content.get('tabsInfo').get('tabs'):
        if data.get('tab_type') == 'weibo':
            containerid = data.get('containerid')

    print('container id is', containerid)
    return containerid


def get_userInfo(id):
    url = 'https://m.weibo.cn/api/container/getIndex?type=uid&value=' + id
    data = use_proxy(url, proxy_addr)
    content = json.loads(data).get('data')
    profile_url = content.get('userInfo').get('profile_url')
    description = content.get('userInfo').get('description')
    name = content.get('userInfo').get('screen_name')
    print("图片来自：\n" + "微博昵称：" + name + "\n" + "微博主页地址：" + profile_url + "\n" + "微博说明：" + description)
    return None


def get_weibo(id, count):
    downloaded = 0
    i = -1
    while downloaded < count:
        print('downloaded is', downloaded)
        i += 1
        url = 'https://m.weibo.cn/api/container/getIndex?type=uid&value=' + id
        weibo_url = 'https://m.weibo.cn/api/container/getIndex?type=uid&value=' + id + '&containerid=' + get_containerid(
            url) + '&page=' + str(i)
        try:
            data = use_proxy(weibo_url, proxy_addr)
            content = json.loads(data).get('data')
            cards = content.get('cards')
        except Exception as e:
            print(e)
            cards = []
            pass
        if (len(cards) > 0):
            for j in range(len(cards)):
                print("-----正在爬取第" + str(i) + "页，第" + str(j) + "条微博------")
                try:
                    card_type = cards[j].get('card_type')
                    if (card_type == 9):
                        mblog = cards[j].get('mblog')
                        attitudes_count = mblog.get('attitudes_count')
                        comments_count = mblog.get('comments_count')
                        created_at = mblog.get('created_at')
                        reposts_count = mblog.get('reposts_count')
                        scheme = cards[j].get('scheme')
                        # Extract weibo texts to name the image files
                        # Keep all characters
                        text = mblog.get('text')
                        text = "".join(re.findall("[\w]", text))
                        if len(text) > 255:
                            text = text[:255]
                        # text = re.sub('[A-Za-z0-9]', '', text)
                        # Output
                        if mblog.get('pics') != None:
                            pic_archive = mblog.get('pics')
                            for _ in range(len(pic_archive)):
                                print(pic_archive[_]['large']['url'])
                                imgurl = pic_archive[_]['large']['url']
                                img = requests.get(imgurl)
                                print('path is', path)
                                f_name = path + '/' + str(text) + str(_ + 1) + str(imgurl[-4:])
                                if os.path.isfile(f_name):
                                    print('file already exists, skipping: {}'.format(path))
                                    continue
                                f = open(f_name, 'ab')
                                f.write(img.content)
                                f.close()
                                writer.writerow({'source_url': weibo_url + 'card={}{}'.format(j, _), 'title': text, 'path': path, 'source': 'weibo-'+id})
                                downloaded += 1

                except Exception as e:
                    print(e)
                    pass
        else:
            break
    print("任务完成。已下载{}页{}张图片".format(i+1, downloaded))
    return None


def main():
    if len(sys.argv) != 3:
        sys.exit('Require two int arguments: [user_id] [num_pages]')

    user_id = args.uid
    count = args.count

    if not os.path.isdir(path):
        os.mkdir(path)
    get_userInfo(user_id)
    get_weibo(user_id, count)


if __name__ == "__main__":
    main()
