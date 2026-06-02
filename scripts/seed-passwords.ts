/**
 * Seed script: set initial passwords for wife and husband.
 *
 * Usage:
 *   1. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   2. Run: npx tsx scripts/seed-passwords.ts
 *
 * You will be prompted for each role's password.
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("❌ Missing Supabase env vars. Check .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("🔐 Family Menu — Password Setup\n");

  const wifePwd = await ask("Enter password for wife: ");
  const husbandPwd = await ask("Enter password for husband: ");

  const wifeHash = await bcrypt.hash(wifePwd, 12);
  const husbandHash = await bcrypt.hash(husbandPwd, 12);

  const { error } = await supabase.from("app_passwords").upsert([
    { role: "wife", password_hash: wifeHash },
    { role: "husband", password_hash: husbandHash },
  ]);

  if (error) {
    console.error("❌ Failed:", error.message);
  } else {
    console.log("✅ Passwords set successfully!");
  }

  rl.close();
}

main();
