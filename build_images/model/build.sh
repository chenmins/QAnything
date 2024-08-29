#!/bin/bash
# 创建软链接，如果已经存在则不创建
if [ ! -L "$(pwd)/models" ]; then
    ln -s ../../models $(pwd)/models
fi

if [ ! -L "$(pwd)/nltk_data" ]; then
    ln -s ../../nltk_data $(pwd)/nltk_data
fi
docker build -t qanything-linux:v1.5.0 .
docker run --rm -it --gpus all -v $(pwd):/mnt qanything-linux:v1.5.0 ls /root/models
docker run --rm -it --gpus all -v $(pwd):/mnt qanything-linux:v1.5.0 ls /root/nltk_data

