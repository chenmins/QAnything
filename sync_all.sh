#!/bin/bash

# 调用第一个脚本，将 source 远端同步到 origin
./sync_remotes.sh "source" "origin"

./sync_and_merge.sh source origin qanything-v2 qanything-v2_gpu_no_models develop_for_v1.5.0_gpu_no_models qanything-v2_gpu_no_models
./sync_and_merge.sh source origin qanything-v2 qanything-v2_gpu develop_for_v1.5.0_gpu qanything-v2_gpu

# 再次调用第一个脚本，将 origin 远端同步到 gt
./sync_remotes.sh "origin" "gt"
