"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/login/actions";

const NAV_ITEMS = [
  { href: "/menu", label: "菜单", icon: BookOpen },
  { href: "/orders", label: "订单", icon: ShoppingBag },
];

export function WifeNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-bg-surface/95 backdrop-blur-xl border-t border-border-subtle">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors",
                isActive ? "text-accent" : "text-text-muted hover:text-text-secondary"
              )}
            >
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
              )}
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>退出</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
