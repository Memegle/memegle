#!/bin/bash

count=0

python3 -m pip install --upgrade pip || ((count++))
python3 -m pip install paddlepaddle==2.0.0rc1 -i https://mirror.baidu.com/pypi/simple || ((count++))
python3 -m pip install -r ./scripts/paddle-req.txt || ((count++))
python3 -m pip install paddleocr -U || ((count++))

if ((count != 0)); then
  printf "\n\nFailed installing at least one of the dependencies, please try again or try installing manually\n"
else
  printf "\n\nPaddleOCR has been installed successfully\n"
fi

