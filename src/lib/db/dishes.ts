import { createServerClient } from "@/lib/supabase/server";
import type { Dish, Ingredient, Category } from "@/lib/supabase/types";

// ── Queries ──

export async function getAllDishes(): Promise<Dish[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch dishes: ${error.message}`);
  return data;
}

export async function getAvailableDishes(): Promise<Dish[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch dishes: ${error.message}`);
  return data;
}

export async function getDishesByCategory(category: Category): Promise<Dish[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("category", category)
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch dishes: ${error.message}`);
  return data;
}

export async function getDishById(id: string): Promise<Dish | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch dish: ${error.message}`);
  }
  return data;
}

// ── Mutations ──

export interface CreateDishInput {
  name: string;
  category: Category;
  description?: string;
  image_url?: string;
  ingredients: Ingredient[];
  instructions: string;
  cooking_time?: number;
  difficulty?: "easy" | "medium" | "hard";
}

export async function createDish(input: CreateDishInput): Promise<Dish> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(input as any)
    .select()
    .single();

  if (error) throw new Error(`Failed to create dish: ${error.message}`);
  return data;
}

export interface UpdateDishInput extends Partial<CreateDishInput> {
  is_available?: boolean;
}

export async function updateDish(id: string, input: UpdateDishInput): Promise<Dish> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("dishes")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(input as any)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update dish: ${error.message}`);
  return data;
}

export async function deleteDish(id: string): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("dishes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete dish: ${error.message}`);
}
