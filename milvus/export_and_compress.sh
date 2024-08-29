#!/bin/bash

# 拉取 Docker 镜像
docker pull quay.io/coreos/etcd:v3.5.5
docker pull minio/minio:RELEASE.2023-03-20T20-16-18Z
docker pull milvusdb/milvus:v2.4.9-gpu
# docker pull milvusdb/milvus:v2.4.9
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.13.2
docker pull mysql:8.4
docker pull  xixihahaliu01/qanything-linux:v1.5.1
docker pull   freeren/qanything:v1.2.2
# 镜像列表
images=(
    "quay.io/coreos/etcd:v3.5.5"
    "minio/minio:RELEASE.2023-03-20T20-16-18Z"
    "milvusdb/milvus:v2.4.9-gpu"
#    "milvusdb/milvus:v2.4.9"
    "docker.elastic.co/elasticsearch/elasticsearch:8.13.2"
    "mysql:8.4"
    "xixihahaliu01/qanything-linux:v1.5.1"
    "freeren/qanything:v1.2.2"
)

# 导出并压缩镜像
for image in "${images[@]}"; do
    filename=$(echo "$image" | tr '/:' '__')
    docker save "$image" | gzip | split -b 4G - "${filename}.tar.gz."
    echo "已成功导出并压缩镜像：$image"
done

echo "所有镜像已成功导出并分割为 4G 大小的 gzip 文件。"

