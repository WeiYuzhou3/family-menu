// Database type definitions for Supabase.
// Extend this as the schema grows, or generate from Supabase CLI.

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      dishes: {
        Row: Dish;
        Insert: Omit<Dish, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Dish, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      app_passwords: {
        Row: AppPassword;
        Insert: Omit<AppPassword, "id" | "updated_at">;
        Update: Partial<Omit<AppPassword, "id">>;
      };
    };
  };
}

// ── Domain Types ──

export type Category = "main" | "side" | "soup" | "breakfast" | "dessert" | "beverage";
export type Difficulty = "easy" | "medium" | "hard";
export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";
export type MealTime = "breakfast" | "lunch" | "dinner";
export type AppRole = "wife" | "husband";

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Dish {
  id: string;
  name: string;
  category: Category;
  description: string | null;
  image_url: string | null;
  ingredients: Ingredient[];
  instructions: string;
  cooking_time: number | null;
  difficulty: Difficulty | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  notes: string | null;
  meal_date: string;
  meal_time: MealTime;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string;
  quantity: number;
  special_requests: string | null;
  created_at: string;
}

export interface AppPassword {
  id: number;
  role: AppRole;
  password_hash: string;
  updated_at: string;
}
