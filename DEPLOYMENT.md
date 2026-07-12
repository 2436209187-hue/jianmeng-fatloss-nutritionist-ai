# 部署指南

本项目由前端（React + Vite）和后端（Express + TypeScript）组成，数据库使用 Supabase 云端 PostgreSQL。

## 架构说明

```
用户浏览器 → Vercel（前端静态托管）→ Railway/Render（后端 API）→ Supabase（数据库）
                                      → FastGPT（AI 智能体）
                                      → Deepseek API
```

---

## 第一步：部署后端到 Railway

Railway 提供 Node.js 后端托管，免费额度足够开发使用。

### 1.1 注册 Railway
- 打开 https://railway.app
- 点击 "Login" → 用 GitHub 账号登录

### 1.2 创建后端服务
- 点击 "New Project" → "Deploy from GitHub repo"
- 选择 `jianmeng-fatloss-nutritionist-ai` 仓库
- **Root Directory** 设置为 `backend`
- Railway 会自动识别 `package.json`

### 1.3 配置环境变量
在 Railway 项目的 "Variables" 标签页中添加以下变量：

```
PORT=3000
DATABASE_URL=你的Supabase连接字符串
JWT_SECRET=你的JWT密钥
JWT_EXPIRES_IN=7d
DEEPSEEK_API_KEY=你的Deepseek密钥
FASTGPT_API_URL=https://cloud.fastgpt.io/api
FASTGPT_API_KEY=你的FastGPT密钥
FASTGPT_APP_ID=你的FastGPT App ID
FASTGPT_DIET_APP_ID=6a530a2a2ba4b7445d2ddf3f
FASTGPT_INGREDIENT_APP_ID=6a5319f880692507444b0ce0
FASTGPT_MENU_APP_ID=6a531f4ec344535fdc5f6dc0
FRONTEND_URL=https://你的vercel域名.vercel.app
NODE_ENV=production
```

### 1.4 配置构建命令
在 Railway 的 "Settings" 中设置：
- **Build Command**: `npm install`
- **Start Command**: `npx tsx src/index.ts`
- **Root Directory**: `backend`

### 1.5 获取后端 URL
部署成功后，Railway 会分配一个域名，例如：
```
https://jianmeng-backend-production.up.railway.app
```
记住这个 URL，后面配置 Vercel 时需要用到。

---

## 第二步：部署前端到 Vercel

### 2.1 注册 Vercel
- 打开 https://vercel.com
- 点击 "Sign Up" → 用 GitHub 账号登录

### 2.2 导入项目
- 点击 "Add New..." → "Project"
- 选择 `jianmeng-fatloss-nutritionist-ai` 仓库

### 2.3 配置项目
在 "Configure Project" 页面设置：

| 配置项 | 值 |
|-------|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 2.4 配置环境变量
在 "Environment Variables" 中添加：

```
VITE_API_URL=https://你的railway后端域名.up.railway.app
```

例如：
```
VITE_API_URL=https://jianmeng-backend-production.up.railway.app
```

### 2.5 部署
点击 "Deploy" 按钮，等待构建完成（约 1-2 分钟）。

部署成功后，Vercel 会分配域名：
```
https://jianmeng-fatloss-nutritionist-ai.vercel.app
```

---

## 第三步：配置后端 CORS

部署完成后，需要更新后端的 CORS 配置，允许 Vercel 域名访问。

在 Railway 的环境变量中，将 `FRONTEND_URL` 更新为你的 Vercel 域名：
```
FRONTEND_URL=https://jianmeng-fatloss-nutritionist-ai.vercel.app
```

Railway 会自动重新部署。

---

## 第四步：验证

1. 打开 Vercel 分配的前端域名
2. 应该能看到登录页面
3. 注册/登录账号
4. 进入工作台，测试各功能

---

## 常见问题

### Q: API 请求返回 CORS 错误？
A: 检查后端 `FRONTEND_URL` 环境变量是否设置为 Vercel 的完整域名（包含 https://）。

### Q: 图片上传失败？
A: Vercel 的 Serverless 函数有请求体大小限制（4.5MB），后端 Express 的 `express.json({ limit: "20mb" })` 在 Railway 上不受此限制。

### Q: 数据库连接失败？
A: 确认 `DATABASE_URL` 使用的是 Supabase 的连接池地址（端口 6543），不是直连地址（端口 5432）。

### Q: FastGPT 接口超时？
A: Railway 免费套餐有冷启动延迟（约 30 秒），首次请求可能较慢。后续请求会正常响应。

---

## 备选方案：Render 部署后端

如果 Railway 不可用，可以使用 Render：

1. 打开 https://render.com
2. "New" → "Web Service" → 连接 GitHub 仓库
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npx tsx src/index.ts`
6. 添加与 Railway 相同的环境变量
7. 免费套餐会在 15 分钟无请求后休眠
