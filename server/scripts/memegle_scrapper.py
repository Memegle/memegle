import urllib.request, json 
import argparse
from os.path import exists, isdir, isfile, join, abspath
from os import mkdir

parser = argparse.ArgumentParser()
parser.add_argument('-o', '--output_dir', default='./data/raw/')
args = parser.parse_args()

DOWNLOAD_FOLDER = abspath(args.output_dir)
URL = "https://memegle.live:8080/all"
TIMES_RUN = 0
success = 0

if not isdir(DOWNLOAD_FOLDER):
    print('Folder {} not found, creating...'.format(DOWNLOAD_FOLDER))
    mkdir(DOWNLOAD_FOLDER)

with urllib.request.urlopen(URL) as url:
    data = json.loads(url.read().decode())
    for img in data:
    	try: 
    		TIMES_RUN += 1
    		img_url = img['media_url']
    		filename = img['title'] + '.' + img['ext']
    		path = join(DOWNLOAD_FOLDER, filename)
    		urllib.request.urlretrieve(img_url, path)
    		success += 1
    	except Exception as e:
    		print('failing at {} with error: {}'.format(img['media_url'], e))

print('successfully downloaded {} images out of {}'.format(success, TIMES_RUN-success))