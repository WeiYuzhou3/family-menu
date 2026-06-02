"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/contexts/OrderCartContext";
import type { Dish } from "@/lib/supabase/types";

interface AddToCartButtonProps {
  dish: Dish;
}

export function AddToCartButton({ dish }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [showSheet, setShowSheet] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      dish_id: dish.id,
      dish_name: dish.name,
      dish_image_url: dish.image_url,
      quantity,
      special_requests: notes || undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setShowSheet(false);
      setAdded(false);
      setQuantity(1);
      setNotes("");
    }, 600);
  }

  return (
    <>
      <div className="fixed bottom-20 inset-x-0 z-40 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full shadow-elevated"
            onClick={() => setShowSheet(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            加入点单
          </Button>
        </div>
      </div>

      {showSheet && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowSheet(false)}
          />
          <div
            className="fixed bottom-0 inset-x-0 z-[100] bg-bg-surface border-t border-border-subtle rounded-t-2xl px-6 py-6 max-h-[60vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]"
          >
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="w-10 h-1 bg-border-subtle rounded-full mx-auto" />
              <div>
                <h3 className="font-serif text-lg text-text-primary">
                  {dish.name}
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                  选择数量并添加备注
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary hover:border-border-default transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-medium text-text-primary w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary hover:border-border-default transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Textarea
                label="特殊需求（可选）"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例如：少盐、不要辣..."
                rows={2}
              />

              <Button size="lg" className="w-full" onClick={handleAdd} loading={false}>
                {added ? "已加入！" : `加入点单 · ${quantity} 份`}
              </Button>
            </div>
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </>
      )}
    </>
  );
}
