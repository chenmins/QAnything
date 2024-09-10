#!/bin/bash

# 使用变量定义远端仓库名称
SOURCE_REMOTE=$1
TARGET_REMOTE=$2

if [ -z "$SOURCE_REMOTE" ] || [ -z "$TARGET_REMOTE" ]; then
  echo "用法: $0 <source_remote> <target_remote>"
  exit 1
fi

# 从 source 拉取所有分支
git fetch "$SOURCE_REMOTE"

# 获取所有分支名称（排除 HEAD 和远端标记的分支）
branches=$(git branch -r | grep "$SOURCE_REMOTE/" | grep -v '\->' | sed "s/$SOURCE_REMOTE\///")

# 对每个分支进行操作
for branch in $branches; do
    echo "正在处理分支: $branch"

    # 如果本地分支存在，删除它
    if git show-ref --verify --quiet "refs/heads/$branch"; then
        git branch -D "$branch"
    fi

    # 创建本地分支并跟踪 source 远端分支
    git checkout --track "$SOURCE_REMOTE/$branch"

    # 推送本地分支到 target 远端
    git push "$TARGET_REMOTE" "$branch" --force
done

echo "所有分支已成功从 $SOURCE_REMOTE 推送到 $TARGET_REMOTE"
