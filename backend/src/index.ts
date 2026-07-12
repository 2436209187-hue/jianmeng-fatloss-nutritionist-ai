import express from "express";
import cors from "cors";
import path from "path";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/campers", camperRoutes);
app.use("/api/dining", diningRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/diet-plan", dietPlanRoutes);

// FastGPT 预留接口
app.use("/api/diet", fastgptRoutes);       // /api/diet/analyze
app.post("/api/ingredient/analyze", (_req, res) => {
  if (!env.FASTGPT_API_URL) {
    res.status(503).json({
      error: "FastGPT 智能体未配置",
      message: "请在 .env 中设置 FASTGPT_API_URL 以启用配料分析功能",
    });
    return;
  }
  res.json({ message: "FastGPT route reserved" });
});
app.post("/api/menu/recommend", (_req, res) => {
  if (!env.FASTGPT_API_URL) {
    res.status(503).json({
      error: "FastGPT 智能体未配置",
      message: "请在 .env 中设置 FASTGPT_API_URL 以启用菜单建议功能",
    });
    return;
  }
  res.json({ message: "FastGPT route reserved" });
});

// 静态文件服务（打包模式：后端直接托管前端）
const frontendDist = path.join(__dirname, "../frontend/dist");
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
  });
}

export default app;
