"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/OrderCartContext";

export function FloatingCartBadge() {
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 animate-[popIn_0.3s_ease-out]">
      <Link
        href="/orders/cart"
        className="relative flex items-center justify-center w-14 h-14 bg-accent rounded-2xl shadow-elevated hover:bg-accent-hover transition-colors"
      >
        <ShoppingCart className="w-6 h-6 text-black" />
        <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-bg-base text-accent text-xs font-bold border-2 border-accent px-1">
          {itemCount}
        </span>
      </Link>
      <style jsx>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
