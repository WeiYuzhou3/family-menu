import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-overlay text-text-secondary border-border-subtle",
  accent: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  info: "bg-info/10 text-info border-info/20",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Status Badge (for orders) ──
const STATUS_LABELS: Record<string, string> = {
  pending: "待接单",
  preparing: "制作中",
  completed: "已完成",
  cancelled: "已取消",
};

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  pending: "warning",
  preparing: "info",
  completed: "success",
  cancelled: "default",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || "default"}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

// ── Category Badge (for dishes) ──
const CATEGORY_LABELS: Record<string, string> = {
  main: "主菜",
  side: "小食",
  soup: "汤品",
  breakfast: "早餐",
  dessert: "甜品",
  beverage: "饮品",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="accent">
      {CATEGORY_LABELS[category] || category}
    </Badge>
  );
}
