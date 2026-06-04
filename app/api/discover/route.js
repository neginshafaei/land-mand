export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  getIncomeByRarity,
  normalizeDiscoverPrice,
  rollRarity,
} from "@/lib/economy";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function POST(req) {
  try {
    const { userId, price } = await req.json();
    const discoverPrice = normalizeDiscoverPrice(price);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!discoverPrice) {
      return NextResponse.json(
        { error: "Invalid discover price" },
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

    if (user.balance < discoverPrice) {
      return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
    }

    const { data: openLand, error: landError } = await supabase
      .from("lands")
      .select("*")
      .is("owner_id", null)
      .limit(1)
      .single();

    if (landError || !openLand) {
      return NextResponse.json({ error: "No land available" }, { status: 404 });
    }

    const rarity = rollRarity(discoverPrice);
    const income = getIncomeByRarity(rarity);

    const { data: land, error: updateLandError } = await supabase
      .from("lands")
      .update({
        owner_id: userId,
        rarity,
        income_per_hour: income,
        level: 1,
      })
      .eq("id", openLand.id)
      .is("owner_id", null)
      .select()
      .single();

    if (updateLandError || !land) {
      return NextResponse.json(
        { error: "Land was already claimed" },
        { status: 409 },
      );
    }

    const { data: updatedUser, error: balanceError } = await supabase
      .from("users")
      .update({ balance: user.balance - discoverPrice })
      .eq("id", userId)
      .select()
      .single();

    if (balanceError) {
      return NextResponse.json({ error: balanceError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      land,
      user: updatedUser,
      rarity,
      income,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
