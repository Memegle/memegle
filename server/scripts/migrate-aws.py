import boto3
from botocore.exceptions import ClientError
import argparse
import magic
from os import mkdir, listdir
from os.path import exists, isfile, join
import sys

DEFAULT_INPUT_FOLDER = './data/raw/'
DEFAULT_OUTPUT_FOLDER = './data/uploaded/'
DEFAULT_ERROR_FOLDER = './data/error/'
BUCKET_NAME = 'memegle'

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input_dir')
parser.add_argument('-o', '--output_dir')
parser.add_argument('-e', '--error_dir')

args = parser.parse_args()

input_dir = args.input_dir if args.input_dir else DEFAULT_INPUT_FOLDER
output_dir = args.output_dir if args.output_dir else DEFAULT_OUTPUT_FOLDER
error_dir = args.error_dir if args.error_dir else DEFAULT_ERROR_FOLDER

s3 = boto3.resource('s3')
memegle = s3.Bucket(BUCKET_NAME)
client = boto3.client('s3')

if not exists(input_dir):
    if input_dir == DEFAULT_INPUT_FOLDER:
        print('Default input directory does not exist, creating and exiting')
        mkdir(input_dir)
    else:
        print('Input directory does not exist, exiting')

    sys.exit()

if not exists(output_dir):
    print('Output directory does not exist, creating')
    mkdir(output_dir)

if not exists(error_dir):
    print('Error directory does not exists, creating')
    mkdir(error_dir)


def process_dir(dir):
    for filename in listdir(dir):
        upload_file(dir, filename)


def upload_file(dir, filename):
    path = join(dir, filename)
    if not isfile(join(dir, filename)):
        return False

    if key_exists(filename):
        print('File with name {} already exists on S3, skipping'.format(filename))
        return False

    print('Uploading {} to s3...'.format(filename))
    mime = magic.from_file(path, mime=True)
    memegle.put_object(Key=filename, Body=open(path, 'rb'), ContentType=mime)
    return True


def key_exists(key):
    try:
        client.head_object(Bucket=BUCKET_NAME, Key=key)
        return True
    except ClientError as e:
        if e.response['ResponseMetadata']['HTTPStatusCode'] == 404:
            return False

        raise


process_dir(input_dir)
