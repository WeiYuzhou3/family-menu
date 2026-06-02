import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { AppRole } from "@/lib/supabase/types";

// ── Session Data ──
export interface SessionData {
  role: AppRole;
  authenticatedAt: number; // Date.now()
}

// ── Session Options ──
export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET || "dev-secret-at-least-32-characters-long!!",
  cookieName: "family-menu-session",
  cookieOptions: {
    // Secure in production (HTTPS). Supabase provides HTTPS, so true in prod.
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
  ttl: 60 * 60 * 24 * 7, // 7 days
};

// ── Helper: get session in Server Components / Server Actions ──
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

// ── Helper: require a specific role, redirect otherwise ──
export async function requireRole(role: AppRole) {
  const session = await getSession();

  if (!session.role || session.role !== role) {
    return null;
  }

  return session;
}

// ── Helper: get current session (any role) ──
export async function getCurrentSession(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.role) return null;
  return {
    role: session.role,
    authenticatedAt: session.authenticatedAt,
  };
}
