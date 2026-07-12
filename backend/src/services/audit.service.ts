import { generateStructuredResponse } from "./gemini.service";

export interface AuditInput {
  plan: Record<string, unknown>[];
  goal: string;
}

export interface DailyEvaluation {
  dayNum: number;
  dayName: string;
  score: number;
  summary: string;
  issues: string[];
}

export interface AuditOutput {
  overallScore: number;
  dailyEvaluations: DailyEvaluation[];
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  pros: string[];
  cons: string[];
  expertRecommendations: string[];
}

const AUDIT_SCHEMA = {
  type: "object",
  properties: {
    overallScore: { type: "integer" },
    dailyEvaluations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dayNum: { type: "integer" },
          dayName: { type: "string" },
          score: { type: "integer" },
          summary: { type: "string" },
          issues: { type: "array", items: { type: "string" } },
        },
        required: ["dayNum", "dayName", "score", "summary", "issues"],
      },
    },
    avgCalories: { type: "number" },
    avgProtein: { type: "number" },
    avgCarbs: { type: "number" },
    avgFat: { type: "number" },
    pros: { type: "array", items: { type: "string" } },
    cons: { type: "array", items: { type: "string" } },
    expertRecommendations: { type: "array", items: { type: "string" } },
  },
  required: ["overallScore", "dailyEvaluations", "avgCalories", "avgProtein", "avgCarbs", "avgFat", "pros", "cons", "expertRecommendations"],
};

export async function auditDietPlan(input: AuditInput): Promise<AuditOutput> {
  const prompt = `你是一位资深营养学专家，需要审核一份7日饮食方案。减脂目标：${input.goal}。

以下是完整的7日方案（JSON格式）：
${JSON.stringify(input.plan, null, 2)}

请从以下几个维度进行全方位审核：
1. 营养均衡性（宏量营养素配比是否合理）
2. 热量控制（每日热量是否在减脂目标范围内）
3. 食物多样性（是否避免单一食材重复）
4. 实用性（食材是否容易获取、烹饪是否可操作）
5. 安全性（是否存在过敏风险或不健康搭配）

请给出：
- 综合评分（0-100）
- 每日评估（含评分、总结、问题列表）
- 日均营养素估算
- 方案优点和缺陷
- 专家精准改良方案（具体到每餐的调整建议）`;

  return generateStructuredResponse<AuditOutput>(prompt, AUDIT_SCHEMA);
}
