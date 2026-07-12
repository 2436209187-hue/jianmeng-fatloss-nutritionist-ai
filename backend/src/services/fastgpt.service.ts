import { env } from "../config/env";

const FASTGPT_CHAT_URL = "/v1/chat/completions";

export function isFastGPTCongifured(): boolean {
  return !!(env.FASTGPT_API_URL && env.FASTGPT_API_KEY);
}

/**
 * 调用 FastGPT 智能体（带全局变量）
 * FastGPT API 兼容 OpenAI 格式，通过 variables 传全局变量
 */
export async function callFastGPTWithVariables(
  prompt: string,
  variables: Record<string, string | number>
): Promise<string> {
  const url = `${env.FASTGPT_API_URL}${FASTGPT_CHAT_URL}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.FASTGPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "plan",
      appId: env.FASTGPT_APP_ID,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      variables,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`FastGPT API 调用失败 (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as any;

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("FastGPT 响应内容为空");
  }

  return content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
}

/**
 * 调用 FastGPT 智能体（纯文本）
 */
export async function callFastGPT(prompt: string): Promise<string> {
  return callFastGPTWithVariables(prompt, {});
}
