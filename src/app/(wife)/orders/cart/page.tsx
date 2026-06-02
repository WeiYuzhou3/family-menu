"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Send,
} from "lucide-react";
import { useCart } from "@/contexts/OrderCartContext";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { submitOrderAction } from "./actions";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
};

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (isToday) return "今天";
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, mealDate, mealTime } = useCart();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const result = await submitOrderAction(items, {
        notes: notes || undefined,
        mealDate,
        mealTime,
      });
      if (result.success) {
        clearCart();
        setSubmitted(true);
      }
    } catch {
      // error handled by server action
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 animate-[popIn_0.4s_ease-out]">
          <Send className="w-10 h-10 text-accent" />
        </div>
        <h1 className="font-serif text-2xl text-text-primary mb-2">下单成功！</h1>
        <p className="text-text-secondary mb-8">大厨已经开始准备做饭啦</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push("/menu")}>
            继续点单
          </Button>
          <Button onClick={() => router.push("/orders")}>
            查看订单
          </Button>
        </div>
      </div>
    );
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
        <h1 className="font-serif text-xl text-text-primary">点单确认</h1>
        <span className="text-sm text-text-muted">
          {formatDateLabel(mealDate)} · {MEAL_LABELS[mealTime]} · {items.length} 种菜品
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="购物车是空的"
          description="去菜单选几道想吃的菜吧"
          action={
            <Button onClick={() => router.push("/menu")}>浏览菜单</Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.dish_id}
              className="flex gap-3 p-3 bg-bg-surface border border-border-subtle rounded-xl"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-bg-base shrink-0">
                {item.dish_image_url ? (
                  <Image
                    src={item.dish_image_url}
                    alt={item.dish_name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    🍽
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-text-primary truncate">
                  {item.dish_name}
                </h3>
                {item.special_requests && (
                  <p className="text-xs text-accent mt-0.5">
                    {item.special_requests}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.dish_id, Math.max(1, item.quantity - 1))
                      }
                      className="p-1 rounded-lg hover:bg-bg-base text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium text-text-primary w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.dish_id, item.quantity + 1)
                      }
                      className="p-1 rounded-lg hover:bg-bg-base text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.dish_id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Textarea
            label="备注（可选）"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="整体备注，例如：不急、慢慢做..."
            rows={2}
          />

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            loading={submitting}
          >
            <Send className="w-5 h-5" />
            提交订单 · {items.reduce((s, i) => s + i.quantity, 0)} 份
          </Button>
        </div>
      )}
    </div>
  );
}
