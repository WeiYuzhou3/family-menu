import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff, Sparkles } from "lucide-react";
import { getAllDishes } from "@/lib/db/dishes";
import { toggleAvailablityAction } from "./actions";
import { DeleteButton } from "./_components/DeleteButton";
import { WeeklySuggestions } from "./_components/WeeklySuggestions";
import { CategoryBadge } from "@/components/ui/Badge";

export default async function AdminPage() {
  const dishes = await getAllDishes();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>
            菜品管理
          </h1>
          <p className="text-sm text-text-muted mt-1">{dishes.length} 道菜品</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-wood/20 text-wood-dark border border-wood/30 hover:bg-wood/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI 导入
          </Link>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增
          </Link>
        </div>
      </div>

      {/* Weekly Suggestions (collapsible at top) */}
      {dishes.length > 0 && <WeeklySuggestions />}

      {/* Dish List */}
      {dishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
            <span className="text-2xl">🍽</span>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">还没有菜品</h3>
          <p className="text-sm text-text-muted mb-4">点击右上角「新增」开始添加第一道菜吧</p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-accent text-black hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加菜品
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="flex gap-4 p-3 bg-bg-surface border border-border-subtle rounded-xl"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-bg-base shrink-0">
                {dish.image_url ? (
                  <Image
                    src={dish.image_url}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xl">
                    🍽
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-text-primary truncate">
                      {dish.name}
                    </h3>
                    {!dish.is_available && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-overlay text-text-muted shrink-0">
                        已下架
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge category={dish.category} />
                    {dish.cooking_time && (
                      <span className="text-xs text-text-muted">
                        {dish.cooking_time}分钟
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-2">
                  <form action={toggleAvailablityAction.bind(null, dish.id, !dish.is_available)}>
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-base transition-colors"
                      title={dish.is_available ? "下架" : "上架"}
                    >
                      {dish.is_available ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </form>

                  <Link
                    href={`/admin/${dish.id}/edit`}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-base transition-colors inline-flex"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  <DeleteButton dishId={dish.id} dishName={dish.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
