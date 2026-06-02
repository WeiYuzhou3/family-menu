"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Loader2, Check, Save, Link2, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
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
  const [recipe, setRecipe] = useState<RecipePreview | null>(null);
  const [saving, setSaving] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const isBili = isBilibili(url);

  async function handleGenerate() {
    if (!url.trim() && !manualText.trim()) {
      setError("请输入视频链接或粘贴视频文案");
      return;
    }
    setError("");
    setRecipe(null);
    setLoading(true);

    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim() || undefined,
          manualText: manualText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setRecipe(data.recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!recipe) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.set("name", recipe.name);
      formData.set("category", recipe.category);
      formData.set("description", recipe.description);
      formData.set("instructions", recipe.instructions);
      formData.set("cooking_time", String(recipe.cooking_time || ""));
      formData.set("difficulty", recipe.difficulty);
      formData.set("ingredients", JSON.stringify(recipe.ingredients));

      // Call the existing createDishAction
      const { createDishAction } = await import("../actions");
      await createDishAction(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
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

      {/* Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            <Link2 className="w-4 h-4 inline mr-1" />
            视频链接
          </label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="粘贴 B站 / 小红书 / 抖音 视频链接..."
          />
          {isBili && url && (
            <p className="text-xs text-accent mt-1.5">✅ 检测到B站链接，将自动获取视频信息</p>
          )}
        </div>

        {!isBili && (
          <div>
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showManual ? "收起" : "粘贴视频标题和简介文字（小红书/抖音需要）"}
            </button>
            {showManual && (
              <Textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="把视频的标题、简介、评论区UP主发的食材清单等文字复制到这里..."
                rows={5}
                className="mt-2"
              />
            )}
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleGenerate}
          loading={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          AI 生成菜谱
        </Button>
      </div>

      {/* Preview */}
      {recipe && (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-lg text-text-primary">生成结果预览</h2>
          </div>

          {/* Name + Meta */}
          <div>
            <h3 className="text-xl font-medium text-text-primary">{recipe.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
                {CATEGORY_LABELS[recipe.category] || recipe.category}
              </span>
              {recipe.cooking_time > 0 && (
                <span className="text-xs text-text-muted">⏱ {recipe.cooking_time}分钟</span>
              )}
              {recipe.difficulty && (
                <span className="text-xs text-text-muted">
                  {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
                </span>
              )}
            </div>
            {recipe.description && (
              <p className="text-sm text-text-secondary mt-2">{recipe.description}</p>
            )}
          </div>

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">📋 食材清单</h4>
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

          {/* Instructions */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">📝 烹饪做法</h4>
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-base rounded-lg p-3">
              {recipe.instructions}
            </div>
          </div>

          {/* Save */}
          <Button size="lg" className="w-full" onClick={handleSave} loading={saving}>
            <Save className="w-5 h-5" />
            保存到菜单
          </Button>
        </div>
      )}
    </div>
  );
}
