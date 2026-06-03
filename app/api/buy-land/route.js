export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const { x, y, userId } = await req.json();

    if (x === undefined || y === undefined)
      return Response.json({ error: "Missing coordinates" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data: land, error: landErr } = await supabase
      .from("lands")
      .select("*")
      .eq("x", x)
      .eq("y", y)
      .single();

    if (!land)
      return Response.json({ error: "Land not found" }, { status: 404 });

    if (land.owner_id)
      return Response.json({ error: "Land already owned" }, { status: 400 });

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    if (user.balance < land.price)
      return Response.json({ error: "Not enough coins" }, { status: 400 });

    await supabase
      .from("lands")
      .update({ owner_id: userId })
      .eq("x", x)
      .eq("y", y);

    await supabase
      .from("users")
      .update({ balance: user.balance - land.price })
      .eq("id", userId);

    return Response.json({ success: true, price: land.price });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
