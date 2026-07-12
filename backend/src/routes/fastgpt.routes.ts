import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { env } from "../config/env";
import { createApiLog } from "../services/db.service";

const router = Router();
router.use(authMiddleware);

router.post("/analyze", async (req: Request, res: Response) => {
  if (!env.FASTGPT_API_URL || !env.FASTGPT_API_KEY) {
    res.status(503).json({ success: false, error: "饮食识别服务未配置" });
    return;
  }

  try {
    const { image, note, meal_period, age, gender, height_cm, weight_kg, waist_cm } = req.body;

    // 构建消息内容：图片用 OpenAI multimodal 格式传递
    const messageContent: any[] = [
      { type: "text", text: note || "请识别图片中的食物，分析每种食物的名称、克重、热量，并给出饮食建议" },
    ];

    if (image && typeof image === "string" && image.startsWith("data:")) {
      messageContent.unshift({ type: "image_url", image_url: { url: image } });
    }

    const response = await fetch(`${env.FASTGPT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FASTGPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "diet",
        appId: env.FASTGPT_DIET_APP_ID || undefined,
        messages: [{ role: "user", content: messageContent }],
        stream: false,
        variables: {
          meal_period: meal_period || "",
          age: age || "",
          gender: gender || "",
          height_cm: height_cm || "",
          weight_kg: weight_kg || "",
          waist_cm: waist_cm || "",
          note: note || "",
        },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        res.json(JSON.parse(cleaned));
        await createApiLog({ userId: req.user!.userId, apiType: "diet_analyze", inputSummary: req.body.note?.slice(0, 30) || "饮食识别" });
        return;
      } catch {
        res.json({ success: true, foods: [], comment: content });
        await createApiLog({ userId: req.user!.userId, apiType: "diet_analyze", status: "success" });
        return;
      }
    }
    res.json(data);
  } catch (error: any) {
    await createApiLog({ userId: req.user!.userId, apiType: "diet_analyze", status: "failed" });
    console.error("饮食识别调用失败:", error.message);
    res.status(500).json({ success: false, error: "未识别到食物，请重新上传" });
  }
});

// ============================================
// 配料分析 - AI 智能体接入
// ============================================
router.post("/ingredient-analyze", async (req: Request, res: Response) => {
  if (!env.FASTGPT_API_URL || !env.FASTGPT_API_KEY) {
    res.status(503).json({ success: false, error: "配料分析服务未配置" });
    return;
  }

  try {
    const { image, note, meal_period, age, gender, height_cm, weight_kg, waist_cm } = req.body;

    const messageContent: any[] = [
      { type: "text", text: note || "请分析食品配料表，给出食品评级、饮食建议，并分析每个配料的风险等级" },
    ];
    if (image && typeof image === "string" && image.startsWith("data:")) {
      messageContent.unshift({ type: "image_url", image_url: { url: image } });
    }

    const response = await fetch(`${env.FASTGPT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FASTGPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "ingredient",
        appId: env.FASTGPT_INGREDIENT_APP_ID || undefined,
        messages: [{ role: "user", content: messageContent }],
        stream: false,
        variables: {
          meal_period: meal_period || "",
          age: age || "",
          gender: gender || "",
          height_cm: height_cm || "",
          weight_kg: weight_kg || "",
          waist_cm: waist_cm || "",
          note: note || "",
        },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        res.json(JSON.parse(cleaned));
        await createApiLog({ userId: req.user!.userId, apiType: "ingredient_analyze", inputSummary: "配料分析" });
        return;
      } catch {
        res.json({ success: false, error: "无法识别配料表，请重新上传" });
        await createApiLog({ userId: req.user!.userId, apiType: "ingredient_analyze", status: "failed" });
        return;
      }
    }
    res.json(data);
  } catch (error: any) {
    await createApiLog({ userId: req.user!.userId, apiType: "ingredient_analyze", status: "failed" });
    console.error("配料分析调用失败:", error.message);
    res.status(500).json({ success: false, error: "无法识别配料表，请重新上传" });
  }
});

// ============================================
// 菜单建议 - AI 智能体接入
// ============================================
router.post("/menu-recommend", async (req: Request, res: Response) => {
  if (!env.FASTGPT_API_URL || !env.FASTGPT_API_KEY) {
    res.status(503).json({ success: false, error: "菜单建议服务未配置" });
    return;
  }

  try {
    const { image, note, meal_period, age, gender, height_cm, weight_kg, waist_cm } = req.body;

    const messageContent: any[] = [
      { type: "text", text: note || "请分析这份菜单，推荐适合减脂的菜品，标注需要避开的菜品，并给出点餐建议" },
    ];
    if (image && typeof image === "string" && image.startsWith("data:")) {
      messageContent.unshift({ type: "image_url", image_url: { url: image } });
    }

    const response = await fetch(`${env.FASTGPT_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FASTGPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "menu",
        appId: env.FASTGPT_MENU_APP_ID || undefined,
        messages: [{ role: "user", content: messageContent }],
        stream: false,
        variables: {
          meal_period: meal_period || "",
          age: age || "",
          gender: gender || "",
          height_cm: height_cm || "",
          weight_kg: weight_kg || "",
          waist_cm: waist_cm || "",
          note: note || "",
        },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        res.json(JSON.parse(cleaned));
        await createApiLog({ userId: req.user!.userId, apiType: "menu_recommend", inputSummary: "菜单建议" });
        return;
      } catch {
        res.json({ success: false, error: "无法识别菜单，请重新上传图片" });
        await createApiLog({ userId: req.user!.userId, apiType: "menu_recommend", status: "failed" });
        return;
      }
    }
    res.json(data);
  } catch (error: any) {
    await createApiLog({ userId: req.user!.userId, apiType: "menu_recommend", status: "failed" });
    console.error("菜单建议调用失败:", error.message);
    res.status(500).json({ success: false, error: "无法识别菜单，请重新上传图片" });
  }
});

export default router;
