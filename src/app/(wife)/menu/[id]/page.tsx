import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ChefHat, Flame } from "lucide-react";
import { getDishById } from "@/lib/db/dishes";
import { CategoryBadge } from "@/components/ui/Badge";
import { PageTransition } from "@/components/ui/PageTransition";
import { AddToCartButton } from "./_components/AddToCartButton";
import type { Dish } from "@/lib/supabase/types";

interface DishDetailPageProps {
  params: Promise<{ id: string }>;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export default async function DishDetailPage({ params }: DishDetailPageProps) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish || !dish.is_available) {
    notFound();
  }

  return (
    <PageTransition>
      {/* Hero Image */}
      <div className="relative aspect-[4/3] max-h-[50vh] overflow-hidden">
        {dish.image_url ? (
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg-elevated text-text-muted text-6xl">
            🍽
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/20 to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-10 pb-24">
        {/* Name & Meta */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl text-text-primary mb-3">
            {dish.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={dish.category} />
            {dish.cooking_time && (
              <span className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-surface border border-border-subtle rounded-full px-3 py-1">
                <Clock className="w-3.5 h-3.5" />
                {dish.cooking_time} 分钟
              </span>
            )}
            {dish.difficulty && (
              <span className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-surface border border-border-subtle rounded-full px-3 py-1">
                <Flame className="w-3.5 h-3.5" />
                {DIFFICULTY_LABELS[dish.difficulty] || dish.difficulty}
              </span>
            )}
          </div>
          {dish.description && (
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>

        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <section className="mb-8">
            <h2 className="font-serif text-lg text-text-primary mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-accent" />
              食材清单
            </h2>
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
              <div className="grid grid-cols-2 gap-2">
                {dish.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-bg-base"
                  >
                    <span className="text-sm text-text-primary">{ing.name}</span>
                    <span className="text-xs text-text-muted font-mono">
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Instructions */}
        {dish.instructions && (
          <section className="mb-8">
            <h2 className="font-serif text-lg text-text-primary mb-3">烹饪做法</h2>
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {dish.instructions}
              </div>
            </div>
          </section>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton dish={dish} />
      </div>
    </PageTransition>
  );
}
