import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { auditDietPlan } from "../services/audit.service";
import { isGeminiAvailable } from "../services/gemini.service";
import { createAuditLog, getAuditLogs, createApiLog } from "../services/db.service";

const router = Router();

router.use(authMiddleware);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { plan, goal } = req.body;
    if (!plan || !Array.isArray(plan) || plan.length === 0) {
      res.status(400).json({ error: "请提供有效的7日饮食方案" });
      return;
    }
    if (!isGeminiAvailable()) {
      res.status(503).json({ error: "AI 服务未配置，请先配置 DEEPSEEK_API_KEY" });
      return;
    }

    const result = await auditDietPlan({ plan, goal: goal || "健康减脂" });

    await createAuditLog({
      userId: req.user!.userId,
      planData: plan,
      auditResult: result,
      dietGoal: goal || "健康减脂",
      overallScore: result.overallScore,
    });

    await createApiLog({
      userId: req.user!.userId,
      apiType: "diet_plan_audit",
      inputSummary: `${plan.length}天方案审核 / ${goal || "健康减脂"}`,
    });

    res.json(result);
  } catch (error: any) {
    console.error("方案审核失败:", error);
    await createApiLog({
      userId: req.user!.userId,
      apiType: "diet_plan_audit",
      inputSummary: "方案审核",
      status: "failed",
    });
    res.status(500).json({ error: error.message || "方案审核失败" });
  }
});

router.get("/history", async (req: Request, res: Response) => {
  try {
    const logs = await getAuditLogs(req.user!.userId, 20);
    res.json(logs);
  } catch (error) {
    console.error("获取审核历史失败:", error);
    res.status(500).json({ error: "获取审核历史失败" });
  }
});

export default router;
