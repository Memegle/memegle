# credit to the following page (for performance)
# https://stackoverflow.com/questions/6824681/get-a-random-boolean-in-python

from random import random

def predict_watermark(img):
    return random() < 0.5