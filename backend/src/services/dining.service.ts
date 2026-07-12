import { generateStructuredResponse } from "./gemini.service";

export interface DiningRecommendInput {
  scenario: string;
  goal: string;
}

export interface RecommendedDishOutput {
  name: string;
  estimatedCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
}

export interface DiningRecommendOutput {
  scenario: string;
  suitabilityScore: number;
  recommendedDishes: RecommendedDishOutput[];
  customizationTips: string[];
  hiddenTraps: string[];
  nutritionalAdvice: string;
}

const DINING_SCHEMA = {
  type: "object",
  properties: {
    scenario: { type: "string" },
    suitabilityScore: { type: "integer" },
    recommendedDishes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          estimatedCalories: { type: "number" },
          protein: { type: "number" },
          carbs: { type: "number" },
          fat: { type: "number" },
          reason: { type: "string" },
        },
        required: ["name", "estimatedCalories", "protein", "carbs", "fat", "reason"],
      },
    },
    customizationTips: { type: "array", items: { type: "string" } },
    hiddenTraps: { type: "array", items: { type: "string" } },
    nutritionalAdvice: { type: "string" },
  },
  required: ["scenario", "suitabilityScore", "recommendedDishes", "customizationTips", "hiddenTraps", "nutritionalAdvice"],
};

export async function getDiningRecommendation(input: DiningRecommendInput): Promise<DiningRecommendOutput> {
  const prompt = `你是一位资深减脂营养顾问。用户正在${input.scenario}用餐，减脂目标是${input.goal}。

请分析该用餐场景的减脂友好度，提供以下内容（用中文）：
1. 场景友好度评分（0-100）
2. 推荐3-4道最佳菜品及宏量营养素估算
3. 3条点餐改单暗号（如"少油少盐"、"酱汁分开放"）
4. 3个隐形高热量陷阱
5. 综合营养建议

请确保推荐具体可操作。`;

  return generateStructuredResponse<DiningRecommendOutput>(prompt, DINING_SCHEMA);
}
