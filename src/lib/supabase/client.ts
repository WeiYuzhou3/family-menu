import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Client-side Supabase client – uses ANON key.
// Only for Storage uploads (the browser needs public access).
// All DB queries go through Server Components / Server Actions.
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient<Database>(url, key);
}
