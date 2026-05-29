# Front_end 多版本构建说明

## 概述

front_end 项目现在支持两种构建模式：
1. **完整版本**：包含所有功能模块（/home、/bots、/quickstart、/statistics）
2. **Bots分享专用版本**：仅包含机器人分享页面，不包含管理界面

## 构建命令

### 1. 构建完整版本

```bash
cd front_end
pnpm install
pnpm build
```

**输出目录**：`dist/qanything`

**包含的路由**：
- `/home` - 首页（知识库管理）
- `/bots` - 机器人管理
- `/quickstart` - 快速开始
- `/statistics` - 统计页面

### 2. 构建 Bots 分享专用版本

```bash
cd front_end
pnpm install
pnpm build:bots
```

**输出目录**：`dist/bots-only`

**包含的路由**：
- `/bots/:botId/share` - 机器人分享页面（**仅此一个路由**）

**安全说明**：
- ✅ 只能访问具体的分享链接，如：`/#/bots/BOTc262bc7b4f93447ebaef52d68e038d15/share`
- ❌ 无法访问 `/bots` 管理界面
- ❌ 无法访问 `/bots/:botId/edit` 编辑页面
- ❌ 所有非分享路径会被拦截重定向
- 防止用户通过前台网址进入机器人管理界面

## 技术实现细节

### 环境配置文件

- `.env.production` - 完整版本的生产环境配置
- `.env.production.bots` - Bots分享专用版本的生产环境配置

关键配置项：
```
VITE_APP_MODE=bots-only  # 在 .env.production.bots 中标识构建模式
```

### 路由配置

- `src/router/routes.ts` - 完整版本的路由配置（包含所有管理功能）
- `src/router/routes.bots.ts` - Bots分享专用版本的路由配置（**仅包含 share 路由**）
- `src/router/index.ts` - 根据 `VITE_APP_MODE` 环境变量动态加载对应的路由

#### Bots分享版本路由结构

```typescript
// 仅包含分享页面
{
  path: '/bots/:botId/share',
  name: 'share',
  component: () => import('@/views/bots/children/BotShare.vue'),
}

// 所有其他路径都被拦截
{
  path: '/:catchAll(.*)',
  redirect: '/bots/error/share'
}
```

### Vite 构建配置

`vite.config.ts` 中根据构建模式自动切换输出目录：
- `production` 模式 → `dist/qanything`
- `production-bots` 模式 → `dist/bots-only`

## 开发模式

开发模式默认使用完整版本的路由：

```bash
pnpm dev
```

如果需要在开发模式下测试 Bots 分享专用版本，可以修改 `.env.development` 文件中的 `VITE_APP_MODE` 为 `bots-only`。

## 构建优化

### Tree Shaking

Vite 会自动进行 Tree Shaking，移除未使用的代码。在 Bots 分享专用版本中：
- **不包含**：BotsManage、BotEdit、EditDetail、BotPublish 等管理组件
- **不包含**：Layout、Header、Sider 等后台管理布局组件
- **不包含**：Home、QuickStart 等其他功能模块
- **仅包含**：BotShare 分享页面及其依赖的聊天组件
- 大幅减少最终构建包的大小

### 代码分割

项目使用动态导入 (`import()`) 实现路由级别的代码分割：
- 每个路由组件会被分割到独立的 chunk
- 按需加载，提高首屏加载速度

### 构建分析

查看构建产物分析：

```bash
pnpm build  # 或 pnpm build:bots
```

构建完成后，查看生成的 `analysis-chart.html` 文件来分析打包体积。

## 版本对比

| 功能模块 | 完整版本 | Bots分享版本 |
|---------|---------|-------------|
| 机器人管理 (`/bots`) | ✅ | ❌ |
| 机器人编辑 (`/bots/:id/edit`) | ✅ | ❌ |
| 机器人分享 (`/bots/:id/share`) | ✅ | ✅ |
| 知识库管理 (`/home`) | ✅ | ❌ |
| 快速开始 (`/quickstart`) | ✅ | ❌ |
| 统计页面 (`/statistics`) | ✅ | ❌ |
| Layout布局 | ✅ | ❌ |
| Header导航 | ✅ | ❌ |
| Sider侧边栏 | ✅ | ❌ |

## 部署建议

### 完整版本部署（内部管理系统）

```bash
pnpm build
# 部署 dist/qanything 目录到内部服务器
# 需要配置访问权限控制
```

适用场景：
- 内部管理后台
- 需要创建和管理机器人
- 需要完整的功能访问

### Bots 分享专用版本部署（公开访问）

```bash
pnpm build:bots
# 部署 dist/bots-only 目录到公网服务器
# 可以公开访问，安全性高
```

适用场景：
- 公开的机器人分享链接
- 嵌入到第三方网站
- 对外提供服务的分享页面

推荐部署方式：
- 完整版本：`https://admin.example.com/qanything/` （内网或受保护）
- 分享版本：`https://chat.example.com/` 或 `https://example.com/bots/` （公网）

## 安全性说明

### Bots分享版本的安全特性

1. **路由隔离**：构建时就已移除所有管理相关的路由和组件
2. **代码精简**：不包含任何管理界面的代码，即使通过浏览器调试也无法访问
3. **访问限制**：只有持有正确 botId 的分享链接才能访问对应的机器人
4. **防止枚举**：错误的路径会被重定向，不会暴露系统信息

### 建议的安全措施

在服务端API层面：
1. 对分享接口做访问频率限制
2. 验证 botId 的有效性
3. 检查机器人的分享权限设置
4. 记录访问日志便于审计

## 故障排查

### 构建失败

1. 确保已安装依赖：`pnpm install`
2. 清除缓存：`rm -rf node_modules/.vite`
3. 检查 Node.js 版本（推荐 v16+）

### 路由不工作

1. 检查环境变量是否正确设置
2. 确认 `.env.production.bots` 文件存在
3. 查看浏览器控制台的错误信息

### 分享页面无法访问

1. 确认 botId 格式正确
2. 检查服务端 API 是否正常
3. 确认机器人已设置为允许分享

## 扩展新的构建版本

如果需要添加其他构建版本（例如仅知识库版本），可以按照以下步骤：

1. 创建新的环境配置文件：`.env.production.knowledge`
2. 创建新的路由文件：`src/router/routes.knowledge.ts`
3. 在 `src/router/index.ts` 中添加条件判断
4. 在 `vite.config.ts` 中添加新的模式判断
5. 在 `package.json` 中添加新的构建脚本：`build:knowledge`

## 使用示例

### 完整版本使用流程

1. 登录管理后台
2. 创建/编辑机器人
3. 配置机器人知识库
4. 发布机器人并获取分享链接

### 分享版本使用流程

1. 用户访问分享链接：`https://chat.example.com/#/bots/BOTxxx/share`
2. 直接进入聊天界面与机器人对话
3. 无需登录，无需权限，公开访问
