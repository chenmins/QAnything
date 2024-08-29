FROM onnx_cuda_check

# 设置工作目录
WORKDIR /workspace

# 复制 models 文件夹到 /root 目录
COPY models /root/models
COPY nltk_data /root/nltk_data

ADD requirements.txt /workspace/requirements.txt
RUN pip3 install --no-cache-dir -r /workspace/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

