# 多版本构建系统使用说明

## 快速开始

### 构建完整版本（包含管理界面）

```bash
cd front_end
pnpm install
pnpm build
```

输出目录：`dist/qanything`

### 构建 Bots 分享专用版本（仅分享页面）

```bash
cd front_end
pnpm install
pnpm build:bots
```

输出目录：`dist/bots-only`

## 配置验证

运行配置测试脚本：

```bash
cd front_end
./test-build-config.sh
```

## 版本说明

### 完整版本
- ✅ 机器人管理界面 (`/bots`)
- ✅ 机器人编辑功能 (`/bots/:id/edit`)
- ✅ 知识库管理 (`/home`)
- ✅ 快速开始 (`/quickstart`)
- ✅ 统计功能 (`/statistics`)
- ✅ 分享页面 (`/bots/:id/share`)

### Bots 分享专用版本
- ❌ 无管理界面
- ❌ 无编辑功能
- ❌ 无知识库管理
- ❌ 无快速开始
- ❌ 无统计功能
- ✅ **仅包含分享页面** (`/bots/:id/share`)

## 安全特性

分享专用版本的安全设计：
1. 构建时移除所有管理功能代码
2. 只保留分享页面路由
3. 用户无法通过任何方式访问管理界面
4. 适合部署到公网提供分享服务

## 详细文档

查看完整文档：[BUILD_GUIDE.md](./BUILD_GUIDE.md)
