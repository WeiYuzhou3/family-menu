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

interface Props {
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

export function AIRecommendModal({ open, onClose, mealDate, mealTime }: Props) {
  const { addItem } = useCart();
  const [step, setStep] = useState<"prefer" | "result">("prefer");
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<RecommendDish[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  async function fetchRecommend() {
    setLoading(true);
    setError("");
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
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "推荐失败");
    } finally {
      setLoading(false);
    }
  }

  function handleAddAll() {
    dishes.forEach((d) => addItem({ dish_id: d.id, dish_name: d.name, dish_image_url: d.image_url, quantity: 1 }));
    onClose();
  }

  const s = (css: Record<string, string>) => css as React.CSSProperties;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div style={{ position: "relative", width: "100%", maxWidth: 420, maxHeight: "85vh", overflow: "auto", background: "#fff", borderRadius: "16px 16px 0 0", padding: 24, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", color: "#333" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>✕</button>
        <h2 style={{ textAlign: "center", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>✨ AI 智能推荐</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#999", marginBottom: 20 }}>告诉我你想吃什么，帮你搭配</p>

        {error && <p style={{ color: "#c4665a", fontSize: 14, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        {step === "prefer" ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {PREFERENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPreference(opt.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: preference === opt.value ? "2px solid #7c9a6e" : "1px solid #e0d8c8",
                    background: preference === opt.value ? "#f0f5ee" : "#f5f0e8",
                    textAlign: "left",
                    fontSize: 14,
                    cursor: "pointer",
                    color: "#3d3226",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={fetchRecommend}
              disabled={loading}
              style={{ width: "100%", padding: 14, borderRadius: 12, background: "#7c9a6e", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.5 : 1 }}
            >
              {loading ? "搭配中..." : "帮我搭配"}
            </button>
          </>
        ) : (
          <>
            {message && (
              <div style={{ padding: 12, borderRadius: 12, background: "#f0f5ee", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Heart size={20} style={{ color: "#c4665a", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 14, color: "#555", margin: 0 }}>{message}</p>
              </div>
            )}
            {dishes.map((dish) => (
              <div key={dish.id} style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, border: "1px solid #e0d8c8", marginBottom: 8, background: "#faf7f2" }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, background: "#e0d8c8", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  {dish.image_url ? (
                    <Image src={dish.image_url} alt={dish.name} fill style={{ objectFit: "cover" }} sizes="64px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍽</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>{dish.name}</h3>
                  <p style={{ fontSize: 13, color: "#999", margin: 0 }}>{dish.reason}</p>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => { setStep("prefer"); setError(""); }}
                disabled={loading}
                style={{ flex: 1, padding: 14, borderRadius: 12, background: "#f5f0e8", border: "1px solid #e0d8c8", color: "#666", fontSize: 14, cursor: "pointer" }}
              >
                🔄 换一批
              </button>
              <button
                onClick={handleAddAll}
                style={{ flex: 2, padding: 14, borderRadius: 12, background: "#7c9a6e", color: "#fff", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
              >
                ➕ 全部加入点单
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
