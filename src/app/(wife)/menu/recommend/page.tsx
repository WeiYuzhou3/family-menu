"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, RefreshCw, Plus, Loader2, ArrowLeft, Heart } from "lucide-react";
import { useCart } from "@/contexts/OrderCartContext";

interface RecommendDish {
  id: string;
  name: string;
  reason: string;
  image_url: string | null;
  cooking_time: number;
}

const PREFERENCE_OPTIONS = [
  { value: "", label: "随便，都行 😋" },
  { value: "清淡健康", label: "🥬 清淡健康" },
  { value: "香辣过瘾", label: "🌶️ 香辣过瘾" },
  { value: "酸甜可口", label: "🍋 酸甜可口" },
  { value: "浓郁下饭", label: "🍖 浓郁下饭" },
  { value: "暖胃汤煲", label: "🍲 暖胃汤煲" },
];

export default function AIRecommendPage() {
  const { addItem, mealDate, mealTime } = useCart();
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState<RecommendDish[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedAll, setAddedAll] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "推荐失败");
    } finally {
      setLoading(false);
    }
  }

  function handleAddAll() {
    dishes.forEach((d) => addItem({
      dish_id: d.id,
      dish_name: d.name,
      dish_image_url: d.image_url,
      quantity: 1,
    }));
    setAddedAll(true);
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px", minHeight: "100vh", background: "#faf7f2" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/menu" style={{ color: "#8b7e6e", textDecoration: "none" }}>
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, fontFamily: "var(--font-serif)", color: "#3d3226" }}>AI 智能推荐</h1>
          <p style={{ fontSize: 13, color: "#8b7e6e", margin: "2px 0 0" }}>告诉我你想吃什么，帮你搭配</p>
        </div>
      </div>

      {error && (
        <p style={{ color: "#c4665a", fontSize: 14, textAlign: "center", marginBottom: 16, padding: 12, background: "#fdf0ee", borderRadius: 12 }}>{error}</p>
      )}

      {/* Preference Selection */}
      {dishes.length === 0 && (
        <>
          <p style={{ fontSize: 14, color: "#8b7e6e", marginBottom: 12 }}>今天想吃点什么方向？</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {PREFERENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPreference(opt.value)}
                style={{
                  padding: "12px",
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
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "none",
              background: loading ? "#ccc" : "#7c9a6e", color: "#fff",
              fontSize: 16, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={20} />}
            {loading ? "搭配中..." : "帮我搭配"}
          </button>
        </>
      )}

      {/* Results */}
      {dishes.length > 0 && (
        <>
          {message && (
            <div style={{ padding: 14, borderRadius: 12, background: "#f0f5ee", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Heart size={20} style={{ color: "#e88b82", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.6 }}>{message}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {dishes.map((dish) => (
              <div key={dish.id} style={{ display: "flex", gap: 12, padding: 14, borderRadius: 14, border: "1px solid #e0d8c8", background: "#fff" }}>
                <div style={{ width: 68, height: 68, borderRadius: 10, background: "#f0ebe0", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  {dish.image_url ? (
                    <Image src={dish.image_url} alt={dish.name} fill style={{ objectFit: "cover" }} sizes="68px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🍽</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px", color: "#3d3226" }}>{dish.name}</h3>
                  <p style={{ fontSize: 13, color: "#8b7e6e", margin: 0, lineHeight: 1.5 }}>{dish.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setDishes([]); setError(""); setPreference(""); }}
              style={{ flex: 1, padding: 14, borderRadius: 14, background: "#f5f0e8", border: "1px solid #e0d8c8", color: "#666", fontSize: 15, cursor: "pointer" }}
            >
              <RefreshCw size={16} style={{ marginRight: 4 }} />
              换一批
            </button>
            {!addedAll ? (
              <button
                onClick={handleAddAll}
                style={{ flex: 2, padding: 14, borderRadius: 14, background: "#7c9a6e", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer" }}
              >
                <Plus size={16} style={{ marginRight: 4 }} />
                全部加入点单
              </button>
            ) : (
              <Link
                href="/orders/cart"
                style={{ flex: 2, padding: 14, borderRadius: 14, background: "#7c9a6e", color: "#fff", border: "none", fontSize: 15, fontWeight: 500, cursor: "pointer", textDecoration: "none", textAlign: "center" }}
              >
                去下单 ✅
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
