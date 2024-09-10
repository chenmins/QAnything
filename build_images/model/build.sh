#!/bin/bash
# 创建软链接，如果已经存在则不创建
if [ ! -L "$(pwd)/models" ]; then
    ln -s ../../models $(pwd)/models
fi

if [ ! -L "$(pwd)/nltk_data" ]; then
    ln -s ../../nltk_data $(pwd)/nltk_data
fi
docker build -t chenmins/qanything-linux:v2 .
docker run --rm -it --gpus all -v $(pwd):/mnt chenmins/qanything-linux:v2 ls /root/models
docker run --rm -it --gpus all -v $(pwd):/mnt chenmins/qanything-linux:v2 ls /root/nltk_data

