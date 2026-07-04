# 前端项目文件说明文档

> 项目名称：QAnything Front End
> 技术栈：Vue 3 + TypeScript + Pinia + Vite + Ant Design Vue

---

## 一、项目根目录配置

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `index.html` | Vite 应用入口 HTML，挂载 `#app` 根节点 | 被 `vite.config.ts` 引用为构建入口 |
| `package.json` | 项目依赖配置（Vue、Ant Design、Pinia、axios 等） | 被所有代码文件间接依赖 |
| `vite.config.ts` | Vite 构建配置，定义别名 `@`、插件、proxy 等 | 关联 `main.ts`（入口）、`tsconfig.json`（路径别名） |
| `tsconfig.json` | TypeScript 编译配置 | 关联所有 `.ts` / `.vue` 文件 |
| `.eslintrc.js` | ESLint 代码规范配置 | 关联所有 `.ts` / `.vue` / `.js` 文件 |
| `.prettierrc.js` | Prettier 代码格式化配置 | 配合 ESLint 使用 |
| `version.json` | 版本号文件 | 被 `writeVersion.js` 写入 |
| `analysis-chart.html` | 分析图表页面（独立 HTML） | 独立，不依赖项目其他文件 |
| `test.js` | 测试脚本 | 独立工具脚本 |
| `writeVersion.js` | 版本号写入脚本，构建时自动更新 `version.json` | 关联 `version.json` |

---

## 二、应用入口

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/main.ts` | Vue 应用入口文件，初始化 App、挂载 Pinia/Router，注册全局组件 | 关联 `App.vue`、`router/index.ts`、`store/index.ts`、`language/index.ts`、全局样式 |
| `src/App.vue` | 根组件，仅包含 `<router-view>` 作为路由出口 | 被 `main.ts` 挂载，关联路由系统 |
| `src/env.d.ts` | 环境类型声明（Vite 环境变量类型） | 被所有 TS 文件间接引用 |
| `src/auto-import.d.ts` | 自动导入的类型声明（unplugin-auto-import） | 关联 `main.ts` 的自动导入配置 |
| `urs.d.ts` | 额外类型声明 | 补充全局类型定义 |

---

## 三、路由模块

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/router/index.ts` | 创建 Vue Router 实例，配置路由模式和全局守卫 | 关联 `routes.ts`（路由表）、`main.ts`（挂载） |
| `src/router/routes.ts` | 路由表定义，配置页面路径与组件映射 | 关联 `views/` 目录下的页面组件 |
| `src/controller/router.ts` | 路由控制器封装，提供 `changePage`、`openNewPage`、`getUrlParams` 等工具函数 | 被各 Store 和组件引用用于页面跳转 |

**关联关系：** `main.ts` → `router/index.ts` → `routes.ts` → `views/*.vue`

---

## 四、Store（Pinia 状态管理）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/store/index.ts` | Pinia 实例创建 | 被 `main.ts` 挂载 |
| `src/store/useChat.ts` | 对话聊天状态管理（消息列表、发送消息、SSE 流式接收、历史记录） | 关联 `useChatSource.ts`、`useKnowledgeBase.ts`、`useChatSetting.ts`、`services/`、`utils/` |
| `src/store/useHomeChat.ts` | 首页对话状态管理 | 关联 `useChat.ts`、`useKnowledgeBase.ts` |
| `src/store/useBots.ts` | 机器人（Bot）列表状态管理 | 关联 `useKnowledgeBase.ts`、`services/` |
| `src/store/useBotsChat.ts` | 机器人对话状态管理 | 关联 `useChat.ts`、`useKnowledgeBase.ts` |
| `src/store/useChatSource.ts` | 对话数据来源状态管理（来源展开/折叠、模态框控制） | 被 `useChat.ts` 引用 |
| `src/store/useChunkView.ts` | 切片预览/编辑弹窗状态管理 | 被知识库相关组件引用 |
| `src/store/useHeader.ts` | 页面 Header 状态管理 | 被布局组件引用 |
| `src/store/useKnowledgeBase.ts` | 知识库状态管理（知识库列表、当前知识库 ID） | 被多个 Store 和组件核心引用 |
| `src/store/useKnowledgeModal.ts` | 知识库弹窗状态管理 | 关联 `useKnowledgeBase.ts` |
| `src/store/useLanguage.ts` | 语言偏好状态管理（本地持久化） | 关联 `language/` 国际化文件 |
| `src/store/useQuickStart.ts` | 快速开始引导状态管理 | 被首页组件引用 |
| `src/store/useUploadFiles.ts` | 文件上传状态管理 | 关联 `services/` 上传 API |
| `src/store/useUser.ts` | 用户信息状态管理 | 关联 `services/` 用户 API |
| `src/store/useChatSetting.ts` | 对话模型设置状态管理（模型选择、参数配置） | 关联 `interface.ts`（IChatSetting 类型）、`services/` |
| `src/store/useOptiionList.ts` | 知识库文件列表 & FAQ 列表状态管理（分页、轮询、状态统计） | 关联 `useKnowledgeBase.ts`、`services/urlConfig.ts`、`utils/utils.ts` |

**核心依赖链：** `useKnowledgeBase.ts`（知识库 ID）→ 被 `useChat.ts`、`useBots.ts`、`useOptiionList.ts` 等依赖

---

## 五、组件（Components）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/components/ChatInfoPanel.vue` | 聊天信息面板（展示耗时、Token 消耗、模型信息等） | 关联 `useChat.ts`、`useChatSource.ts`、`interface.ts`（IChatItemInfo） |
| `src/components/ChatSettingDialog.vue` | 聊天设置弹窗 | 关联 `useChatSetting.ts`、`ChatSettingForm.vue` |
| `src/components/ChatSettingForm.vue` | 聊天设置表单（模型参数配置） | 关联 `useChatSetting.ts` |
| `src/components/ChatTextarea.vue` | 聊天输入框组件（支持 URL 解析、文件上传、提及） | 关联 `Mention.vue`、`useUploadFiles.ts`、`services/` |
| `src/components/Mention.vue` | @提及组件（提及知识库） | 关联 `useKnowledgeBase.ts` |
| `src/components/HighLightMarkDown.vue` | Markdown 渲染高亮组件 | 关联 `useChatSource.ts`（数据来源高亮） |
| `src/components/SvgIcon.vue` | SVG 图标组件 | 被全局注册，各组件通用 |
| `src/components/DefaultModal.vue` | 通用模态框组件 | 被其他弹窗组件复用 |
| `src/components/Bots/ChatShare.vue` | 机器人聊天分享组件 | 关联 `useBotsChat.ts`、`shareBotApi.ts` |

---

## 六、视图页面（Views）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/views/bots/children/BotShare.vue` | 机器人分享页面 | 关联 `Bots/ChatShare.vue`、`useBotsChat.ts`、`shareBotApi.ts` |

---

## 七、API 服务层（Services）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/services/urlConfig.ts` | API 接口配置和请求封装（所有后端 API 调用入口） | 被所有 Store 引用发请求，关联 `ResConfig.ts` |
| `src/services/ResConfig.ts` | 响应结果统一处理配置 | 被 `urlConfig.ts` 引用 |
| `src/services/index.ts` | services 统一导出 | 方便其他模块引用 |
| `src/services/shareBotApi.ts` | 机器人分享专用 API | 关联 `urlConfig.ts`，被 BotShare 相关组件使用 |

### 7.1 Axios 拦截器系统（请求/响应拦截器链）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/services/axiosInterceptor/index.ts` | 拦截器系统主入口，创建 axios 实例并组合各拦截器 | 被所有 API 请求使用 |
| `src/services/axiosInterceptor/autoImport.ts` | 拦截器自动导入配置 | 关联 `index.ts` |
| `src/services/axiosInterceptor/browerQuene.ts` | 浏览器请求队列管理（控制并发请求数） | 被拦截器主入口引用 |
| `src/services/axiosInterceptor/interceptors/index.ts` | 拦截器统一导出 | 被 `index.ts` 引用 |
| `src/services/axiosInterceptor/interceptors/autoRetry.ts` | **请求拦截器** — 自动重试失败请求 | 链式组合到 axios 实例 |
| `src/services/axiosInterceptor/interceptors/cancelRepeat.ts` | **请求拦截器** — 取消重复请求（防重复提交） | 链式组合到 axios 实例 |
| `src/services/axiosInterceptor/interceptors/errorToast.ts` | **响应拦截器** — 错误提示 Toast | 链式组合到 axios 实例 |
| `src/services/axiosInterceptor/interceptors/forceRetry.ts` | **请求拦截器** — 强制重试机制 | 链式组合到 axios 实例 |
| `src/services/axiosInterceptor/interceptors/showLoading.ts` | **请求拦截器** — 全局 Loading 状态控制 | 链式组合到 axios 实例 |
| `src/services/axiosInterceptor/interceptors/sign.ts` | **请求拦截器** — 请求签名（鉴权） | 链式组合到 axios 实例 |

**拦截器执行顺序（请求拦器）：** sign → cancelRepeat → forceRetry → autoRetry → showLoading

---

## 八、国际化（i18n）

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/language/index.ts` | 国际化主入口，创建 i18n 实例、切换语言方法 | 被 `main.ts` 挂载，关联 `en.ts` / `zh.ts` |
| `src/language/en.ts` | 英文语言包 | 被 `index.ts` 引用 |
| `src/language/zh.ts` | 中文语言包 | 被 `index.ts` 引用 |

---

## 九、工具函数 & 类型定义

### 9.1 类型定义

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/interface.ts` | 全局接口/类型定义 | 被多个 Store 和组件引用 |
| `src/utils/types.ts` | 核心业务类型定义（`IKnowledgeItem`、`IChatItem`、`IChatSetting`、`IDataSourceItem`、`ITimeInfo`、`ITokenInfo`、`IUrlListItem`、`IFileListItem` 等） | 被几乎所有 Store 和组件引用，是项目的类型核心 |
| `src/utils/enum.ts` | 枚举常量定义 | 被相关组件引用 |
| `src/utils/config.ts` | 应用配置常量（API 基础路径等） | 被 `services/` 引用 |

### 9.2 功能工具

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/utils/utils.ts` | 通用工具函数（`formatDate`、`formatFileSize`、`resultControl`、`deepClone` 等） | 被多个 Store 和组件引用 |
| `src/utils/getPosition.ts` | DOM 元素位置计算工具 | 被 `Mention.vue`、`ChatTextarea.vue` 引用 |
| `src/utils/nporgress.ts` | 页面顶部进度条控制（基于 NProgress） | 被路由守卫和请求拦截器引用 |
| `src/utils/typewriter.ts` | 打字机效果工具（逐字显示 AI 回复） | 被 `useChat.ts` 引用用于流式输出 |
| `src/utils/version.ts` | 版本信息工具 | 被页面组件引用显示版本号 |

---

## 十、样式模块

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/styles/variable/global.scss` | 全局 SCSS 变量定义（品牌色、标题色、线条色、链接色） | 被所有 `.vue` 组件样式引用 |
| `src/styles/variable/setting.scss` | SCSS 配置变量 | 被全局样式引用 |
| `src/styles/variable/mixins.scss` | SCSS 混入（mixin）定义 | 被组件样式引用 |
| `src/styles/common/global.scss` | 全局公共样式（覆盖默认样式） | 被 `main.ts` 全局引入 |
| `src/styles/common/reset.scss` | CSS Reset 样式重置 | 被 `main.ts` 全局引入 |
| `src/styles/common/resetAntd.scss` | Ant Design Vue 样式重置/覆盖 | 被 `main.ts` 全局引入 |

---

## 十一、静态资源 & 其他

| 文件 | 说明 | 关联性 |
|------|------|--------|
| `src/assets/js/index.umd.js` | UMD 格式静态 JS 库 | 被 `index.html` 或组件引用 |
| `src/assets/js/RecordEntry.js` | 录音功能 JS 实现 | 被音频相关组件引用 |
| `public/processor.worker.js` | Web Worker — 音频处理 Worker（在独立线程运行） | 被 `processor.worklet.js` 或录音功能引用 |
| `public/processor.worklet.js` | AudioWorklet — 音频处理 Worklet（音频重采样） | 被录音功能引用 |

---

## 十二、整体架构依赖关系图

```
main.ts (入口)
  ├─ App.vue (根组件，仅 `<router-view>`)
  │    └─ router/index.ts
  │         └─ routes.ts → views/*.vue + components/*.vue
  │
  ├─ store/index.ts (Pinia)
  │    ├─ useKnowledgeBase.ts (核心：知识库 ID)
  │    ├─ useChat.ts (对话) ──→ useChatSource.ts, useChatSetting.ts
  │    ├─ useHomeChat.ts (首页对话)
  │    ├─ useBots.ts (机器人) ──→ useBotsChat.ts
  │    ├─ useOptiionList.ts (文件/FAQ 列表)
  │    ├─ useUploadFiles.ts (上传)
  │    ├─ useLanguage.ts (国际化)
  │    └─ 其他 Store
  │
  ├─ services/ (API 层)
  │    ├─ urlConfig.ts (接口封装) ──→ axiosInterceptor/
  │    │    ├── sign.ts (签名)
  │    │    ├── cancelRepeat.ts (防重复)
  │    │    ├── forceRetry.ts / autoRetry.ts (重试)
  │    │    ├── showLoading.ts (加载态)
  │    │    └── errorToast.ts (错误提示)
  │    └─ shareBotApi.ts (分享 API)
  │
  ├─ language/ (国际化)
  │    ├── index.ts → en.ts + zh.ts
  │
  ├─ utils/ (工具)
  │    ├── types.ts (核心类型定义)
  │    ├── interface.ts (接口定义)
  │    ├── utils.ts (通用工具)
  │    ├── typewriter.ts (打字机效果)
  │    └── ...
  │
  └─ styles/ (样式)
       ├── variable/ (SCSS 变量)
       └── common/ (公共样式 + Reset)
```

---

## 十三、关键依赖关系说明

1. **`useKnowledgeBase.ts` 是状态核心** — 几乎所有其他 Store 都依赖当前选中的知识库 ID (`currentId`)
2. **`utils/types.ts` 是类型核心** — 定义了 `IChatItem`、`IChatSetting`、`IDataSourceItem` 等核心业务类型，被大多数模块引用
3. **`services/urlConfig.ts` 是 API 入口** — 所有后端请求都通过此文件发出，经过 axios 拦截器链处理
4. **`controller/router.ts` 是路由工具层** — 封装了页面跳转逻辑，被 Store 和组件复用
5. **样式文件按职责分离** — `variable/` 定义变量和 mixin，`common/` 定义全局样式，组件各自有 scoped 样式
