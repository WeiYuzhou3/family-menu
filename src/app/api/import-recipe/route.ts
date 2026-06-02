import { NextRequest, NextResponse } from "next/server";

// ── Types ──

interface RecipeOutput {
  name: string;
  description: string;
  category: string;
  cooking_time: number;
  difficulty: string;
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string;
}

// ── B站 API ──

function extractBilibiliId(url: string): string | null {
  // BV号格式
  const bvMatch = url.match(/BV[a-zA-Z0-9]{10}/);
  if (bvMatch) return bvMatch[0];
  // av号格式
  const avMatch = url.match(/av(\d+)/i);
  if (avMatch) return `av${avMatch[1]}`;
  return null;
}

interface BilibiliInfo {
  text: string;
  coverUrl: string | null;
}

async function fetchBilibiliInfo(id: string): Promise<BilibiliInfo> {
  const isAv = id.startsWith("av");
  const param = isAv ? `aid=${id.slice(2)}` : `bvid=${id}`;
  const apiUrl = `https://api.bilibili.com/x/web-interface/view?${param}`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "FamilyMenu/1.0",
      Referer: "https://www.bilibili.com",
    },
  });

  if (!res.ok) {
    throw new Error(`B站 API 请求失败: ${res.status}`);
  }

  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(`B站 API 返回错误: ${json.message}`);
  }

  const { title, desc, dynamic, pic } = json.data;
  const parts = [title, desc, dynamic].filter(Boolean);
  return {
    text: parts.join("\n\n"),
    coverUrl: pic || null,
  };
}

// ── DeepSeek API ──

const DEEPSEEK_API = "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `你是一个专业的家庭烹饪助手。用户会给你一段做菜视频的描述文字，请你从中提取或推断出一份完整的菜谱。

请严格按照以下JSON格式返回（不要包含markdown代码块标记）：

{
  "name": "菜名",
  "description": "简短诱人的菜品简介（一句话）",
  "category": "main/side/soup/breakfast/dessert/beverage 之一",
  "cooking_time": 烹饪时间（分钟，整数）,
  "difficulty": "easy/medium/hard 之一",
  "ingredients": [
    {"name": "食材名称", "amount": 数量, "unit": "单位"}
  ],
  "instructions": "详细的烹饪步骤，用编号列出，每步占一行"
}

⚠️ 重要格式要求：
- amount 必须是数字，不能加引号，例如 "amount": 200（正确），"amount": "200"（错误）
- cooking_time 必须是数字，不能加引号
- 所有字符串必须用双引号，不能有换行
- 不要在JSON外面加任何解释文字
- 确保JSON完全符合标准格式，没有多余的逗号或引号`;


async function callDeepSeek(text: string): Promise<RecipeOutput> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY 环境变量");
  }

  const res = await fetch(DEEPSEEK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `请根据以下视频内容生成菜谱：\n\n${text}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API 请求失败 (${res.status}): ${err}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek 返回内容为空");
  }

  // Parse JSON from response (might have markdown code blocks)
  let cleaned = content
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  // Fix common AI JSON mistakes: "amount": 1" → "amount": 1
  cleaned = cleaned.replace(/"amount":\s*(\d+)"(\s*[,}\]])/g, '"amount": $1$2');
  cleaned = cleaned.replace(/"cooking_time":\s*(\d+)"(\s*[,}\]])/g, '"cooking_time": $1$2');
  // Fix trailing comma before } or ]
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  try {
    const recipe = JSON.parse(cleaned) as RecipeOutput;
    // Basic validation
    if (!recipe.name || !recipe.instructions) {
      throw new Error("AI 生成的菜谱缺少必要字段");
    }
    return recipe;
  } catch (err) {
    throw new Error(`AI 返回格式解析失败: ${(err as Error).message}\n\n原始内容: ${content.slice(0, 300)}`);
  }
}

// ── Route Handler ──

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, manualText } = body as { url?: string; manualText?: string };

    let contentText = manualText || "";
    let coverUrl: string | null = null;

    // Try B站 auto-fetch
    if (url) {
      const bvid = extractBilibiliId(url);
      if (bvid) {
        try {
          const biliInfo = await fetchBilibiliInfo(bvid);
          contentText = biliInfo.text + (contentText ? "\n\n用户补充:\n" + contentText : "");
          coverUrl = biliInfo.coverUrl;
        } catch (err) {
          console.error("B站抓取失败:", err);
          if (!contentText) {
            return NextResponse.json(
              { error: "B站视频信息获取失败，请手动粘贴视频标题和简介文字" },
              { status: 400 }
            );
          }
        }
      }
    }

    if (!contentText.trim()) {
      return NextResponse.json(
        { error: "请提供视频链接（B站）或手动粘贴视频文案（抖音/小红书）" },
        { status: 400 }
      );
    }

    const recipe = await callDeepSeek(contentText);

    return NextResponse.json({ recipe, coverUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    console.error("import-recipe error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
