import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import type { AppRole } from "@/lib/supabase/types";

// ── Verify password ──
export async function verifyPassword(
  role: AppRole,
  password: string
): Promise<boolean> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("app_passwords")
    .select("password_hash")
    .eq("role", role)
    .single();

  if (error || !data) return false;

  return bcrypt.compare(password, data.password_hash);
}

// ── Set/update password ──
export async function setPassword(role: AppRole, password: string): Promise<void> {
  const supabase = createServerClient();
  const password_hash = await bcrypt.hash(password, 12);

  const { data: existing } = await supabase
    .from("app_passwords")
    .select("id")
    .eq("role", role)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("app_passwords")
      .update({ password_hash })
      .eq("role", role);
    if (error) throw new Error(`Failed to update password: ${error.message}`);
  } else {
    const { error } = await supabase
      .from("app_passwords")
      .insert({ role, password_hash });
    if (error) throw new Error(`Failed to set password: ${error.message}`);
  }
}

// ── Check if any password exists (for first-run setup detection) ──
export async function hasAnyPassword(): Promise<boolean> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("app_passwords")
    .select("*", { count: "exact", head: true });

  if (error) return false;
  return (count || 0) > 0;
}
