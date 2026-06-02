"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AppRole } from "@/lib/supabase/types";

interface AuthState {
  role: AppRole;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ role, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
