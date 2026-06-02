import { createServerClient } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus, MealTime } from "@/lib/supabase/types";

// ── Extended Types ──

export interface OrderItemWithDish extends OrderItem {
  dish_name: string;
  dish_image_url: string | null;
  dish_ingredients: { name: string; amount: number; unit: string }[] | null;
  dish_instructions: string | null;
  dish_cooking_time: number | null;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithDish[];
}

// ── Queries ──

export async function getOrdersByStatus(statuses: OrderStatus[]): Promise<Order[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .in("status", statuses)
    .order("meal_date", { ascending: true })
    .order("meal_time", { ascending: true });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

export async function getPendingOrders(date?: string): Promise<Order[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("orders")
    .select("*")
    .in("status", ["pending", "preparing"])
    .order("meal_time", { ascending: true });

  if (date) {
    query = query.eq("meal_date", date);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

export async function getCompletedOrders(): Promise<Order[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "completed")
    .order("meal_date", { ascending: false })
    .order("meal_time", { ascending: false })
    .limit(50);

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

export async function getOrdersByRole(
  statuses: OrderStatus[]
): Promise<OrderWithItems[]> {
  const supabase = createServerClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .in("status", statuses)
    .order("meal_date", { ascending: true })
    .order("meal_time", { ascending: true });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  if (!orders.length) return [];

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: items } = await supabase
        .from("order_items")
        .select("*, dishes(name, image_url, ingredients, instructions, cooking_time)")
        .eq("order_id", order.id);

      return {
        ...order,
        items: (items || []).map((item) => {
          const dishData = (item as unknown as { dishes: { name: string; image_url: string | null; ingredients: unknown; instructions: string | null; cooking_time: number | null } | null })?.dishes;
          return {
            ...item,
            dish_name: dishData?.name || "Unknown",
            dish_image_url: dishData?.image_url || null,
            dish_ingredients: (dishData?.ingredients as { name: string; amount: number; unit: string }[]) || null,
            dish_instructions: dishData?.instructions || null,
            dish_cooking_time: dishData?.cooking_time || null,
          };
        }),
      };
    })
  );

  return ordersWithItems;
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const supabase = createServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*, dishes(name, image_url, ingredients, instructions, cooking_time)")
    .eq("order_id", id);

  return {
    ...order,
    items: (items || []).map((item) => {
      const dishData = (item as unknown as { dishes: { name: string; image_url: string | null; ingredients: unknown; instructions: string | null; cooking_time: number | null } | null })?.dishes;
      return {
        ...item,
        dish_name: dishData?.name || "Unknown",
        dish_image_url: dishData?.image_url || null,
        dish_ingredients: (dishData?.ingredients as { name: string; amount: number; unit: string }[]) || null,
        dish_instructions: dishData?.instructions || null,
        dish_cooking_time: dishData?.cooking_time || null,
      };
    }),
  };
}

// ── Mutations ──

export interface CreateOrderItem {
  dish_id: string;
  quantity: number;
  special_requests?: string;
}

export async function createOrder(
  items: CreateOrderItem[],
  options?: {
    notes?: string;
    meal_date?: string;
    meal_time?: MealTime;
  }
): Promise<Order> {
  const supabase = createServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "pending",
      notes: options?.notes || null,
      meal_date: options?.meal_date || new Date().toISOString().split("T")[0],
      meal_time: options?.meal_time || "lunch",
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  const orderItems = items.map((item) => ({
    order_id: order.id,
    dish_id: item.dish_id,
    quantity: item.quantity,
    special_requests: item.special_requests || null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update order: ${error.message}`);
  return data;
}
