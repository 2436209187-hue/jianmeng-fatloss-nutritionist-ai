import { env } from "../config/env";

const FASTGPT_CHAT_URL = "/v1/chat/completions";
// FastGPT 请求超时时间（毫秒）— 智能体可能需要较长时间处理
const FASTGPT_TIMEOUT_MS = 120_000;

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
    signal: AbortSignal.timeout(FASTGPT_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`FastGPT API 调用失败 (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as any;

  // FastGPT 错误响应处理
  if (data.code && data.code !== 200) {
    throw new Error(`FastGPT 错误: ${data.message || data.statusText || "未知错误"}`);
  }

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
