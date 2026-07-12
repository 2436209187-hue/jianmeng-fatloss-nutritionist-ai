# FastGPT 智能体接入指南

以下 4 个功能将通过 FastGPT 平台的智能体实现，通过 API 接口接入本工作台：

| 功能 | API 端点 | FastGPT 智能体名称 |
|------|---------|-------------------|
| 饮食方案生成 | POST /api/diet-plan/generate | 营养方案生成助手 |
| 饮食识别 | POST /api/diet/analyze | 餐食识别分析助手 |
| 配料分析 | POST /api/ingredient/analyze | 配料安全分析助手 |
| 菜单建议 | POST /api/menu/recommend | 外食菜单推荐助手 |

## 接入步骤

### 1. 在 FastGPT 平台创建智能体

登录 FastGPT 平台，分别创建以上 4 个智能体，配置：

- **知识库**: 上传营养学指南、食物热量数据、食品添加剂数据库
- **提示词**: 参考原项目 `server.ts` 中对应 API 的 Prompt
- **输出格式**: 使用结构化 JSON Schema

### 2. 获取 API 接口

每个智能体发布后获得独立的 API 端点，记下格式：
```
https://your-fastgpt.com/api/v1/chat/completions
```

### 3. 配置后端环境变量

在 `.env` 文件中设置：
```env
FASTGPT_API_URL="https://your-fastgpt.com/api/v1"
FASTGPT_API_KEY="your-api-key"
```

### 4. 实现后端代理

在 `backend/src/routes/fastgpt.routes.ts` 中补充各接口的 FastGPT 调用逻辑。

### 5. 重启服务

```bash
npm run dev
```

前端页面将自动从"接入中"占位切换到可用的功能页面。
