"use server";

import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/db/orders";
import type { CartItem } from "@/contexts/OrderCartContext";
import type { CreateOrderItem } from "@/lib/db/orders";
import type { MealTime } from "@/lib/supabase/types";

export async function submitOrderAction(
  cartItems: CartItem[],
  options?: {
    notes?: string;
    mealDate?: string;
    mealTime?: MealTime;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!cartItems.length) {
    return { success: false, error: "购物车为空" };
  }

  const items: CreateOrderItem[] = cartItems.map((item) => ({
    dish_id: item.dish_id,
    quantity: item.quantity,
    special_requests: item.special_requests,
  }));

  try {
    await createOrder(items, {
      notes: options?.notes,
      meal_date: options?.mealDate,
      meal_time: options?.mealTime,
    });
    revalidatePath("/orders");
    revalidatePath("/kitchen");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "下单失败，请重试",
    };
  }
}
