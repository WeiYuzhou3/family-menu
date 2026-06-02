"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/db/passwords";
import type { AppRole } from "@/lib/supabase/types";

export async function loginAction(formData: FormData) {
  const role = formData.get("role") as AppRole;
  const password = formData.get("password") as string;

  if (!role || !password) {
    return { success: false, error: "请选择角色并输入密码" };
  }

  const isValid = await verifyPassword(role, password);

  if (!isValid) {
    return { success: false, error: "密码不正确" };
  }

  const session = await getSession();
  session.role = role;
  session.authenticatedAt = Date.now();
  await session.save();

  // Return redirect URL instead of using redirect() directly
  // This ensures the cookie is properly set before navigation
  return {
    success: true,
    redirectTo: role === "wife" ? "/menu" : "/kitchen",
  };
}

export async function logoutAction() {
  "use server";

  const session = await getSession();
  session.destroy();
  redirect("/login");
}
