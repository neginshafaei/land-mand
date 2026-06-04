export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { calculateClaimAmount } from "@/lib/economy";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: lands, error: landsError } = await supabase
      .from("lands")
      .select("id,income_per_hour,level")
      .eq("owner_id", userId);

    if (landsError) {
      return NextResponse.json({ error: landsError.message }, { status: 500 });
    }

    const now = new Date();
    const claimed = calculateClaimAmount(lands, user.last_claim, now);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        balance: user.balance + claimed,
        last_claim: now.toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      claimed,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
