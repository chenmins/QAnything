#!/bin/bash
docker build -t onnx_cuda_check .
docker run --rm -it --gpus all -v $(pwd):/mnt onnx_cuda_check python3 /mnt/cuda_check.py
