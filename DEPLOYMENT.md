# 部署指南 — 全部部署到 Vercel

前后端均部署到 Vercel，无需额外服务器。

## 部署架构

```
Vercel
├── frontend/  →  静态托管 (Vite build)
├── api/       →  Serverless Functions (Express API)
└── vercel.json →  路由配置
```

`/api/*` 请求 → Vercel Serverless Function（后端 Express）
其他请求 → 静态文件（前端 React）

---

## 步骤

### 1. 推送代码到 GitHub

确保代码已推送到 GitHub 仓库。

### 2. 在 Vercel 导入项目

1. 打开 https://vercel.com → 用 GitHub 登录
2. 点击 "Add New..." → "Project"
3. 选择 `jianmeng-fatloss-nutritionist-ai` 仓库
4. **不要修改任何配置**，Vercel 会自动读取 `vercel.json`

### 3. 配置环境变量

在 Vercel 项目的 "Settings" → "Environment Variables" 中添加：

| 变量名 | 值 |
|--------|---|
| `DATABASE_URL` | Supabase PostgreSQL 连接字符串（端口 6543） |
| `JWT_SECRET` | 你的 JWT 签名密钥 |
| `JWT_EXPIRES_IN` | `7d` |
| `DEEPSEEK_API_KEY` | Deepseek API 密钥 |
| `FASTGPT_API_URL` | `https://cloud.fastgpt.io/api` |
| `FASTGPT_API_KEY` | FastGPT API 密钥 |
| `FASTGPT_APP_ID` | FastGPT 主 App ID |
| `FASTGPT_DIET_APP_ID` | `6a530a2a2ba4b7445d2ddf3f` |
| `FASTGPT_INGREDIENT_APP_ID` | `6a5319f880692507444b0ce0` |
| `FASTGPT_MENU_APP_ID` | `6a531f4ec344535fdc5f6dc0` |
| `FRONTEND_URL` | 留空（Vercel 会自动同源） |
| `NODE_ENV` | `production` |

### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动：
1. 安装根目录 + `frontend/` 的 npm 依赖
2. 构建 Vite 前端 → `frontend/dist/`
3. 编译 `api/[...path].ts` → Serverless Function
4. 分配域名：`https://jianmeng-fatloss-nutritionist-ai.vercel.app`

### 5. 验证

打开 Vercel 分配的域名，应能看到登录页面。

---

## 注意事项

### 请求体大小限制
Vercel 免费版 Serverless Function 请求体上限 **4.5MB**。前端已做图片压缩（≤500KB），不受影响。

### 函数执行时间
免费版超时 **10 秒**，Pro 版 **60 秒**。FastGPT 响应通常 3-8 秒，如果偶发超时建议升级 Pro。

### 冷启动
Serverless Function 首次请求有 ~1 秒冷启动延迟，后续请求正常。

### 本地开发不受影响
`vercel.json` 和 `api/` 目录不影响本地 `npm run dev` 开发，Vite 代理仍走 `localhost:3000`。
