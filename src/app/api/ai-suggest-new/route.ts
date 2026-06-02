import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const DEEPSEEK_API = "https://api.deepseek.com/chat/completions";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("未配置 DEEPSEEK_API_KEY");

    const supabase = createServerClient();
    const { data: dishes } = await supabase
      .from("dishes")
      .select("name, category")
      .eq("is_available", true);

    const existingNames = dishes?.map((d) => d.name) || [];
    const existingText = existingNames.length > 0
      ? `已有菜品：${existingNames.join("、")}`
      : "目前还没有菜品";

    const prompt = `你是一个家庭烹饪顾问。用户的家庭菜单目前有以下菜品：${existingText}

请推荐3-4道家常下饭的新菜品。要求：
1. 真正的家常菜，不能太难（家庭厨房水平）
2. 下饭、实用、大众口味
3. 不能和已有菜品重复
4. 考虑营养多样性（荤素搭配）

返回JSON数组（不要markdown）：
[
  {"name": "菜名", "description": "一句话介绍", "difficulty": "easy/medium", "cooking_time": 分钟数, "reason": "推荐理由"}
]`;

    const res = await fetch(DEEPSEEK_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) throw new Error(`DeepSeek API 请求失败: ${res.status}`);

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let suggestions;
    try {
      suggestions = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "AI 返回格式异常，请重试" }, { status: 500 });
    }

    return NextResponse.json({ suggestions: Array.isArray(suggestions) ? suggestions : [suggestions] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "推荐失败" },
      { status: 500 }
    );
  }
}
