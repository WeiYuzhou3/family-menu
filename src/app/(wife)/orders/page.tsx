import Link from "next/link";
import { getOrdersByRole } from "@/lib/db/orders";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { ShoppingBag, Clock } from "lucide-react";
import type { OrderWithItems } from "@/lib/db/orders";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅 早餐",
  lunch: "☀️ 午餐",
  dinner: "🌙 晚餐",
};

function groupOrders(orders: OrderWithItems[]) {
  const grouped: Record<string, Record<string, OrderWithItems[]>> = {};
  for (const order of orders) {
    const date = order.meal_date;
    const meal = order.meal_time;
    if (!grouped[date]) grouped[date] = {};
    if (!grouped[date][meal]) grouped[date][meal] = [];
    grouped[date][meal].push(order);
  }
  return grouped;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return isToday ? `今天 ${month}月${day}日` : `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

export default async function OrdersPage() {
  const activeOrders = await getOrdersByRole(["pending", "preparing"]);
  const completedOrders = await getOrdersByRole(["completed"]);

  const activeGrouped = groupOrders(activeOrders);

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>我的订单</h1>
        <p className="text-sm text-text-muted mt-1">
          {activeOrders.length} 个进行中 · {completedOrders.length} 个已完成
        </p>
      </div>

      {/* Active Orders */}
      {Object.keys(activeGrouped).length > 0 ? (
        <section className="mb-8 space-y-6">
          {Object.entries(activeGrouped).map(([date, meals]) => (
            <div key={date}>
              <h2 className="font-medium text-sm text-accent mb-3">
                {formatDateLabel(date)}
              </h2>
              <div className="space-y-3">
                {Object.entries(meals).map(([meal, orders]) => (
                  <div key={meal}>
                    <h3 className="text-xs font-medium text-text-secondary mb-2 ml-1">
                      {MEAL_LABELS[meal] || meal}
                    </h3>
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-bg-surface border border-border-subtle rounded-xl p-4 mb-2"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <StatusBadge status={order.status} />
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(order.created_at)}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="text-sm text-text-primary flex justify-between"
                            >
                              <span>
                                {item.dish_name}{" "}
                                {item.special_requests && (
                                  <span className="text-accent text-xs">
                                    ({item.special_requests})
                                  </span>
                                )}
                              </span>
                              <span className="text-text-muted">×{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <p className="mt-2 text-xs text-text-secondary bg-bg-base rounded-lg p-2">
                            📝 {order.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="暂无订单"
          description="去菜单选菜下单吧"
          action={
            <Link href="/menu">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent-hover transition-colors">
                浏览菜单
              </span>
            </Link>
          }
        />
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <section>
          <h2 className="font-medium text-sm text-text-secondary uppercase tracking-wider mb-3">
            已完成
          </h2>
          <div className="space-y-2">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-bg-surface/50 border border-border-subtle/50 rounded-xl p-3 opacity-75"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="completed" />
                    <span className="text-xs text-text-muted">
                      {formatDateLabel(order.meal_date)} · {MEAL_LABELS[order.meal_time]}
                    </span>
                  </div>
                </div>
                <ul className="space-y-0.5">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm text-text-secondary flex justify-between"
                    >
                      <span>{item.dish_name}</span>
                      <span className="text-text-muted">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageTransition>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}小时前`;
  return date.toLocaleDateString("zh-CN");
}
