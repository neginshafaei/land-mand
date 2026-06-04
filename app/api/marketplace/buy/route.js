export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { calculateSellerPayout } from "@/lib/economy";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function POST(req) {
  try {
    const { buyerId, landId } = await req.json();

    if (!buyerId || !landId) {
      return NextResponse.json(
        { error: "Missing buyerId or landId" },
        { status: 400 },
      );
    }

    const { data: land, error: landError } = await supabase
      .from("lands")
      .select("*")
      .eq("id", landId)
      .eq("for_sale", true)
      .single();

    if (landError || !land) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (String(land.owner_id) === String(buyerId)) {
      return NextResponse.json(
        { error: "You already own this land" },
        { status: 400 },
      );
    }

    const { data: buyer, error: buyerError } = await supabase
      .from("users")
      .select("*")
      .eq("id", buyerId)
      .single();

    if (buyerError || !buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    if (buyer.balance < land.sale_price) {
      return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
    }

    const sellerPayout = calculateSellerPayout(land.sale_price);

    const { data: seller, error: sellerError } = await supabase
      .from("users")
      .select("*")
      .eq("id", land.owner_id)
      .single();

    if (sellerError || !seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const { data: updatedLand, error: landUpdateError } = await supabase
      .from("lands")
      .update({
        owner_id: buyerId,
        for_sale: false,
        sale_price: null,
      })
      .eq("id", landId)
      .eq("owner_id", land.owner_id)
      .eq("for_sale", true)
      .select()
      .single();

    if (landUpdateError || !updatedLand) {
      return NextResponse.json(
        { error: "Listing is no longer available" },
        { status: 409 },
      );
    }

    const { data: updatedBuyer, error: buyerUpdateError } = await supabase
      .from("users")
      .update({ balance: buyer.balance - land.sale_price })
      .eq("id", buyerId)
      .select()
      .single();

    if (buyerUpdateError) {
      return NextResponse.json(
        { error: buyerUpdateError.message },
        { status: 500 },
      );
    }

    const { error: sellerUpdateError } = await supabase
      .from("users")
      .update({ balance: seller.balance + sellerPayout })
      .eq("id", seller.id);

    if (sellerUpdateError) {
      return NextResponse.json(
        { error: sellerUpdateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      fee: land.sale_price - sellerPayout,
      sellerPayout,
      land: updatedLand,
      user: updatedBuyer,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
