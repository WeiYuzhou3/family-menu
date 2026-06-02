"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, ArrowRight, KeyRound } from "lucide-react";
import { loginAction } from "./actions";
import type { AppRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<AppRole>("wife");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("role", role);
    formData.set("password", password);

    const result = await loginAction(formData);

    if (!result.success) {
      setError(result.error || "登录失败");
      setLoading(false);
      return;
    }

    router.push(result.redirectTo!);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg, #faf7f2 0%, #f0ebe0 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-border-subtle mb-4 shadow-card">
            <span className="text-4xl">🍳</span>
          </div>
          <h1 className="text-3xl text-text-primary tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            家庭私厨
          </h1>
          <p className="text-text-muted text-sm mt-2">用爱烹饪每一餐</p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6">
          <div className="flex bg-bg-surface rounded-xl p-1.5 border border-border-subtle">
            {(["wife", "husband"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  role === r
                    ? "text-white bg-accent shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {r === "wife" ? "👩 老婆" : "👨‍🍳 老公"}
              </button>
            ))}
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="请输入密码"
              autoFocus
              className={cn(
                "w-full pl-12 pr-4 py-3.5 bg-bg-surface border rounded-xl text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
                "transition-all duration-200",
                error ? "border-danger" : "border-border-subtle"
              )}
            />
          </div>

          {error && (
            <p className="text-danger text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm",
              "bg-accent text-white transition-all duration-200",
              "hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed",
              "shadow-sm"
            )}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                进入
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-text-muted text-xs text-center mt-8">
          选择角色，输入密码进入
        </p>
      </div>
    </div>
  );
}
