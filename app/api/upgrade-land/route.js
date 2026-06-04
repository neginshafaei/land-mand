export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getLevelIncome, getUpgradeCost } from "@/lib/economy";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function POST(req) {
  try {
    const { userId, landId } = await req.json();

    if (!userId || !landId) {
      return NextResponse.json(
        { error: "Missing userId or landId" },
        { status: 400 },
      );
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: land, error: landError } = await supabase
      .from("lands")
      .select("*")
      .eq("id", landId)
      .eq("owner_id", userId)
      .single();

    if (landError || !land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    const cost = getUpgradeCost(land.level);

    if (user.balance < cost) {
      return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
    }

    const nextLevel = Number(land.level || 1) + 1;

    const { data: updatedLand, error: updateLandError } = await supabase
      .from("lands")
      .update({ level: nextLevel })
      .eq("id", landId)
      .eq("owner_id", userId)
      .select()
      .single();

    if (updateLandError) {
      return NextResponse.json(
        { error: updateLandError.message },
        { status: 500 },
      );
    }

    const { data: updatedUser, error: updateUserError } = await supabase
      .from("users")
      .update({ balance: user.balance - cost })
      .eq("id", userId)
      .select()
      .single();

    if (updateUserError) {
      return NextResponse.json(
        { error: updateUserError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      cost,
      income_per_hour: getLevelIncome(updatedLand.income_per_hour, nextLevel),
      land: updatedLand,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
