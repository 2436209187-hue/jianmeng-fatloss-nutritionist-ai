import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { getDiningRecommendation } from "../services/dining.service";
import { isGeminiAvailable } from "../services/gemini.service";
import { createDiningLog, getDiningLogs, createApiLog } from "../services/db.service";

const router = Router();

router.use(authMiddleware);

router.post("/recommend", async (req: Request, res: Response) => {
  try {
    const { scenario, goal } = req.body;
    if (!scenario || !goal) {
      res.status(400).json({ error: "用餐场景和减脂目标为必填项" });
      return;
    }
    if (!isGeminiAvailable()) {
      res.status(503).json({ error: "AI 服务未配置，请先配置 DEEPSEEK_API_KEY" });
      return;
    }

    const result = await getDiningRecommendation({ scenario, goal });

    await createDiningLog({
      userId: req.user!.userId,
      scenario,
      goal,
      resultData: result,
      score: result.suitabilityScore,
    });

    await createApiLog({
      userId: req.user!.userId,
      apiType: "dining_recommend",
      inputSummary: `${scenario} / ${goal}`,
    });

    res.json(result);
  } catch (error: any) {
    console.error("外食推荐失败:", error);
    await createApiLog({
      userId: req.user!.userId,
      apiType: "dining_recommend",
      inputSummary: req.body.scenario || "unknown",
      status: "failed",
    });
    res.status(500).json({ error: error.message || "外食推荐失败" });
  }
});

router.get("/history", async (req: Request, res: Response) => {
  try {
    const logs = await getDiningLogs(req.user!.userId, 20);
    res.json(logs);
  } catch (error) {
    console.error("获取外食推荐历史失败:", error);
    res.status(500).json({ error: "获取推荐历史失败" });
  }
});

export default router;
