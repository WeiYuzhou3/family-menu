import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-card transition-all duration-200",
        hover && "cursor-pointer hover:border-border-default hover:scale-[1.01] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
