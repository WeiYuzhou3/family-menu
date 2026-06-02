"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/db/orders";
import type { OrderStatus } from "@/lib/supabase/types";

export async function markOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/kitchen");
    revalidatePath("/orders");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "更新失败",
    };
  }
}
