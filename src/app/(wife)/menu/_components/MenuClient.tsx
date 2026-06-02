"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/OrderCartContext";
import { DateMealSelector } from "@/components/DateMealSelector";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Dish, Category } from "@/lib/supabase/types";

const CATEGORY_TABS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "main", label: "主菜" },
  { value: "side", label: "小食" },
  { value: "soup", label: "汤品" },
  { value: "breakfast", label: "早餐" },
  { value: "dessert", label: "甜品" },
  { value: "beverage", label: "饮品" },
];

interface MenuClientProps {
  dishes: Dish[];
}

export function MenuClient({ dishes }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const { mealDate, mealTime, setMealDate, setMealTime } = useCart();

  const filteredDishes = useMemo(() => {
    if (activeCategory === "all") return dishes;
    return dishes.filter((d) => d.category === activeCategory);
  }, [dishes, activeCategory]);

  return (
    <div>
      {/* Date & Meal Selector */}
      <div className="mb-4">
        <DateMealSelector
          selectedDate={mealDate}
          selectedMeal={mealTime}
          onDateChange={setMealDate}
          onMealChange={setMealTime}
        />
      </div>

      {/* AI Recommend Button */}
      <div className="mb-4">
        <Link
          href="/menu/recommend"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-accent/5 border border-accent/20 text-accent hover:bg-accent/10 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          不知道吃什么？AI 帮你搭配
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={cn(
              "relative shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === tab.value
                ? "text-black bg-accent"
                : "text-text-secondary bg-bg-surface border border-border-subtle hover:border-border-default"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dish Grid */}
      {filteredDishes.length === 0 ? (
        <EmptyState title="暂无菜品" description="此分类下还没有菜品" />
      ) : (
        <div className="grid grid-cols-2 gap-3 stagger">
          {filteredDishes.map((dish, i) => (
            <div key={dish.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <Link key={dish.id} href={`/menu/${dish.id}`}>
              <div className="group rounded-xl overflow-hidden bg-white border border-border-subtle card-hover">
                <div className="relative aspect-square overflow-hidden">
                  {dish.image_url ? (
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-bg-elevated text-text-muted text-4xl">
                      🍽
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-text-primary truncate">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                      {CATEGORY_TABS.find((t) => t.value === dish.category)?.label}
                    </span>
                    {dish.cooking_time && (
                      <span className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock className="w-3 h-3" />
                        {dish.cooking_time}分钟
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
