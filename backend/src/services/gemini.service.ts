import { env } from "../config/env";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export function isGeminiAvailable(): boolean {
  return !!env.DEEPSEEK_API_KEY;
}

export async function generateStructuredResponse<T>(
  prompt: string,
  schema: Record<string, unknown>
): Promise<T> {
  if (!env.DEEPSEEK_API_KEY) {
    throw new Error("AI 服务未配置，请在 .env 中设置 DEEPSEEK_API_KEY");
  }

  const schemaStr = JSON.stringify(schema, null, 2);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一个专业的减脂营养顾问AI助手。请严格按照以下JSON Schema格式输出响应，不要输出任何额外的markdown标记或文字说明，只输出纯JSON：\n${schemaStr}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Deepseek API 调用失败 (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as any;
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("AI 响应为空");
  }

  try {
    // 去掉可能的 markdown 代码块标记
    const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleanText) as T;
  } catch {
    throw new Error("AI 响应 JSON 解析失败");
  }
}
