"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDish, updateDish, deleteDish, type CreateDishInput, type UpdateDishInput } from "@/lib/db/dishes";
import type { Category, Difficulty } from "@/lib/supabase/types";

export async function createDishAction(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as Category;
  const description = (formData.get("description") as string) || undefined;
  const image_url = (formData.get("image_url") as string) || undefined;
  const instructions = formData.get("instructions") as string;
  const cooking_time = formData.get("cooking_time")
    ? parseInt(formData.get("cooking_time") as string)
    : undefined;
  const difficulty = (formData.get("difficulty") as Difficulty) || undefined;

  // Parse ingredients from JSON string
  let ingredients = [];
  try {
    const raw = formData.get("ingredients") as string;
    ingredients = raw ? JSON.parse(raw) : [];
  } catch {
    return { success: false, error: "食材数据格式不正确" };
  }

  if (!name || !category || !instructions) {
    return { success: false, error: "请填写菜品名称、分类和做法" };
  }

  await createDish({
    name,
    category,
    description,
    image_url,
    ingredients,
    instructions,
    cooking_time,
    difficulty,
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateDishAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as Category;
  const description = (formData.get("description") as string) || undefined;
  const image_url = (formData.get("image_url") as string) || undefined;
  const instructions = formData.get("instructions") as string;
  const cooking_time = formData.get("cooking_time")
    ? parseInt(formData.get("cooking_time") as string)
    : undefined;
  const difficulty = (formData.get("difficulty") as Difficulty) || undefined;
  const is_available = formData.get("is_available") === "true";

  let ingredients = [];
  try {
    const raw = formData.get("ingredients") as string;
    ingredients = raw ? JSON.parse(raw) : [];
  } catch {
    return { success: false, error: "食材数据格式不正确" };
  }

  if (!name || !category || !instructions) {
    return { success: false, error: "请填写菜品名称、分类和做法" };
  }

  await updateDish(id, {
    name,
    category,
    description,
    image_url,
    ingredients,
    instructions,
    cooking_time,
    difficulty,
    is_available,
  });

  revalidatePath("/admin");
  revalidatePath("/menu");
  redirect("/admin");
}

export async function deleteDishAction(id: string) {
  await deleteDish(id);
  revalidatePath("/admin");
  revalidatePath("/menu");
}

export async function toggleAvailablityAction(id: string, available: boolean) {
  await updateDish(id, { is_available: available });
  revalidatePath("/admin");
  revalidatePath("/menu");
}
