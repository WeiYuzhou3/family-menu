"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ImageUpload";
import { IngredientsEditor } from "@/components/IngredientsEditor";
import { createDishAction, updateDishAction } from "@/app/(husband)/admin/actions";
import type { Dish, Category, Difficulty, Ingredient } from "@/lib/supabase/types";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "main", label: "主菜" },
  { value: "side", label: "小食" },
  { value: "soup", label: "汤品" },
  { value: "breakfast", label: "早餐" },
  { value: "dessert", label: "甜品" },
  { value: "beverage", label: "饮品" },
];

const DIFFICULTIES: { value: Difficulty | ""; label: string }[] = [
  { value: "", label: "不设置" },
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

interface DishFormProps {
  dish?: Dish;
}

export function DishForm({ dish }: DishFormProps) {
  const router = useRouter();
  const isEditing = !!dish;

  const [name, setName] = useState(dish?.name || "");
  const [category, setCategory] = useState<Category>(dish?.category || "main");
  const [description, setDescription] = useState(dish?.description || "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    dish?.image_url || undefined
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    dish?.ingredients || []
  );
  const [instructions, setInstructions] = useState(dish?.instructions || "");
  const [cookingTime, setCookingTime] = useState(
    dish?.cooking_time?.toString() || ""
  );
  const [difficulty, setDifficulty] = useState<Difficulty | "">(
    dish?.difficulty || ""
  );
  const [isAvailable, setIsAvailable] = useState(dish?.is_available ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("category", category);
    if (description) formData.set("description", description);
    if (imageUrl) formData.set("image_url", imageUrl);
    formData.set("ingredients", JSON.stringify(ingredients));
    formData.set("instructions", instructions);
    if (cookingTime) formData.set("cooking_time", cookingTime);
    if (difficulty) formData.set("difficulty", difficulty);
    formData.set("is_available", isAvailable.toString());

    try {
      if (isEditing) {
        await updateDishAction(dish!.id, formData);
      } else {
        await createDishAction(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-xl text-text-primary">
          {isEditing ? "编辑菜品" : "新增菜品"}
        </h1>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      <ImageUpload value={imageUrl} onChange={setImageUrl} />

      <Input
        label="菜品名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例如：红烧排骨"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 bg-bg-surface border border-border-subtle rounded-xl text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <Input
          label="烹饪时间（分钟）"
          type="number"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          placeholder="例如：30"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">难度</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
            className="w-full px-4 py-3 bg-bg-surface border border-border-subtle rounded-xl text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">状态</label>
          <select
            value={isAvailable.toString()}
            onChange={(e) => setIsAvailable(e.target.value === "true")}
            className="w-full px-4 py-3 bg-bg-surface border border-border-subtle rounded-xl text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="true">可点单</option>
            <option value="false">暂不供应</option>
          </select>
        </div>
      </div>

      <Textarea
        label="菜品描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="简短描述这道菜..."
        rows={3}
      />

      <IngredientsEditor ingredients={ingredients} onChange={setIngredients} />

      <Textarea
        label="烹饪做法"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="详细描述烹饪步骤..."
        rows={6}
        required
      />

      <Button type="submit" loading={saving} size="lg" className="w-full">
        <Save className="w-5 h-5" />
        {isEditing ? "保存修改" : "添加菜品"}
      </Button>
    </form>
  );
}
