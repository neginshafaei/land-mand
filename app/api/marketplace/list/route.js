export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function POST(req) {
  try {
    const { userId, landId, salePrice } = await req.json();
    const price = Math.floor(Number(salePrice));

    if (!userId || !landId || !price || price <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid listing data" },
        { status: 400 },
      );
    }

    const { data: land, error } = await supabase
      .from("lands")
      .update({ for_sale: true, sale_price: price })
      .eq("id", landId)
      .eq("owner_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, land });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
