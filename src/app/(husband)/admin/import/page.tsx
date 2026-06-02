"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Check, Save } from "lucide-react";
import type { Ingredient } from "@/lib/supabase/types";

interface RecipePreview {
  name: string;
  description: string;
  category: string;
  cooking_time: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  main: "主菜", side: "小食", soup: "汤品", breakfast: "早餐", dessert: "甜品", beverage: "饮品",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "简单", medium: "中等", hard: "困难",
};

function isBilibili(url: string): boolean {
  return /bilibili\.com|b23\.tv|BV[a-zA-Z0-9]{10}/i.test(url);
}

export default function ImportRecipePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipes, setRecipes] = useState<RecipePreview[]>([]);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savedDishes, setSavedDishes] = useState<Set<number>>(new Set());
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const isBili = isBilibili(url);
  const inputStyle = {
    width: "100%" as const,
    padding: "0.75rem 1rem",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "0.75rem",
    color: "var(--text-primary)",
    outline: "none",
  };

  async function handleGenerate() {
    if (!url.trim() && !manualText.trim()) {
      setError("请输入视频链接或粘贴视频文案");
      return;
    }
    setError("");
    setRecipes([]);
    setLoading(true);

    try {
      // Clean URL: extract from mixed text like "【标题】 https://b23.tv/xxx"
      const urlMatch = url.match(/(https?:\/\/\S+)/i);
      const cleanUrl = urlMatch ? urlMatch[1] : url.trim();

      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl || undefined,
          manualText: manualText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setRecipes(data.recipes || []);
      setCoverUrl(data.coverUrl || null);
      setVideoUrl(cleanUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(recipe: RecipePreview, index: number) {
    setSavingIndex(index);
    setError("");

    try {
      // Use server action so it runs on the server with env access
      const { createDishWithoutRedirect } = await import("../actions");
      const result = await createDishWithoutRedirect({
        name: recipe.name,
        category: recipe.category as "main" | "side" | "soup" | "breakfast" | "dessert" | "beverage",
        description: recipe.description,
        image_url: coverUrl || undefined,
        ingredients: recipe.ingredients,
        instructions: videoUrl
          ? `📺 参考视频：${videoUrl}\n\n${recipe.instructions}`
          : recipe.instructions,
        cooking_time: recipe.cooking_time,
        difficulty: recipe.difficulty as "easy" | "medium" | "hard" | undefined,
      });
      if (!result.success) throw new Error(result.error);
      setSavedDishes((prev) => new Set(prev).add(index));
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSavingIndex(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
            AI 导入菜谱
          </h1>
          <p className="text-sm text-text-muted mt-0.5">粘贴视频链接，自动生成菜谱</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">视频链接</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴 B站 / 小红书 / 抖音 视频链接..."
            style={inputStyle}
          />
          {isBili && url && (
            <p className="text-xs text-accent mt-1.5">✅ 检测到B站链接，将自动获取视频信息</p>
          )}
        </div>

        {!isBili && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              视频文案（小红书/抖音需手动粘贴）
            </label>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="把视频的标题、简介、UP主发的食材清单等文字复制到这里..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI 生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              AI 生成菜谱
            </>
          )}
        </button>
      </div>

      {recipes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" />
            <h2 className="text-lg text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
              生成结果 · {recipes.length} 道菜
            </h2>
          </div>

          {coverUrl && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-bg-base">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="封面"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          {recipes.map((recipe, index) => (
            <div key={index} className="bg-bg-surface border border-border-subtle rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary">
                  <span className="text-text-muted text-sm mr-2">#{index + 1}</span>
                  {recipe.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
                  {CATEGORY_LABELS[recipe.category] || recipe.category}
                </span>
                {recipe.cooking_time > 0 && <span className="text-xs text-text-muted">⏱ {recipe.cooking_time}分钟</span>}
                {recipe.difficulty && <span className="text-xs text-text-muted">{DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}</span>}
              </div>
              {recipe.description && <p className="text-sm text-text-secondary">{recipe.description}</p>}

              {recipe.ingredients.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">📋 食材</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <div key={i} className="flex justify-between px-3 py-1.5 rounded-lg bg-bg-base text-sm">
                        <span>{ing.name}</span>
                        <span className="text-text-muted">{ing.amount} {ing.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">📝 做法</h4>
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-base rounded-lg p-3">
                  {recipe.instructions}
                </div>
              </div>

              <button
                onClick={() => handleSave(recipe, index)}
                disabled={savingIndex !== null || savedDishes.has(index)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-40 ${
                  savedDishes.has(index)
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {savingIndex === index ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : savedDishes.has(index) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savedDishes.has(index) ? `「${recipe.name}」已保存` : `保存「${recipe.name}」到菜单`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
