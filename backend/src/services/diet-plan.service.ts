import { generateStructuredResponse } from "./gemini.service";

export interface DietPlanInput {
  name: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bodyFat: number;
  waist: number;
  targetWeight: number;
  lossSpeed: string;
  dailyActivity: string;
  exercise: string;
  tastes: string;
  allergies: string;
  medicalHistory: string;
  digestion: string;
}

export interface FoodItem {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Meal {
  type: string;
  foods: FoodItem[];
}

export interface DayPlan {
  day: number;
  meals: Meal[];
}

export interface DietPlanOutput {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  days: DayPlan[];
}

const ACTIVITY_MAP: Record<string, string> = {
  sedentary: "久坐少动",
  light_active: "轻度活动",
  moderate_work: "中等体力",
};

const EXERCISE_MAP: Record<string, string> = {
  none: "几乎不运动",
  light: "每周1-2次",
  moderate: "每周3-4次",
  active: "每周5次及以上",
  very_active: "每天",
};

const DIET_PLAN_SCHEMA = {
  type: "object",
  properties: {
    totalCalories: { type: "number", description: "7日总热量（千卡）" },
    totalProtein: { type: "number", description: "7日总蛋白质（克）" },
    totalFat: { type: "number", description: "7日总脂肪（克）" },
    totalCarbs: { type: "number", description: "7日总碳水（克）" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          meals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", description: "早餐/午餐/晚餐/加餐" },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "食物名称" },
                      grams: { type: "number", description: "克数" },
                      calories: { type: "number", description: "热量千卡" },
                      protein: { type: "number", description: "蛋白质克数" },
                      fat: { type: "number", description: "脂肪克数" },
                      carbs: { type: "number", description: "碳水克数" },
                    },
                    required: ["name", "grams", "calories", "protein", "fat", "carbs"],
                  },
                },
              },
              required: ["type", "foods"],
            },
          },
        },
        required: ["day", "meals"],
      },
    },
  },
  required: ["totalCalories", "totalProtein", "totalFat", "totalCarbs", "days"],
};

export async function generateDietPlan(input: DietPlanInput): Promise<DietPlanOutput> {
  const dailyActivityLabel = ACTIVITY_MAP[input.dailyActivity] || input.dailyActivity || "未填写";
  const exerciseLabel = EXERCISE_MAP[input.exercise] || input.exercise || "未填写";

  const prompt = `你是一位顶级减脂营养顾问，请根据以下营员信息，定制一份7日黄金饮食方案。

【营员信息】
- 姓名：${input.name || "未填写"}
- 性别：${input.gender === "male" ? "男" : input.gender === "female" ? "女" : "未填写"}
- 年龄：${input.age} 岁
- 身高：${input.height} cm
- 当前体重：${input.weight} kg
- 体脂率：${input.bodyFat}%
- 当前腰围：${input.waist} cm
- 目标体重：${input.targetWeight} kg
- 希望减重速度：${input.lossSpeed} kg/周
- 日常活动：${dailyActivityLabel}
- 运动习惯：${exerciseLabel}
- 口味偏好：${input.tastes || "无特殊偏好"}
- 食物过敏原：${input.allergies || "无"}
- 既往病史：${input.medicalHistory || "无"}
- 消化症状：${input.digestion || "无"}

【方案要求】
1. 每餐包含2-4种食物，营养均衡、食材常见易得
2. 严格避开过敏原，考虑消化症状选择易消化食材
3. 每天安排：早餐、午餐、晚餐、加餐（可选）
4. 总热量控制在减脂目标范围内，蛋白质占30-35%，碳水40-45%，脂肪20-25%
5. 口味偏好尽量满足，但要保证减脂效果
6. 每餐的每种食物需精确标注克数和热量

请严格按照JSON Schema输出7日完整方案。`;

  return generateStructuredResponse<DietPlanOutput>(prompt, DIET_PLAN_SCHEMA);
}
