"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { MealTime } from "@/lib/supabase/types";

interface DateMealSelectorProps {
  selectedDate: string;
  selectedMeal: MealTime;
  onDateChange: (date: string) => void;
  onMealChange: (meal: MealTime) => void;
}

const MEAL_OPTIONS: { value: MealTime; label: string; icon: string }[] = [
  { value: "breakfast", label: "早餐", icon: "🌅" },
  { value: "lunch", label: "午餐", icon: "☀️" },
  { value: "dinner", label: "晚餐", icon: "🌙" },
];

const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getWeekDates(): { date: string; label: string; isToday: boolean }[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dayOfWeek = today.getDay(); // 0=Sun

  // Generate 7 days from today
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = WEEKDAY_NAMES[d.getDay()];

    dates.push({
      date: dateStr,
      label: i === 0 ? "今天" : `${month}/${day} ${weekday}`,
      isToday: i === 0,
    });
  }

  return dates;
}

export function DateMealSelector({
  selectedDate,
  selectedMeal,
  onDateChange,
  onMealChange,
}: DateMealSelectorProps) {
  const dates = useMemo(() => getWeekDates(), []);

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          选择日期
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dates.map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => onDateChange(d.date)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                selectedDate === d.date
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-default"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Time */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          选择餐次
        </label>
        <div className="flex gap-2">
          {MEAL_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onMealChange(m.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                selectedMeal === m.value
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-default"
              )}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
