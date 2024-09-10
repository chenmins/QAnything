#!/bin/bash
docker build -t chenmins/onnx_cuda_check:v2 .
docker run --rm -it --gpus all -v $(pwd):/mnt chenmins/onnx_cuda_check:v2 python3 /mnt/cuda_check.py
