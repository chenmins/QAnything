#!/bin/bash

# 合并分割文件为一个 .tar.gz 文件
cat compressed_data.part.* > compressed_data.tar.gz

# 解压缩还原
tar -xzvf compressed_data.tar.gz

# 删除合并的 .tar.gz 文件
rm compressed_data.tar.gz

echo "解压并还原完成！"