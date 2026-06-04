export const runtime = "nodejs";

import { NextResponse } from "next/server";
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

    const { data: land, error } = await supabase
      .from("lands")
      .update({ for_sale: false, sale_price: null })
      .eq("id", landId)
      .eq("owner_id", userId)
      .eq("for_sale", true)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!land) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, land });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
