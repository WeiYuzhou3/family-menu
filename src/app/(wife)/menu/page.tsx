import { getAvailableDishes } from "@/lib/db/dishes";
import { MenuClient } from "./_components/MenuClient";
import { PageTransition } from "@/components/ui/PageTransition";
import type { Category } from "@/lib/supabase/types";

export default async function MenuPage() {
  const dishes = await getAvailableDishes();

  // Group dishes by category for the view
  const categories = dishes.reduce<Record<Category, number>>((acc, dish) => {
    acc[dish.category] = (acc[dish.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-text-primary">今日菜单</h1>
        <p className="text-sm text-text-muted mt-1">
          {dishes.length} 道菜品可选
        </p>
      </div>

      <MenuClient dishes={dishes} />
    </PageTransition>
  );
}
