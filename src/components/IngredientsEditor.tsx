"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/lib/supabase/types";

interface IngredientsEditorProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  className?: string;
}

export function IngredientsEditor({
  ingredients,
  onChange,
  className,
}: IngredientsEditorProps) {
  function addIngredient() {
    onChange([...ingredients, { name: "", amount: 0, unit: "g" }]);
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">食材清单</label>
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          添加食材
        </button>
      </div>

      <div className="space-y-2">
        {ingredients.map((ing, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-3 bg-bg-base rounded-xl border border-border-subtle"
          >
            <input
              type="text"
              value={ing.name}
              onChange={(e) => updateIngredient(i, "name", e.target.value)}
              placeholder="食材名称"
              className="flex-1 min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <input
              type="number"
              value={ing.amount || ""}
              onChange={(e) =>
                updateIngredient(i, "amount", parseFloat(e.target.value) || 0)
              }
              placeholder="数量"
              className="w-16 bg-bg-surface rounded-lg px-2 py-1.5 text-sm text-text-primary text-center focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <input
              type="text"
              list="unit-suggestions"
              value={ing.unit}
              onChange={(e) => updateIngredient(i, "unit", e.target.value)}
              placeholder="单位"
              className="w-16 bg-bg-surface rounded-lg px-1 py-1.5 text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <datalist id="unit-suggestions">
              <option value="g" />
              <option value="kg" />
              <option value="ml" />
              <option value="L" />
              <option value="个" />
              <option value="勺" />
              <option value="杯" />
              <option value="片" />
              <option value="根" />
              <option value="块" />
              <option value="把" />
              <option value="颗" />
              <option value="条" />
              <option value="只" />
              <option value="瓣" />
              <option value="段" />
              <option value="碗" />
              <option value="盘" />
              <option value="适量" />
            </datalist>
            <button
              type="button"
              onClick={() => removeIngredient(i)}
              className="p-1.5 text-text-muted hover:text-danger transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {ingredients.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            暂无食材，点击上方"添加食材"开始
          </p>
        )}
      </div>
    </div>
  );
}
