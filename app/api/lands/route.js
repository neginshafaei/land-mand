export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

export async function GET() {
  const { data, error } = await supabase
    .from("lands")
    .select("*")
    .order("y", { ascending: true })
    .order("x", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
