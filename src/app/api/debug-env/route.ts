import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DEEPSEEK_API_KEY_exists: !!process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_API_KEY_length: process.env.DEEPSEEK_API_KEY?.length || 0,
    DEEPSEEK_API_KEY_prefix: process.env.DEEPSEEK_API_KEY?.substring(0, 8) || "N/A",
  });
}
