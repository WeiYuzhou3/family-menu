import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/db/orders";
import { PageTransition } from "@/components/ui/PageTransition";
import { StatusBadge } from "@/components/ui/Badge";
import { ArrowLeft, Clock, ChefHat } from "lucide-react";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅 早餐",
  lunch: "☀️ 午餐",
  dinner: "🌙 晚餐",
};
import { OrderActions } from "./_components/OrderActions";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/kitchen"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-xl text-text-primary">订单详情</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={order.status} />
            <span className="text-xs text-text-muted">
              {order.meal_date} · {MEAL_LABELS[order.meal_time]}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(order.created_at).toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="mb-6 p-4 bg-accent/5 border border-accent/10 rounded-xl">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-accent">📝 备注：</span>
            {order.notes}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-4 mb-8">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden"
          >
            {/* Item Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-bg-base shrink-0">
                {item.dish_image_url ? (
                  <Image
                    src={item.dish_image_url}
                    alt={item.dish_name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    🍽
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">{item.dish_name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-text-muted">×{item.quantity}</span>
                  {item.special_requests && (
                    <span className="text-xs text-accent bg-accent/5 px-2 py-0.5 rounded-full">
                      {item.special_requests}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients + Instructions */}
            {(item.dish_ingredients?.length || item.dish_instructions) && (
              <div className="border-t border-border-subtle p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <ChefHat className="w-4 h-4 text-accent" />
                  <span className="font-medium">菜谱</span>
                </div>

                {/* Ingredients */}
                {item.dish_ingredients && item.dish_ingredients.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-text-muted mb-2">📋 食材清单</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {item.dish_ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-bg-base text-xs">
                          <span className="text-text-primary">{ing.name}</span>
                          <span className="text-text-muted font-mono">{ing.amount}{ing.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {item.dish_instructions && (
                  <div>
                    <h4 className="text-xs font-medium text-text-muted mb-2">📝 烹饪步骤</h4>
                    <div
                      className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-base rounded-lg p-3"
                      dangerouslySetInnerHTML={{
                        __html: item.dish_instructions.replace(
                          /(https?:\/\/\S+)/g,
                          '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:underline">$1</a>'
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Actions */}
      {order.status !== "completed" && order.status !== "cancelled" && (
        <OrderActions orderId={order.id} currentStatus={order.status} />
      )}
    </PageTransition>
  );
}
