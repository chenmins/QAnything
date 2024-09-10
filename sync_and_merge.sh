#!/bin/bash

# 检查参数数量
if [ "$#" -ne 6 ]; then
    echo "用法: $0 <source_remote> <origin_remote> <base_branch> <new_branch> <merge_branch> <target_branch>"
    exit 1
fi

# 从命令行参数获取变量
SOURCE_REMOTE=$1
ORIGIN_REMOTE=$2
BASE_BRANCH=$3
NEW_BRANCH=$4
MERGE_BRANCH=$5
TARGET_BRANCH=$6

# 从 source 拉取 base 分支
echo "从 $SOURCE_REMOTE 拉取 $BASE_BRANCH 分支..."
git fetch "$SOURCE_REMOTE" "$BASE_BRANCH"

# 切换到 base 分支
git checkout "$SOURCE_REMOTE/$BASE_BRANCH"

# 如果新的分支存在，删除它
if git show-ref --verify --quiet "refs/heads/$NEW_BRANCH"; then
    echo "删除存在的分支 $NEW_BRANCH..."
    git branch -D "$NEW_BRANCH"
fi

# 基于 base 分支创建新分支
echo "基于 $BASE_BRANCH 创建新分支 $NEW_BRANCH..."
git checkout -b "$NEW_BRANCH"

# 拉取 origin 的合并分支
echo "从 $ORIGIN_REMOTE 拉取 $MERGE_BRANCH 分支..."
git fetch "$ORIGIN_REMOTE" "$MERGE_BRANCH"

# 合并 origin 的合并分支到新的分支
echo "合并 $ORIGIN_REMOTE/$MERGE_BRANCH 到 $NEW_BRANCH..."
git merge "$ORIGIN_REMOTE/$MERGE_BRANCH" --no-ff

# 解决合并冲突后，推送新分支到 origin
echo "推送 $NEW_BRANCH 到 $ORIGIN_REMOTE..."
git push "$ORIGIN_REMOTE" "$TARGET_BRANCH" --force

echo "分支合并和推送完成！"
