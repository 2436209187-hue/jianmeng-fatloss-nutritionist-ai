import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { createApiLog } from "../services/db.service";
import { generateDietPlan } from "../services/diet-plan.service";
import { callFastGPTWithVariables, isFastGPTCongifured } from "../services/fastgpt.service";
import { isGeminiAvailable } from "../services/gemini.service";

const router = Router();

router.use(authMiddleware);

router.post("/generate", async (req: Request, res: Response) => {
  const input = req.body;

  // 营养师输入变量（FastGPT 和 DeepSeek 共用）
  const variables: Record<string, string | number> = {
    gender: input.gender === "male" ? "男" : input.gender === "female" ? "女" : "",
    age: Number(input.age) || 0,
    height_cm: Number(input.height) || 0,
    weight_kg: Number(input.weight) || 0,
    body_fat_pct: Number(input.bodyFat) || 0,
    waist_cm: Number(input.waist) || 0,
    target_weight_kg: Number(input.targetWeight) || 0,
    target_loss_rate: `${input.lossSpeed}kg/周`,
    diagnosed_diseases: input.medicalHistory || "无",
    food_allergens: input.allergies || "无",
    digestive_symptoms: input.digestion || "无",
    taste_preference: input.tastes || "无",
    activity_level: mapDailyActivity(input.dailyActivity),
    exercise_frequency: mapExercise(input.exercise),
  };

  let result: any;
  let usedFallback = false;

  // 策略 1：优先使用 FastGPT（带超时保护）
  if (isFastGPTCongifured()) {
    try {
      const content = await callFastGPTWithVariables("请生成7日饮食方案", variables);
      const parsed = JSON.parse(content);
      result = parsed.data || parsed;
    } catch (error: any) {
      console.error("FastGPT 饮食方案生成失败，尝试 DeepSeek 备用:", error.message);
      // 不 return，继续走备用方案
    }
  }

  // 策略 2：FastGPT 失败时降级到 DeepSeek
  if (!result && isGeminiAvailable()) {
    try {
      result = await generateDietPlan(input);
      usedFallback = true;
      console.log("饮食方案已通过 DeepSeek 备用生成");
    } catch (error: any) {
      console.error("DeepSeek 饮食方案生成也失败:", error.message);
      await createApiLog({
        userId: req.user!.userId,
        apiType: "diet_plan",
        inputSummary: req.body.name || "未知营员",
        status: "failed",
      });
      if (error instanceof SyntaxError) {
        res.status(500).json({ error: "AI 返回格式异常，请重试" });
        return;
      }
      res.status(500).json({ error: error.message || "饮食方案生成失败" });
      return;
    }
  }

  if (!result) {
    await createApiLog({
      userId: req.user!.userId,
      apiType: "diet_plan",
      inputSummary: req.body.name || "未知营员",
      status: "failed",
    });
    res.status(503).json({ error: "AI 服务均不可用，请检查 FastGPT 和 DeepSeek 配置" });
    return;
  }

  await createApiLog({
    userId: req.user!.userId,
    apiType: "diet_plan",
    inputSummary: `${input.name || "未知营员"} / ${input.targetWeight}kg目标${usedFallback ? " (DeepSeek)" : ""}`,
  });

  res.json(result);
});

function mapDailyActivity(value: string): string {
  const map: Record<string, string> = {
    sedentary: "久坐少动",
    light_active: "轻度活动",
    moderate_work: "中等体力",
  };
  return map[value] || value || "未填写";
}

function mapExercise(value: string): string {
  const map: Record<string, string> = {
    none: "几乎不运动",
    light: "每周1-2次",
    moderate: "每周3-4次",
    active: "每周5次及以上",
    very_active: "每天",
  };
  return map[value] || value || "未填写";
}

export default router;
