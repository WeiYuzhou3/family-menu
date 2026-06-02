"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MealTime } from "@/lib/supabase/types";

// ── Types ──

export interface CartItem {
  dish_id: string;
  dish_name: string;
  dish_image_url: string | null;
  quantity: number;
  special_requests?: string;
}

interface CartContextValue {
  items: CartItem[];
  mealDate: string;
  mealTime: MealTime;
  setMealDate: (date: string) => void;
  setMealTime: (time: MealTime) => void;
  addItem: (item: CartItem) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const STORAGE_KEY = "family-menu-cart";
const STORAGE_DATE_KEY = "family-menu-cart-date";
const STORAGE_MEAL_KEY = "family-menu-cart-meal";

const today = () => new Date().toISOString().split("T")[0];

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function OrderCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mealDate, setMealDateState] = useState(today());
  const [mealTime, setMealTimeState] = useState<MealTime>("lunch");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
    if (savedDate) setMealDateState(savedDate);
    const savedMeal = localStorage.getItem(STORAGE_MEAL_KEY);
    if (savedMeal) setMealTimeState(savedMeal as MealTime);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const setMealDate = useCallback((date: string) => {
    setMealDateState(date);
    localStorage.setItem(STORAGE_DATE_KEY, date);
  }, []);

  const setMealTime = useCallback((time: MealTime) => {
    setMealTimeState(time);
    localStorage.setItem(STORAGE_MEAL_KEY, time);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish_id === item.dish_id);
      if (existing) {
        return prev.map((i) =>
          i.dish_id === item.dish_id
            ? { ...i, quantity: i.quantity + item.quantity, special_requests: item.special_requests || i.special_requests }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish_id !== dishId));
  }, []);

  const updateQuantity = useCallback((dishId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.dish_id !== dishId)
        : prev.map((i) => (i.dish_id === dishId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, mealDate, mealTime, setMealDate, setMealTime, addItem, removeItem, updateQuantity, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within an OrderCartProvider");
  }
  return ctx;
}
