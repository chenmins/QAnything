#!/bin/bash

# 压缩 models 和 nltk_data 文件夹
tar -czvf compressed_data.tar.gz models nltk_data

# 分割压缩文件为 99MB 的小文件
split -b 99M -d -a 3 compressed_data.tar.gz compressed_data.part.

# 删除原始压缩文件
rm compressed_data.tar.gz

echo "压缩并分割完成！文件名为 compressed_data.part.000, compressed_data.part.001, ..."