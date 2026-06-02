"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CookingPot, Clock, ArrowRight } from "lucide-react";
import { ElapsedTime } from "./ElapsedTime";
import type { Order } from "@/lib/supabase/types";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅 早餐",
  lunch: "☀️ 午餐",
  dinner: "🌙 晚餐",
};

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dates: { date: string; label: string }[] = [];
  for (let i = 0; i < 7 - dayOfWeek; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    dates.push({
      date: dateStr,
      label: i === 0 ? "今天" : `${month}/${day} ${weekdays[d.getDay()]}`,
    });
  }
  return dates;
}

interface KitchenClientProps {
  activeOrders: Order[];
  completedOrders: Order[];
}

export function KitchenClient({ activeOrders, completedOrders }: KitchenClientProps) {
  const dates = getWeekDates();
  const today = dates[0]?.date || new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredOrders = activeOrders.filter((o) => o.meal_date === selectedDate);

  const byMeal: Record<string, Order[]> = { breakfast: [], lunch: [], dinner: [] };
  for (const order of filteredOrders) {
    if (byMeal[order.meal_time]) {
      byMeal[order.meal_time].push(order);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-text-primary" style={{ fontFamily: "var(--font-serif)" }}>厨房看板</h1>
        <p className="text-sm text-text-muted mt-1">
          {activeOrders.length} 个待处理 · {completedOrders.length} 个已完成
        </p>
      </div>

      {/* Date Picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              selectedDate === d.date
                ? "bg-accent text-white border-accent shadow-sm"
                : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-default"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Orders by meal time */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {(["breakfast", "lunch", "dinner"] as const).map((meal) => {
            const orders = byMeal[meal];
            if (!orders?.length) return null;
            return (
              <section key={meal}>
                <h2 className="font-medium text-sm text-accent mb-2 ml-1">
                  {MEAL_LABELS[meal]}
                </h2>
                <div className="space-y-2">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/kitchen/${order.id}`}
                      className="block bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-accent/30 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <StatusBadge status={order.status} />
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <Clock className="w-3 h-3" />
                            <ElapsedTime since={order.created_at} />
                          </span>
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                      {order.notes && (
                        <p className="mt-2 text-sm text-text-secondary bg-bg-base rounded-lg p-2">
                          📝 {order.notes}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CookingPot}
          title="暂无订单"
          description={selectedDate === today ? "等待老婆下单中..." : "这一天还没有预约"}
        />
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <section className="mt-8">
          <h2 className="font-medium text-sm text-text-secondary uppercase tracking-wider mb-3">
            最近已完成
          </h2>
          <div className="space-y-2">
            {completedOrders.slice(0, 10).map((order) => (
              <Link
                key={order.id}
                href={`/kitchen/${order.id}`}
                className="block bg-bg-surface/50 border border-border-subtle/50 rounded-xl p-3 opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status="completed" />
                  <span className="text-xs text-text-muted">
                    {order.meal_date} {MEAL_LABELS[order.meal_time]}
                  </span>
                </div>
                {order.notes && (
                  <p className="mt-1 text-xs text-text-muted">{order.notes}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
