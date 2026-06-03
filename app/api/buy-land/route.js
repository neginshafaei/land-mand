export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  const { landId, userId } = await req.json();

  const { data: land } = await supabase
    .from("lands")
    .select("*")
    .eq("id", landId)
    .single();

  if (!land) {
    return NextResponse.json({ error: "Land not found" }, { status: 404 });
  }

  if (land.owner_id) {
    return NextResponse.json({ error: "Land already owned" });
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (user.balance < land.price) {
    return NextResponse.json({ error: "Not enough coins" });
  }

  await supabase
    .from("users")
    .update({
      balance: user.balance - land.price,
    })
    .eq("id", userId);

  await supabase
    .from("lands")
    .update({
      owner_id: userId,
    })
    .eq("id", landId);

  return NextResponse.json({ success: true });
}
