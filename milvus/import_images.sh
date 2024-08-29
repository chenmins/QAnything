#!/bin/bash

# 导入压缩后的分割镜像文件
# 假定所有相关文件都在当前目录下，并且文件名遵循 '*__.tar.gz.*' 的模式

# 查找所有分割文件
files=$(ls *.tar.gz.*)

# 对于每个基本文件名，合并分片并解压
for base in $(echo "$files" | rev | cut -d '.' -f 2- | rev | uniq); do
    # 合并分片
    cat ${base}.* | gzip -d | docker load
    echo "已成功导入镜像：$base"
done

echo "所有分割的镜像文件已成功导入。"

