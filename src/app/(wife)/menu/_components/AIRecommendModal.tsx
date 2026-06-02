"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, RefreshCw, Plus, Loader2, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/OrderCartContext";

interface RecommendDish {
  id: string;
  name: string;
  reason: string;
  image_url: string | null;
  cooking_time: number;
  category: string;
}

interface AIRecommendModalProps {
  open: boolean;
  onClose: () => void;
  mealDate: string;
  mealTime: string;
}

const PREFERENCE_OPTIONS = [
  { value: "", label: "随便，都行 😋" },
  { value: "清淡健康", label: "🥬 清淡健康" },
  { value: "香辣过瘾", label: "🌶️ 香辣过瘾" },
  { value: "酸甜可口", label: "🍋 酸甜可口" },
  { value: "浓郁下饭", label: "🍖 浓郁下饭" },
  { value: "暖胃汤煲", label: "🍲 暖胃汤煲" },
];

export function AIRecommendModal({ open, onClose, mealDate, mealTime }: AIRecommendModalProps) {
  const { addItem } = useCart();
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<RecommendDish[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedAll, setAddedAll] = useState(false);

  if (!open) return null;

  async function fetchRecommend() {
    setLoading(true);
    setError("");
    setDishes([]);
    setMessage("");
    setAddedAll(false);

    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference, mealDate, mealTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDishes(data.dishes || []);
      setMessage(data.message || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "推荐失败");
    } finally {
      setLoading(false);
    }
  }

  function handleAddAll() {
    for (const dish of dishes) {
      addItem({
        dish_id: dish.id,
        dish_name: dish.name,
        dish_image_url: dish.image_url,
        quantity: 1,
      });
    }
    setAddedAll(true);
    setTimeout(() => onClose(), 800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-elevated">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-text-muted hover:text-text-primary">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h2 className="text-lg text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
              AI 智能推荐
            </h2>
          </div>
          <p className="text-sm text-text-muted">告诉我你想吃什么，帮你搭配</p>
        </div>

        {/* Preference */}
        {dishes.length === 0 && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PREFERENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPreference(opt.value)}
                  className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all border ${
                    preference === opt.value
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-bg-surface border-border-subtle text-text-secondary hover:border-border-default"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-danger text-sm text-center mb-3">{error}</p>
            )}

            <button
              onClick={fetchRecommend}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "搭配中..." : "帮我搭配"}
            </button>
          </>
        )}

        {/* Results */}
        {dishes.length > 0 && (
          <>
            {message && (
              <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <Heart className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {dishes.map((dish) => (
                <div key={dish.id} className="flex gap-3 p-3 bg-bg-surface rounded-xl border border-border-subtle">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-base shrink-0">
                    {dish.image_url ? (
                      <Image src={dish.image_url} alt={dish.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-text-primary">{dish.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{dish.reason}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchRecommend}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-medium text-sm bg-bg-surface border border-border-subtle text-text-secondary hover:border-border-default transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                换一批
              </button>
              <button
                onClick={handleAddAll}
                disabled={addedAll}
                className={`flex-[2] flex items-center justify-center gap-1.5 py-3 rounded-xl font-medium text-sm transition-colors ${
                  addedAll
                    ? "bg-success/20 text-success"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {addedAll ? "已加入 ✅" : <><Plus className="w-4 h-4" /> 全部加入点单</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
