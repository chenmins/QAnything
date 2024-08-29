FROM nvidia/cuda:12.2.2-base-ubuntu22.04

# 设置清华源，并安装必备的依赖和编译工具
RUN sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y build-essential wget zlib1g-dev libssl-dev libffi-dev libbz2-dev libreadline-dev libsqlite3-dev

# 创建构建目录并下载、安装 Python 3.10.12
RUN mkdir /build && \
    cd /build && \
    wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz && \
    tar -xvf Python-3.10.12.tgz && \
    cd Python-3.10.12 && \
    ./configure && \
    make all && \
    make install && \
    ln -s /usr/local/bin/python3 /usr/bin/python3 && \
    ln -s /usr/local/bin/pip3 /usr/bin/pip3

# 安装 ONNX Runtime GPU 版本
RUN pip3 install onnxruntime-gpu