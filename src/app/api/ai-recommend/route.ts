import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { Dish } from "@/lib/supabase/types";

const DEEPSEEK_API = "https://api.deepseek.com/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preference, mealDate, mealTime } = body as {
      preference?: string;
      mealDate: string;
      mealTime: string;
    };

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("未配置 DEEPSEEK_API_KEY");

    const supabase = createServerClient();

    // Get all available dishes
    const { data: dishes } = await supabase
      .from("dishes")
      .select("id, name, category, description, cooking_time, difficulty")
      .eq("is_available", true);

    if (!dishes?.length) {
      return NextResponse.json({ error: "菜单里还没有菜品哦，让老公先添加一些吧" }, { status: 400 });
    }

    // Get recent orders (last 7 days) to avoid repeats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, meal_date")
      .gte("meal_date", sevenDaysAgo.toISOString().split("T")[0])
      .in("status", ["pending", "preparing", "completed"]);

    let recentDishIds: string[] = [];
    if (recentOrders?.length) {
      const { data: items } = await supabase
        .from("order_items")
        .select("dish_id")
        .in("order_id", recentOrders.map((o) => o.id));
      recentDishIds = items?.map((i) => i.dish_id) || [];
    }

    // Build dish list for AI
    const dishList = dishes.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      description: d.description || "",
      cooking_time: d.cooking_time || 0,
      recently_eaten: recentDishIds.includes(d.id),
    }));

    const CAT_NAMES: Record<string, string> = {
      main: "主菜", side: "小食", soup: "汤品", breakfast: "早餐", dessert: "甜品", beverage: "饮品",
    };

    const dishText = dishList
      .map((d) => `- [${d.id}] ${d.name}（${CAT_NAMES[d.category] || d.category}，${d.cooking_time}分钟）${d.recently_eaten ? "【近7天已吃过】" : ""} ${d.description}`)
      .join("\n");

    const mealNames: Record<string, string> = {
      breakfast: "早餐", lunch: "午餐", dinner: "晚餐",
    };

    const prompt = `你是家庭营养搭配师。老婆今天要吃${mealNames[mealTime] || mealTime}，偏好：${preference || "无特别偏好，请自由搭配"}。

请从以下菜品中挑选2-3道，注意：
1. 营养均衡搭配（荤素、口味不冲突）
2. 如果标注了【近7天已吃过】，尽量不要选
3. 不同category搭配合理（比如有主食也要有配菜或汤）
4. 用温柔关心的语气，给老婆一句暖心的搭配说明

可用菜品：
${dishText}

请严格返回JSON（不要markdown）：
{"dishes": [{"id": "菜品id", "name": "菜名", "reason": "选择理由，一句话"}], "message": "给老婆的暖心关怀语，一两句话"}

菜品id必须从上面的列表中选择，不要编造。`;

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

    // Fix common JSON issues
    const fixed = cleaned.replace(/"amount":\s*(\d+)"(\s*[,}\]])/g, '"amount": $1$2');

    let result;
    try {
      result = JSON.parse(fixed);
    } catch {
      return NextResponse.json({ error: "AI 返回格式异常，请重试", raw: cleaned.slice(0, 200) }, { status: 500 });
    }

    // Enrich with full dish data
    const recommendedDishes = (result.dishes || []).map((rd: { id: string; name: string; reason: string }) => {
      const full = dishes.find((d) => d.id === rd.id);
      return {
        id: rd.id,
        name: rd.name,
        reason: rd.reason,
        image_url: full?.image_url || null,
        cooking_time: full?.cooking_time || 0,
        category: full?.category || "",
      };
    });

    return NextResponse.json({
      dishes: recommendedDishes,
      message: result.message || "今天也要好好吃饭哦～",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "推荐失败" },
      { status: 500 }
    );
  }
}
