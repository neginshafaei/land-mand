import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTelegramData } from "@/lib/telegram";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  const { initData } = await req.json();

  if (!initData) {
    // dev mode
    return NextResponse.json({
      id: 999,
      first_name: "Dev User",
      username: "developer",
      balance: 1000,
    });
  }

  const isValid = verifyTelegramData(initData, process.env.BOT_TOKEN);

  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlParams = new URLSearchParams(initData);
  const userRaw = JSON.parse(urlParams.get("user") || "{}");

  const { data, error } = await supabase
    .from("users")
    .upsert({
      id: userRaw.id,
      username: userRaw.username,
      first_name: userRaw.first_name,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
