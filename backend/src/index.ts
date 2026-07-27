import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { isFastGPTCongifured } from "./services/fastgpt.service";
import authRoutes from "./routes/auth.routes";
import overviewRoutes from "./routes/overview.routes";
import camperRoutes from "./routes/campers.routes";
import diningRoutes from "./routes/dining.routes";
import auditRoutes from "./routes/audit.routes";
import historyRoutes from "./routes/history.routes";
import fastgptRoutes from "./routes/fastgpt.routes";
import dietPlanRoutes from "./routes/diet-plan.routes";

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: "20mb" }));

// Health check
app.get("/api/status", (_req, res) => {
  res.json({
    status: "running",
    hasApiKey: !!env.DEEPSEEK_API_KEY,
    fastgptConfigured: isFastGPTCongifured(),
  });
});

// FastGPT 诊断接口 — 测试连通性和智能体响应
app.get("/api/fastgpt-diag", async (_req, res) => {
  const result: any = {
    configured: isFastGPTCongifured(),
    apiUrl: env.FASTGPT_API_URL || "(未配置)",
    appIds: {
      dietPlan: env.FASTGPT_APP_ID || "(未配置)",
      dietRecognition: env.FASTGPT_DIET_APP_ID || "(未配置)",
      ingredient: env.FASTGPT_INGREDIENT_APP_ID || "(未配置)",
      menu: env.FASTGPT_MENU_APP_ID || "(未配置)",
    },
    deepseekAvailable: !!env.DEEPSEEK_API_KEY,
  };

  if (!isFastGPTCongifured()) {
    result.testResult = "跳过（未配置）";
    res.json(result);
    return;
  }

  // 测试 FastGPT 连通性（5秒超时）
  const testStart = Date.now();
  try {
    const resp = await fetch(`${env.FASTGPT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.FASTGPT_API_KEY}` },
      body: JSON.stringify({ appId: env.FASTGPT_APP_ID, messages: [{ role: "user", content: "ping" }], stream: false }),
      signal: AbortSignal.timeout(10000),
    });

    result.httpStatus = resp.status;
    result.responseTime = `${Date.now() - testStart}ms`;

    if (resp.ok) {
      result.testResult = "✅ 可访问且正常响应";
    } else {
      const errBody = await resp.text().catch(() => "");
      result.testResult = `⚠ HTTP ${resp.status}: ${errBody.slice(0, 200)}`;
    }
  } catch (e: any) {
    result.responseTime = `${Date.now() - testStart}ms`;
    if (e.name === "TimeoutError") {
      result.testResult = "❌ 超时（10秒无响应）— 智能体可能未发布或工作流异常";
    } else {
      result.testResult = `❌ 连接失败: ${e.cause?.code || e.message}`;
    }
  }

  res.json(result);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/campers", camperRoutes);
app.use("/api/dining", diningRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/diet-plan", dietPlanRoutes);

// FastGPT 智能体接口（饮食识别/配料分析/菜单建议）
// 路由前缀 /api/diet，包含：
//   POST /api/diet/analyze             — 饮食识别
//   POST /api/diet/ingredient-analyze  — 配料分析
//   POST /api/diet/menu-recommend      — 菜单建议
app.use("/api/diet", fastgptRoutes);

// 静态文件服务（打包模式：后端直接托管前端）
// 兼容两种运行方式：从项目根目录运行（打包模式）和从 backend 目录运行（开发模式）
const frontendDist = [
  path.join(process.cwd(), "frontend/dist"),
  path.join(process.cwd(), "../frontend/dist"),
].find((p) => fs.existsSync(p)) || path.join(process.cwd(), "frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Error handler
app.use(errorHandler);

// Start server (only in local dev, not in Vercel serverless)
if (process.env.VERCEL !== "1") {
  app.listen(env.PORT, () => {
    console.log(`\n🚀 减脂营营养师工作台 - 后端服务`);
    console.log(`  地址: http://localhost:${env.PORT}`);
    console.log(`  Deepseek AI: ${env.DEEPSEEK_API_KEY ? "已配置 ✓" : "未配置 ✗"}`);
    console.log(`  FastGPT: ${env.FASTGPT_API_URL ? "已配置 ✓" : "未配置 ✗ (4个功能待接入)"}`);
    console.log(`  前端: ${env.FRONTEND_URL}\n`);

    // FastGPT 连通性检测（不影响启动）
    if (env.FASTGPT_API_URL) {
      fetch(`${env.FASTGPT_API_URL}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.FASTGPT_API_KEY}` },
        body: JSON.stringify({ appId: env.FASTGPT_APP_ID, messages: [{ role: "user", content: "ping" }], stream: false }),
        signal: AbortSignal.timeout(15000),
      })
        .then(async (resp) => {
          if (resp.ok) {
            console.log(`  FastGPT 连通性: 可访问 ✓`);
          } else {
            const errBody = await resp.text().catch(() => "");
            console.log(`  FastGPT 连通性: HTTP ${resp.status} ⚠ (${errBody.slice(0, 80)})`);
          }
        })
        .catch((e: any) => {
          const reason = e.name === "TimeoutError" ? "响应超时（15秒）" : (e.cause?.code || e.message);
          console.log(`  FastGPT 连通性: 不可访问 ✗ (${reason})`);
          console.log(`  提示: 请检查电脑是否能访问 cloud.fastgpt.io（可能被防火墙拦截）`);
        });
    }
  });
}

export default app;
